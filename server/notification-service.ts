import { getDb } from "./db";
import { notifications, notificationPreferences } from "../drizzle/schema";
import { eq, and } from "drizzle-orm";

export type NotificationType = "info" | "success" | "warning" | "error";
export type NotificationCategory = "order" | "subscription" | "promotion" | "system";

export interface CreateNotificationInput {
  userId: number;
  title: string;
  message: string;
  type?: NotificationType;
  category?: NotificationCategory;
  actionUrl?: string;
  expiresAt?: Date;
}

/**
 * Create a new notification for a user
 */
export async function createNotification(input: CreateNotificationInput): Promise<boolean> {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    // Check user preferences
    const prefs = await db
      .select()
      .from(notificationPreferences)
      .where(eq(notificationPreferences.userId, input.userId));

    if (prefs.length === 0) {
      // Create default preferences if not exists
      await db.insert(notificationPreferences).values({
        userId: input.userId,
        inAppNotifications: true,
        emailNotifications: true,
        orderUpdates: true,
        subscriptionAlerts: true,
        promotionalEmails: true,
        weeklyDigest: false,
      });
    } else if (!prefs[0].inAppNotifications) {
      // User disabled in-app notifications
      return false;
    }

    // Create notification
    await db.insert(notifications).values({
      userId: input.userId,
      title: input.title,
      message: input.message,
      type: input.type || "info",
      category: input.category,
      actionUrl: input.actionUrl,
      expiresAt: input.expiresAt,
      isRead: false,
    });

    return true;
  } catch (error) {
    console.error("[Notification] Failed to create notification:", error);
    return false;
  }
}

/**
 * Get unread notifications for a user
 */
export async function getUnreadNotifications(userId: number): Promise<any[]> {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const unread = await db
      .select()
      .from(notifications)
      .where(
        and(
          eq(notifications.userId, userId),
          eq(notifications.isRead, false)
        )
      )
      .orderBy((n: any) => n.createdAt);

    return unread || [];
  } catch (error) {
    console.error("[Notification] Failed to get unread notifications:", error);
    return [];
  }
}

/**
 * Get all notifications for a user with pagination
 */
export async function getUserNotifications(
  userId: number,
  limit: number = 20,
  offset: number = 0
): Promise<any[]> {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const userNotifications = await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy((n: any) => n.createdAt)
      .limit(limit)
      .offset(offset);

    return userNotifications || [];
  } catch (error) {
    console.error("[Notification] Failed to get user notifications:", error);
    return [];
  }
}

/**
 * Mark notification as read
 */
export async function markAsRead(notificationId: number): Promise<boolean> {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    await db
      .update(notifications)
      .set({
        isRead: true,
        readAt: new Date(),
      })
      .where(eq(notifications.id, notificationId));

    return true;
  } catch (error) {
    console.error("[Notification] Failed to mark as read:", error);
    return false;
  }
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllAsRead(userId: number): Promise<boolean> {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    await db
      .update(notifications)
      .set({
        isRead: true,
        readAt: new Date(),
      })
      .where(
        and(
          eq(notifications.userId, userId),
          eq(notifications.isRead, false)
        )
      );

    return true;
  } catch (error) {
    console.error("[Notification] Failed to mark all as read:", error);
    return false;
  }
}

/**
 * Delete a notification
 */
export async function deleteNotification(notificationId: number): Promise<boolean> {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    await db
      .delete(notifications)
      .where(eq(notifications.id, notificationId));

    return true;
  } catch (error) {
    console.error("[Notification] Failed to delete notification:", error);
    return false;
  }
}

/**
 * Get user notification preferences
 */
export async function getNotificationPreferences(userId: number): Promise<any> {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const prefs = await db
      .select()
      .from(notificationPreferences)
      .where(eq(notificationPreferences.userId, userId));

    return prefs?.[0] || null;
  } catch (error) {
    console.error("[Notification] Failed to get preferences:", error);
    return null;
  }
}

/**
 * Update notification preferences
 */
export async function updateNotificationPreferences(
  userId: number,
  updates: Partial<any>
): Promise<boolean> {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const existing = await getNotificationPreferences(userId);

    if (!existing) {
      // Create new preferences
      await db.insert(notificationPreferences).values({
        userId,
        ...updates,
      });
    } else {
      // Update existing
      await db
        .update(notificationPreferences)
        .set(updates)
        .where(eq(notificationPreferences.userId, userId));
    }

    return true;
  } catch (error) {
    console.error("[Notification] Failed to update preferences:", error);
    return false;
  }
}

/**
 * Send order notification
 */
export async function notifyOrderUpdate(
  userId: number,
  orderId: number,
  status: string
): Promise<boolean> {
  const statusMessages: Record<string, string> = {
    pending: "Your order has been received and is being processed.",
    processing: "Your order is being prepared for shipment.",
    shipped: "Your order has been shipped! Track it now.",
    delivered: "Your order has been delivered. Enjoy!",
    cancelled: "Your order has been cancelled.",
  };

  return createNotification({
    userId,
    title: `Order #${orderId} ${status}`,
    message: statusMessages[status] || `Order status updated to ${status}`,
    type: status === "cancelled" ? "error" : "info",
    category: "order",
    actionUrl: `/account?tab=orders&orderId=${orderId}`,
  });
}

/**
 * Send subscription notification
 */
export async function notifySubscriptionUpdate(
  userId: number,
  subscriptionId: number,
  status: string
): Promise<boolean> {
  const statusMessages: Record<string, string> = {
    active: "Your subscription is now active!",
    paused: "Your subscription has been paused.",
    cancelled: "Your subscription has been cancelled.",
    renewal: "Your subscription will renew soon.",
  };

  return createNotification({
    userId,
    title: `Subscription ${status}`,
    message: statusMessages[status] || `Subscription status: ${status}`,
    type: status === "cancelled" ? "warning" : "success",
    category: "subscription",
    actionUrl: `/account?tab=subscriptions&subscriptionId=${subscriptionId}`,
  });
}

/**
 * Send promotional notification
 */
export async function notifyPromotion(
  userId: number,
  title: string,
  message: string,
  actionUrl?: string
): Promise<boolean> {
  return createNotification({
    userId,
    title,
    message,
    type: "success",
    category: "promotion",
    actionUrl,
  });
}

export default {
  createNotification,
  getUnreadNotifications,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getNotificationPreferences,
  updateNotificationPreferences,
  notifyOrderUpdate,
  notifySubscriptionUpdate,
  notifyPromotion,
};
