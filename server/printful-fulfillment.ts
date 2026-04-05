/**
 * Printful Fulfillment Router
 * Handles automatic order routing to Printful for production and shipping
 */

import { z } from "zod";
import { protectedProcedure, router } from "./_core/trpc";
import { printfulService } from "./printful-service";
import { nailProducts } from "./nail-products-data";
import { getDb } from "./db";
import { orders } from "../drizzle/schema";
import { eq } from "drizzle-orm";

export const fulfillmentRouter = router({
  /**
   * Create Printful order from customer order
   * Routes order to Printful for production and shipping
   */
  createPrintfulOrder: protectedProcedure
    .input(
      z.object({
        orderId: z.number(),
        productId: z.string(),
        quantity: z.number().default(1),
        shippingAddress: z.object({
          name: z.string(),
          address: z.string(),
          city: z.string(),
          state: z.string(),
          zip: z.string(),
          country: z.string(),
        }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // Get product details
        const product = nailProducts.find((p) => p.id === input.productId);
        if (!product) {
          throw new Error(`Product ${input.productId} not found`);
        }

        // Create order in Printful
        const printfulOrder = await printfulService.createOrder(
          `order-${input.orderId}`,
          [{ productId: input.productId, quantity: input.quantity }],
          input.shippingAddress
        );

        // Update order with Printful reference
        const db = await getDb();
        if (db) {
          await db
            .update(orders)
            .set({
              status: "processing",
              updatedAt: new Date(),
            })
            .where(eq(orders.id, input.orderId));
        }

        console.log(
          `[Fulfillment] Order ${input.orderId} routed to Printful:`,
          printfulOrder
        );

        return {
          success: true,
          printfulOrderId: printfulOrder.id,
          status: printfulOrder.status,
        };
      } catch (error) {
        console.error("[Fulfillment] Error creating Printful order:", error);
        throw error;
      }
    }),

  /**
   * Get order status from Printful
   */
  getOrderStatus: protectedProcedure
    .input(z.object({ printfulOrderId: z.number() }))
    .query(async ({ input }) => {
      try {
        const status = await printfulService.getOrderStatus(
          input.printfulOrderId.toString()
        );
        return status;
      } catch (error) {
        console.error("[Fulfillment] Error getting order status:", error);
        throw error;
      }
    }),

  /**
   * Sync all products to Printful
   */
  syncAllProducts: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      // Only allow admins
      if (ctx.user?.role !== "admin") {
        throw new Error("Only admins can sync products");
      }

      console.log("[Fulfillment] Starting product sync to Printful...");
      await printfulService.createAllProducts();

      return {
        success: true,
        message: "All products synced to Printful",
        count: nailProducts.length,
      };
    } catch (error) {
      console.error("[Fulfillment] Error syncing products:", error);
      throw error;
    }
  }),

  /**
   * Get Printful products
   */
  getPrintfulProducts: protectedProcedure.query(async () => {
    try {
      const products = await printfulService.getAllProducts();
      return products;
    } catch (error) {
      console.error("[Fulfillment] Error getting Printful products:", error);
      throw error;
    }
  }),

  /**
   * Validate Printful connection
   */
  validateConnection: protectedProcedure.query(async ({ ctx }) => {
    try {
      // Only allow admins
      if (ctx.user?.role !== "admin") {
        throw new Error("Only admins can validate connection");
      }

      const response = await fetch("https://api.printful.com/account", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        return {
          connected: true,
          accountId: data.result?.id,
          message: "Printful API connection successful",
        };
      } else {
        return {
          connected: false,
          status: response.status,
          message: "Printful API connection failed",
        };
      }
    } catch (error) {
      console.error("[Fulfillment] Error validating connection:", error);
      return {
        connected: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }),
});
