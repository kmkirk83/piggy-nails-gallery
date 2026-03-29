# SendGrid Email Integration - Implementation Guide

## Overview

This guide provides step-by-step instructions to integrate SendGrid with your Nail'd platform for transactional and marketing emails.

---

## Step 1: Create SendGrid Account (Free Tier)

### Sign Up
1. Go to https://sendgrid.com
2. Click **Sign Up**
3. Enter your information:
   - Email: xxearthx@gmail.com
   - Password: [Create strong password]
   - Company: Nail'd
4. Verify email address
5. Complete onboarding

### Free Tier Benefits
- 100 emails/day (unlimited days)
- Perfect for testing and small launches
- Upgrade anytime as you grow

---

## Step 2: Verify Sender Email

### Option A: Verify Single Email (Quick)

1. Go to **Settings** → **Sender Authentication**
2. Click **Verify a Sender**
3. Enter sender details:
   - From Email: noreply@nailed.app (or your domain)
   - From Name: Nail'd
   - Reply To: support@nailed.app
   - Company: Nail'd
4. SendGrid sends verification email
5. Click verification link in your email
6. Status changes to "Verified"

**Time:** 5 minutes

### Option B: Verify Domain (Recommended for Production)

1. Go to **Settings** → **Sender Authentication**
2. Click **Authenticate Your Domain**
3. Select domain: nailed.app (or your domain)
4. SendGrid provides CNAME records
5. Add records to your domain registrar (GoDaddy, Namecheap, etc.)
6. Return to SendGrid and verify
7. Status changes to "Verified"

**Time:** 15-30 minutes (depends on DNS propagation)

---

## Step 3: Get API Key

### Create API Key

1. Go to **Settings** → **API Keys**
2. Click **Create API Key**
3. Name it: "Nail'd App"
4. Select **Full Access** (or custom permissions)
5. Copy the API key (starts with `SG.`)
6. **SAVE THIS KEY** - you won't see it again

**Example:** `SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

---

## Step 4: Add SendGrid to Your Project

### Install SendGrid Package

```bash
cd /home/ubuntu/piggy-nails-gallery
npm install @sendgrid/mail
```

### Create SendGrid Service

Create file: `server/sendgrid-service.ts`

```typescript
import sgMail from '@sendgrid/mail';

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
  cc?: string[];
  bcc?: string[];
}

export async function sendEmail(options: EmailOptions) {
  try {
    const msg = {
      to: options.to,
      from: options.from || 'noreply@nailed.app',
      replyTo: options.replyTo || 'support@nailed.app',
      subject: options.subject,
      html: options.html,
      cc: options.cc,
      bcc: options.bcc,
    };

    const result = await sgMail.send(msg);
    console.log(`Email sent to ${options.to}:`, result[0].statusCode);
    return { success: true, messageId: result[0].headers['x-message-id'] };
  } catch (error) {
    console.error('SendGrid error:', error);
    return { success: false, error: error.message };
  }
}

export async function sendBulkEmail(recipients: string[], subject: string, html: string) {
  try {
    const messages = recipients.map(to => ({
      to,
      from: 'noreply@nailed.app',
      subject,
      html,
    }));

    const result = await sgMail.sendMultiple({
      ...messages[0],
      to: recipients,
    });

    console.log(`Bulk email sent to ${recipients.length} recipients`);
    return { success: true, count: recipients.length };
  } catch (error) {
    console.error('SendGrid bulk error:', error);
    return { success: false, error: error.message };
  }
}
```

---

## Step 5: Update Email Service

### Modify `server/email-service.ts`

Replace console logging with SendGrid:

```typescript
import { sendEmail } from './sendgrid-service';

export async function sendOrderConfirmation(
  email: string,
  orderId: string,
  items: any[],
  total: number
) {
  const html = `
    <h1>Thank you for your order!</h1>
    <p>Order #${orderId}</p>
    <p>Total: $${total.toFixed(2)}</p>
    <h2>Items:</h2>
    <ul>
      ${items.map(item => `<li>${item.name} - $${item.price}</li>`).join('')}
    </ul>
    <p><a href="https://nailed.app/orders/${orderId}">View Order</a></p>
  `;

  return sendEmail({
    to: email,
    subject: `Order Confirmation #${orderId}`,
    html,
  });
}

