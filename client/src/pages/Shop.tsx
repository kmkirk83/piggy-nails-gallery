import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ShoppingBag, Sparkles, Heart, Zap } from "lucide-react";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";



interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "subscription" | "one-time" | "aftercare";
  subcategory?: string;
  trending?: boolean;
  features?: string[];
  imageUrl?: string;
}

const products: Product[] = [
  // Subscriptions
  {
    id: "starter-monthly",
    name: "Starter Box",
    description: "3 nail wrap kits monthly",
    price: 34.99,
    category: "subscription",
    subcategory: "monthly",
    trending: true,
    features: ["3 kits", "Mini files", "Free shipping"],
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/B98P4q7Eu5xg_092370d6.jpg",
  },
  {
    id: "trendsetter-quarterly",
    name: "Trendsetter Box",
    description: "3 kits per month for 3 months",
    price: 99.99,
    category: "subscription",
    subcategory: "quarterly",
    trending: true,
    features: ["3 kits/month", "Exclusive access", "Early releases"],
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/I2ySVxCEnfxd_b7e53c20.jpg",
  },
  {
    id: "vip-biannual",
    name: "VIP Box",
    description: "4 kits per month for 6 months",
    price: 189.99,
    category: "subscription",
    subcategory: "biannual",
    features: ["4 kits/month", "Premium files", "Priority support"],
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/M2tb20TzCWVP_5f03f32f.jpg",
  },
  {
    id: "elite-annual",
    name: "Elite Box",
    description: "4 kits per month for 12 months",
    price: 360.0,
    category: "subscription",
    subcategory: "annual",
    trending: true,
    features: ["4 kits/month", "Free aftercare", "Annual gift"],
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/QFIFJu3FSsLE_c546cf86.jpg",
  },
  // One-Time Purchases
  {
    id: "chrome-dreams",
    name: "Chrome Dreams",
    description: "Chrome and metallic designs",
    price: 12.99,
    category: "one-time",
    subcategory: "trending",
    trending: true,
    features: ["20 wraps", "Metallic finish", "Includes file"],
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/QRfqOPbkeuVO_572e38f9.jpg",
  },
  {
    id: "minimalist-chic",
    name: "Minimalist Chic",
    description: "Elegant minimalist designs",
    price: 12.99,
    category: "one-time",
    subcategory: "elegant",
    features: ["20 wraps", "Professional", "Includes file"],
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/UREkDhdJefLj_8d98a6c3.jpg",
  },
  {
    id: "floral-garden",
    name: "Floral Garden",
    description: "Beautiful floral patterns",
    price: 12.99,
    category: "one-time",
    subcategory: "nature",
    features: ["20 wraps", "Floral design", "Includes file"],
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/aXImH6bF4dK2_18cf2855.jpg",
  },
  {
    id: "glitter-bomb",
    name: "Glitter Bomb",
    description: "Sparkly festive designs",
    price: 12.99,
    category: "one-time",
    subcategory: "sparkle",
    trending: true,
    features: ["20 wraps", "Glitter finish", "Includes file"],
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/hjPLR7GAeXxS_2f36a687.jpg",
  },
  {
    id: "ombre-sunset",
    name: "Ombre Sunset",
    description: "Gradient ombre designs",
    price: 14.99,
    category: "one-time",
    subcategory: "gradient",
    trending: true,
    features: ["20 wraps", "Gradient", "Includes file"],
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/lA0O7S1CNf0T_6b494785.jpg",
  },
  {
    id: "geometric-pop",
    name: "Geometric Pop",
    description: "Bold geometric patterns",
    price: 14.99,
    category: "one-time",
    subcategory: "geometric",
    trending: true,
    features: ["20 wraps", "Geometric", "Includes file"],
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/B98P4q7Eu5xg_092370d6.jpg",
  },
  {
    id: "3d-texture",
    name: "3D Texture",
    description: "3D textured designs",
    price: 16.99,
    category: "one-time",
    subcategory: "textured",
    trending: true,
    features: ["20 wraps", "3D texture", "Includes file"],
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/I2ySVxCEnfxd_b7e53c20.jpg",
  },
  {
    id: "holographic-dreams",
    name: "Holographic Dreams",
    description: "Iridescent holographic",
    price: 16.99,
    category: "one-time",
    subcategory: "holographic",
    trending: true,
    features: ["20 wraps", "Holographic", "Includes file"],
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/M2tb20TzCWVP_5f03f32f.jpg",
  },
  // Aftercare Kits
  {
    id: "basic-aftercare",
    name: "Basic Aftercare Kit",
    description: "Essential nail care",
    price: 14.99,
    category: "aftercare",
    subcategory: "basic",
    features: ["Base coat", "Top coat", "File"],
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/QRfqOPbkeuVO_572e38f9.jpg",
  },
  {
    id: "premium-aftercare",
    name: "Premium Aftercare Kit",
    description: "Complete care collection",
    price: 24.99,
    category: "aftercare",
    subcategory: "premium",
    trending: true,
    features: ["Base + top", "Remover", "Buffer", "File"],
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/UREkDhdJefLj_8d98a6c3.jpg",
  },
  {
    id: "deluxe-aftercare",
    name: "Deluxe Aftercare Kit",
    description: "Ultimate care collection",
    price: 34.99,
    category: "aftercare",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/aXImH6bF4dK2_18cf2855.jpg",
    subcategory: "deluxe",
    trending: true,
    features: ["Complete set", "Art pen", "Cuticle oil", "Premium"],
  },
];

