# Fulfillment Partner Integration Guide

## Current Status

You have contacted 8 fulfillment partners with professional inquiry emails. This guide explains how to evaluate responses and integrate the selected partner.

---

## Fulfillment Partner Comparison

### Partners Contacted

| Partner | Status | Response | Notes |
|---------|--------|----------|-------|
| SunDance | Awaiting | - | Print-on-demand specialist |
| Printful | Awaiting | - | Popular POD platform |
| Printify | Awaiting | - | Multi-supplier POD |
| ShipBob | Awaiting | - | 3PL fulfillment |
| eFulfillment | Awaiting | - | General fulfillment |
| Fulfillrite | Awaiting | - | Boutique fulfillment |
| ShipMonk | Awaiting | - | Enterprise fulfillment |

---

## Evaluation Criteria

When partners respond, evaluate based on:

### 1. Product Capabilities
- [ ] Can print nail art designs on boxes/packaging
- [ ] Quality of print (color accuracy, durability)
- [ ] Minimum order quantities
- [ ] Lead times
- [ ] Custom packaging options

### 2. Pricing
- [ ] Setup fees
- [ ] Per-unit costs (by product type)
- [ ] Shipping costs
- [ ] Hidden fees
- [ ] Volume discounts

### 3. Integration
- [ ] API availability
- [ ] Webhook support for order sync
- [ ] Real-time inventory tracking
- [ ] Tracking number generation
- [ ] Returns/refund handling

### 4. Reliability
- [ ] Uptime SLA
- [ ] Average fulfillment time
- [ ] Error rate
- [ ] Customer reviews
- [ ] Support availability

### 5. Scalability
- [ ] Can handle 100+ orders/day
- [ ] Can handle 1000+ orders/day
- [ ] Inventory management
- [ ] Multi-warehouse support
- [ ] International shipping

---

## Integration Architecture

### Order Flow

```
Customer Order
    ↓
Stripe Payment Processed
    ↓
Order Created in Database
    ↓
Webhook Triggers Fulfillment
    ↓
Order Sent to Partner API
    ↓
Partner Confirms Receipt
    ↓
Partner Ships Order
    ↓
Tracking Number Received
    ↓
Customer Notified via Email
    ↓
Order Delivered
```

---

## API Integration Steps

### Step 1: Get Partner API Credentials

After selecting partner, request:
- API Key / Access Token
- API Endpoint URL
- Webhook URL
- Test/Sandbox environment
- Documentation

### Step 2: Implement Partner API Client

Create `server/fulfillment-partner.ts`:

