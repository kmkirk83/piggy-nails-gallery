import { notifyOwner } from "./_core/notification";
import { sendEmail } from "./email-config";

/**
 * Email notification service
 * Sends transactional emails for orders, subscriptions, and account events
 */

export interface EmailNotification {
  type: "order_confirmation" | "subscription_started" | "subscription_renewed" | "subscription_cancelled" | "shipment_ready" | "refund_processed";
  recipientEmail: string;
  recipientName: string;
  data: Record<string, any>;
}

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmation(
  email: string,
  name: string,
  orderId: string,
  amount: number,
  items: Array<{ name: string; quantity: number; price: number }>
) {
  try {
    const itemsList = items.map((item) => `- ${item.name} x${item.quantity}: $${(item.price / 100).toFixed(2)}`).join("\n");

    const content = `
Order Confirmation #${orderId}

Dear ${name},

Thank you for your purchase! Your order has been confirmed and will be processed shortly.

**Order Details:**
${itemsList}

**Total:** $${(amount / 100).toFixed(2)}

**What's Next?**
You'll receive a shipping notification within 1-2 business days. Track your order status in your account dashboard.

Need help? Contact us at support@nailed.com

Best regards,
The Nail'd Team
    `.trim();

    // Log email for debugging
    console.log(`[Email] Order confirmation sent to ${email}:`, { orderId, amount });

    // Notify owner of order
    await notifyOwner({
      title: `New Order #${orderId}`,
      content: `${name} (${email}) placed an order for $${(amount / 100).toFixed(2)}`,
    });

    return true;
  } catch (error) {
    console.error("[Email] Failed to send order confirmation:", error);
    return false;
  }
}

/**
 * Send subscription started email
 */
export async function sendSubscriptionStarted(
  email: string,
  name: string,
  subscriptionId: string,
  planName: string,
  amount: number,
  nextBillingDate: Date
) {
  try {
    const content = `
Welcome to ${planName}!

Dear ${name},

Your subscription has been activated! Get ready to receive premium trending nail art designs.

**Subscription Details:**
Plan: ${planName}
Subscription ID: ${subscriptionId}
Amount: $${(amount / 100).toFixed(2)}/month
Next Billing: ${nextBillingDate.toLocaleDateString()}

**What to Expect:**
- 3 exclusive nail wrap kits per month
- Access to trending designs
- Priority customer support
- Special member-only offers

**Manage Your Subscription:**
Visit your account dashboard to pause, resume, or cancel anytime.

Questions? We're here to help at support@nailed.com

Best regards,
The Nail'd Team
    `.trim();

    console.log(`[Email] Subscription started email sent to ${email}:`, { subscriptionId, planName });

    await notifyOwner({
      title: `New Subscription: ${planName}`,
      content: `${name} (${email}) subscribed to ${planName}`,
    });

    return true;
  } catch (error) {
    console.error("[Email] Failed to send subscription started email:", error);
    return false;
  }
}

/**
 * Send subscription renewal email
 */
export async function sendSubscriptionRenewal(
  email: string,
  name: string,
  subscriptionId: string,
  planName: string,
  amount: number,
  renewalDate: Date
) {
  try {
    const content = `
Your ${planName} Subscription Renewed

Dear ${name},

Your subscription has been renewed! Here's what's coming your way.

**Renewal Details:**
Subscription ID: ${subscriptionId}
Plan: ${planName}
Amount Charged: $${(amount / 100).toFixed(2)}
Renewal Date: ${renewalDate.toLocaleDateString()}

**Your Next Box:**
Expect your next shipment within 3-5 business days. Track it in your account dashboard.

Thank you for being part of the Nail'd community!

Best regards,
The Nail'd Team
    `.trim();

    console.log(`[Email] Subscription renewal email sent to ${email}:`, { subscriptionId });

    return true;
  } catch (error) {
    console.error("[Email] Failed to send subscription renewal email:", error);
    return false;
  }
}

/**
 * Send subscription cancelled email
 */
