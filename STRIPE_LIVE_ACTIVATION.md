# Stripe Live Keys Activation Guide

## Current Status

Your Stripe account is currently in **Test Mode** (sandbox). This means:
- ✅ Transactions are simulated and free
- ✅ No real money is charged
- ✅ Perfect for testing before launch
- ❌ Customers cannot make real purchases

---

## Step 1: Verify Stripe Account

1. Go to https://dashboard.stripe.com
2. Sign in with your account
3. Click your profile icon (top-right)
4. Verify you're in **Test Mode** (toggle in top-left shows "Test Data")

---

## Step 2: Complete Business Verification

Before activating live keys, Stripe requires business verification:

1. Go to **Settings** → **Account Settings**
2. Complete **Business Profile**:
   - Business name: "Nail'd"
   - Business type: Sole proprietor or LLC
   - Business website: Your Nail'd domain
   - Business address: Your address
   - Phone number: Your contact number

3. Add **Responsible person** information:
   - Full name: Kegan Meng
   - Email: xxearthx@gmail.com
   - Date of birth: [Your DOB]
   - Address: [Your address]

4. Review and accept **Stripe Connected Account Agreement**

---

## Step 3: Get Live API Keys

1. Go to **Developers** → **API Keys**
2. Toggle from **Test Mode** to **Live Mode** (top-left)
3. Copy your **Live Secret Key** (starts with `sk_live_`)
4. Copy your **Live Publishable Key** (starts with `pk_live_`)

⚠️ **Important**: Keep your Secret Key private! Never commit to Git or expose in client code.

---

## Step 4: Update Environment Variables

### Option A: Update in Manus Management UI

1. Go to your Manus project Management UI
2. Click **Settings** → **Secrets**
3. Update these secrets:
   - `STRIPE_SECRET_KEY`: Paste your live secret key
   - `VITE_STRIPE_PUBLISHABLE_KEY`: Paste your live publishable key

4. Restart your dev server or redeploy

### Option B: Update in .env File (Local Development)

```bash
# .env file (never commit this!)
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxx
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxx
```

Then restart your server:
```bash
npm run dev
```

---

## Step 5: Test Live Mode

### Test with Real Card (Stripe Test Card)

Even in live mode, you can test with Stripe's test card:

**Test Card Details**:
- Card Number: `4242 4242 4242 4242`
- Expiry: Any future date (e.g., 12/25)
- CVC: Any 3 digits (e.g., 123)
- ZIP: Any 5 digits (e.g., 12345)

**Test Flow**:
1. Go to your Nail'd app
2. Add a product to cart
3. Proceed to checkout
4. Enter test card details above
5. Complete payment
6. Verify order confirmation email received
7. Check Stripe dashboard for transaction

### Verify in Stripe Dashboard

1. Go to **Payments** → **Payments**
2. You should see your test transaction
3. Status should be **Succeeded**
4. Amount should match your order total

---

## Step 6: Configure Webhooks for Live Mode

Your webhook endpoint needs to be updated for live mode:

1. Go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Enter your endpoint URL:
   ```
   https://your-domain.com/api/stripe/webhook
   ```
4. Select events to listen for:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`

5. Click **Add endpoint**
6. Copy the **Signing Secret** (starts with `whsec_`)
7. Update environment variable:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
   ```

---

## Step 7: Enable Live Payments

### Verify Webhook Handler

Your webhook handler is already implemented at `server/stripe.ts`:

```typescript
// This handles all Stripe webhook events
export async function handleStripeWebhook(event: Stripe.Event) {
  switch (event.type) {
    case 'payment_intent.succeeded':
      // Order confirmed
      break;
    case 'customer.subscription.updated':
      // Subscription updated
      break;
    // ... more events
  }
}
```

### Test Webhook Delivery

1. In Stripe dashboard, go to **Webhooks**
2. Click your endpoint
3. Scroll to **Events**
4. Click **Send test event**
5. Select an event type (e.g., `payment_intent.succeeded`)
6. Click **Send test event**
7. Verify your webhook handler receives it

---

## Step 8: Set Up Monitoring & Alerts

### Enable Stripe Alerts

1. Go to **Settings** → **Notifications**
2. Enable email alerts for:
   - Failed payments
   - Suspicious activity
   - Webhook failures
   - Account changes

### Monitor Your Dashboard

Daily checks:
- [ ] Revenue dashboard
- [ ] Failed payments
- [ ] Webhook errors
- [ ] Dispute/chargeback notifications

---

## Step 9: Prepare for First Real Transaction

### Pre-Launch Checklist

- [ ] Live keys configured
- [ ] Webhook endpoint verified
- [ ] Test transaction successful
- [ ] Order confirmation email working
- [ ] Subscription management working
- [ ] Refund process tested
- [ ] Customer support email configured
- [ ] Monitoring alerts enabled

### Communicate with Customers

Add to your website:
```
🔒 Secure Payments
We use Stripe for secure payment processing.
Your credit card information is never stored on our servers.
```

---

## Troubleshooting

### Payments Failing

**Check**:
1. Webhook endpoint is accessible
2. Webhook signing secret is correct
3. API keys are live (not test)
4. HTTPS certificate is valid
5. Firewall isn't blocking Stripe IPs

**Debug**:
```bash
# Check webhook logs
curl https://dashboard.stripe.com/webhooks
```

### Webhook Not Firing

1. Verify endpoint URL is correct
2. Check webhook signing secret
3. Verify events are subscribed
4. Check server logs for errors
5. Test with Stripe CLI:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

### Customer Sees "Payment Failed"

1. Check Stripe dashboard for error details
2. Verify customer's card is not declined
3. Check 3D Secure requirements
4. Verify billing address matches

---

## Important Security Notes

### Never Expose Secret Key

❌ **DON'T**:
```javascript
// Never put secret key in client code!
const stripe = new Stripe('sk_live_xxxxx');
```

✅ **DO**:
```javascript
// Secret key only on server
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
```

### Protect Webhook Secret

- Store in environment variables only
- Never commit to Git
- Rotate periodically
- Use different secrets for test/live

### Monitor for Fraud

- Enable Stripe Radar for fraud detection
- Monitor chargeback rates
- Set up alerts for suspicious patterns
- Review failed payment reasons

---

## Scaling Considerations

### High Volume (>1000 transactions/day)

1. Enable Stripe Connect for marketplace features
2. Set up Stripe Sigma for advanced analytics
3. Implement payment retry logic
4. Use Stripe Billing for subscriptions (already done)
5. Monitor API rate limits

### International Payments

1. Enable multi-currency support
2. Add country-specific payment methods
3. Configure tax calculation
4. Review compliance requirements

---

## Resources

- [Stripe Dashboard](https://dashboard.stripe.com)
- [Stripe API Documentation](https://stripe.com/docs/api)
- [Webhook Guide](https://stripe.com/docs/webhooks)
- [Testing Guide](https://stripe.com/docs/testing)
- [Security Best Practices](https://stripe.com/docs/security)

---

## Support

For issues with Stripe integration:
1. Check [Stripe Status Page](https://status.stripe.com)
2. Review [Stripe Documentation](https://stripe.com/docs)
3. Contact [Stripe Support](https://support.stripe.com)
4. Check your server logs for webhook errors
