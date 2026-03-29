# Stripe Live Keys Activation - Complete Setup Guide

## Overview

This guide walks you through activating Stripe live keys for real payment processing. Currently, your Nail'd platform is in **TEST MODE** (sandbox). You need to switch to **LIVE MODE** to accept real customer payments.

---

## Current Status

### Test Mode (Current)
- ✅ Test card: 4242 4242 4242 4242
- ✅ Payments are simulated
- ✅ No real money charged
- ✅ Perfect for testing

### Live Mode (Target)
- ✅ Real customer payments
- ✅ Real money processed
- ✅ Production-ready
- ✅ Requires Stripe verification

---

## Step 1: Verify Your Stripe Account

### Check Account Status

1. Go to https://dashboard.stripe.com
2. Log in with your Stripe account
3. Look for banner at top:
   - **Green checkmark:** Account verified ✅
   - **Yellow warning:** Verification pending ⏳
   - **Red alert:** Verification failed ❌

### If Account Not Verified

1. Click **Verify your account** banner
2. Complete identity verification:
   - Full name
   - Date of birth
   - Address
   - Last 4 digits of SSN
3. Upload ID document (driver's license or passport)
4. Stripe reviews (usually 1-2 hours)
5. Receive verification email

---

## Step 2: Complete Business Information

### Update Account Settings

1. Go to **Settings** → **Account Settings**
2. Fill in business details:
   - **Business name:** Nail'd
   - **Business type:** Sole proprietorship or LLC
   - **Website:** https://nailed.app
   - **Business description:** Premium nail art subscription service
   - **Phone:** [Your phone]
   - **Address:** [Your address]

### Add Banking Information

1. Go to **Settings** → **Payouts**
2. Click **Add bank account**
3. Enter banking details:
   - Account type: Checking or Savings
   - Routing number: [Your bank's routing number]
   - Account number: [Your account number]
   - Account holder name: [Your name]
4. Stripe sends 2 small deposits (verification)
5. Confirm deposits in your bank account
6. Enter amounts in Stripe to verify

**Time:** 1-2 business days for deposits

---

## Step 3: Get Live API Keys

### Locate API Keys

1. Go to **Developers** → **API Keys**
2. Toggle **View test data** OFF (top right)
3. You should now see **LIVE** keys:
   - **Publishable key:** `pk_live_xxxxxxxxxxxxx`
   - **Secret key:** `sk_live_xxxxxxxxxxxxx`

### Copy Keys

1. Copy **Publishable key**
   - Store in: `VITE_STRIPE_PUBLISHABLE_KEY`
2. Copy **Secret key**
   - Store in: `STRIPE_SECRET_KEY`
   - **KEEP THIS SECRET!** Never commit to git

---

## Step 4: Update Environment Variables

### Option A: Via Manus Management UI (Recommended)

1. Go to **Settings** → **Secrets**
2. Update these variables:

**Variable 1:**
- Key: `VITE_STRIPE_PUBLISHABLE_KEY`
- Value: `pk_live_xxxxxxxxxxxxx`

**Variable 2:**
- Key: `STRIPE_SECRET_KEY`
- Value: `sk_live_xxxxxxxxxxxxx`

**Variable 3:**
- Key: `STRIPE_WEBHOOK_SECRET`
- Value: `whsec_xxxxxxxxxxxxx` (see Step 5)

3. Click **Save**
4. Server automatically restarts

### Option B: Via .env File (Local Development)

```bash
# .env.local
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

---

## Step 5: Set Up Webhook Endpoint

### Why Webhooks Matter

Webhooks notify your server when Stripe events occur:
- Payment succeeded
- Subscription renewed
- Refund issued
- Charge failed

### Create Webhook Endpoint

1. Go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Enter endpoint URL:
   - `https://[your-domain]/api/stripe/webhook`
   - Example: `https://nailed.app/api/stripe/webhook`
4. Select events to listen for:
   - `payment_intent.succeeded`
   - `charge.refunded`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
5. Click **Add endpoint**

### Get Webhook Secret

1. Click on your webhook endpoint
2. Copy **Signing secret** (starts with `whsec_`)
3. Add to environment variables:
   - `STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx`

### Verify Webhook Handler

Your webhook handler should be at: `/api/stripe/webhook`

**Check implementation:**

```typescript
// server/_core/webhooks.ts or similar
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function handleStripeWebhook(req: Request) {
  const signature = req.headers['stripe-signature'] as string;
  const body = await req.text();

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    // Handle events
    switch (event.type) {
      case 'payment_intent.succeeded':
        // Process payment
        break;
      case 'customer.subscription.updated':
        // Update subscription
        break;
      // ... other events
    }

    return { received: true };
  } catch (error) {
    console.error('Webhook error:', error);
    return { error: 'Webhook verification failed' };
  }
}
```

---

## Step 6: Test Live Mode

### Test with Real Card (No Charge)

Stripe provides test cards that work in live mode:

| Card Number | CVC | Date | Use Case |
|------------|-----|------|----------|
| 4242 4242 4242 4242 | Any | Any future | Successful charge |
| 4000 0000 0000 0002 | Any | Any future | Declined charge |
| 4000 0025 0000 3155 | Any | Any future | 3D Secure |

### Test Payment Flow

1. Go to https://nailed.app
2. Log in or create account
3. Add item to cart
4. Proceed to checkout
5. Enter test card: **4242 4242 4242 4242**
6. Enter any future expiration date
7. Enter any 3-digit CVC
8. Click **Pay**

### Verify Payment

1. Check Stripe dashboard:
   - Go to **Payments** → **Payments**
   - You should see your test payment
   - Status: **Succeeded**
   - Amount: $0.50 (minimum)

2. Check your database:
   - Order should be created
   - Payment status: **completed**
   - Customer record updated

3. Check email:
   - Confirmation email should be sent
   - Check spam folder if not in inbox

---

## Step 7: Verify Webhook Delivery

### Test Webhook

1. Go to **Developers** → **Webhooks**
2. Click on your endpoint
3. Scroll to **Recent events**
4. Look for `payment_intent.succeeded` event
5. Click event to see details
6. Check **Response** tab:
   - Status: **200 OK** ✅
   - Response body: `{"received":true}`

### If Webhook Failed

1. Check server logs for errors
2. Verify webhook URL is correct
3. Verify webhook secret is correct
4. Check firewall/security settings
5. Retry webhook from dashboard

---

## Step 8: Configure Webhook Retry Policy

### Automatic Retries

Stripe automatically retries failed webhooks:
- First attempt: Immediately
- 2nd attempt: 5 minutes later
- 3rd attempt: 30 minutes later
- 4th attempt: 2 hours later
- 5th attempt: 5 hours later
- 6th attempt: 10 hours later
- 7th attempt: 24 hours later

### Manual Retry

1. Go to **Developers** → **Webhooks**
2. Click endpoint
3. Find failed event
4. Click **Retry** button

---

## Step 9: Monitor Live Transactions

### View Live Payments

1. Go to **Payments** → **Payments**
2. Filter by date range
3. View transaction details:
   - Amount
   - Customer
   - Status
   - Payment method
   - Timestamp

### View Subscriptions

1. Go to **Billing** → **Subscriptions**
2. View active subscriptions
3. Monitor churn rate
4. Check failed renewals

### View Customers

1. Go to **Customers**
2. Search by email
3. View customer history
4. Check payment methods

---

## Step 10: Set Up Alerts & Monitoring

### Email Alerts

1. Go to **Settings** → **Email Notifications**
2. Enable alerts for:
   - Failed charges
   - High refund rate
   - Suspicious activity
   - Webhook failures

### Stripe Dashboard Alerts

1. Go to **Settings** → **Alerts**
2. Create alerts for:
   - Failed payment rate > 5%
   - Refund rate > 2%
   - Chargeback rate > 1%

### Monitor Metrics

| Metric | Target | Action |
|--------|--------|--------|
| Success rate | > 95% | Investigate failures |
| Churn rate | < 5% | Improve retention |
| Refund rate | < 2% | Check product quality |
| Dispute rate | < 1% | Improve descriptions |

---

## Step 11: Compliance & Security

### PCI Compliance

✅ **You're compliant because:**
- Stripe handles all card processing
- You never see full card numbers
- Stripe is PCI Level 1 certified

### Security Best Practices

1. **Never log sensitive data:**
   ```typescript
   // ❌ BAD
   console.log(event.data.object); // Could contain card data

   // ✅ GOOD
   console.log(`Payment succeeded: ${event.data.object.id}`);
   ```

2. **Validate webhook signatures:**
   ```typescript
   // Always verify signature
   const event = stripe.webhooks.constructEvent(
     body,
     signature,
     webhookSecret
   );
   ```

3. **Use HTTPS only:**
   - All API calls must be HTTPS
   - Webhook endpoint must be HTTPS

4. **Rotate API keys:**
   - Regularly generate new keys
   - Delete old keys
   - Use restricted API keys when possible

---

## Step 12: Troubleshooting

### Payment Declined

**Common reasons:**
- Card is expired
- Insufficient funds
- Card blocked by issuer
- Incorrect CVC
- Address mismatch

**Solution:**
- Use test card: 4242 4242 4242 4242
- Check Stripe dashboard for decline reason
- Contact customer's bank

### Webhook Not Firing

**Check:**
1. Webhook endpoint URL is correct
2. Endpoint is publicly accessible
3. Webhook secret is correct
4. Server is running
5. No firewall blocking webhooks

**Debug:**
```bash
# Check server logs
tail -f /home/ubuntu/piggy-nails-gallery/.manus-logs/devserver.log | grep -i webhook
```

### Subscription Not Renewing

**Check:**
1. Subscription status is "active"
2. Payment method is valid
3. Billing cycle date is correct
4. No failed payments

**Solution:**
- Go to **Billing** → **Subscriptions**
- Find subscription
- Check status and billing details
- Manually trigger renewal if needed

### High Refund Rate

**Investigate:**
1. Check refund reasons
2. Review product quality
3. Check customer feedback
4. Improve product descriptions

---

## Step 13: Go-Live Checklist

Before accepting real customer payments:

- [ ] Stripe account verified
- [ ] Business information complete
- [ ] Bank account verified
- [ ] Live API keys configured
- [ ] Environment variables updated
- [ ] Webhook endpoint created and tested
- [ ] Test payment succeeded
- [ ] Webhook delivery verified
- [ ] Email notifications working
- [ ] Legal documents published (Terms, Privacy, Returns)
- [ ] Checkout flow tested end-to-end
- [ ] Error handling tested
- [ ] Refund process tested
- [ ] Customer support email set up
- [ ] Monitoring and alerts configured

---

## Step 14: Monitor First Week

### Daily Checks

1. Check payment success rate
2. Review failed payments
3. Monitor webhook delivery
4. Check customer support emails
5. Review error logs

### Weekly Review

1. Total revenue
2. New customers
3. Refund rate
4. Churn rate
5. Customer feedback

### Metrics to Track

- Total transactions
- Success rate
- Average order value
- Customer acquisition cost
- Customer lifetime value
- Churn rate

---

## Minimum Transaction Amount

⚠️ **Important:** Stripe requires a minimum transaction amount of **$0.50 USD** for live mode.

- Transactions below $0.50 will fail
- Test cards work with any amount
- Customers will see error if amount too low

---

## Support & Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Stripe Testing Guide](https://stripe.com/docs/testing)
- [Stripe Support](https://support.stripe.com)

---

## Next Steps

1. Verify your Stripe account
2. Complete business information
3. Verify bank account
4. Get live API keys
5. Update environment variables
6. Set up webhook endpoint
7. Test live payment
8. Verify webhook delivery
9. Configure alerts
10. Go live! 🚀

---

## Timeline

| Step | Time | Status |
|------|------|--------|
| Account verification | 1-2 hours | ⏳ Pending |
| Bank verification | 1-2 business days | ⏳ Pending |
| Get live keys | 5 minutes | ✅ Ready |
| Update environment | 5 minutes | ✅ Ready |
| Test payment | 5 minutes | ✅ Ready |
| **Total to go-live** | **1-2 days** | **⏳ Pending** |

---

**You're almost ready to launch! Follow these steps and you'll be accepting real payments within 24-48 hours.**
