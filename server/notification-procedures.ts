import { z } from "zod";
import { protectedProcedure, router } from "./_core/trpc";
import {
  createNotification,
  getUnreadNotifications,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getNotificationPreferences,
  updateNotificationPreferences,
} from "./notification-service";

export const notificationRouter = router({
  /**
   * Get notifications with optional filtering
   */
  list: protectedProcedure
    .input(
      z.object({
        filter: z.enum(["all", "unread"]).default("unread"),
        limit: z.number().default(20),
        offset: z.number().default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      if (input.filter === "unread") {
        return await getUnreadNotifications(ctx.user.id);
      }
      return await getUserNotifications(ctx.user.id, input.limit, input.offset);
    }),

  /**
   * Get unread count
   */
  unreadCount: protectedProcedure.query(async ({ ctx }) => {
    const unread = await getUnreadNotifications(ctx.user.id);
    return unread.length;
  }),

  /**
   * Mark single notification as read
   */
  markAsRead: protectedProcedure
    .input(
      z.object({
        notificationId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      return await markAsRead(input.notificationId);
    }),

  /**
   * Mark all notifications as read
   */
  markAllAsRead: protectedProcedure.mutation(async ({ ctx }) => {
    return await markAllAsRead(ctx.user.id);
  }),

  /**
   * Delete notification
   */
  delete: protectedProcedure
    .input(
      z.object({
        notificationId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      return await deleteNotification(input.notificationId);
    }),

  /**
   * Get notification preferences
   */
  getPreferences: protectedProcedure.query(async ({ ctx }) => {
    return await getNotificationPreferences(ctx.user.id);
  }),

  /**
   * Update notification preferences
   */
  updatePreferences: protectedProcedure
    .input(
      z.object({
        emailNotifications: z.boolean().optional(),
        inAppNotifications: z.boolean().optional(),
        orderUpdates: z.boolean().optional(),
        subscriptionAlerts: z.boolean().optional(),
        promotionalEmails: z.boolean().optional(),
        weeklyDigest: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await updateNotificationPreferences(ctx.user.id, input);
    }),

  /**
   * Create a notification (admin only for testing)
   */
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        message: z.string(),
        type: z.enum(["info", "success", "warning", "error"]).optional(),
        category: z.enum(["order", "subscription", "promotion", "system"]).optional(),
        actionUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await createNotification({
        userId: ctx.user.id,
        ...input,
      });
    }),
});

export type NotificationRouter = typeof notificationRouter;
