# Email Provider Configuration Guide

## Current Status

Your email system is currently configured with **console fallback** - emails are logged to console instead of being sent. This is perfect for development but must be configured for production.

---

## Choose Your Email Provider

### Option 1: SendGrid (Recommended)

**Advantages**:
- ✅ Excellent deliverability (99.9% uptime)
- ✅ Detailed analytics and reporting
- ✅ Free tier: 100 emails/day
- ✅ Paid tier: $19.95/month (100k emails)
- ✅ Easy integration

**Disadvantages**:
- Requires domain verification
- Setup takes 15-30 minutes

### Option 2: Mailgun

**Advantages**:
- ✅ Powerful API
- ✅ Free tier: 5000 emails/month
- ✅ Paid tier: $35/month (50k emails)
- ✅ Good for high volume

**Disadvantages**:
- More complex setup
- Requires DNS configuration

### Option 3: AWS SES (Simple Email Service)

**Advantages**:
- ✅ Lowest cost ($0.10 per 1000 emails)
- ✅ Highly scalable
- ✅ Integrated with AWS ecosystem

**Disadvantages**:
- Sandbox mode limits (100 emails/day initially)
- Requires AWS account
- More technical setup

---

## Setup Guide: SendGrid (Recommended)

### Step 1: Create SendGrid Account

1. Go to https://sendgrid.com
2. Click **Sign Up**
3. Enter your information:
   - Email: xxearthx@gmail.com
   - Password: [Create strong password]
   - Company: Nail'd
4. Verify email
5. Complete onboarding

### Step 2: Verify Sender Email

1. Go to **Settings** → **Sender Authentication**
2. Click **Verify a Sender**
3. Enter sender details:
   - From Email: noreply@nailed.app (or your domain)
   - From Name: Nail'd
   - Reply To: support@nailed.app
4. SendGrid sends verification email
5. Click verification link in email

**Alternative**: Verify entire domain (recommended for production):
1. Go to **Settings** → **Sender Authentication**
2. Click **Authenticate Your Domain**
3. Follow DNS setup instructions
4. Add CNAME records to your domain registrar
5. Wait for verification (usually 5-30 minutes)

### Step 3: Get API Key

1. Go to **Settings** → **API Keys**
2. Click **Create API Key**
3. Name it: `Nail'd App`
4. Select **Full Access** (or custom permissions)
5. Copy the API key (starts with `SG.`)
6. Store securely - you'll need it next

### Step 4: Update Environment Variables

In your Manus Management UI:

1. Go to **Settings** → **Secrets**
2. Add/update these secrets:
   ```
   EMAIL_PROVIDER=sendgrid
   SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
   ```
3. Restart your server

Or locally in `.env`:
```bash
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
```

### Step 5: Test Email Sending

1. Go to your Nail'd app
2. Create a test account
3. Make a test purchase
4. Check your email for order confirmation
5. Verify it arrives in inbox (not spam)

### Step 6: Monitor Sending

In SendGrid dashboard:
1. Go to **Mail Send** → **Statistics**
2. View real-time sending metrics
3. Monitor bounce/spam rates
4. Review delivery reports

---

## Setup Guide: Mailgun

### Step 1: Create Mailgun Account

1. Go to https://www.mailgun.com
2. Click **Sign Up**
3. Enter your information
4. Verify email
5. Complete onboarding

### Step 2: Add Domain

1. Go to **Sending** → **Domains**
2. Click **Add New Domain**
3. Enter your domain: `mail.nailed.app` (or `nailed.app`)
4. Choose region (US or EU)
5. Click **Add Domain**

### Step 3: Verify Domain with DNS

Mailgun provides DNS records to add:

1. Copy the **CNAME** records from Mailgun
2. Go to your domain registrar (GoDaddy, Namecheap, etc.)
3. Add the CNAME records to DNS
4. Wait for propagation (usually 24-48 hours)
5. Return to Mailgun and click **Check DNS Records**
6. Verify status shows **Active**

### Step 4: Get API Key

1. Go to **Account Settings** → **API Security**
2. Copy **Private API Key** (starts with `key-`)
3. Store securely

### Step 5: Update Environment Variables

In Manus Management UI:

1. Go to **Settings** → **Secrets**
2. Add/update:
   ```
   EMAIL_PROVIDER=mailgun
   MAILGUN_API_KEY=key-xxxxxxxxxxxxx
   MAILGUN_DOMAIN=mail.nailed.app
   ```
3. Restart server

Or locally in `.env`:
```bash
EMAIL_PROVIDER=mailgun
MAILGUN_API_KEY=key-xxxxxxxxxxxxx
MAILGUN_DOMAIN=mail.nailed.app
```

### Step 6: Test Email Sending

Same as SendGrid - make a test purchase and verify email arrives.

---

## Email Templates

Your app sends these emails automatically:

### 1. Order Confirmation Email

**Sent**: Immediately after successful payment

**Contains**:
- Order number
- Items purchased
- Total amount
- Estimated delivery date
- Order tracking link

**Template Location**: `server/email-service.ts`

### 2. Subscription Confirmation Email

**Sent**: When subscription is activated

**Contains**:
- Subscription tier name
- Billing amount
- Billing cycle (monthly/quarterly/annual)
- Next billing date
- Cancellation instructions

### 3. Subscription Renewal Reminder

**Sent**: 3 days before renewal

