/**
 * Stripe Products and Prices Configuration
 * These are the subscription tiers available for Piggy Nails
 */

export const SUBSCRIPTION_PRODUCTS = {
  monthly: {
    name: "Keep it casual",
    description: "1 Month Subscription",
    price: 3450, // $34.50 in cents
    interval: "month",
    intervalCount: 1,
    metadata: {
      tier: "monthly",
      wrapsPerMonth: "3",
      description: "3 nail wrap kits + mini nail files",
    },
  },
  quarterly: {
    name: "Friends with benefits",
    description: "3 Month Subscription",
    price: 3300, // $33.00/month average ($99 for 3 months)
    interval: "month",
    intervalCount: 3,
    metadata: {
      tier: "quarterly",
      wrapsPerMonth: "3",
      description: "3 nail wrap kits + mini nail files per month",
    },
  },
  biannual: {
    name: "Committed",
    description: "6 Month Subscription",
    price: 3150, // $31.50/month average ($189 for 6 months)
    interval: "month",
    intervalCount: 6,
    metadata: {
      tier: "biannual",
      wrapsPerMonth: "3",
      description: "3 nail wrap kits + mini nail files per month",
    },
  },
  annual: {
    name: "Ride or die",
    description: "12 Month Subscription",
    price: 3000, // $30.00/month average ($360 for 12 months)
    interval: "month",
    intervalCount: 12,
    metadata: {
      tier: "annual",
      wrapsPerMonth: "3",
      description: "3 nail wrap kits + mini nail files per month",
    },
  },
} as const;

export type SubscriptionTier = keyof typeof SUBSCRIPTION_PRODUCTS;

export function getSubscriptionProduct(tier: SubscriptionTier) {
  return SUBSCRIPTION_PRODUCTS[tier];
}

export function getTierFromPrice(priceId: string): SubscriptionTier | null {
  // This would be populated from Stripe's price ID mapping
  // For now, we'll handle this in the webhook handler
  return null;
}
