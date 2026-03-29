import { eq, desc, and } from "drizzle-orm";
import { getDb } from "./db";
import {
  nailDesigns,
  designRatings,
  designComments,
  designHashtags,
  handTemplates,
  productHashtags,
  productRatings,
  InsertNailDesign,
  InsertDesignRating,
  InsertDesignComment,
  InsertDesignHashtag,
  InsertHandTemplate,
  InsertProductHashtag,
  InsertProductRating,
} from "../drizzle/schema";

/**
 * Create a new nail design
 */
export async function createNailDesign(design: InsertNailDesign) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(nailDesigns).values(design);
  return result;
}

/**
 * Get nail design by ID with ratings and comments
 */
export async function getNailDesignById(designId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const design = await db
    .select()
    .from(nailDesigns)
    .where(eq(nailDesigns.id, designId))
    .limit(1);

  if (!design.length) return null;

  const ratings = await db
    .select()
    .from(designRatings)
    .where(eq(designRatings.designId, designId));

  const comments = await db
    .select()
    .from(designComments)
    .where(eq(designComments.designId, designId))
    .orderBy(desc(designComments.createdAt));

  const hashtags = await db
    .select()
    .from(designHashtags)
    .where(eq(designHashtags.designId, designId));

  return {
    ...design[0],
    ratings,
    comments,
    hashtags,
  };
}

/**
 * Get all public nail designs with pagination and sorting
 */
export async function getPublicNailDesigns(
  sortBy: "recent" | "rating" | "views" = "recent",
  limit: number = 20,
  offset: number = 0
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const baseQuery = db
    .select()
    .from(nailDesigns)
    .where(eq(nailDesigns.isPublic, 1));

  if (sortBy === "rating") {
    return baseQuery
      .orderBy(desc(nailDesigns.averageRating))
      .limit(limit)
      .offset(offset);
  } else if (sortBy === "views") {
    return baseQuery
      .orderBy(desc(nailDesigns.viewCount))
      .limit(limit)
      .offset(offset);
  } else {
    return baseQuery
      .orderBy(desc(nailDesigns.createdAt))
      .limit(limit)
      .offset(offset);
  }
}

/**
 * Get user's nail designs
 */
export async function getUserNailDesigns(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select()
    .from(nailDesigns)
    .where(eq(nailDesigns.userId, userId))
    .orderBy(desc(nailDesigns.createdAt));
}

/**
 * Rate a nail design
 */
export async function rateNailDesign(
  designId: number,
  userId: number,
  rating: number
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Check if user already rated
  const existing = await db
    .select()
    .from(designRatings)
    .where(
      and(
        eq(designRatings.designId, designId),
        eq(designRatings.userId, userId)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    // Update existing rating
    await db
      .update(designRatings)
      .set({ rating, updatedAt: new Date() })
      .where(
        and(
          eq(designRatings.designId, designId),
          eq(designRatings.userId, userId)
        )
      );
  } else {
    // Create new rating
    await db.insert(designRatings).values({
      designId,
      userId,
      rating,
    });
  }

  // Update design average rating
  const allRatings = await db
    .select()
    .from(designRatings)
    .where(eq(designRatings.designId, designId));

  const avgRating = Math.round(
    (allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length) * 10
  );

  await db
    .update(nailDesigns)
    .set({
      averageRating: avgRating,
      totalRatings: allRatings.length,
    })
    .where(eq(nailDesigns.id, designId));
}

/**
 * Add comment to nail design
 */
export async function addDesignComment(
  designId: number,
  userId: number,
  content: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(designComments).values({
    designId,
    userId,
    content,
  });
}

/**
 * Add hashtags to nail design
 */
export async function addDesignHashtags(designId: number, tags: string[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const hashtagValues = tags.map((tag) => ({
    designId,
    tag: tag.toLowerCase().replace(/^#/, ""),
  }));

  return db.insert(designHashtags).values(hashtagValues);
}

/**
 * Get hand templates
 */
export async function getHandTemplates() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select()
    .from(handTemplates)
    .where(eq(handTemplates.isActive, 1))
    .orderBy(desc(handTemplates.createdAt));
}

/**
 * Get hand template by ID
 */
export async function getHandTemplateById(templateId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const template = await db
    .select()
    .from(handTemplates)
    .where(eq(handTemplates.id, templateId))
    .limit(1);

  return template.length > 0 ? template[0] : null;
}

/**
 * Add hashtag to product
 */
export async function addProductHashtag(productId: string, tag: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(productHashtags).values({
    productId,
    tag: tag.toLowerCase().replace(/^#/, ""),
  });
}

/**
 * Get product hashtags
 */
export async function getProductHashtags(productId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select()
    .from(productHashtags)
    .where(eq(productHashtags.productId, productId));
}

/**
 * Rate a product
 */
export async function rateProduct(
  productId: string,
  userId: number,
  rating: number,
  review?: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(productRatings).values({
    productId,
    userId,
    rating,
    review,
  });
}

/**
 * Get product ratings
 */
export async function getProductRatings(productId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select()
    .from(productRatings)
    .where(eq(productRatings.productId, productId))
    .orderBy(desc(productRatings.createdAt));
}

/**
 * Get average product rating
 */
export async function getProductAverageRating(productId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const ratings = await db
    .select()
    .from(productRatings)
    .where(eq(productRatings.productId, productId));

  if (ratings.length === 0) return 0;

  const avgRating =
    ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
  return Math.round(avgRating * 10) / 10;
}

/**
 * Search designs by hashtag
 */
export async function searchDesignsByHashtag(tag: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const cleanTag = tag.toLowerCase().replace(/^#/, "");

  const tagResults = await db
    .select()
    .from(designHashtags)
    .where(eq(designHashtags.tag, cleanTag));

  const designIds = tagResults.map((t) => t.designId);

  if (designIds.length === 0) return [];

  return db
    .select()
    .from(nailDesigns)
    .where(
      and(
        eq(nailDesigns.isPublic, 1),
        // Use raw SQL for IN clause
      )
    )
    .orderBy(desc(nailDesigns.createdAt));
}