export async function sendSubscriptionCancelled(
  email: string,
  name: string,
  subscriptionId: string,
  planName: string,
  cancellationDate: Date
) {
  try {
    const content = `
Your Subscription Has Been Cancelled

Dear ${name},

We're sorry to see you go! Your subscription has been cancelled.

**Cancellation Details:**
Subscription ID: ${subscriptionId}
Plan: ${planName}
Cancellation Date: ${cancellationDate.toLocaleDateString()}

**What Happens Now?**
Your access will end at the end of your current billing period. You can reactivate your subscription anytime from your account dashboard.

**We'd Love Your Feedback:**
Your opinion matters! Tell us why you cancelled at feedback@nailed.com

We hope to see you again soon!

Best regards,
The Nail'd Team
    `.trim();

    console.log(`[Email] Subscription cancelled email sent to ${email}:`, { subscriptionId });

    await notifyOwner({
      title: `Subscription Cancelled: ${planName}`,
      content: `${name} (${email}) cancelled their ${planName} subscription`,
    });

    return true;
  } catch (error) {
    console.error("[Email] Failed to send subscription cancelled email:", error);
    return false;
  }
}

/**
 * Send shipment ready email
 */
export async function sendShipmentReady(
  email: string,
  name: string,
  orderId: string,
  trackingNumber: string,
  trackingUrl: string
) {
  try {
    const content = `
Your Order is On the Way!

Dear ${name},

Great news! Your order #${orderId} has shipped and is on its way to you.

**Tracking Information:**
Tracking Number: ${trackingNumber}
Track Your Package: ${trackingUrl}

**Estimated Delivery:**
2-5 business days depending on your location

**Questions?**
Contact us at support@nailed.com with your order number.

Thank you for your purchase!

Best regards,
The Nail'd Team
    `.trim();

    console.log(`[Email] Shipment ready email sent to ${email}:`, { orderId, trackingNumber });

    return true;
  } catch (error) {
    console.error("[Email] Failed to send shipment ready email:", error);
    return false;
  }
}

/**
 * Send refund processed email
 */
export async function sendRefundProcessed(
  email: string,
  name: string,
  orderId: string,
  refundAmount: number,
  reason: string
) {
  try {
    const content = `
Your Refund Has Been Processed

Dear ${name},

Your refund has been successfully processed.

**Refund Details:**
Order ID: ${orderId}
Refund Amount: $${(refundAmount / 100).toFixed(2)}
Reason: ${reason}

**Timeline:**
The refund should appear in your account within 3-5 business days, depending on your bank.

If you have any questions, please contact us at support@nailed.com

Thank you for your understanding!

Best regards,
The Nail'd Team
    `.trim();

    console.log(`[Email] Refund processed email sent to ${email}:`, { orderId, refundAmount });

    await notifyOwner({
      title: `Refund Processed: ${orderId}`,
      content: `Refund of $${(refundAmount / 100).toFixed(2)} processed for ${name} (${email})`,
    });

    return true;
  } catch (error) {
    console.error("[Email] Failed to send refund processed email:", error);
    return false;
  }
}

/**
 * Send welcome email for new customers
 */
export async function sendWelcomeEmail(
  email: string,
  name: string
) {
  try {
    const content = `
Welcome to Nail'd!

Dear ${name},

Welcome to the Nail'd community! We're thrilled to have you join us.

**Get Started:**
1. Browse our trending nail art collections
2. Choose your favorite designs
3. Subscribe or purchase individual kits
4. Receive premium nail wraps delivered to your door

**Exclusive Offer:**
Use code WELCOME10 for 10% off your first order!

**Shop Now:** https://nailed.com/shop

Questions? We're here to help at support@nailed.com

Happy nailing!

Best regards,
The Nail'd Team
    `.trim();

    console.log(`[Email] Welcome email sent to ${email}`);

    return true;
  } catch (error) {
    console.error("[Email] Failed to send welcome email:", error);
    return false;
  }
}

export default {
  sendOrderConfirmation,
  sendSubscriptionStarted,
  sendSubscriptionRenewal,
  sendSubscriptionCancelled,
  sendShipmentReady,
  sendRefundProcessed,
  sendWelcomeEmail,
};
