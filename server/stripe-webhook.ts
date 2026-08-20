import { Request, Response } from "express";
import Stripe from "stripe";
import { and, eq } from "drizzle-orm";
import { getDb } from "./db";
import { stripe } from "./stripe-procedures";
import { orders, subscriptions, webhookDeliveries } from "../drizzle/schema";
import {
  extractFulfillmentLines,
  parseStoredShippingAddress,
  queueFulfillment,
} from "./fulfillment-service";

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";
type Db = NonNullable<Awaited<ReturnType<typeof getDb>>>;

type ShippingAddress = {
  name?: string | null;
  address1?: string | null;
  address2?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  country?: string | null;
  countryCode?: string | null;
  phone?: string | null;
  email?: string | null;
};

function stringifyMetadata(metadata: Stripe.Metadata | null | undefined) {
  return Object.fromEntries(Object.entries(metadata || {}).map(([key, value]) => [key, value || ""]));
}

function getShippingAddress(session: Stripe.Checkout.Session): ShippingAddress | null {
  const details = (session as any).shipping_details || session.customer_details;
  const address = details?.address;
  if (!address) return null;
  return {
    name: details.name || null,
    address1: address.line1 || null,
    address2: address.line2 || null,
    city: address.city || null,
    state: address.state || null,
    postalCode: address.postal_code || null,
    country: address.country || null,
    countryCode: address.country || null,
    phone: details.phone || null,
    email: session.customer_details?.email || null,
  };
}

async function deliveryAlreadyProcessed(db: Db, event: Stripe.Event) {
  const prior = await db.select().from(webhookDeliveries)
    .where(and(eq(webhookDeliveries.provider, "stripe"), eq(webhookDeliveries.externalEventId, event.id)))
    .limit(1);
  return Boolean(prior[0]);
}

async function beginDelivery(db: Db, event: Stripe.Event) {
  await db.insert(webhookDeliveries).values({
    provider: "stripe",
    externalEventId: event.id,
    eventType: event.type,
    signatureVerified: true,
    processingStatus: "received",
    payload: JSON.stringify(event),
  });
}

async function finishDelivery(db: Db, event: Stripe.Event, errorMessage?: string) {
  await db.update(webhookDeliveries).set({
    processingStatus: errorMessage ? "failed" : "processed",
    errorMessage: errorMessage || null,
    processedAt: new Date(),
  }).where(and(eq(webhookDeliveries.provider, "stripe"), eq(webhookDeliveries.externalEventId, event.id)));
}

async function createOrderAndQueue(
  db: Db,
  input: {
    userId: number;
    subscriptionId?: number | null;
    stripeSessionId?: string | null;
    stripeInvoiceId?: string | null;
    stripeCustomerId?: string | null;
    productId: string | null;
    amount: number;
    currency: string;
    metadata: Record<string, string>;
    shippingAddress: ShippingAddress | null;
  }
) {
  if (input.stripeSessionId) {
    const existing = await db.select().from(orders).where(eq(orders.stripeSessionId, input.stripeSessionId)).limit(1);
    if (existing[0]) return existing[0];
  }

  if (input.stripeInvoiceId) {
    const existing = await db.select().from(orders).where(eq(orders.stripeInvoiceId, input.stripeInvoiceId)).limit(1);
    if (existing[0]) return existing[0];
  }

  const insertResult = await db.insert(orders).values({
    userId: input.userId,
    subscriptionId: input.subscriptionId || null,
    stripeSessionId: input.stripeSessionId || null,
    stripeInvoiceId: input.stripeInvoiceId || null,
    stripeCustomerId: input.stripeCustomerId || null,
    productId: input.productId,
    status: "pending",
    amount: input.amount,
    currency: input.currency.toUpperCase(),
    shippingAddress: input.shippingAddress ? JSON.stringify(input.shippingAddress) : null,
    metadata: JSON.stringify(input.metadata),
  });
  const orderId = Number(insertResult[0].insertId);

  await queueFulfillment(db, {
    orderId,
    userId: input.userId,
    amount: input.amount,
    currency: input.currency,
    shippingAddress: input.shippingAddress,
    lines: extractFulfillmentLines(input.productId, input.metadata),
  });

  const created = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  return created[0];
}

async function upsertSubscriptionFromCheckout(db: Db, session: Stripe.Checkout.Session, userId: number, metadata: Record<string, string>) {
  const stripeSubscriptionId = typeof session.subscription === "string"
    ? session.subscription
    : session.subscription?.id;
  if (!stripeSubscriptionId) return null;

  const existing = await db.select().from(subscriptions)
    .where(eq(subscriptions.stripeSubscriptionId, stripeSubscriptionId))
    .limit(1);
  if (existing[0]) return existing[0];

  const insertResult = await db.insert(subscriptions).values({
    userId,
    stripeSubscriptionId,
    tier: metadata.productId || "custom-box",
    status: "active",
    selectionMode: metadata.subscriptionBoxMode || "seasonal",
    seasonalOptIn: metadata.seasonalOptIn === "true",
    boxPreferences: JSON.stringify({
      selectedProductIds: (() => {
        try { return JSON.parse(metadata.selectedProductIds || "[]"); } catch { return []; }
      })(),
      createdFrom: "stripe-checkout",
    }),
  });
  const localId = Number(insertResult[0].insertId);
  const created = await db.select().from(subscriptions).where(eq(subscriptions.id, localId)).limit(1);
  return created[0] || null;
}