```typescript
import axios from 'axios';

const PARTNER_API_URL = process.env.FULFILLMENT_API_URL;
const PARTNER_API_KEY = process.env.FULFILLMENT_API_KEY;

interface FulfillmentOrder {
  orderId: string;
  customer: {
    name: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  items: Array<{
    sku: string;
    quantity: number;
    name: string;
  }>;
  shippingMethod: 'standard' | 'express' | 'overnight';
}

export async function createFulfillmentOrder(order: FulfillmentOrder) {
  try {
    const response = await axios.post(
      `${PARTNER_API_URL}/orders`,
      {
        reference_id: order.orderId,
        recipient: order.customer,
        line_items: order.items,
        shipping_method: order.shippingMethod,
      },
      {
        headers: {
          'Authorization': `Bearer ${PARTNER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      success: true,
      partnerId: response.data.id,
      trackingNumber: response.data.tracking_number,
    };
  } catch (error) {
    console.error('Fulfillment API error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function getOrderStatus(partnerId: string) {
  try {
    const response = await axios.get(
      `${PARTNER_API_URL}/orders/${partnerId}`,
      {
        headers: {
          'Authorization': `Bearer ${PARTNER_API_KEY}`,
        },
      }
    );

    return {
      status: response.data.status,
      trackingNumber: response.data.tracking_number,
      estimatedDelivery: response.data.estimated_delivery,
    };
  } catch (error) {
    console.error('Error getting order status:', error);
    return null;
  }
}
```

### Step 3: Add tRPC Procedure

In `server/routers.ts`:

```typescript
export const appRouter = router({
  // ... existing procedures

  fulfillment: {
    createOrder: protectedProcedure
      .input(z.object({
        orderId: z.string(),
        items: z.array(z.object({
          sku: z.string(),
          quantity: z.number(),
        })),
      }))
      .mutation(async ({ input, ctx }) => {
        // Get order from database
        const order = await db.orders.findUnique({
          where: { id: input.orderId },
          include: { customer: true, items: true },
        });

        if (!order) throw new TRPCError({ code: 'NOT_FOUND' });

        // Send to fulfillment partner
        const result = await createFulfillmentOrder({
          orderId: order.id,
          customer: order.customer,
          items: input.items,
          shippingMethod: 'standard',
        });

        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error,
          });
        }

        // Update order with fulfillment info
        await db.orders.update({
          where: { id: order.id },
          data: {
            fulfillmentPartnerId: result.partnerId,
            trackingNumber: result.trackingNumber,
            status: 'fulfillment_sent',
          },
        });

        return result;
      }),
  },
});
```

### Step 4: Handle Webhooks

Create `server/fulfillment-webhook.ts`:

```typescript
import { Router } from 'express';

export const fulfillmentWebhookRouter = Router();

fulfillmentWebhookRouter.post('/webhook', async (req, res) => {
  const event = req.body;

  try {
    switch (event.type) {
      case 'order.shipped':
        await handleOrderShipped(event.data);
        break;
      case 'order.delivered':
        await handleOrderDelivered(event.data);
        break;
      case 'order.failed':
        await handleOrderFailed(event.data);
        break;
      case 'order.returned':
        await handleOrderReturned(event.data);
        break;
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: error.message });
  }
});

async function handleOrderShipped(data: any) {
  // Update order status
  await db.orders.update({
    where: { fulfillmentPartnerId: data.order_id },
    data: {
      status: 'shipped',
      trackingNumber: data.tracking_number,
      shippedAt: new Date(),
    },
  });

  // Send email to customer
  // ... email notification code
}

async function handleOrderDelivered(data: any) {
  // Update order status
  await db.orders.update({
    where: { fulfillmentPartnerId: data.order_id },
    data: {
      status: 'delivered',
      deliveredAt: new Date(),
    },
  });

  // Send email to customer
  // ... email notification code
}

async function handleOrderFailed(data: any) {
  // Handle failed shipment
  // Notify customer
  // Create refund
}

async function handleOrderReturned(data: any) {
  // Handle return
  // Process refund
  // Update inventory
}
```

### Step 5: Update Database Schema

Add fulfillment fields to orders table:

```typescript
// In drizzle/schema.ts
export const orders = sqliteTable('orders', {
  id: text('id').primaryKey(),
  // ... existing fields
  
  // Fulfillment fields
  fulfillmentPartnerId: text('fulfillment_partner_id'),
  trackingNumber: text('tracking_number'),
  fulfillmentStatus: text('fulfillment_status', {
    enum: ['pending', 'sent', 'shipped', 'delivered', 'failed'],
  }),
  shippedAt: integer('shipped_at'),
  deliveredAt: integer('delivered_at'),
});

