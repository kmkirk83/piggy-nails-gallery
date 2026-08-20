import { TRPCError } from "@trpc/server";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import {
  fulfillmentJobs,
  orders,
  productSupplierMappings,
  suppliers,
} from "../drizzle/schema";
import { getDb } from "./db";
import { getProductById } from "./nail-products";
import { protectedProcedure, router } from "./_core/trpc";

function requireAdmin(role: string | null | undefined) {
  if (role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Administrator access is required for supplier configuration." });
  }
}

function operatingMode() {
  return process.env.DROPSHIPPING_MODE === "live" ? "live" : "simulation";
}

async function requireDb() {
  const db = await getDb();
  if (!db) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Database is not configured." });
  return db;
}

export const fulfillmentRouter = router({
  /** Shows whether the store is safely ready for live supplier activation. */
  readiness: protectedProcedure.query(async ({ ctx }) => {
    requireAdmin(ctx.user.role);
    const db = await requireDb();
    const [supplier] = await db.select().from(suppliers).where(eq(suppliers.supplierKey, "cj")).limit(1);
    const activeMappings = await db.select().from(productSupplierMappings)
      .where(eq(productSupplierMappings.isActive, true));

    return {
      mode: operatingMode(),
      supplier: supplier ? { configured: true, active: supplier.isActive, name: supplier.name } : { configured: false, active: false, name: "CJ Dropshipping" },
      activeMappingCount: activeMappings.length,
      liveEnvironmentReady: Boolean(
        process.env.CJ_ACCESS_TOKEN &&
          process.env.CJ_OPEN_ID &&
          process.env.CJ_LOGISTIC_NAME &&
          process.env.STRIPE_WEBHOOK_SECRET
      ),
      safeToTransmit: operatingMode() === "live" && Boolean(supplier?.isActive) && activeMappings.length > 0,
    };
  }),

  /** Creates or updates one explicit storefront-product to supplier-variant mapping. */
  upsertProductMapping: protectedProcedure
    .input(z.object({
      productId: z.string().min(1),
      supplierProductId: z.string().min(1),
      supplierVariantId: z.string().min(1),
      supplierSku: z.string().min(1),
      unitCostCents: z.number().int().nonnegative().optional(),
      active: z.boolean().default(false),
    }))
    .mutation(async ({ ctx, input }) => {
      requireAdmin(ctx.user.role);
      if (!getProductById(input.productId)) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Storefront product not found." });
      }
      const db = await requireDb();

      let [supplier] = await db.select().from(suppliers).where(eq(suppliers.supplierKey, "cj")).limit(1);
      if (!supplier) {
        const result = await db.insert(suppliers).values({
          supplierKey: "cj",
          name: "CJ Dropshipping",
          mode: "simulation",
          isActive: false,
        });
        const supplierId = Number(result[0].insertId);
        [supplier] = await db.select().from(suppliers).where(eq(suppliers.id, supplierId)).limit(1);
      }

      const existing = await db.select().from(productSupplierMappings)
        .where(and(eq(productSupplierMappings.productId, input.productId), eq(productSupplierMappings.supplierId, supplier!.id)))
        .limit(1);
      const values = {
        supplierProductId: input.supplierProductId,
        supplierVariantId: input.supplierVariantId,
        supplierSku: input.supplierSku,
        unitCostCents: input.unitCostCents ?? null,
        isActive: input.active,
        updatedAt: new Date(),
      };

      if (existing[0]) {
        await db.update(productSupplierMappings).set(values).where(eq(productSupplierMappings.id, existing[0].id));
        return { id: existing[0].id, created: false };
      }

      const result = await db.insert(productSupplierMappings).values({
        productId: input.productId,
        supplierId: supplier!.id,
        ...values,
      });
      return { id: Number(result[0].insertId), created: true };
    }),

  /** Lists the signed-in shopper's fulfillment status without exposing supplier credentials. */
  myFulfillmentStatus: protectedProcedure.query(async ({ ctx }) => {
    const db = await requireDb();
    const myOrders = await db.select().from(orders).where(eq(orders.userId, ctx.user.id)).orderBy(desc(orders.createdAt));
    const jobs = await Promise.all(myOrders.map(async (order) => {
      const [job] = await db.select().from(fulfillmentJobs).where(eq(fulfillmentJobs.orderId, order.id)).limit(1);
      return {
        orderId: order.id,
        orderStatus: order.status,
        trackingNumber: order.trackingNumber,
        supplierOrderId: order.supplierOrderId,
        fulfillmentStatus: job?.status || "not_queued",
        simulation: job?.mode !== "live",
        createdAt: order.createdAt,
      };
    }));
    return jobs;
  }),
});
