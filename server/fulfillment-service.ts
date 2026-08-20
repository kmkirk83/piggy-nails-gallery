import { createHmac, timingSafeEqual } from "node:crypto";
import { and, eq } from "drizzle-orm";
import {
  fulfillmentJobs,
  orders,
  productSupplierMappings,
  suppliers,
  webhookDeliveries,
} from "../drizzle/schema";

const CJ_CREATE_ORDER_URL = "https://developers.cjdropshipping.com/api2.0/v1/shopping/order/createOrderV2";

type Db = NonNullable<Awaited<ReturnType<typeof import("./db").getDb>>>;

type FulfillmentLine = {
  productId: string;
  quantity: number;
  storeLineItemId: string;
};

type ShippingAddress = {
  name?: string | null;
  address1?: string | null;
  address2?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  country?: string | null;
  countryCode?: string | null;
  phone?: string | null;
  email?: string | null;
};

export type FulfillmentRequest = {
  orderId: number;
  userId: number;
  amount: number;
  currency: string;
  shippingAddress: ShippingAddress | null;
  lines: FulfillmentLine[];
};

export type FulfillmentResult = {
  jobId: number;
  status: string;
  mode: "simulation" | "live";
  supplierOrderId?: string;
  message: string;
};

function operatingMode(): "simulation" | "live" {
  return process.env.DROPSHIPPING_MODE === "live" ? "live" : "simulation";
}

function parseJson<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function parseOrderId(orderNumber: unknown): number | null {
  if (typeof orderNumber !== "string") return null;
  const match = /^naild-(\d+)$/.exec(orderNumber);
  return match ? Number(match[1]) : null;
}

function addressIsComplete(address: ShippingAddress | null): address is Required<Pick<ShippingAddress, "name" | "address1" | "city" | "state" | "postalCode" | "country" | "countryCode">> & ShippingAddress {
  return Boolean(
    address?.name &&
      address.address1 &&
      address.city &&
      address.state &&
      address.postalCode &&
      address.country &&
      address.countryCode
  );
}

async function getApprovedMappings(db: Db, lines: FulfillmentLine[]) {
  const mappings = await Promise.all(
    lines.map(async (line) => {
      const mapping = await db
        .select()
        .from(productSupplierMappings)
        .where(and(eq(productSupplierMappings.productId, line.productId), eq(productSupplierMappings.isActive, true)))
        .limit(1);
      return { line, mapping: mapping[0] };
    })
  );
  return mappings;
}

async function getCjSupplier(db: Db) {
  const result = await db
    .select()
    .from(suppliers)
    .where(and(eq(suppliers.supplierKey, "cj"), eq(suppliers.isActive, true)))
    .limit(1);
  return result[0] ?? null;
}

function buildCjRequest(request: FulfillmentRequest, mappings: Awaited<ReturnType<typeof getApprovedMappings>>) {
  if (!addressIsComplete(request.shippingAddress)) {
    throw new Error("A complete shipping address is required before supplier submission.");
  }

  const missing = mappings.filter(({ mapping }) => !mapping);
  if (missing.length) {
    throw new Error(`Missing active supplier SKU mappings for: ${missing.map(({ line }) => line.productId).join(", ")}`);
  }

  const logisticName = process.env.CJ_LOGISTIC_NAME;
  if (!logisticName) {
    throw new Error("CJ_LOGISTIC_NAME must be configured before live supplier submission.");
  }

  return {
    orderNumber: `naild-${request.orderId}`,
    shippingZip: request.shippingAddress.postalCode,
    shippingCountry: request.shippingAddress.country,
    shippingCountryCode: request.shippingAddress.countryCode,
    shippingProvince: request.shippingAddress.state,
    shippingCity: request.shippingAddress.city,
    shippingPhone: request.shippingAddress.phone || "",
    shippingCustomerName: request.shippingAddress.name,
    shippingAddress: request.shippingAddress.address1,
    shippingAddress2: request.shippingAddress.address2 || "",
    email: request.shippingAddress.email || "",
    remark: "Nail'd storefront order",
    payType: process.env.CJ_PAYMENT_MODE === "balance" ? 2 : 3,
    logisticName,
    fromCountryCode: process.env.CJ_FROM_COUNTRY_CODE || "CN",
    platform: "Api",
    orderFlow: 1,
    products: mappings.map(({ line, mapping }) => ({
      vid: mapping!.supplierVariantId,
      sku: mapping!.supplierSku,
      quantity: line.quantity,
      storeLineItemId: line.storeLineItemId,
    })),
  };
}

