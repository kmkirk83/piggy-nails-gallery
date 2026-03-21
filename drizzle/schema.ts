import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  /** Stripe customer ID for billing */
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }).unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Subscriptions table to track active and past subscriptions
 */
export const subscriptions = mysqlTable("subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  /** Stripe subscription ID */
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }).notNull().unique(),
  /** Subscription tier: monthly, quarterly, biannual, annual */
  tier: varchar("tier", { length: 50 }).notNull(),
  /** Subscription status: active, paused, canceled, past_due */
  status: varchar("status", { length: 50 }).notNull().default("active"),
  /** Current period start date */
  currentPeriodStart: timestamp("currentPeriodStart"),
  /** Current period end date */
  currentPeriodEnd: timestamp("currentPeriodEnd"),
  /** Cancellation date if applicable */
  canceledAt: timestamp("canceledAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;

/**
 * Orders table to track individual subscription shipments
 */
export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  subscriptionId: int("subscriptionId"),
  /** Stripe invoice ID */
  stripeInvoiceId: varchar("stripeInvoiceId", { length: 255 }),
  /** Order status: pending, processing, shipped, delivered */
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  /** Order amount in cents */
  amount: int("amount").notNull(),
  /** Currency code (e.g., USD) */
  currency: varchar("currency", { length: 3 }).default("USD"),
  /** Shipping address */
  shippingAddress: text("shippingAddress"),
  /** Tracking number if shipped */
  trackingNumber: varchar("trackingNumber", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;
