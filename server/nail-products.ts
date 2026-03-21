/**
 * Nail'd Premium Product Catalog
 * Comprehensive product definitions with Stripe integration
 */

export interface NailProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "subscription" | "one-time" | "aftercare";
  subcategory?: string;
  image?: string;
  stripeProductId?: string;
  stripePriceId?: string;
  features?: string[];
  trending?: boolean;
}

// Subscription Products
export const subscriptionProducts: NailProduct[] = [
  {
    id: "starter-monthly",
    name: "Starter Box - Monthly",
    description: "3 trending nail wrap kits delivered monthly",
    price: 3499, // $34.99 in cents
    category: "subscription",
    subcategory: "monthly",
    trending: true,
    features: [
      "3 nail wrap kits (20 wraps each)",
      "Mini nail files",
      "Free worldwide shipping",
      "Cancel anytime",
    ],
  },
  {
    id: "trendsetter-quarterly",
    name: "Trendsetter Box - Quarterly",
    description: "3 nail wrap kits per month for 3 months",
    price: 9999, // $99.99 in cents
    category: "subscription",
    subcategory: "quarterly",
    trending: true,
    features: [
      "3 nail wrap kits per month (20 wraps each)",
      "Mini nail files",
      "Free worldwide shipping",
      "Exclusive design access",
      "Early access to new collections",
    ],
  },
  {
    id: "vip-biannual",
    name: "VIP Box - 6 Months",
    description: "4 nail wrap kits per month for 6 months",
    price: 18999, // $189.99 in cents
    category: "subscription",
    subcategory: "biannual",
    trending: true,
    features: [
      "4 nail wrap kits per month (20 wraps each)",
      "Premium nail files",
      "Free worldwide shipping",
      "Exclusive designs",
      "Early access to new collections",
      "Priority customer support",
      "Quarterly bonus designs",
    ],
  },
  {
    id: "elite-annual",
    name: "Elite Box - 12 Months",
    description: "4 nail wrap kits per month for 12 months",
    price: 36000, // $360.00 in cents
    category: "subscription",
    subcategory: "annual",
    trending: true,
    features: [
      "4 nail wrap kits per month (20 wraps each)",
      "Premium nail files",
      "Free worldwide shipping",
      "Exclusive designs",
      "Early access to new collections",
      "Priority customer support",
      "Quarterly bonus designs",
      "Free Premium Aftercare Kit",
      "Annual exclusive gift",
    ],
  },
];

