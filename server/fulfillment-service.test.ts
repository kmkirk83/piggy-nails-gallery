import { createHmac } from "node:crypto";
import { afterEach, describe, expect, it } from "vitest";
import {
  extractFulfillmentLines,
  parseStoredShippingAddress,
  verifyCjWebhookSignature,
} from "./fulfillment-service";

const originalOpenId = process.env.CJ_OPEN_ID;

afterEach(() => {
  if (originalOpenId === undefined) {
    delete process.env.CJ_OPEN_ID;
  } else {
    process.env.CJ_OPEN_ID = originalOpenId;
  }
});

describe("CJ supplier safety helpers", () => {
  it("accepts only a valid raw-body HMAC signature", () => {
    process.env.CJ_OPEN_ID = "test-open-id";
    const body = Buffer.from('{"messageId":"test-event","type":"ORDER"}');
    const signature = createHmac("sha256", "test-open-id").update(body).digest("base64");

    expect(verifyCjWebhookSignature(body, signature)).toBe(true);
    expect(verifyCjWebhookSignature(body, "not-a-valid-signature")).toBe(false);
  });

  it("uses customer-selected box items before falling back to the primary product", () => {
    expect(extractFulfillmentLines("starter-monthly", {
      selectedProductIds: JSON.stringify(["chrome-dreams", "floral-garden"]),
    })).toEqual([
      { productId: "chrome-dreams", quantity: 1, storeLineItemId: "chrome-dreams-1" },
      { productId: "floral-garden", quantity: 1, storeLineItemId: "floral-garden-2" },
    ]);

    expect(extractFulfillmentLines("chrome-dreams", {})).toEqual([
      { productId: "chrome-dreams", quantity: 1, storeLineItemId: "chrome-dreams-1" },
    ]);
  });

  it("fails closed for malformed shipping address data", () => {
    expect(parseStoredShippingAddress("not-json")).toBeNull();
    expect(parseStoredShippingAddress(JSON.stringify({ city: "Seattle" }))).toEqual({ city: "Seattle" });
  });
});
