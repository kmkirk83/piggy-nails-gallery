import { eq, and } from "drizzle-orm";
import { getDb } from "./db";
import { users, subscriptions } from "../drizzle/schema";

export type StudioAccessLevel = "free" | "premium" | "lifetime";

export interface StudioFeatures {
  maxDesignsPerMonth: number;
  canUploadCustomHand: boolean;
  canUseAdvancedTemplates: boolean;
  canExportDesigns: boolean;
  canSharePublicly: boolean;
  canAccessAITools: boolean;
  canUseAdvancedFilters: boolean;
  maxUploadSizeMB: number;
  accessLevel: StudioAccessLevel;
}

/**
 * Get user's studio access level
 */
export async function getUserStudioAccessLevel(
  userId: number
): Promise<StudioAccessLevel> {
  const db = await getDb();
  if (!db) return "free";

  try {
    // Check if user has lifetime access
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user.length) return "free";

    // Check for active subscription
    const activeSubscription = await db
      .select()
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.userId, userId),
          eq(subscriptions.status, "active")
        )
      )
      .limit(1);

    if (activeSubscription.length > 0) {
      return "premium";
    }

    // Check for lifetime access (stored in user metadata or separate table)
    // For now, we'll use a simple check - in production, add a lifetimeStudioAccess field
    return "free";
  } catch (error) {
    console.error("Error checking studio access:", error);
    return "free";
  }
}

/**
 * Get studio features based on access level
 */
export function getStudioFeatures(accessLevel: StudioAccessLevel): StudioFeatures {
  const baseFeatures: Record<StudioAccessLevel, StudioFeatures> = {
    free: {
      maxDesignsPerMonth: 3,
      canUploadCustomHand: false,
      canUseAdvancedTemplates: false,
      canExportDesigns: false,
      canSharePublicly: true,
      canAccessAITools: false,
      canUseAdvancedFilters: false,
      maxUploadSizeMB: 2,
      accessLevel: "free",
    },
    premium: {
      maxDesignsPerMonth: 100,
      canUploadCustomHand: true,
      canUseAdvancedTemplates: true,
      canExportDesigns: true,
      canSharePublicly: true,
      canAccessAITools: true,
      canUseAdvancedFilters: true,
      maxUploadSizeMB: 50,
      accessLevel: "premium",
    },
    lifetime: {
      maxDesignsPerMonth: 1000,
      canUploadCustomHand: true,
      canUseAdvancedTemplates: true,
      canExportDesigns: true,
      canSharePublicly: true,
      canAccessAITools: true,
      canUseAdvancedFilters: true,
      maxUploadSizeMB: 100,
      accessLevel: "lifetime",
    },
  };

  return baseFeatures[accessLevel] || baseFeatures.free;
}

/**
 * Check if user can perform a specific action
 */
export async function canUserPerformAction(
  userId: number,
  action: keyof Omit<StudioFeatures, "maxDesignsPerMonth" | "maxUploadSizeMB" | "accessLevel">
): Promise<boolean> {
  const accessLevel = await getUserStudioAccessLevel(userId);
  const features = getStudioFeatures(accessLevel);
  return features[action] as boolean;
}

/**
 * Check if user has reached design limit
 */
export async function hasReachedDesignLimit(userId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    const accessLevel = await getUserStudioAccessLevel(userId);
    const features = getStudioFeatures(accessLevel);

    // Count designs created this month
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // This would need to be implemented with actual design count query
    // For now, return false (implement with actual design table query)
    return false;
  } catch (error) {
    console.error("Error checking design limit:", error);
    return false;
  }
}

/**
 * Get studio paywall products
 */
export function getStudioPaywallProducts() {
  return {
    lifetime: {
      id: "studio-lifetime-access",
      name: "Studio Lifetime Access",
      description: "Unlimited access to all studio features forever",
      price: 9999, // $99.99 in cents
      features: [
        "Unlimited designs per month",
        "Upload custom hand images",
        "Access all advanced templates",
        "Export designs in multiple formats",
        "AI-powered design tools",
        "Advanced filtering and search",
        "100MB file uploads",
        "Lifetime updates and support",
      ],
    },
    monthlyPremium: {
      id: "studio-monthly-premium",
      name: "Studio Monthly Premium",
      description: "Premium studio access for one month",
      price: 999, // $9.99 in cents
      features: [
        "100 designs per month",
        "Upload custom hand images",
        "Access all advanced templates",
        "Export designs",
        "AI-powered design tools",
        "Advanced filtering",
        "50MB file uploads",
      ],
    },
  };
}

/**
 * Check if user has purchased lifetime studio access
 */
export async function hasLifetimeStudioAccess(userId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    // Check if user has a lifetime studio access purchase
    // This would require a new table or field to track lifetime purchases
    // For now, return false - implement with actual purchase tracking
    return false;
  } catch (error) {
    console.error("Error checking lifetime access:", error);
    return false;
  }
}

/**
 * Grant lifetime studio access to user
 */
export async function grantLifetimeStudioAccess(userId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    // Update user with lifetime studio access flag
    // This would require adding a lifetimeStudioAccess field to users table
    // For now, this is a placeholder
    console.log(`Granted lifetime studio access to user ${userId}`);
  } catch (error) {
    console.error("Error granting lifetime access:", error);
    throw error;
  }
}