// One-Time Purchase Products
export const oneTimePurchaseProducts: NailProduct[] = [
  {
    id: "chrome-dreams",
    name: "Chrome Dreams Collection",
    description: "Trending chrome and metallic nail wraps",
    price: 1299, // $12.99 in cents
    category: "one-time",
    subcategory: "trending",
    trending: true,
    features: [
      "1 nail wrap kit (20 wraps)",
      "Includes nail file",
      "Chrome and metallic finishes",
      "Long-lasting wear (7-14 days)",
    ],
  },
  {
    id: "minimalist-chic",
    name: "Minimalist Chic Collection",
    description: "Elegant minimalist designs",
    price: 1299,
    category: "one-time",
    subcategory: "elegant",
    features: [
      "1 nail wrap kit (20 wraps)",
      "Includes nail file",
      "Minimalist aesthetic",
      "Perfect for professionals",
    ],
  },
  {
    id: "floral-garden",
    name: "Floral Garden Collection",
    description: "Beautiful floral and nature-inspired designs",
    price: 1299,
    category: "one-time",
    subcategory: "nature",
    features: [
      "1 nail wrap kit (20 wraps)",
      "Includes nail file",
      "Floral patterns",
      "Spring/summer vibes",
    ],
  },
  {
    id: "glitter-bomb",
    name: "Glitter Bomb Collection",
    description: "Sparkly and festive nail wraps",
    price: 1299,
    category: "one-time",
    subcategory: "sparkle",
    trending: true,
    features: [
      "1 nail wrap kit (20 wraps)",
      "Includes nail file",
      "Glitter and sparkle finishes",
      "Party-ready designs",
    ],
  },
  {
    id: "ombre-sunset",
    name: "Ombre Sunset Collection",
    description: "Gradient and ombre nail wraps",
    price: 1499, // $14.99
    category: "one-time",
    subcategory: "gradient",
    trending: true,
    features: [
      "1 nail wrap kit (20 wraps)",
      "Includes nail file",
      "Gradient transitions",
      "Sunset color palette",
    ],
  },
  {
    id: "geometric-pop",
    name: "Geometric Pop Collection",
    description: "Bold geometric patterns and shapes",
    price: 1499,
    category: "one-time",
    subcategory: "geometric",
    trending: true,
    features: [
      "1 nail wrap kit (20 wraps)",
      "Includes nail file",
      "Bold geometric patterns",
      "Modern and trendy",
    ],
  },
  {
    id: "3d-texture",
    name: "3D Texture Collection",
    description: "3D textured and embellished nail wraps",
    price: 1699, // $16.99
    category: "one-time",
    subcategory: "textured",
    trending: true,
    features: [
      "1 nail wrap kit (20 wraps)",
      "Includes nail file",
      "3D textured finishes",
      "Statement-making designs",
    ],
  },
  {
    id: "french-classic",
    name: "French Classic Collection",
    description: "Timeless French manicure designs",
    price: 1299,
    category: "one-time",
    subcategory: "classic",
    features: [
      "1 nail wrap kit (20 wraps)",
      "Includes nail file",
      "French manicure styles",
      "Versatile and elegant",
    ],
  },
  {
    id: "holographic-dreams",
    name: "Holographic Dreams Collection",
    description: "Iridescent holographic nail wraps",
    price: 1699,
    category: "one-time",
    subcategory: "holographic",
    trending: true,
    features: [
      "1 nail wrap kit (20 wraps)",
      "Includes nail file",
      "Holographic finishes",
      "Color-changing effects",
    ],
  },
  {
    id: "marble-luxe",
    name: "Marble Luxe Collection",
    description: "Marble and stone-inspired designs",
    price: 1499,
    category: "one-time",
    subcategory: "luxury",
    features: [
      "1 nail wrap kit (20 wraps)",
      "Includes nail file",
      "Marble patterns",
      "Sophisticated look",
    ],
  },
  {
    id: "neon-nights",
    name: "Neon Nights Collection",
    description: "Bright neon and electric colors",
    price: 1499,
    category: "one-time",
    subcategory: "bold",
    trending: true,
    features: [
      "1 nail wrap kit (20 wraps)",
      "Includes nail file",
      "Neon bright colors",
      "Festival-ready",
    ],
  },
  {
    id: "pastel-dreams",
    name: "Pastel Dreams Collection",
    description: "Soft pastel nail wrap designs",
    price: 1299,
    category: "one-time",
    subcategory: "soft",
    features: [
      "1 nail wrap kit (20 wraps)",
      "Includes nail file",
      "Pastel colors",
      "Cute and feminine",
    ],
  },
];

// Aftercare Kit Products
export const aftercareKitProducts: NailProduct[] = [
  {
    id: "basic-aftercare",
    name: "Basic Aftercare Kit",
    description: "Essential nail care products",
    price: 1499, // $14.99 in cents
    category: "aftercare",
    subcategory: "basic",
    features: [
      "Nail base coat",
      "Nail top coat",
      "Nail file",
      "Includes care guide",
    ],
  },
  {
    id: "premium-aftercare",
    name: "Premium Aftercare Kit",
    description: "Complete nail care and maintenance",
    price: 2499, // $24.99 in cents
    category: "aftercare",
    subcategory: "premium",
    trending: true,
    features: [
      "Nail base coat",
      "Nail top coat",
      "Nail wrap remover",
      "Professional nail file",
      "Nail buffer",
      "Includes detailed care guide",
    ],
  },
  {
    id: "deluxe-aftercare",
    name: "Deluxe Aftercare Kit",
    description: "Ultimate nail art care collection",
    price: 3499, // $34.99 in cents
    category: "aftercare",
    subcategory: "deluxe",
    trending: true,
    features: [
      "Nail base coat",
      "Nail top coat",
      "Nail wrap remover",
      "Professional nail file",
      "Nail buffer",
      "Nail art pen",
      "Cuticle oil",
      "Includes professional care guide",
      "Premium packaging",
    ],
  },
  {
    id: "travel-aftercare",
    name: "Travel Aftercare Kit",
    description: "Portable nail care essentials",
    price: 1099, // $10.99 in cents
    category: "aftercare",
    subcategory: "travel",
    features: [
      "Mini base coat",
      "Mini top coat",
      "Compact nail file",
      "Perfect for travel",
      "Fits in any bag",
    ],
  },
];

