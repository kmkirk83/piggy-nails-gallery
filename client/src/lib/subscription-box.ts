export type SubscriptionTierId = "monthly" | "quarterly" | "biannual" | "annual";
export type SubscriptionSelectionMode = "custom" | "seasonal";

export interface SubscriptionPlan {
  id: SubscriptionTierId;
  productId: string;
  name: string;
  price: number;
  cadenceLabel: string;
  kitsPerShipment: number;
  savings: string;
}

export interface BoxChoice {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  seasonal?: boolean;
}

export interface SubscriptionBoxDraft {
  version: 1;
  tierId: SubscriptionTierId;
  mode: SubscriptionSelectionMode;
  seasonalOptIn: boolean;
  selectedProductIds: string[];
  createdAt: string;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "monthly",
    productId: "starter-monthly",
    name: "Starter",
    price: 34.99,
    cadenceLabel: "Billed every month",
    kitsPerShipment: 3,
    savings: "Save 15%",
  },
  {
    id: "quarterly",
    productId: "trendsetter-quarterly",
    name: "Trendsetter",
    price: 99.99,
    cadenceLabel: "Billed every 3 months",
    kitsPerShipment: 3,
    savings: "Save 20%",
  },
  {
    id: "biannual",
    productId: "vip-biannual",
    name: "VIP",
    price: 189.99,
    cadenceLabel: "Billed every 6 months",
    kitsPerShipment: 4,
    savings: "Save 25%",
  },
  {
    id: "annual",
    productId: "elite-annual",
    name: "Elite",
    price: 360,
    cadenceLabel: "Billed every 12 months",
    kitsPerShipment: 4,
    savings: "Save 30%",
  },
];

export const BOX_CHOICES: BoxChoice[] = [
  {
    id: "chrome-dreams",
    name: "Chrome Dreams",
    description: "Mirror-metallic shine",
    price: 12.99,
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/QRfqOPbkeuVO_572e38f9.jpg",
  },
  {
    id: "minimalist-chic",
    name: "Minimalist Chic",
    description: "Clean, understated polish",
    price: 12.99,
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/UREkDhdJefLj_8d98a6c3.jpg",
  },
  {
    id: "floral-garden",
    name: "Floral Garden",
    description: "Fresh botanical details",
    price: 12.99,
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/aXImH6bF4dK2_18cf2855.jpg",
    seasonal: true,
  },
  {
    id: "holographic-dreams",
    name: "Holographic Dreams",
    description: "Iridescent color shift",
    price: 16.99,
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/M2tb20TzCWVP_5f03f32f.jpg",
  },
  {
    id: "cat-eye-glitter",
    name: "Cat Eye Glitter",
    description: "Magnetic sparkle finish",
    price: 16.99,
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/QRfqOPbkeuVO_572e38f9.jpg",
  },
  {
    id: "clean-french-nude",
    name: "Clean French Nude",
    description: "Soft modern French tips",
    price: 12.99,
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/aXImH6bF4dK2_18cf2855.jpg",
  },
  {
    id: "summer-ocean-wave",
    name: "Summer Ocean Wave",
    description: "Limited seasonal blue set",
    price: 14.99,
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/QRfqOPbkeuVO_572e38f9.jpg",
    seasonal: true,
  },
  {
    id: "rose-gold-confetti",
    name: "Rose Gold Confetti",
    description: "Warm luxe sparkle",
    price: 15.99,
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/hjPLR7GAeXxS_2f36a687.jpg",
  },
];

const DRAFT_STORAGE_KEY = "naild.subscription-box-draft";

export function saveSubscriptionBoxDraft(draft: SubscriptionBoxDraft) {
  window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
}

export function getSubscriptionBoxDraft(): SubscriptionBoxDraft | null {
  try {
    const stored = window.localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!stored) return null;
    const draft = JSON.parse(stored) as SubscriptionBoxDraft;
    return draft.version === 1 ? draft : null;
  } catch {
    return null;
  }
}

export function clearSubscriptionBoxDraft() {
  window.localStorage.removeItem(DRAFT_STORAGE_KEY);
}

export function getBoxChoices(ids: string[]) {
  return ids
    .map((id) => BOX_CHOICES.find((choice) => choice.id === id))
    .filter((choice): choice is BoxChoice => Boolean(choice));
}

export function getSubscriptionPlan(tierId: SubscriptionTierId) {
  return SUBSCRIPTION_PLANS.find((plan) => plan.id === tierId);
}
