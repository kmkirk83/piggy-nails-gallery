import { Request, Response } from "express";
import { getDb } from "./db";
import { processCjWebhook, verifyCjWebhookSignature } from "./fulfillment-service";

/**
 * CJ webhook receiver. It accepts raw JSON before Express parsing, verifies CJ's
 * Base64 HMAC signature, and only records or applies supplier-originated updates.
 */
export async function handleCjWebhook(req: Request, res: Response) {
  const rawBody = req.body as Buffer;
  const signature = typeof req.headers.sign === "string" ? req.headers.sign : undefined;

  if (!Buffer.isBuffer(rawBody) || !verifyCjWebhookSignature(rawBody, signature)) {
    return res.status(401).json({ error: "Invalid CJ webhook signature" });
  }

  let payload: Record<string, any>;
  try {
    payload = JSON.parse(rawBody.toString("utf8"));
  } catch {
    return res.status(400).json({ error: "Invalid CJ webhook payload" });
  }

  const db = await getDb();
  if (!db) return res.status(503).json({ error: "Database unavailable" });

  try {
    const result = await processCjWebhook(db, rawBody, payload);
    return res.status(200).json({ received: true, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "CJ webhook processing failed";
    console.error("[CJ webhook] Processing failed", { message, messageId: payload.messageId });
    return res.status(500).json({ error: "CJ webhook processing failed" });
  }
}
