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

/**
 * User-created nail art designs
 */
export const nailDesigns = mysqlTable("nailDesigns", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  imageUrl: text("imageUrl").notNull(),
  templateId: int("templateId"), // Reference to template if created from template
  uploadedImageUrl: text("uploadedImageUrl"), // User's uploaded image
  designData: text("designData"), // JSON data for design (layers, colors, etc.)
  isPublic: int("isPublic").default(1).notNull(), // 1 = public, 0 = private
  viewCount: int("viewCount").default(0).notNull(),
  averageRating: int("averageRating").default(0).notNull(), // 0-5 stars * 10 (0-50)
  totalRatings: int("totalRatings").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type NailDesign = typeof nailDesigns.$inferSelect;
export type InsertNailDesign = typeof nailDesigns.$inferInsert;

/**
 * Design templates provided by designers
 */
export const designTemplates = mysqlTable("designTemplates", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  thumbnailUrl: text("thumbnailUrl"),
  templateData: text("templateData").notNull(), // JSON for template structure
  category: varchar("category", { length: 100 }),
  difficulty: mysqlEnum("difficulty", ["easy", "medium", "hard"]).default("easy"),
  createdBy: int("createdBy").notNull(), // Admin/designer user ID
  isActive: int("isActive").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DesignTemplate = typeof designTemplates.$inferSelect;
export type InsertDesignTemplate = typeof designTemplates.$inferInsert;

/**
 * Hand templates for nail art creation
 */
export const handTemplates = mysqlTable("handTemplates", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  imageUrl: text("imageUrl").notNull(),
  skinTone: varchar("skinTone", { length: 50 }),
  handOrientation: varchar("handOrientation", { length: 50 }).default("palm-up"),
  nailBeds: text("nailBeds").notNull(),
  isActive: int("isActive").default(1).notNull(),
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type HandTemplate = typeof handTemplates.$inferSelect;
export type InsertHandTemplate = typeof handTemplates.$inferInsert;

/**
 * Ratings for nail designs
 */
export const designRatings = mysqlTable("designRatings", {
  id: int("id").autoincrement().primaryKey(),
  designId: int("designId").notNull(),
  userId: int("userId").notNull(),
  rating: int("rating").notNull(), // 1-5 stars
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DesignRating = typeof designRatings.$inferSelect;
export type InsertDesignRating = typeof designRatings.$inferInsert;

/**
 * Comments on nail designs
 */
export const designComments = mysqlTable("designComments", {
  id: int("id").autoincrement().primaryKey(),
  designId: int("designId").notNull(),
  userId: int("userId").notNull(),
  content: text("content").notNull(),
  likes: int("likes").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DesignComment = typeof designComments.$inferSelect;
export type InsertDesignComment = typeof designComments.$inferInsert;

/**
 * Hashtags for designs
 */
export const designHashtags = mysqlTable("designHashtags", {
  id: int("id").autoincrement().primaryKey(),
  designId: int("designId").notNull(),
  tag: varchar("tag", { length: 100 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DesignHashtag = typeof designHashtags.$inferSelect;
export type InsertDesignHashtag = typeof designHashtags.$inferInsert;

/**
 * Product hashtags and categories
 */
export const productHashtags = mysqlTable("productHashtags", {
  id: int("id").autoincrement().primaryKey(),
  productId: varchar("productId", { length: 255 }).notNull(),
  tag: varchar("tag", { length: 100 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ProductHashtag = typeof productHashtags.$inferSelect;
export type InsertProductHashtag = typeof productHashtags.$inferInsert;

/**
 * Product ratings
 */
export const productRatings = mysqlTable("productRatings", {
  id: int("id").autoincrement().primaryKey(),
  productId: varchar("productId", { length: 255 }).notNull(),
  userId: int("userId").notNull(),
  rating: int("rating").notNull(), // 1-5 stars
  review: text("review"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ProductRating = typeof productRatings.$inferSelect;
export type InsertProductRating = typeof productRatings.$inferInsert;