async function submitToCj(payload: ReturnType<typeof buildCjRequest>) {
  const accessToken = process.env.CJ_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error("CJ_ACCESS_TOKEN must be configured before live supplier submission.");
  }

  const response = await fetch(CJ_CREATE_ORDER_URL, {
    method: "POST",
    headers: {
      "CJ-Access-Token": accessToken,
      platformToken: process.env.CJ_PLATFORM_TOKEN || "",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const body = await response.json().catch(() => null) as {
    code?: number;
    message?: string;
    data?: { orderId?: string };
  } | null;

  if (!response.ok || (body?.code !== undefined && body.code !== 200)) {
    throw new Error(body?.message || `CJ supplier request failed with HTTP ${response.status}.`);
  }

  return body;
}

/**
 * Creates exactly one fulfillment job per internal order. Simulation mode produces an
 * auditable job but does not call the supplier or charge a supplier account.
 */
export async function queueFulfillment(db: Db, request: FulfillmentRequest): Promise<FulfillmentResult> {
  const idempotencyKey = `order:${request.orderId}:fulfillment`;
  const existing = await db
    .select()
    .from(fulfillmentJobs)
    .where(eq(fulfillmentJobs.idempotencyKey, idempotencyKey))
    .limit(1);

  if (existing[0]) {
    return {
      jobId: existing[0].id,
      status: existing[0].status,
      mode: existing[0].mode === "live" ? "live" : "simulation",
      supplierOrderId: existing[0].supplierOrderId || undefined,
      message: "Fulfillment job already exists; duplicate supplier submission was prevented.",
    };
  }

  const mode = operatingMode();
  const mappings = await getApprovedMappings(db, request.lines);
  const supplier = await getCjSupplier(db);
  const basePayload = { order: request, mappings: mappings.map(({ line, mapping }) => ({ line, mapping: mapping ? { supplierVariantId: mapping.supplierVariantId, supplierSku: mapping.supplierSku } : null })) };

  if (mode === "simulation") {
    const status = mappings.every(({ mapping }) => mapping) ? "simulated" : "awaiting_supplier_mapping";
    const result = await db.insert(fulfillmentJobs).values({
      orderId: request.orderId,
      supplierId: supplier?.id ?? null,
      mode,
      status,
      idempotencyKey,
      requestPayload: JSON.stringify(basePayload),
      responsePayload: JSON.stringify({ simulated: true, transmitted: false }),
      attempts: 0,
      processedAt: new Date(),
    });
    const jobId = Number(result[0].insertId);
    return {
      jobId,
      status,
      mode,
      message: status === "simulated"
        ? "Simulation job created. No supplier order was transmitted."
        : "Simulation job created and is awaiting approved supplier SKU mappings.",
    };
  }

  if (!supplier) {
    throw new Error("An active CJ supplier record is required before live supplier submission.");
  }

  const cjRequest = buildCjRequest(request, mappings);
  const jobResult = await db.insert(fulfillmentJobs).values({
    orderId: request.orderId,
    supplierId: supplier.id,
    mode,
    status: "submitting",
    idempotencyKey,
    requestPayload: JSON.stringify(cjRequest),
    attempts: 1,
  });
  const jobId = Number(jobResult[0].insertId);

  try {
    const response = await submitToCj(cjRequest);
    const supplierOrderId = response?.data?.orderId || null;
    await db.update(fulfillmentJobs).set({
      status: "submitted",
      responsePayload: JSON.stringify(response),
      supplierOrderId,
      processedAt: new Date(),
    }).where(eq(fulfillmentJobs.id, jobId));
    await db.update(orders).set({ supplierOrderId, status: "processing" }).where(eq(orders.id, request.orderId));
    return { jobId, status: "submitted", mode, supplierOrderId: supplierOrderId || undefined, message: "Supplier order was submitted to CJ." };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown supplier submission error.";
    await db.update(fulfillmentJobs).set({ status: "failed", errorMessage: message, processedAt: new Date() }).where(eq(fulfillmentJobs.id, jobId));
    throw error;
  }
}

/** CJ webhook signatures are HMAC-SHA256 Base64 values over the unmodified raw body. */
export function verifyCjWebhookSignature(rawBody: Buffer, signature: string | undefined): boolean {
  const openId = process.env.CJ_OPEN_ID;
  if (!openId || !signature) return false;
  const expected = createHmac("sha256", openId).update(rawBody).digest("base64");
  const expectedBuffer = Buffer.from(expected);
  const signatureBuffer = Buffer.from(signature);
  return expectedBuffer.length === signatureBuffer.length && timingSafeEqual(expectedBuffer, signatureBuffer);
}

/**
 * Records authenticated supplier events and updates internal order tracking. Incoming
 * CJ events never trigger a new supplier order, avoiding feedback loops.
 */
export async function processCjWebhook(db: Db, rawBody: Buffer, payload: Record<string, any>) {
  const eventId = String(payload.messageId || "");
  const eventType = String(payload.type || "UNKNOWN");
  if (!eventId) throw new Error("CJ webhook is missing a messageId.");

  const duplicate = await db.select().from(webhookDeliveries)
    .where(and(eq(webhookDeliveries.provider, "cj"), eq(webhookDeliveries.externalEventId, eventId)))
    .limit(1);
  if (duplicate[0]) return { duplicate: true };

  await db.insert(webhookDeliveries).values({
    provider: "cj",
    externalEventId: eventId,
    eventType,
    signatureVerified: true,
    processingStatus: "received",
    payload: rawBody.toString("utf8"),
  });

  const params = payload.params || {};
  const orderNumber = params.orderNumber || params.orderNum || params.storeOrderNumbers?.[0];
  const orderId = parseOrderId(orderNumber);

  if (orderId && eventType === "ORDER") {
    await db.update(orders).set({
      supplierOrderId: params.cjOrderId || undefined,
      trackingNumber: params.trackNumber || undefined,
      status: params.orderStatus === "COMPLETED" ? "delivered" : "processing",
    }).where(eq(orders.id, orderId));
  }

  if (orderId && eventType === "LOGISTIC") {
    const trackingStatus = Number(params.trackingStatus);
    await db.update(orders).set({
      supplierOrderId: params.orderId || undefined,
      trackingNumber: params.trackingNumber || undefined,
      status: trackingStatus === 12 ? "delivered" : trackingStatus >= 1 ? "shipped" : "processing",
    }).where(eq(orders.id, orderId));
  }

  await db.update(webhookDeliveries).set({ processingStatus: "processed", processedAt: new Date() })
    .where(and(eq(webhookDeliveries.provider, "cj"), eq(webhookDeliveries.externalEventId, eventId)));
  return { duplicate: false };
}

export function extractFulfillmentLines(productId: string | null, metadata: Record<string, string>): FulfillmentLine[] {
  const selected = parseJson<string[]>(metadata.selectedProductIds, []);
  const productIds = selected.length ? selected : productId ? [productId] : [];
  return productIds.map((id, index) => ({ productId: id, quantity: 1, storeLineItemId: `${id}-${index + 1}` }));
}

export function parseStoredShippingAddress(value: string | null): ShippingAddress | null {
  return parseJson<ShippingAddress | null>(value, null);
}
