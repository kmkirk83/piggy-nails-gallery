import { Request, Response } from "express";
import Stripe from "stripe";
import { getDb } from "./db";
import { stripe } from "./stripe-procedures";
import { orders, subscriptions } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { createOrder, updateOrderStatus, createSubscription, updateSubscriptionStatus, setUserStripeCustomerId } from "./stripe-db";
import { notifyOwner } from "./_core/notification";

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";

/**
 * Handle Stripe webhook events
 * This endpoint processes payment confirmations, subscription updates, and customer events
 */
export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers["stripe-signature"] as string;

  if (!sig) {
    console.error("[Webhook] Missing stripe-signature header");
    return res.status(400).json({ error: "Missing stripe-signature header" });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, WEBHOOK_SECRET);
  } catch (err: any) {
    console.error("[Webhook] Signature verification failed:", err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // Handle test events
  if (event.id.startsWith("evt_test_")) {
    console.log("[Webhook] Test event detected, returning verification response");
    return res.json({ verified: true });
  }

  console.log(`[Webhook] Processing event: ${event.type} (${event.id})`);

  try {
    const db = await getDb();
    if (!db) {
      console.error("[Webhook] Database not available");
      return res.status(500).json({ error: "Database unavailable" });
    }

    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session, db);
        break;

      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent, db);
        break;

      case "invoice.paid":
        await handleInvoicePaid(event.data.object as Stripe.Invoice, db);
        break;

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription, db);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription, db);
        break;

      case "charge.refunded":
        await handleChargeRefunded(event.data.object as Stripe.Charge, db);
        break;

      default:
        console.log(`[Webhook] Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("[Webhook] Error processing event:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Handle checkout.session.completed
 * Creates an order record when checkout is completed
 */
async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session,
  db: any
) {
  try {
    const clientReferenceId = session.client_reference_id;
    const customerId = session.customer as string;
    const sessionId = session.id;
    const metadata = session.metadata || {};

    if (!clientReferenceId) {
      console.error("[Webhook] Missing client_reference_id in checkout session");
      return;
    }

    const userId = parseInt(clientReferenceId);

    // Store Stripe customer ID
    await setUserStripeCustomerId(userId, customerId);
    console.log(`[Webhook] Stored Stripe customer ID for user ${userId}`);

    // Check if this is a subscription or one-time payment
    if (session.mode === "subscription") {
      console.log(`[Webhook] Subscription created for user ${userId}`);
      // Subscription is automatically created by Stripe
      // We just need to log it
      await notifyOwner({
        title: "New Subscription",
        content: `User ${userId} subscribed to ${metadata.tier || "unknown tier"}`,
      });
    } else if (session.mode === "payment") {
      // Create order record for one-time purchase
      const amount = session.amount_total || 0;
      const currency = session.currency || "USD";

      const result = await createOrder(
        userId,
        null, // subscriptionId
        sessionId, // stripeInvoiceId (using session ID as reference)
        amount,
        currency
      );

      console.log(`[Webhook] Order created for user ${userId}:`, {
        amount,
        currency,
        productId: metadata.productId,
      });

      await notifyOwner({
        title: "New Order",
        content: `User ${userId} placed an order for $${(amount / 100).toFixed(2)} ${currency}`,
      });
    }
  } catch (error) {
    console.error("[Webhook] Error handling checkout.session.completed:", error);
    throw error;
  }
}

/**
 * Handle payment_intent.succeeded
 * Confirms payment was successful
 */
async function handlePaymentIntentSucceeded(
  paymentIntent: Stripe.PaymentIntent,
  db: any
) {
  try {
    const metadata = paymentIntent.metadata || {};
    const userId = metadata.userId ? parseInt(metadata.userId) : null;

    console.log(`[Webhook] Payment succeeded for user ${userId}:`, {
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
    });

    // Additional processing can be added here
    // e.g., send confirmation email, update inventory, etc.
  } catch (error) {
    console.error("[Webhook] Error handling payment_intent.succeeded:", error);
    throw error;
  }
}

/**
 * Handle invoice.paid
 * Confirms subscription payment was successful
 */
async function handleInvoicePaid(invoice: Stripe.Invoice, db: any) {
  try {
    const customerId = invoice.customer as string;
    const subscriptionId = (invoice as any).subscription as string;
    const invoiceId = invoice.id;
    const amount = invoice.amount_paid;
    const currency = invoice.currency || "USD";

    console.log(`[Webhook] Invoice paid:`, {
      invoiceId,
      customerId,
      subscriptionId,
      amount,
      currency,
    });

    // For subscription invoices, create an order record
    if (subscriptionId) {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      console.log(`[Webhook] Subscription status: ${subscription.status}`);

      // Create order for this invoice
      const userId = subscription.metadata?.userId
        ? parseInt(subscription.metadata.userId)
        : null;

      if (userId) {
        await createOrder(
          userId,
          null,
          invoiceId,
          amount,
          currency
        );

        console.log(`[Webhook] Created order for subscription invoice ${invoiceId}`);

        await notifyOwner({
          title: "Subscription Payment Received",
          content: `Subscription invoice ${invoiceId} paid: $${(amount / 100).toFixed(2)} ${currency}`,
        });
      }
    }
  } catch (error) {
    console.error("[Webhook] Error handling invoice.paid:", error);
    throw error;
  }
}

/**
 * Handle customer.subscription.updated
 * Handles subscription changes (pause, resume, plan changes)
 */
async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription,
  db: any
) {
  try {
    const customerId = subscription.customer as string;
    const subscriptionId = subscription.id;
    const status = subscription.status;
    const currentPeriodStart = new Date(
      (subscription as any).current_period_start * 1000
    );
    const currentPeriodEnd = new Date(
      (subscription as any).current_period_end * 1000
    );

    console.log(`[Webhook] Subscription updated:`, {
      subscriptionId,
      customerId,
      status,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      currentPeriodEnd,
    });

    // Update subscription status in database
    await updateSubscriptionStatus(
      subscriptionId,
      status,
      currentPeriodStart,
      currentPeriodEnd
    );

    // Log subscription state changes
    if (subscription.cancel_at_period_end) {
      console.log(`[Webhook] Subscription scheduled for cancellation at period end`);
      await notifyOwner({
        title: "Subscription Cancellation Scheduled",
        content: `Subscription ${subscriptionId} will be canceled at period end`,
      });
    }
  } catch (error) {
    console.error("[Webhook] Error handling customer.subscription.updated:", error);
    throw error;
  }
}

/**
 * Handle customer.subscription.deleted
 * Handles subscription cancellation
 */
async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription,
  db: any
) {
  try {
    const customerId = subscription.customer as string;
    const subscriptionId = subscription.id;
    const canceledAt = new Date((subscription.canceled_at || 0) * 1000);

    console.log(`[Webhook] Subscription deleted:`, {
      subscriptionId,
      customerId,
      canceledAt,
    });

    // Update subscription status to canceled
    await updateSubscriptionStatus(subscriptionId, "canceled");

    await notifyOwner({
      title: "Subscription Canceled",
      content: `Subscription ${subscriptionId} has been canceled`,
    });
  } catch (error) {
    console.error("[Webhook] Error handling customer.subscription.deleted:", error);
    throw error;
  }
}

/**
 * Handle charge.refunded
 * Handles refunds
 */
async function handleChargeRefunded(charge: Stripe.Charge, db: any) {
  try {
    console.log(`[Webhook] Charge refunded:`, {
      chargeId: charge.id,
      amount: charge.amount,
      currency: charge.currency,
      refunded: charge.refunded,
      amountRefunded: charge.amount_refunded,
    });

    // Log refund for records
  } catch (error) {
    console.error("[Webhook] Error handling charge.refunded:", error);
    throw error;
  }
}

export default handleStripeWebhook;