// Design Collections (for one-time purchases)
export const designCollections: NailProduct[] = [
  {
    id: "seasonal-spring",
    name: "Seasonal Spring Collection",
    description: "Spring-themed nail wrap collection",
    price: 2499, // $24.99 in cents
    category: "one-time",
    subcategory: "seasonal",
    features: [
      "3 nail wrap kits (20 wraps each)",
      "Spring colors and themes",
      "Includes nail files",
      "Limited edition",
    ],
  },
  {
    id: "seasonal-summer",
    name: "Seasonal Summer Collection",
    description: "Summer-themed nail wrap collection",
    price: 2499,
    category: "one-time",
    subcategory: "seasonal",
    features: [
      "3 nail wrap kits (20 wraps each)",
      "Summer colors and themes",
      "Includes nail files",
      "Limited edition",
    ],
  },
  {
    id: "seasonal-holiday",
    name: "Holiday Collection",
    description: "Festive holiday nail wrap collection",
    price: 2999, // $29.99 in cents
    category: "one-time",
    subcategory: "seasonal",
    trending: true,
    features: [
      "3 nail wrap kits (20 wraps each)",
      "Holiday themes",
      "Includes nail files",
      "Limited edition",
      "Perfect for celebrations",
    ],
  },
  {
    id: "viral-tiktok",
    name: "Viral TikTok Trends",
    description: "Most trending designs from TikTok",
    price: 2999,
    category: "one-time",
    subcategory: "trending",
    trending: true,
    features: [
      "3 nail wrap kits (20 wraps each)",
      "Trending TikTok designs",
      "Includes nail files",
      "Updated monthly",
    ],
  },
  {
    id: "instagram-inspired",
    name: "Instagram Inspired Collection",
    description: "Top designs from Instagram creators",
    price: 2999,
    category: "one-time",
    subcategory: "trending",
    trending: true,
    features: [
      "3 nail wrap kits (20 wraps each)",
      "Instagram creator designs",
      "Includes nail files",
      "Curated by experts",
    ],
  },
];

// All products combined
export const allProducts = [
  ...subscriptionProducts,
  ...oneTimePurchaseProducts,
  ...aftercareKitProducts,
  ...designCollections,
];

// Helper functions
export function getProductById(id: string): NailProduct | undefined {
  return allProducts.find((p) => p.id === id);
}

export function getProductsByCategory(
  category: "subscription" | "one-time" | "aftercare"
): NailProduct[] {
  return allProducts.filter((p) => p.category === category);
}

export function getTrendingProducts(): NailProduct[] {
  return allProducts.filter((p) => p.trending);
}

export function getProductsBySubcategory(subcategory: string): NailProduct[] {
  return allProducts.filter((p) => p.subcategory === subcategory);
}

// Stripe product mapping
export const stripeProductMapping: Record<string, { productId: string; priceId: string }> = {
  "starter-monthly": {
    productId: "prod_starter_monthly",
    priceId: "price_starter_monthly",
  },
  "trendsetter-quarterly": {
    productId: "prod_trendsetter_quarterly",
    priceId: "price_trendsetter_quarterly",
  },
  "vip-biannual": {
    productId: "prod_vip_biannual",
    priceId: "price_vip_biannual",
  },
  "elite-annual": {
    productId: "prod_elite_annual",
    priceId: "price_elite_annual",
  },
};