export default function Shop() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "subscription" | "one-time" | "aftercare"
  >("all");
  const [showTrendingOnly, setShowTrendingOnly] = useState(false);

  const categories = [
    { id: "all", label: "All Products", icon: ShoppingBag },
    { id: "subscription", label: "Subscriptions", icon: Zap },
    { id: "one-time", label: "Shop Designs", icon: Sparkles },
    { id: "aftercare", label: "Aftercare", icon: Heart },
  ];

  const filteredProducts = products.filter((p) => {
    const categoryMatch =
      selectedCategory === "all" || p.category === selectedCategory;
    const trendingMatch = !showTrendingOnly || p.trending;
    return categoryMatch && trendingMatch;
  });

  const handleAddToCart = (product: Product) => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    // TODO: Implement cart functionality
    setLocation(`/checkout?product=${product.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <button
            onClick={() => setLocation("/")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-display font-bold">Nail'd Shop</h1>
          </div>
          <div className="w-20" />
        </div>
      </nav>

      {/* Hero */}
      <section className="py-12 bg-gradient-to-br from-background to-primary/5">
        <div className="container">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Shop Nail'd
          </h2>
          <p className="text-lg text-muted-foreground">
            Trending designs, subscriptions, and aftercare kits
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-16 z-30 bg-background/95 backdrop-blur border-b border-border py-4">
        <div className="container">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() =>
                      setSelectedCategory(
                        cat.id as
                          | "all"
                          | "subscription"
                          | "one-time"
                          | "aftercare"
                      )
                    }
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      selectedCategory === cat.id
                        ? "bg-accent text-accent-foreground"
                        : "bg-secondary/20 hover:bg-secondary/30"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{cat.label}</span>
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setShowTrendingOnly(!showTrendingOnly)}
              className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                showTrendingOnly
                  ? "bg-accent text-accent-foreground"
                  : "bg-secondary/20 hover:bg-secondary/30"
              }`}
            >
              {showTrendingOnly ? "✓ Trending Only" : "Show All"}
            </button>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                No products found in this category
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center relative overflow-hidden">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : null}
                    {product.trending && (
                      <div className="absolute top-3 right-3 px-2 py-1 bg-accent text-accent-foreground text-xs font-bold rounded">
                        TRENDING
                      </div>
                    )}
                    {!product.imageUrl && (
                      <Sparkles className="w-16 h-16 text-accent/30" />
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <CardDescription>{product.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-accent">
                        ${product.price.toFixed(2)}
                      </span>
                    </div>
                    {product.features && (
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {product.features.slice(0, 3).map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-accent" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    )}
                    <Button
                      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                      onClick={() => handleAddToCart(product)}
                    >
                      {product.category === "subscription"
                        ? "Subscribe"
                        : "Add to Cart"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-background">
        <div className="container text-center text-sm text-muted-foreground">
          <p>&copy; 2026 Nail'd. Premium trending nail art delivered.</p>
        </div>
      </footer>
    </div>
  );
}