// Run migration
// pnpm db:push
```

---

## Testing Integration

### Step 1: Test in Sandbox

1. Get partner's test/sandbox credentials
2. Configure with test API key
3. Create test order
4. Verify order appears in partner's dashboard
5. Test webhook delivery

### Step 2: Test Order Flow

1. Create test product in shop
2. Add to cart
3. Checkout with test payment
4. Verify order created in database
5. Verify order sent to fulfillment partner
6. Verify tracking number received
7. Verify customer email sent

### Step 3: Test Webhook

1. Simulate order shipped event
2. Verify order status updated
3. Verify customer notification sent
4. Verify tracking link works

### Step 4: Test Error Handling

- [ ] API timeout
- [ ] Invalid API key
- [ ] Order not found
- [ ] Network error
- [ ] Malformed response

---

## Environment Variables

Add to your secrets:

```
FULFILLMENT_API_URL=https://api.partner.com
FULFILLMENT_API_KEY=your_api_key_here
FULFILLMENT_WEBHOOK_SECRET=your_webhook_secret
```

---

## Monitoring

### Track Metrics

| Metric | Target | Action |
|--------|--------|--------|
| Order Fulfillment Rate | > 99% | Investigate failures |
| Average Fulfillment Time | < 24 hours | Optimize process |
| Shipping Cost | < 15% of order | Negotiate rates |
| Tracking Accuracy | 100% | Verify all orders tracked |
| Customer Satisfaction | > 4.5/5 | Improve packaging/speed |

### Set Up Alerts

```typescript
// Alert if fulfillment fails
if (fulfillmentResult.success === false) {
  await notifyOwner({
    title: 'Fulfillment Error',
    content: `Order ${orderId} failed to send to partner: ${fulfillmentResult.error}`,
  });
}

// Alert if shipping takes too long
const hoursElapsed = (Date.now() - order.createdAt) / (1000 * 60 * 60);
if (hoursElapsed > 48 && order.status !== 'shipped') {
  await notifyOwner({
    title: 'Slow Fulfillment',
    content: `Order ${orderId} not shipped after 48 hours`,
  });
}
```

---

## Common Issues & Solutions

### Issue: Orders Not Syncing

**Check**:
1. API credentials correct
2. API endpoint accessible
3. Webhook URL correct
4. Firewall not blocking
5. Server logs for errors

**Solution**:
```bash
# Test API connectivity
curl -H "Authorization: Bearer YOUR_KEY" \
  https://api.partner.com/orders
```

### Issue: Tracking Numbers Not Received

**Check**:
1. Partner API returns tracking number
2. Database field exists
3. Email template includes tracking link
4. Customer receives email

### Issue: Webhook Not Firing

**Check**:
1. Webhook URL is public/accessible
2. Webhook secret correct
3. Event type subscribed
4. Server logs for errors

**Debug**:
```typescript
// Log all webhook events
console.log('Webhook received:', JSON.stringify(event, null, 2));
```

---

## Scaling Fulfillment

### Multi-Warehouse

If partner supports multiple warehouses:

```typescript
interface FulfillmentOrder {
  warehouse?: 'west' | 'east' | 'central';
  // ... other fields
}
```

### Inventory Sync

Sync inventory from partner:

```typescript
async function syncInventory() {
  const inventory = await getPartnerInventory();
  
  for (const item of inventory) {
    await db.products.update({
      where: { sku: item.sku },
      data: { stock: item.quantity },
    });
  }
}

// Run every hour
setInterval(syncInventory, 60 * 60 * 1000);
```

### Returns Management

Handle returns from partner:

```typescript
async function handleReturn(orderId: string, reason: string) {
  // Create return in partner system
  const result = await createReturnOrder(orderId, reason);
  
  // Update order status
  await db.orders.update({
    where: { id: orderId },
    data: { status: 'returned', returnReason: reason },
  });
  
  // Process refund
  await processRefund(orderId);
}
```

---

## Resources

- [Printful API Docs](https://developers.printful.com)
- [Printify API Docs](https://developers.printify.com)
- [ShipBob API Docs](https://developer.shipbob.com)
- [Fulfillment Best Practices](https://www.shopify.com/blog/fulfillment)

---

## Next Steps

1. Wait for partner responses
2. Evaluate based on criteria above
3. Schedule calls with top 2-3 partners
4. Request test API credentials
5. Implement integration
6. Test thoroughly
7. Go live
