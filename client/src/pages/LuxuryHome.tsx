import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronRight, ShoppingCart } from "lucide-react";
import { useLocation } from "wouter";
import LuxuryNav from "@/components/LuxuryNav";
import CartDrawer from "@/components/CartDrawer";
import QuickViewModal, { QuickViewProduct } from "@/components/QuickViewModal";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

const featuredProducts: QuickViewProduct[] = [
  {
    id: "chrome-dreams",
    name: "Chrome Dreams",
    description: "Chrome and metallic designs — 20 wraps, metallic finish, includes file.",
    price: 12.99,
    category: "Nail Wraps",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/QRfqOPbkeuVO_572e38f9.jpg",
    features: ["20 wraps", "Metallic finish", "Includes file"],
  },
  {
    id: "floral-garden",
    name: "Floral Garden",
    description: "Beautiful floral patterns — 20 wraps, includes file.",
    price: 12.99,
    category: "Nail Wraps",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/aXImH6bF4dK2_18cf2855.jpg",
    features: ["20 wraps", "Floral design", "Includes file"],
  },
  {
    id: "minimalist-chic",
    name: "Minimalist Chic",
    description: "Elegant minimalist designs — professional quality, 20 wraps.",
    price: 12.99,
    category: "Nail Wraps",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/UREkDhdJefLj_8d98a6c3.jpg",
    features: ["20 wraps", "Professional", "Includes file"],
  },
  {
    id: "press-on-coffin",
    name: "Press-On Coffin Set",
    description: "24 pieces, multiple sizes, coffin shape — trending style.",
    price: 8.99,
    category: "Press-On Nails",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/hjPLR7GAeXxS_2f36a687.jpg",
    features: ["24 pieces", "Multiple sizes", "Coffin shape"],
  },
];

export default function LuxuryHome() {
  const [, setLocation] = useLocation();
  const [cartOpen, setCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<QuickViewProduct | null>(null);
  const { addItem } = useCart();

  useEffect(() => {
    document.title = "Nail'd - Premium Nail Art & Subscription Boxes";
  }, []);

  const handleQuickAdd = (product: QuickViewProduct) => {
    const price =
      typeof product.price === "number"
        ? product.price
        : parseFloat(String(product.price).replace("$", "")) || 0;
    addItem({
      id: String(product.id),
      name: product.name,
      price,
      imageUrl: product.image || product.imageUrl,
      category: product.category,
    });
    toast.success(`${product.name} added to cart`);
    setCartOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <LuxuryNav onCartOpen={() => setCartOpen(true)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onOpenCart={() => setCartOpen(true)}
      />

      {/* Hero — single primary action */}
      <section
        className="relative h-screen pt-32 flex items-center justify-start overflow-hidden"
        style={{
          backgroundImage: `url('https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/lA0O7S1CNf0T_6b494785.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center right",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-transparent" />
        <div className="container relative z-10 max-w-2xl space-y-8">
          <div className="space-y-6">
            <p className="text-accent font-display text-lg tracking-widest uppercase">
              Luxury Nail Art
            </p>
            <h1 className="text-6xl md:text-7xl font-display font-bold text-foreground leading-tight">
              Beyond
              <br />
              <span className="italic">Salon.</span>
            </h1>
            <p className="text-xl text-foreground/80 max-w-xl leading-relaxed">
              18-day wear. Hand-painted aesthetics. Delivered to your door.
            </p>
          </div>

          {/* Single clear primary CTA */}
          <Button
            size="lg"
            onClick={() => setLocation("/gallery")}
            className="bg-accent hover:bg-accent/90 text-background font-display text-xl px-10 py-7 rounded-sm font-semibold"
          >
            Browse Nails
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Featured Products — browsable without login, Quick View on tap */}
      <section className="py-20 px-6 bg-background border-t border-accent/10">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-accent font-display text-sm tracking-widest uppercase mb-2">
              Trending Now
            </p>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground">
              Featured Collections
            </h2>
            <p className="text-foreground/60 mt-3">Tap any design to see details &amp; add to cart</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Card
                key={product.id}
                className="group overflow-hidden bg-card/50 border-accent/20 hover:border-accent/50 transition-all cursor-pointer"
                onClick={() => setQuickViewProduct(product)}
              >
                <div className="aspect-square overflow-hidden bg-muted relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Quick View overlay on hover */}
                  <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-accent text-background text-sm font-medium px-4 py-2 rounded-sm">
                      Quick View
                    </span>
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  <div>
                    <p className="text-xs text-accent/70 uppercase tracking-wider">{product.category}</p>
                    <h3 className="font-display text-base text-foreground font-semibold mt-1">
                      {product.name}
                    </h3>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-accent font-semibold text-lg">${Number(product.price).toFixed(2)}</p>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleQuickAdd(product); }}
                      className="bg-accent hover:bg-accent/90 text-background p-2 rounded-lg transition-colors"
                      aria-label={`Add ${product.name} to cart`}
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button
              onClick={() => setLocation("/gallery")}
              variant="outline"
              className="border-accent/40 text-foreground hover:bg-accent/10 font-display px-8 py-5"
            >
              View All {">"}
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-accent/10 py-12 px-6 bg-background">
        <div className="container text-center text-foreground/60 text-sm">
          <p>&copy; 2026 Nail'd. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