/**
 * Handle Stripe payment events. The raw request body is registered before JSON parsing
 * by the Express bootstrap so Stripe signature verification remains valid.
 */
export async function handleStripeWebhook(req: Request, res: Response) {
  const signature = req.headers["stripe-signature"] as string | undefined;
  if (!signature) return res.status(400).json({ error: "Missing stripe-signature header" });
  if (!WEBHOOK_SECRET) return res.status(503).json({ error: "Stripe webhook is not configured" });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, WEBHOOK_SECRET);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown signature error";
    return res.status(400).json({ error: `Webhook signature verification failed: ${message}` });
  }

  const db = await getDb();
  if (!db) return res.status(503).json({ error: "Database unavailable" });
  if (await deliveryAlreadyProcessed(db, event)) return res.status(200).json({ received: true, duplicate: true });

  try {
    await beginDelivery(db, event);

    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session, db);
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
        console.info(`[Stripe webhook] Received non-commerce event ${event.type}`);
    }

    await finishDelivery(db, event);
    return res.status(200).json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown webhook processing error";
    console.error("[Stripe webhook] Processing failed", { eventId: event.id, eventType: event.type, message });
    await finishDelivery(db, event, message);
    return res.status(500).json({ error: "Webhook processing failed" });
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session, db: Db) {
  const userId = Number(session.client_reference_id);
  if (!Number.isInteger(userId) || userId <= 0) throw new Error("Checkout session is missing a valid client reference.");

  const metadata = stringifyMetadata(session.metadata);
  const productId = metadata.productId || null;
  const shippingAddress = getShippingAddress(session);
  const localSubscription = session.mode === "subscription"
    ? await upsertSubscriptionFromCheckout(db, session, userId, metadata)
    : null;

  await createOrderAndQueue(db, {
    userId,
    subscriptionId: localSubscription?.id || null,
    stripeSessionId: session.id,
    stripeCustomerId: typeof session.customer === "string" ? session.customer : null,
    productId,
    amount: session.amount_total || 0,
    currency: session.currency || "usd",
    metadata,
    shippingAddress,
  });
}

async function handleInvoicePaid(invoice: Stripe.Invoice, db: Db) {
  // The initial subscription order is created from checkout.session.completed. The
  // corresponding first invoice is an accounting confirmation, not a second shipment.
  if ((invoice as any).billing_reason === "subscription_create") return;

  const stripeSubscriptionId = (invoice as any).subscription as string | null;
  if (!stripeSubscriptionId) return;

  const localSubscription = await db.select().from(subscriptions)
    .where(eq(subscriptions.stripeSubscriptionId, stripeSubscriptionId))
    .limit(1);
  const subscription = localSubscription[0];
  if (!subscription) {
    console.warn("[Stripe webhook] Received an invoice for an unknown subscription", { stripeSubscriptionId });
    return;
  }

  const stripeSubscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);
  const metadata = stringifyMetadata(stripeSubscription.metadata);
  const priorOrders = await db.select().from(orders).where(eq(orders.subscriptionId, subscription.id)).limit(1);
  const shippingAddress = parseStoredShippingAddress(priorOrders[0]?.shippingAddress || null);

  await createOrderAndQueue(db, {
    userId: subscription.userId,
    subscriptionId: subscription.id,
    stripeInvoiceId: invoice.id,
    stripeCustomerId: typeof invoice.customer === "string" ? invoice.customer : null,
    productId: metadata.productId || subscription.tier,
    amount: invoice.amount_paid,
    currency: invoice.currency || "usd",
    metadata: {
      ...metadata,
      selectedProductIds: metadata.selectedProductIds || JSON.stringify((() => {
        try { return JSON.parse(subscription.boxPreferences || "{}").selectedProductIds || []; } catch { return []; }
      })()),
    },
    shippingAddress,
  });
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription, db: Db) {
  await db.update(subscriptions).set({
    status: subscription.status,
    canceledAt: subscription.cancel_at ? new Date(subscription.cancel_at * 1000) : null,
  }).where(eq(subscriptions.stripeSubscriptionId, subscription.id));
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription, db: Db) {
  await db.update(subscriptions).set({
    status: "canceled",
    canceledAt: new Date((subscription.canceled_at || Math.floor(Date.now() / 1000)) * 1000),
  }).where(eq(subscriptions.stripeSubscriptionId, subscription.id));
}

async function handleChargeRefunded(charge: Stripe.Charge, db: Db) {
  const paymentIntentId = typeof charge.payment_intent === "string" ? charge.payment_intent : null;
  if (!paymentIntentId) return;
  await db.update(orders).set({ status: "refunded" })
    .where(eq(orders.stripeSessionId, paymentIntentId));
}

export default handleStripeWebhook;
