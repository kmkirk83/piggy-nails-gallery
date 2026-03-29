# Nail'd - CJ Dropshipping Integration Guide
## Complete Setup & Product Implementation

---

## Part 1: CJ Dropshipping Account Setup

### Step 1: Create Account
1. Visit https://www.cjdropshipping.com
2. Click "Register" (top right)
3. Enter email address
4. Create password (min 8 characters)
5. Verify email via confirmation link
6. Complete business profile:
   - Business name: Nail'd
   - Business type: E-commerce/Dropshipping
   - Country: [Your location]
   - Phone number: [Your phone]

**Time:** 10 minutes

### Step 2: Add Payment Method
1. Go to Account Settings → Payment Methods
2. Add credit card or PayPal
3. Verify payment method
4. Set as default payment method

**Time:** 5 minutes

### Step 3: Download CJ Mobile App
1. Search "CJ Dropshipping" on App Store or Google Play
2. Download official app
3. Log in with your credentials
4. Enable push notifications for order alerts

**Time:** 5 minutes

---

## Part 2: Finding & Selecting Products

### Step 4: Browse Product Catalog
1. Go to CJ Dropshipping → Products
2. Use search filters:
   - Category: Beauty → Nails
   - Price range: $2-12
   - Supplier rating: 4.5+ stars
   - Shipping time: 7-15 days

**Search keywords to use:**
- "Nail wraps"
- "Press-on nails"
- "Gel nail kit"
- "Nail art accessories"
- "Manicure tools"
- "Nail polish"

### Step 5: Evaluate Products
For each product, check:
- **Supplier rating:** 4.5+ stars minimum
- **Reviews:** Read 5-10 customer reviews
- **Shipping time:** 7-15 days preferred
- **Price:** $2-12 per unit
- **Images:** High quality, multiple angles
- **Description:** Detailed, accurate

### Step 6: Create Product Selection Spreadsheet

Create a Google Sheet with these columns:

| Product Name | CJ Product ID | Category | Cost | Retail Price | Profit | Supplier Rating | Notes |
|---|---|---|---|---|---|---|---|
| Holographic Nail Wraps | CJ-12345 | Nail Wraps | $4 | $9.99 | $5.99 | 4.8 | Best seller |
| Press-On Nails Set | CJ-12346 | Press-Ons | $3 | $8.99 | $5.99 | 4.7 | Multiple colors |
| Gel Nail Kit LED | CJ-12347 | Gel Kits | $8 | $19.99 | $11.99 | 4.9 | Includes lamp |

**Target:** Select 15-20 products across categories

### Step 7: Add Products to Favorites
1. For each selected product, click ❤️ "Add to Favorites"
2. This creates a collection for easy ordering
3. You can also create custom collections by category

**Time:** 2-3 hours for full research

---

## Part 3: Pricing & Profit Configuration

### Step 8: Set Up Pricing Strategy

**Formula:** Retail Price = (Cost × 2.5) to (Cost × 3)

**Example:**
- CJ cost: $4/unit
- Retail price: $9.99-12 (2.5-3x markup)
- Profit per unit: $5.99-8
- Profit margin: 60-67%

**For subscription boxes:**
- Starter Box: 3 items @ $4-8 cost = $12-24 cost
- Retail price: $34.99
- Profit: $10.99-22.99 per box (31-66% margin)

### Step 9: Create Pricing Spreadsheet

| Subscription Tier | Items | Total Cost | Retail Price | Profit | Margin |
|---|---|---|---|---|---|
| Starter | 2 wraps + 1 accessory | $11 | $34.99 | $23.99 | 69% |
| Trendsetter | 2 wraps + 1 exclusive + 2 accessories | $14 | $49.99 | $35.99 | 72% |
| VIP | 1 exclusive + 1 wrap + 1 gel kit + 3 accessories | $18 | $69.99 | $51.99 | 74% |

---

## Part 4: Importing Products to Nail'd Platform

### Step 10: Create Product Database Entries

For each CJ product, add to your Nail'd database:

```
Product Details:
- Product name: [From CJ]
- Description: [From CJ, customize if needed]
- Category: [Nail Wraps / Press-Ons / Gel Kits / Accessories]
- CJ Product ID: [From CJ]
- Cost: [CJ price]
- Retail price: [Your markup]
- Supplier: CJ Dropshipping
- Shipping time: [7-15 days]
- Stock: [Unlimited - dropshipping]
- Image URL: [From CJ product page]
```