**Contains**:
- Renewal date
- Amount to be charged
- Subscription details
- Update payment method link

### 4. Subscription Cancellation Email

**Sent**: When subscription is cancelled

**Contains**:
- Cancellation confirmation
- Final billing date
- Access end date
- Reactivation instructions

### 5. Password Reset Email

**Sent**: When user requests password reset

**Contains**:
- Reset link (expires in 1 hour)
- Instructions
- Security notice

### 6. Account Welcome Email

**Sent**: When new account is created

**Contains**:
- Welcome message
- Getting started guide
- Link to design studio
- Special offer (optional)

---

## Email Customization

### Customize Email Templates

Edit `server/email-service.ts`:

```typescript
// Example: Customize order confirmation email
const orderEmailTemplate = `
  <h1>Thank you for your order!</h1>
  <p>Order #${orderId}</p>
  <p>Total: $${amount}</p>
  <!-- Add your custom HTML here -->
`;
```

### Add Custom Branding

1. Add logo to email header
2. Use brand colors
3. Add social media links
4. Include company address
5. Add unsubscribe link

### Localization

For international customers, add language support:

```typescript
const emailTemplate = getEmailTemplate(userLanguage);
// Supports: en, es, fr, de, ja, zh
```

---

## Monitoring & Troubleshooting

### Email Not Sending

**Check**:
1. API key is correct
2. Environment variables are set
3. Sender email is verified
4. Server restarted after config change
5. No errors in server logs

**Debug**:
```bash
# Check email service logs
tail -f /home/ubuntu/piggy-nails-gallery/.manus-logs/devserver.log | grep -i email
```

### Emails Going to Spam

**Solutions**:
1. Verify sender domain (DKIM/SPF)
2. Add unsubscribe link to emails
3. Use consistent sender email
4. Avoid spam trigger words
5. Monitor bounce rates

**Check SendGrid/Mailgun**:
- Go to **Deliverability** dashboard
- Review bounce/spam rates
- Check reputation score

### Bounced Emails

**Common Reasons**:
- Invalid email address
- Mailbox full
- Domain doesn't exist
- Server temporarily unavailable

**Solution**:
- Remove bounced emails from list
- Implement bounce handling in code
- Retry with exponential backoff

---

## Best Practices

### 1. Sender Reputation

- ✅ Always verify domain
- ✅ Use consistent sender email
- ✅ Monitor bounce rates
- ✅ Remove invalid emails
- ❌ Don't send to spam traps

### 2. Email Content

- ✅ Include unsubscribe link
- ✅ Use clear subject lines
- ✅ Add company address
- ✅ Make emails mobile-friendly
- ❌ Don't use misleading subject lines

### 3. Frequency

- ✅ Send transactional emails immediately
- ✅ Send marketing emails weekly/monthly
- ✅ Respect user preferences
- ❌ Don't spam users

### 4. Testing

- ✅ Test emails before sending
- ✅ Check on multiple email clients
- ✅ Verify links work
- ✅ Check images load
- ❌ Don't send test emails to real users

---

## Email Analytics

### Track Metrics

In SendGrid/Mailgun dashboard:

| Metric | Target | Action |
|--------|--------|--------|
| Delivery Rate | > 98% | Investigate bounces |
| Open Rate | > 20% | Improve subject lines |
| Click Rate | > 5% | Improve CTA buttons |
| Bounce Rate | < 2% | Clean email list |
| Spam Rate | < 0.1% | Check content |

### Set Up Alerts

1. Go to **Alerts** in SendGrid/Mailgun
2. Enable alerts for:
   - High bounce rate (> 5%)
   - High spam rate (> 1%)
   - Delivery failures
   - API errors

---

## Scaling Email

### High Volume (>10k emails/day)

1. **SendGrid**: Upgrade to higher tier
2. **Mailgun**: Upgrade to higher tier
3. **Implement queuing**: Use Redis/Bull for email queue
4. **Batch sending**: Group emails for efficiency
5. **Monitor**: Track delivery metrics closely

### Implementation

```typescript
// Example: Email queue with Bull
import Queue from 'bull';

const emailQueue = new Queue('emails', {
  redis: { host: 'localhost', port: 6379 }
});

// Add email to queue
await emailQueue.add({
  to: 'user@example.com',
  template: 'order-confirmation',
  data: { orderId: '123' }
});

// Process queue
emailQueue.process(async (job) => {
  await sendEmail(job.data);
});
```

---

## Compliance

### GDPR Compliance

- ✅ Get explicit consent before sending
- ✅ Include unsubscribe link
- ✅ Honor unsubscribe requests immediately
- ✅ Store consent records
- ✅ Allow data deletion requests

### CAN-SPAM Compliance

- ✅ Include company address
- ✅ Include unsubscribe link
- ✅ Honor unsubscribe requests
- ✅ Use accurate subject lines
- ✅ Identify as advertisement (if applicable)

---

## Resources

- [SendGrid Documentation](https://docs.sendgrid.com)
- [Mailgun Documentation](https://documentation.mailgun.com)
- [Email Best Practices](https://sendgrid.com/blog/email-best-practices/)
- [GDPR Compliance](https://gdpr.eu)
- [CAN-SPAM Act](https://www.ftc.gov/business-guidance/pages/can-spam-act-compliance-guide-business)

---

## Support

For email issues:
1. Check provider status page
2. Review documentation
3. Check server logs
4. Contact provider support
5. Test with different email addresses
