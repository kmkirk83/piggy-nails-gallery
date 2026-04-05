import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { printfulService } from "./printful-service";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { stripeRouter } from "./stripe-procedures";
import { designRouter } from "./design-procedures";
import { notificationRouter } from "./notification-procedures";
import { productsRouter } from "./products-procedures";
import { fulfillmentRouter } from "./printful-fulfillment";
import { adminRouter } from "./admin-procedures";
import { marketingRouter } from "./marketing-procedures";
import { orders } from "../drizzle/schema";
import { desc, eq, count } from "drizzle-orm";
import { protectedProcedure } from "./_core/trpc";
import { getDb } from "./db";

/**
 * Orders Router
 */
export const ordersRouter = router({
  getCustomerOrders: protectedProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(20),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database connection failed");

        const offset = (input.page - 1) * input.limit;

        const userOrders = await db
          .select()
          .from(orders)
          .where(eq(orders.userId, ctx.user!.id))
          .orderBy(desc(orders.createdAt))
          .limit(input.limit)
          .offset(offset);

        const countResult = await db
          .select({ count: count() })
          .from(orders)
          .where(eq(orders.userId, ctx.user!.id));

        return {
          orders: userOrders,
          total: countResult[0]?.count || 0,
          page: input.page,
          limit: input.limit,
        };
      } catch (error) {
        console.error("[Orders] Error fetching customer orders:", error);
        throw error;
      }
    }),
});

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  stripe: stripeRouter,
  design: designRouter,
  notifications: notificationRouter,
  products: productsRouter,
  fulfillment: fulfillmentRouter,
  admin: adminRouter,
  marketing: marketingRouter,
  orders: ordersRouter,

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