export async function sendSubscriptionConfirmation(
  email: string,
  subscriptionId: string,
  tier: string,
  amount: number
) {
  const html = `
    <h1>Subscription Confirmed!</h1>
    <p>You're now subscribed to the ${tier} tier.</p>
    <p>Amount: $${amount.toFixed(2)}/month</p>
    <p>Subscription ID: ${subscriptionId}</p>
    <p><a href="https://nailed.app/account/subscriptions">Manage Subscription</a></p>
  `;

  return sendEmail({
    to: email,
    subject: `${tier} Subscription Confirmed`,
    html,
  });
}

export async function sendRenewalReminder(
  email: string,
  subscriptionId: string,
  renewalDate: string,
  amount: number
) {
  const html = `
    <h1>Your subscription renews soon</h1>
    <p>Renewal Date: ${renewalDate}</p>
    <p>Amount: $${amount.toFixed(2)}</p>
    <p><a href="https://nailed.app/account/subscriptions">Update Payment Method</a></p>
  `;

  return sendEmail({
    to: email,
    subject: 'Subscription Renewal Reminder',
    html,
  });
}

export async function sendCancellationEmail(
  email: string,
  subscriptionId: string,
  finalDate: string
) {
  const html = `
    <h1>Subscription Cancelled</h1>
    <p>Your subscription has been cancelled.</p>
    <p>Final Billing Date: ${finalDate}</p>
    <p>We'd love to have you back! <a href="https://nailed.app/shop">Shop Now</a></p>
  `;

  return sendEmail({
    to: email,
    subject: 'Subscription Cancelled',
    html,
  });
}
```

---

## Step 6: Add Environment Variable

### Update `.env` File

```bash
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
EMAIL_PROVIDER=sendgrid
```

### Or Add via Manus Management UI

1. Go to **Settings** → **Secrets**
2. Add new secret:
   - Key: `SENDGRID_API_KEY`
   - Value: `SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
3. Save and restart server

---

## Step 7: Test Email Sending

### Create Test Endpoint

Add to `server/routers.ts`:

```typescript
export const appRouter = router({
  // ... existing procedures

  email: {
    sendTest: publicProcedure
      .input(z.object({
        email: z.string().email(),
        subject: z.string(),
      }))
      .mutation(async ({ input }) => {
        const result = await sendEmail({
          to: input.email,
          subject: input.subject,
          html: '<h1>Test Email from Nail\'d</h1><p>If you see this, SendGrid is working!</p>',
        });

        return result;
      }),
  },
});
```

### Test via Frontend

Create test component:

```typescript
// In a test page or component
import { trpc } from '@/lib/trpc';

export function EmailTest() {
  const sendTest = trpc.email.sendTest.useMutation();

  const handleTest = async () => {
    await sendTest.mutateAsync({
      email: 'xxearthx@gmail.com',
      subject: 'Test Email from Nail\'d',
    });
  };

  return (
    <button onClick={handleTest}>
      Send Test Email
    </button>
  );
}
```

### Or Test via Command Line

```bash
curl -X POST http://localhost:3000/api/trpc/email.sendTest \
  -H "Content-Type: application/json" \
  -d '{
    "email": "xxearthx@gmail.com",
    "subject": "Test Email"
  }'
```

---

## Step 8: Email Templates

