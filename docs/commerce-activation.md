# Commerce Activation Guide

## Purpose

This storefront is designed to run in **market-test mode** by default. Customers can browse products, build subscription boxes, select or decline seasonal curation, and complete a testable checkout journey. Supplier fulfillment remains simulated until the operator has approved a pilot catalog and configured verified supplier credentials.

> **Safety default:** `DROPSHIPPING_MODE=simulation` must remain enabled until real product mappings, shipping terms, and supplier credentials have been reviewed.

## Architecture

| Layer | Responsibility | Market-test behavior | Live behavior |
|---|---|---|---|
| Product catalog | Presents sellable items, prices, images, and box eligibility | Uses curated, operator-owned catalog data | Links each sellable SKU to an approved supplier variant |
| Subscription builder | Captures cadence, item choices, seasonal preference, and delivery intent | Stores the requested box composition in checkout metadata and fulfillment records | Reuses the saved composition for each paid renewal |
| Payment events | Receives signed Stripe payment and subscription events | Creates idempotent fulfillment jobs in a non-transmitting state | Enqueues approved jobs for supplier submission |
| Fulfillment adapter | Translates an internal order into a supplier request | Records a simulated supplier order and state transition | Sends the mapped order to CJ Dropshipping and stores the supplier order ID |
| Supplier webhook | Accepts stock, order, and logistics updates | Validates and records test payloads without customer-facing shipment claims | Updates fulfillment status and tracking from authenticated supplier updates |

## Subscription Choices

Each subscriber selects a box size, delivery cadence, and either a **custom** or **seasonal** selection mode. A custom box lets the subscriber choose each included product. A seasonal box lets the subscriber accept a curated edit for the current season. Customers can decline seasonal choices, switch to custom choices, skip an upcoming box, or pause/cancel the subscription before the stated cutoff.

A subscription item must be eligible for the selected box and must have an active supplier SKU mapping before it can be transmitted in live mode. The system does not substitute an item automatically when a customer has chosen it explicitly.

## Supplier Activation Checklist

| Requirement | Why it matters |
|---|---|
| CJ Dropshipping account with API access | Required to create and pay supplier orders |
| Approved pilot product list | Prevents unverified or unsuitable nail products from being sold |
| Supplier variant ID and SKU for every sellable item | Enables deterministic order routing |
| Confirmed cost, shipping lanes, and handling time | Needed to validate margin and customer delivery promise |
| `CJ_API_KEY` and `CJ_OPEN_ID` configured as server secrets | Used for authenticated API access and supplier webhook verification |
| `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` configured as server secrets | Required to create checkouts and verify payment events |
| `DROPSHIPPING_MODE=live` explicitly enabled | Unlocks supplier order transmission only after the above checks are complete |

## Webhook Requirements

CJ requires an HTTPS endpoint, raw request-body HMAC-SHA256 signature verification using the account `openId`, and a prompt `200 OK` response. The implementation therefore verifies the signature before handling the message, records a delivery ID for idempotency, and responds before any long-running downstream work. CJ exposes updates for product/variant, stock, order, and logistics changes. [1]

Stripe events are independently verified with the Stripe webhook signing secret. The fulfillment workflow must be idempotent because payment platforms and suppliers can redeliver events.

## Live-Order Controls

The application rejects live supplier submission when any of the following is true: the operating mode is simulation, the product has no active supplier mapping, the order has no validated shipping address, a fulfillment job was already transmitted, or the supplier configuration is incomplete. These guardrails deliberately favor a recoverable queue over an accidental customer charge or duplicate shipment.

## Sources

[1] [CJ Dropshipping — Webhook Mechanism](https://developers.cjdropshipping.cn/en/api/start/webhook.html)

[2] [Shopify — Webhooks](https://shopify.dev/docs/api/webhooks/latest)

[3] [Shopify — Create a webhook subscription](https://shopify.dev/docs/apps/build/webhooks/get-started)

## Initial Pilot Scope

The checkout currently collects shipping addresses for **United States and Canada** only. This is deliberate: it keeps the first market test inside a bounded shipping scope while supplier lanes, duties, delivery times, and margins are verified. Do not advertise worldwide delivery until those settings have been tested with the selected supplier.

## Deployment Steps

| Step | Required action |
|---|---|
| 1. Apply schema changes | Set `DATABASE_URL` and run the repository migration command so the new supplier, mapping, fulfillment-job, webhook-delivery, and subscription-preference records exist. |
| 2. Configure test payments | Add Stripe test-mode server secrets, deploy, and register `https://<your-domain>/api/stripe/webhook` for checkout, invoice, subscription, and refund events. |
| 3. Start in simulation | Keep `DROPSHIPPING_MODE=simulation`. Paid test events will create auditable fulfillment jobs but make **no** supplier request. |
| 4. Map pilot products | As an administrator, add a CJ supplier record and an explicit active mapping for each storefront item: product ID, CJ product ID, CJ variant ID, and CJ SKU. Keep mappings inactive until reviewed. |
| 5. Configure CJ callbacks | Add `https://<your-domain>/api/cj/webhook` in CJ, save `CJ_OPEN_ID` as a server secret, and send a signed test notification. The receiver rejects unsigned or malformed payloads. |
| 6. Activate deliberately | Confirm supplier cost, logistics service, shipping promises, and a real low-value test order. Only then set `DROPSHIPPING_MODE=live`, activate the CJ supplier and approved mappings, and configure CJ payment mode. |

## What the Implementation Validates

| Area | Control implemented |
|---|---|
| Customer choice | Custom boxes require a complete selection; seasonal curation is optional and can be bypassed. |
| Checkout | The box configuration is transferred from the browser to validated Stripe checkout metadata and subscription metadata. |
| Payment safety | Stripe events are signature-verified and recorded in an idempotent delivery ledger. |
| Supplier safety | Simulation is the default. A live supplier call requires active supplier/mapping records, a complete shipping address, a logistics configuration, and a CJ access token. |
| Duplicate prevention | One fulfillment job is allowed per internal order. Duplicate Stripe or CJ deliveries are ignored after they are recorded. |
| Tracking | Authenticated CJ order and logistics updates update the internal supplier order ID, tracking number, and shipment status. |

> **Operational caution:** Do not set `CJ_PAYMENT_MODE=balance` until a real account balance, approved supplier catalog, and low-value live test order have been reviewed. The mode controls whether CJ can charge the supplier balance at order submission.

## Local Verification

Run `pnpm check`, `pnpm test`, and `pnpm build` before deployment. The repository includes unit coverage for CJ HMAC verification and fulfillment-line construction. A configured database and Stripe test account are still required for an end-to-end checkout-to-webhook test.
