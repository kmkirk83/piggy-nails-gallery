import { TRPCError } from "@trpc/server";
import Stripe from "stripe";
import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import {
  subscriptionProducts,
  oneTimePurchaseProducts,
  aftercareKitProducts,
  getProductById,
} from "./nail-products";
import { getUserStripeCustomerId, setUserStripeCustomerId, getUserOrders } from "./stripe-db";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

/**
 * Stripe subscription and e-commerce router
 */
export const stripeRouter = router({
  /**
   * Get all available products
   */
  getProducts: publicProcedure
    .input(
      z.object({
        category: z
          .enum(["subscription", "one-time", "aftercare", "all"])
          .optional(),
        trending: z.boolean().optional(),
      })
    )
    .query(({ input }) => {
      let products: any[] = [];

      if (!input.category || input.category === "all") {
        products = [
          ...subscriptionProducts,
          ...oneTimePurchaseProducts,
          ...aftercareKitProducts,
        ];
      } else if (input.category === "subscription") {
        products = subscriptionProducts;
      } else if (input.category === "one-time") {
        products = oneTimePurchaseProducts;
      } else if (input.category === "aftercare") {
        products = aftercareKitProducts;
      }

      if (input.trending) {
        products = products.filter((p) => p.trending);
      }

      return products;
    }),

  /**
   * Get product details by ID
   */
  getProduct: publicProcedure.input(z.string()).query(({ input }) => {
    const product = getProductById(input);
    if (!product) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Product not found",
      });
    }
    return product;
  }),

  /**
   * Create a checkout session for subscription or one-time purchase
   */
  createCheckoutSession: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        origin: z.string().url(),
        quantity: z.number().optional().default(1),
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

        const product = getProductById(input.productId);
        if (!product) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Product not found",
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

        // Create or get Stripe product and price
        let stripeProductId = product.stripeProductId;
        let stripePriceId = product.stripePriceId;

        if (!stripeProductId) {
          const stripeProduct = await stripe.products.create({
            name: product.name,
            description: product.description,
            metadata: {
              productId: product.id,
              category: product.category,
            },
          });
          stripeProductId = stripeProduct.id;
        }

        if (!stripePriceId) {
          const priceData: Stripe.PriceCreateParams = {
            product: stripeProductId,
            unit_amount: product.price,
            currency: "usd",
            metadata: {
              productId: product.id,
            },
          };

          // Add recurring for subscriptions
          if (product.category === "subscription") {
            const recurringMap: Record<string, Stripe.PriceCreateParams.Recurring> = {
              "starter-monthly": {
                interval: "month",
                interval_count: 1,
              },
              "trendsetter-quarterly": {
                interval: "month",
                interval_count: 3,
              },
              "vip-biannual": {
                interval: "month",
                interval_count: 6,
              },
              "elite-annual": {
                interval: "year",
                interval_count: 1,
              },
            };

            if (recurringMap[product.id]) {
              priceData.recurring = recurringMap[product.id];
            }
          }

          const price = await stripe.prices.create(priceData);
          stripePriceId = price.id;
        }

        // Create checkout session
        const sessionParams: Stripe.Checkout.SessionCreateParams = {
          customer: stripeCustomerId,
          mode: product.category === "subscription" ? "subscription" : "payment",
          payment_method_types: ["card"],
          line_items: [
            {
              price: stripePriceId,
              quantity: input.quantity,
            },
          ],
          success_url: `${input.origin}/account?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${input.origin}/shop`,
          client_reference_id: user.id.toString(),
          metadata: {
            userId: user.id.toString(),
            productId: product.id,
            category: product.category,
          },
          allow_promotion_codes: true,
        };

        const session = await stripe.checkout.sessions.create(sessionParams);

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
        canceledAt: new Date((subscription.canceled_at || 0) * 1000),
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

  /**
   * Get trending products
   */
  getTrendingProducts: publicProcedure.query(() => {
    const trending = [
      ...subscriptionProducts.filter((p) => p.trending),
      ...oneTimePurchaseProducts.filter((p) => p.trending),
      ...aftercareKitProducts.filter((p) => p.trending),
    ];
    return trending.slice(0, 8); // Return top 8 trending
  }),

  /**
   * Search products
   */
  searchProducts: publicProcedure
    .input(z.string())
    .query(({ input }) => {
      const query = input.toLowerCase();
      const allProducts = [
        ...subscriptionProducts,
        ...oneTimePurchaseProducts,
        ...aftercareKitProducts,
      ];

      return allProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.subcategory?.toLowerCase().includes(query)
      );
    }),
});

export { stripe };
