/**
 * Admin Dashboard Procedures
 * Handles all backend logic for admin monitoring, orders, fulfillment, and analytics
 */

import { z } from "zod";
import { protectedProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { orders, subscriptions, users } from "../drizzle/schema";
import { eq, gte, lte, sql, desc, count, sum } from "drizzle-orm";
import { notifyOwner } from "./_core/notification";

export const adminRouter = router({
  /**
   * Get dashboard overview stats
   */
  getDashboardStats: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user?.role !== "admin") {
      throw new Error("Admin access required");
    }

    try {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      // Total revenue
      const revenueResult = await db
        .select({ total: sum(orders.amount) })
        .from(orders)
        .where(eq(orders.status, "completed"));

      // Orders this month
      const monthlyOrdersResult = await db
        .select({ count: count() })
        .from(orders)
        .where(gte(orders.createdAt, thirtyDaysAgo));

      // Active subscriptions
      const activeSubscriptionsResult = await db
        .select({ count: count() })
        .from(subscriptions)
        .where(eq(subscriptions.status, "active"));

      // Total customers
      const totalCustomersResult = await db
        .select({ count: count() })
        .from(users);

      // Pending orders
      const pendingOrdersResult = await db
        .select({ count: count() })
        .from(orders)
        .where(eq(orders.status, "pending"));

      return {
        totalRevenue: revenueResult[0]?.total || 0,
        monthlyOrders: monthlyOrdersResult[0]?.count || 0,
        activeSubscriptions: activeSubscriptionsResult[0]?.count || 0,
        totalCustomers: totalCustomersResult[0]?.count || 0,
        pendingOrders: pendingOrdersResult[0]?.count || 0,
      };
    } catch (error) {
      console.error("[Admin] Error fetching dashboard stats:", error);
      throw error;
    }
  }),

  /**
   * Get recent orders with pagination
   */
  getRecentOrders: protectedProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(10),
        status: z
          .enum(["pending", "processing", "shipped", "completed", "cancelled"])
          .optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("Admin access required");
      }

      try {
        const db = await getDb();
        if (!db) throw new Error("Database connection failed");

        const offset = (input.page - 1) * input.limit;

        let query: any = db.select().from(orders);

        if (input.status) {
          query = query.where(eq(orders.status, input.status));
        }

        const allOrders = await query
          .orderBy(desc(orders.createdAt))
          .limit(input.limit)
          .offset(offset);

        // Get total count
        const countResult = await (input.status
          ? db
              .select({ count: count() })
              .from(orders)
              .where(eq(orders.status, input.status))
          : db.select({ count: count() }).from(orders));

        return {
          orders: allOrders,
          total: countResult[0]?.count || 0,
          page: input.page,
          limit: input.limit,
        };
      } catch (error) {
        console.error("[Admin] Error fetching orders:", error);
        throw error;
      }
    }),

  /**
   * Get revenue analytics
   */
  getRevenueAnalytics: protectedProcedure
    .input(
      z.object({
        days: z.number().default(30),
      })
    )
    .query(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("Admin access required");
      }

      try {
        const db = await getDb();
        if (!db) throw new Error("Database connection failed");

        const now = new Date();
        const startDate = new Date(now.getTime() - input.days * 24 * 60 * 60 * 1000);

        // Daily revenue
        const dailyRevenue: any = await db
          .select({
            date: sql`DATE(${orders.createdAt})`,
            revenue: sum(orders.amount),
            orderCount: count(),
          })
          .from(orders)
          .where(gte(orders.createdAt, startDate))
          .groupBy(sql`DATE(${orders.createdAt})`)
          .orderBy(sql`DATE(${orders.createdAt})`);

        // Revenue by status
        const revenueByStatus: any = await db
          .select({
            status: orders.status,
            revenue: sum(orders.amount),
            count: count(),
          })
          .from(orders)
          .groupBy(orders.status);

        return {
          dailyRevenue,
          revenueByStatus,
        };
      } catch (error) {
        console.error("[Admin] Error fetching revenue analytics:", error);
        throw error;
      }
    }),

  /**
   * Get subscription analytics
   */
  getSubscriptionAnalytics: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user?.role !== "admin") {
      throw new Error("Admin access required");
    }

    try {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      // Subscriptions by status
      const byStatus: any = await db
        .select({
          status: subscriptions.status,
          count: count(),
        })
        .from(subscriptions)
        .groupBy(subscriptions.status);

      // Subscription revenue (calculate from orders linked to subscriptions)
      const revenue = await db
        .select({
          revenue: sum(orders.amount),
        })
        .from(orders)
        .where(eq(orders.status, "completed"));

      return {
        byStatus,
        activeRevenue: revenue[0]?.revenue || 0,
      };
    } catch (error) {
      console.error("[Admin] Error fetching subscription analytics:", error);
      throw error;
    }
  }),

  /**
   * Update order status
   */
  updateOrderStatus: protectedProcedure
    .input(
      z.object({
        orderId: z.number(),
        status: z.enum(["pending", "processing", "shipped", "completed", "cancelled"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("Admin access required");
      }

      try {
        const db = await getDb();
        if (!db) throw new Error("Database connection failed");

        await db
          .update(orders)
          .set({
            status: input.status,
            updatedAt: new Date(),
          })
          .where(eq(orders.id, input.orderId));

        console.log(`[Admin] Order ${input.orderId} status updated to ${input.status}`);

        await notifyOwner({
          title: "Order Status Updated",
          content: `Order #${input.orderId} status changed to ${input.status}`,
        });

        return { success: true };
      } catch (error) {
        console.error("[Admin] Error updating order status:", error);
        throw error;
      }
    }),

  /**
   * Get system health status
   */
  getSystemHealth: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user?.role !== "admin") {
      throw new Error("Admin access required");
    }

    try {
      const db = await getDb();
      const dbHealthy = !!db;

      // Test Printful API
      let printfulHealthy = false;
      try {
        const response = await fetch("https://api.printful.com/products", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}`,
            "Content-Type": "application/json",
          },
        });
        printfulHealthy = response.status === 200;
      } catch (error) {
        console.error("[Admin] Printful health check failed:", error);
      }

      // Test Stripe
      let stripeHealthy = false;
      try {
        stripeHealthy = !!process.env.STRIPE_SECRET_KEY;
      } catch (error) {
        console.error("[Admin] Stripe health check failed:", error);
      }

      return {
        database: dbHealthy ? "healthy" : "unhealthy",
        printful: printfulHealthy ? "healthy" : "unhealthy",
        stripe: stripeHealthy ? "healthy" : "unhealthy",
        timestamp: new Date(),
      };
    } catch (error) {
      console.error("[Admin] Error checking system health:", error);
      return {
        database: "error",
        printful: "error",
        stripe: "error",
        timestamp: new Date(),
      };
    }
  }),

  /**
   * Get customer details
   */
  getCustomerDetails: protectedProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("Admin access required");
      }

      try {
        const db = await getDb();
        if (!db) throw new Error("Database connection failed");

        // Get user
        const user = await db
          .select()
          .from(users)
          .where(eq(users.id, input.userId));

        if (!user.length) {
          throw new Error("User not found");
        }

        // Get user orders
        const userOrders = await db
          .select()
          .from(orders)
          .where(eq(orders.userId, input.userId))
          .orderBy(desc(orders.createdAt));

        // Get user subscriptions
        const userSubscriptions = await db
          .select()
          .from(subscriptions)
          .where(eq(subscriptions.userId, input.userId));

        return {
          user: user[0],
          orders: userOrders,
          subscriptions: userSubscriptions,
          totalSpent: userOrders.reduce((sum, order) => sum + (order.amount || 0), 0),
        };
      } catch (error) {
        console.error("[Admin] Error fetching customer details:", error);
        throw error;
      }
    }),

  /**
   * Export orders to CSV
   */
  exportOrders: protectedProcedure
    .input(
      z.object({
        days: z.number().default(30),
      })
    )
    .query(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("Admin access required");
      }

      try {
        const db = await getDb();
        if (!db) throw new Error("Database connection failed");

        const startDate = new Date(
          Date.now() - input.days * 24 * 60 * 60 * 1000
        );

        const allOrders = await db
          .select()
          .from(orders)
          .where(gte(orders.createdAt, startDate))
          .orderBy(desc(orders.createdAt));

        // Format as CSV
        const headers = [
          "Order ID",
          "User ID",
          "Amount",
          "Status",
          "Created At",
          "Updated At",
        ];
        const rows = allOrders.map((order) => [
          order.id,
          order.userId,
          (order.amount || 0) / 100,
          order.status,
          order.createdAt?.toISOString(),
          order.updatedAt?.toISOString(),
        ]);

        const csv = [
          headers.join(","),
          ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
        ].join("\n");

        return {
          csv,
          filename: `orders-${new Date().toISOString().split("T")[0]}.csv`,
          count: allOrders.length,
        };
      } catch (error) {
        console.error("[Admin] Error exporting orders:", error);
        throw error;
      }
    }),
});