### Order Confirmation Template

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; }
    .header { background-color: #f5e6e0; padding: 20px; }
    .content { padding: 20px; }
    .footer { background-color: #f5e6e0; padding: 20px; text-align: center; }
    .button { background-color: #d4a574; color: white; padding: 10px 20px; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Thank you for your order! 💅</h1>
    </div>
    <div class="content">
      <p>Hi {{firstName}},</p>
      <p>Your order has been confirmed!</p>
      
      <h2>Order Details</h2>
      <p><strong>Order #:</strong> {{orderId}}</p>
      <p><strong>Date:</strong> {{orderDate}}</p>
      <p><strong>Total:</strong> ${{total}}</p>
      
      <h2>Items</h2>
      <ul>
        {{#each items}}
        <li>{{name}} - ${{price}}</li>
        {{/each}}
      </ul>
      
      <h2>Shipping Address</h2>
      <p>{{shippingAddress}}</p>
      
      <p><a href="https://nailed.app/orders/{{orderId}}" class="button">View Order</a></p>
    </div>
    <div class="footer">
      <p>Questions? <a href="mailto:support@nailed.app">Contact us</a></p>
      <p>&copy; 2026 Nail'd. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
```

### Subscription Confirmation Template

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; }
    .header { background-color: #f5e6e0; padding: 20px; }
    .content { padding: 20px; }
    .footer { background-color: #f5e6e0; padding: 20px; text-align: center; }
    .button { background-color: #d4a574; color: white; padding: 10px 20px; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to {{tierName}}! 💅</h1>
    </div>
    <div class="content">
      <p>Hi {{firstName}},</p>
      <p>Your subscription is now active!</p>
      
      <h2>Subscription Details</h2>
      <p><strong>Tier:</strong> {{tierName}}</p>
      <p><strong>Billing Amount:</strong> ${{amount}}/month</p>
      <p><strong>Next Billing Date:</strong> {{nextBillingDate}}</p>
      
      <h2>What's Included</h2>
      <ul>
        {{#each benefits}}
        <li>{{this}}</li>
        {{/each}}
      </ul>
      
      <p><a href="https://nailed.app/account/subscriptions" class="button">Manage Subscription</a></p>
    </div>
    <div class="footer">
      <p>Questions? <a href="mailto:support@nailed.app">Contact us</a></p>
      <p>&copy; 2026 Nail'd. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
```

---

## Step 9: Monitor Email Delivery

### Check SendGrid Dashboard

1. Go to **Mail Send** → **Statistics**
2. View real-time metrics:
   - Emails sent
   - Delivery rate
   - Bounce rate
   - Spam rate
   - Open rate
   - Click rate

### Set Up Alerts

1. Go to **Alerts**
2. Create alerts for:
   - High bounce rate (> 5%)
   - High spam rate (> 1%)
   - Delivery failures
   - API errors

---

## Step 10: Troubleshooting

### Email Not Sending

**Check:**
1. API key is correct
2. Sender email is verified
3. Environment variable is set
4. Server restarted after env change
5. No errors in server logs

**Debug:**
```bash
# Check SendGrid service logs
tail -f /home/ubuntu/piggy-nails-gallery/.manus-logs/devserver.log | grep -i sendgrid
```

### Emails Going to Spam

**Solutions:**
1. Verify domain (not just email)
2. Add SPF and DKIM records
3. Use consistent sender email
4. Include unsubscribe link
5. Avoid spam trigger words

### High Bounce Rate

**Check:**
1. Email addresses are valid
2. No typos in recipient emails
3. Remove bounced emails from list
4. Verify recipient domain exists

---

## Step 11: Scale Beyond Free Tier

### When to Upgrade

- Free tier: 100 emails/day (unlimited days)
- Starter: $19.95/month (unlimited emails)
- Pro: $99/month (advanced features)

### Upgrade Process

1. Go to **Settings** → **Billing**
2. Click **Upgrade**
3. Select plan
4. Add payment method
5. Confirm upgrade

---

## Email Sending Best Practices

### Frequency
- Transactional: Send immediately
- Marketing: 1-2x per week
- Newsletters: Weekly or monthly

### Personalization
- Use recipient's first name
- Segment by behavior
- Customize content based on preferences

### Mobile Optimization
- Single column layout
- Large buttons (44x44px minimum)
- Readable font sizes
- Test on multiple devices

### Compliance
- Include unsubscribe link
- Include company address
- Honor unsubscribe requests within 10 days
- Comply with CAN-SPAM and GDPR

---

## Integration Checklist

- [ ] SendGrid account created
- [ ] Sender email verified
- [ ] API key generated
- [ ] `@sendgrid/mail` package installed
- [ ] SendGrid service created (`sendgrid-service.ts`)
- [ ] Email service updated
- [ ] Environment variable set
- [ ] Server restarted
- [ ] Test email sent successfully
- [ ] Email received in inbox (not spam)
- [ ] Alerts configured
- [ ] Email templates created

---

## Next Steps

1. Create SendGrid account today
2. Verify sender email
3. Get API key
4. Install package and create service
5. Test email sending
6. Monitor delivery metrics
7. Create email templates
8. Set up automation workflows

---

## Resources

- [SendGrid Documentation](https://docs.sendgrid.com)
- [SendGrid API Reference](https://docs.sendgrid.com/api-reference)
- [Email Best Practices](https://sendgrid.com/blog/email-best-practices/)
- [Troubleshooting Guide](https://docs.sendgrid.com/ui/analytics-and-reporting/troubleshooting-guide)

---

## Support

For SendGrid issues:
1. Check [SendGrid Status Page](https://status.sendgrid.com)
2. Review [SendGrid Documentation](https://docs.sendgrid.com)
3. Contact [SendGrid Support](https://support.sendgrid.com)