### Step 11: Update Gallery Page

Add selected products to your Nail'd Gallery:

```tsx
// client/src/pages/Gallery.tsx

const cjProducts = [
  {
    id: 'cj-holographic-wraps',
    name: 'Holographic Nail Wraps',
    category: 'Nail Wraps',
    price: 9.99,
    cost: 4.00,
    image: 'https://cjdropshipping.com/images/...',
    supplier: 'CJ Dropshipping',
    rating: 4.8,
    description: 'Shimmering holographic nail wraps with 20 strips per pack'
  },
  // ... more products
]
```

### Step 12: Set Up Product Sync

Create a script to sync CJ product data:

```javascript
// scripts/sync-cj-products.mjs

import fetch from 'node-fetch';

async function syncCJProducts() {
  const cjProducts = [
    { cjId: 'CJ-12345', nailedId: 'cj-holographic-wraps' },
    { cjId: 'CJ-12346', nailedId: 'cj-press-on-nails' },
    // ... more mappings
  ];

  for (const product of cjProducts) {
    // Fetch from CJ API
    const cjData = await fetch(`https://api.cjdropshipping.com/products/${product.cjId}`);
    
    // Update Nail'd database
    await updateNailedProduct(product.nailedId, cjData);
  }
}

syncCJProducts();
```

---

## Part 5: Order Fulfillment Setup

### Step 13: Configure Order Flow

**When customer orders on Nail'd:**

1. Customer places order on Nail'd
2. Payment processed via Stripe
3. Order details sent to CJ Dropshipping
4. CJ picks, packs, and ships
5. Customer receives tracking number
6. Customer receives package

### Step 14: Create Order Mapping

Create integration between Nail'd orders and CJ:

```
Nail'd Order → CJ Dropshipping Order

Customer: [Name]
Items: [Product IDs]
Shipping Address: [Address]
Order Date: [Date]
CJ Order ID: [Generated by CJ]
Tracking Number: [From CJ]
Status: [Pending/Processing/Shipped/Delivered]
```

### Step 15: Set Up Automated Fulfillment

**Option A: Manual (Recommended for start)**
1. Customer orders on Nail'd
2. You manually create order on CJ
3. CJ ships directly to customer
4. You update Nail'd with tracking

**Option B: API Integration (Advanced)**
Use CJ API to automate:
```
POST /api/cj/orders
{
  "products": [
    { "productId": "CJ-12345", "quantity": 1 },
    { "productId": "CJ-12346", "quantity": 2 }
  ],
  "shippingAddress": {
    "name": "Customer Name",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zip": "10001",
    "country": "US"
  }
}
```

---

## Part 6: Creating Subscription Boxes

### Step 16: Design Subscription Box Tiers

**Starter Box ($34.99/month)**
- Product 1: Holographic Nail Wraps (CJ-12345)
- Product 2: Chrome Nail Wraps (CJ-12346)
- Product 3: Nail Rhinestones (CJ-12347)

**Trendsetter Box ($49.99/month)**
- Product 1: Holographic Nail Wraps (CJ-12345)
- Product 2: Press-On Nails (CJ-12348)
- Product 3: Gel Nail Kit (CJ-12349)
- Product 4: Nail Art Decals (CJ-12350)
- Product 5: Cuticle Oil (CJ-12351)

**VIP Box ($69.99/month)**
- Product 1: Exclusive Design Wraps (HUIZI)
- Product 2: Premium Press-Ons (CJ-12352)
- Product 3: LED Nail Lamp (CJ-12353)
- Product 4: Gel Polish Set (CJ-12354)
- Product 5: Manicure Tool Kit (CJ-12355)
- Product 6: Luxury Packaging

### Step 17: Create Subscription Logic

```typescript
// server/routers.ts

