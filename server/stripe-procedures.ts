import { TRPCError } from "@trpc/server";
import Stripe from "stripe";
import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { SUBSCRIPTION_PRODUCTS, type SubscriptionTier } from "./products";
import { getUserStripeCustomerId, setUserStripeCustomerId, getUserOrders } from "./stripe-db";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

/**
 * Stripe subscription router
 */
export const stripeRouter = router({
  /**
   * Create a checkout session for a subscription
   */
  createCheckoutSession: protectedProcedure
    .input(
      z.object({
        tier: z.enum(["monthly", "quarterly", "biannual", "annual"]),
        origin: z.string().url(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const user = ctx.user;
        if (!user.email) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "User email is required for checkout",
          });
        }

        // Get or create Stripe customer
        let stripeCustomerId = await getUserStripeCustomerId(user.id);

        if (!stripeCustomerId) {
          const customer = await stripe.customers.create({
            email: user.email,
            name: user.name || undefined,
            metadata: {
              userId: user.id.toString(),
            },
          });
          stripeCustomerId = customer.id;
          await setUserStripeCustomerId(user.id, stripeCustomerId);
        }

        // Get product details
        const product = SUBSCRIPTION_PRODUCTS[input.tier as SubscriptionTier];
        if (!product) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid subscription tier",
          });
        }

        // Create or get price
        // In production, you'd want to store price IDs in your database
        // For now, we'll create prices dynamically
        const productId = process.env.STRIPE_PRODUCT_ID;
        if (!productId) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Stripe product ID not configured",
          });
        }

        const prices = await stripe.prices.list({
          product: productId,
          limit: 100,
        });

        let priceId = prices.data.find(
          (p: any) => p.recurring?.interval === product.interval &&
                 p.recurring?.interval_count === product.intervalCount
        )?.id;

        if (!priceId) {
          // Create a new price
          const price = await stripe.prices.create({
            product: productId,
            unit_amount: product.price,
            currency: "usd",
            recurring: {
              interval: product.interval as "month" | "year",
              interval_count: product.intervalCount,
            },
            metadata: product.metadata,
          });
          priceId = price.id;
        }

        // Create checkout session
        const session = await stripe.checkout.sessions.create({
          customer: stripeCustomerId,
          mode: "subscription",
          payment_method_types: ["card"],
          line_items: [
            {
              price: priceId,
              quantity: 1,
            },
          ],
          success_url: `${input.origin}/account?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${input.origin}/subscribe`,
          customer_email: user.email,
          client_reference_id: user.id.toString(),
          metadata: {
            userId: user.id.toString(),
            tier: input.tier,
          },
          allow_promotion_codes: true,
        });

        return {
          sessionId: session.id,
          url: session.url,
        };
      } catch (error) {
        console.error("[Stripe] Checkout session creation failed:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create checkout session",
        });
      }
    }),

  /**
   * Get user's subscription status
   */
  getSubscriptionStatus: protectedProcedure.query(async ({ ctx }) => {
    try {
      const stripeCustomerId = await getUserStripeCustomerId(ctx.user.id);
      if (!stripeCustomerId) {
        return null;
      }

      const subscriptions = await stripe.subscriptions.list({
        customer: stripeCustomerId,
        limit: 1,
      });

      if (subscriptions.data.length === 0) {
        return null;
      }

      const subscription = subscriptions.data[0];
      return {
        id: subscription.id,
        status: subscription.status,
        currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
        currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      };
    } catch (error) {
      console.error("[Stripe] Failed to get subscription status:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get subscription status",
      });
    }
  }),

  /**
   * Cancel user's subscription
   */
  cancelSubscription: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      const stripeCustomerId = await getUserStripeCustomerId(ctx.user.id);
      if (!stripeCustomerId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No active subscription found",
        });
      }

      const subscriptions = await stripe.subscriptions.list({
        customer: stripeCustomerId,
        limit: 1,
      });

      if (subscriptions.data.length === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No active subscription found",
        });
      }

      const subscription = await stripe.subscriptions.cancel(
        subscriptions.data[0].id
      );

      return {
        success: true,
        canceledAt: new Date(subscription.canceled_at! * 1000),
      };
    } catch (error) {
      console.error("[Stripe] Failed to cancel subscription:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to cancel subscription",
      });
    }
  }),

  /**
   * Get user's order history
   */
  getOrderHistory: protectedProcedure.query(async ({ ctx }) => {
    try {
      const orders = await getUserOrders(ctx.user.id);
      return orders;
    } catch (error) {
      console.error("[Stripe] Failed to get order history:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get order history",
      });
    }
  }),
});

export { stripe };
