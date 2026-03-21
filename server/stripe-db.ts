import { eq } from "drizzle-orm";
import { orders, subscriptions, users } from "../drizzle/schema";
import { getDb } from "./db";

/**
 * Create or update a user's Stripe customer ID
 */
export async function setUserStripeCustomerId(userId: number, stripeCustomerId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(users)
    .set({ stripeCustomerId })
    .where(eq(users.id, userId));
}

/**
 * Get a user's Stripe customer ID
 */
export async function getUserStripeCustomerId(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const user = await db
    .select({ stripeCustomerId: users.stripeCustomerId })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return user[0]?.stripeCustomerId || null;
}

/**
 * Create a new subscription record
 */
export async function createSubscription(
  userId: number,
  stripeSubscriptionId: string,
  tier: string,
  currentPeriodStart: Date,
  currentPeriodEnd: Date
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(subscriptions).values({
    userId,
    stripeSubscriptionId,
    tier,
    status: "active",
    currentPeriodStart,
    currentPeriodEnd,
  });

  return result;
}

/**
 * Get user's active subscription
 */
export async function getUserActiveSubscription(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .orderBy(subscriptions.createdAt)
    .limit(1);

  return result[0] || null;
}

/**
 * Update subscription status
 */
export async function updateSubscriptionStatus(
  stripeSubscriptionId: string,
  status: string,
  currentPeriodStart?: Date,
  currentPeriodEnd?: Date
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const updateData: any = { status };
  if (currentPeriodStart) updateData.currentPeriodStart = currentPeriodStart;
  if (currentPeriodEnd) updateData.currentPeriodEnd = currentPeriodEnd;

  await db
    .update(subscriptions)
    .set(updateData)
    .where(eq(subscriptions.stripeSubscriptionId, stripeSubscriptionId));
}

/**
 * Cancel a subscription
 */
export async function cancelSubscription(stripeSubscriptionId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(subscriptions)
    .set({
      status: "canceled",
      canceledAt: new Date(),
    })
    .where(eq(subscriptions.stripeSubscriptionId, stripeSubscriptionId));
}

/**
 * Create an order record
 */
export async function createOrder(
  userId: number,
  subscriptionId: number | null,
  stripeInvoiceId: string | null,
  amount: number,
  currency: string = "USD"
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(orders).values({
    userId,
    subscriptionId,
    stripeInvoiceId,
    amount,
    currency,
    status: "pending",
  });

  return result;
}

/**
 * Update order status
 */
export async function updateOrderStatus(
  orderId: number,
  status: string,
  trackingNumber?: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const updateData: any = { status };
  if (trackingNumber) updateData.trackingNumber = trackingNumber;

  await db
    .update(orders)
    .set(updateData)
    .where(eq(orders.id, orderId));
}

/**
 * Get user's orders
 */
export async function getUserOrders(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(orders.createdAt);

  return result;
}