export const subscriptionRouter = createTRPCRouter({
  createSubscription: protectedProcedure
    .input(z.object({
      tier: z.enum(['starter', 'trendsetter', 'vip']),
      billingCycle: z.enum(['monthly', 'quarterly', 'annual']),
    }))
    .mutation(async ({ ctx, input }) => {
      // Create Stripe subscription
      const subscription = await stripe.subscriptions.create({
        customer: ctx.user.stripeCustomerId,
        items: [
          {
            price: getPriceId(input.tier, input.billingCycle),
          },
        ],
      });

      // Create CJ order for first month
      const cjOrder = await createCJOrder({
        customerId: ctx.user.id,
        tier: input.tier,
        products: getBoxProducts(input.tier),
      });

      // Save to database
      await db.insert(subscriptions).values({
        userId: ctx.user.id,
        stripeSubscriptionId: subscription.id,
        cjOrderId: cjOrder.id,
        tier: input.tier,
        status: 'active',
      });

      return subscription;
    }),
});
```

---

## Part 7: Order Management

### Step 18: Monitor Orders

**Daily checklist:**
1. Check Nail'd for new orders
2. Log into CJ Dropshipping
3. Create corresponding CJ orders
4. Track shipment status
5. Update customers with tracking numbers

### Step 19: Handle Issues

**If product is out of stock:**
1. Contact customer immediately
2. Offer alternative product
3. Process refund if needed
4. Update CJ inventory

**If shipping is delayed:**
1. Check CJ tracking
2. Contact CJ support if needed
3. Notify customer with update
4. Offer discount on next order

### Step 20: Track Metrics

Monitor these KPIs:

| Metric | Target | How to Track |
|--------|--------|-------------|
| Order fulfillment time | <24 hours | CJ dashboard |
| Shipping time | 7-15 days | Tracking numbers |
| Customer satisfaction | 4.5+ stars | Reviews |
| Repeat rate | 30%+ | Subscription renewals |
| Churn rate | <10% | Cancellations |

---

## Part 8: Scaling & Optimization

### Step 21: Negotiate Volume Discounts

After 100+ orders, contact CJ:
- Request account manager
- Ask for volume discount (5-15%)
- Negotiate fulfillment fees
- Discuss custom packaging options

**Email template:**
```
Subject: Volume Discount Request - Nail'd Store

Hi CJ Dropshipping Team,

We've been a customer since [date] and have processed 100+ orders.
We'd like to discuss:
1. Volume discounts on products
2. Reduced fulfillment fees
3. Custom packaging options
4. Dedicated account manager

Our monthly order volume: [X] units
Average order value: $[X]

Please let me know available options.

Best regards,
[Your name]
```

### Step 22: Automate Fulfillment

Once you have 50+ orders/month:
1. Set up CJ API integration
2. Automate order creation
3. Sync tracking numbers automatically
4. Send automated shipping notifications

### Step 23: Expand Product Catalog

Monthly tasks:
- Add 3-5 new trending products
- Remove underperforming products
- Rotate seasonal items
- Test new categories

---

## Quick Reference: CJ Dropshipping Workflow

```
1. Customer orders on Nail'd
   ↓
2. Payment processed (Stripe)
   ↓
3. You create order on CJ Dropshipping
   ↓
4. CJ picks & packs items
   ↓
5. CJ ships to customer
   ↓
6. You get tracking number
   ↓
7. You send tracking to customer
   ↓
8. Customer receives package
   ↓
9. Customer leaves review
```

---

## Troubleshooting

### Product not available on CJ
- Search for alternative product
- Contact CJ support for restock date
- Add to waitlist
- Offer customer discount on alternative

### Customer received wrong item
- Contact CJ support with order ID
- Request replacement or refund
- Offer customer discount on next order
- Update product description if needed

### Shipping delayed
- Check CJ tracking page
- Contact CJ support if >15 days
- Notify customer with update
- Offer partial refund or discount

### High return rate
- Review product quality
- Check customer reviews
- Consider removing product
- Find alternative supplier

---

## CJ Dropshipping Resources

**Official Website:** https://www.cjdropshipping.com  
**Help Center:** https://help.cjdropshipping.com  
**API Documentation:** https://api.cjdropshipping.com/docs  
**Contact Support:** support@cjdropshipping.com  
**WhatsApp:** +1-XXX-XXX-XXXX (available 24/7)

---

## Next Steps

1. **This week:** Create CJ account and select 15 products
2. **Next week:** Place test order (50-100 units)
3. **Week 3:** Design subscription boxes
4. **Week 4:** Integrate with Nail'd platform
5. **Week 5:** Soft launch to beta customers

---

**Status:** Ready to implement  
**Timeline:** 1-2 weeks to full integration  
**Support:** CJ offers 24/7 support via WhatsApp/email
