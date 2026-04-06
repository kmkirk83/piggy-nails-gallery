import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, ShoppingCart, Star } from "lucide-react";
import LuxuryNav from "@/components/LuxuryNav";
import CartDrawer from "@/components/CartDrawer";
import QuickViewModal, { QuickViewProduct } from "@/components/QuickViewModal";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  cost: number;
  image: string;
  description: string;
  rating: number;
  reviews: number;
  supplier: string;
}

export default function Gallery() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cartOpen, setCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<QuickViewProduct | null>(null);
  const { addItem } = useCart();

  useEffect(() => {
    document.title = "Nail'd Gallery - Premium Nail Art Collections";
  }, []);

  const products: Product[] = [
    // CJ Dropshipping Products - Nail Wraps
    { id: 1, name: "Holographic Nail Wraps Set", category: "wraps", price: "$9.99", cost: 4.00, image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/B98P4q7Eu5xg_092370d6.jpg", description: "20 strips, multiple holographic colors, trendy and eye-catching", rating: 4.8, reviews: 342, supplier: "CJ Dropshipping" },
    { id: 2, name: "Chrome Mirror Nail Wraps", category: "wraps", price: "$8.99", cost: 3.50, image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/hjPLR7GAeXxS_2f36a687.jpg", description: "Metallic mirror finish, Instagram-worthy, premium feel", rating: 4.7, reviews: 287, supplier: "CJ Dropshipping" },
    { id: 3, name: "Marble Pattern Nail Wraps", category: "wraps", price: "$9.49", cost: 3.80, image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/lA0O7S1CNf0T_6b494785.jpg", description: "Aesthetic marble patterns, sophisticated and timeless", rating: 4.6, reviews: 215, supplier: "CJ Dropshipping" },
    { id: 4, name: "Glitter Gradient Nail Wraps", category: "wraps", price: "$10.99", cost: 4.20, image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/B98P4q7Eu5xg_092370d6.jpg", description: "Sparkly gradient effect, premium luxury feel", rating: 4.9, reviews: 398, supplier: "CJ Dropshipping" },
    // Press-On Nails
    { id: 5, name: "Press-On Nails Coffin", category: "press-ons", price: "$8.99", cost: 3.00, image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/hjPLR7GAeXxS_2f36a687.jpg", description: "24 pieces, multiple sizes, coffin shape, trending style", rating: 4.8, reviews: 456, supplier: "CJ Dropshipping" },
    { id: 6, name: "Press-On Nails Almond", category: "press-ons", price: "$7.99", cost: 2.80, image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/lA0O7S1CNf0T_6b494785.jpg", description: "Natural almond shape, versatile for any occasion", rating: 4.7, reviews: 389, supplier: "CJ Dropshipping" },
    { id: 7, name: "Press-On Nails Stiletto", category: "press-ons", price: "$9.49", cost: 3.20, image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/B98P4q7Eu5xg_092370d6.jpg", description: "Bold stiletto shape, statement-making style", rating: 4.6, reviews: 267, supplier: "CJ Dropshipping" },
    // Gel Kits
    { id: 8, name: "Gel Nail Kit with LED Lamp", category: "gel-kits", price: "$19.99", cost: 8.50, image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/hjPLR7GAeXxS_2f36a687.jpg", description: "Complete kit with LED lamp, gel polish, and tools", rating: 4.9, reviews: 523, supplier: "CJ Dropshipping" },
    { id: 9, name: "Gel Polish Set 12 Colors", category: "gel-kits", price: "$14.99", cost: 6.00, image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/lA0O7S1CNf0T_6b494785.jpg", description: "Professional quality gel polish, 12 trending colors", rating: 4.8, reviews: 412, supplier: "CJ Dropshipping" },
    // Accessories
    { id: 10, name: "Nail Art Rhinestones Mix", category: "accessories", price: "$5.99", cost: 2.00, image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/B98P4q7Eu5xg_092370d6.jpg", description: "1000+ stones, multiple sizes and colors for nail art", rating: 4.7, reviews: 298, supplier: "CJ Dropshipping" },
    { id: 11, name: "Nail Art Decals Stickers", category: "accessories", price: "$4.99", cost: 1.50, image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/hjPLR7GAeXxS_2f36a687.jpg", description: "50+ designs, waterslide decals for easy application", rating: 4.6, reviews: 234, supplier: "CJ Dropshipping" },
    { id: 12, name: "Manicure Tool Kit 12pcs", category: "accessories", price: "$7.99", cost: 2.50, image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/lA0O7S1CNf0T_6b494785.jpg", description: "Professional 12-piece manicure tool set", rating: 4.8, reviews: 367, supplier: "CJ Dropshipping" },
    { id: 13, name: "Nail Buffer & File Set", category: "accessories", price: "$6.99", cost: 2.20, image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/B98P4q7Eu5xg_092370d6.jpg", description: "5-in-1 professional nail buffer and file set", rating: 4.7, reviews: 278, supplier: "CJ Dropshipping" },
    { id: 14, name: "Nail Sticker Sheets", category: "accessories", price: "$3.99", cost: 1.00, image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/hjPLR7GAeXxS_2f36a687.jpg", description: "30+ designs, easy to apply nail stickers", rating: 4.5, reviews: 201, supplier: "CJ Dropshipping" },
    // Care Products
    { id: 15, name: "Cuticle Oil Pen", category: "care", price: "$5.99", cost: 1.80, image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/lA0O7S1CNf0T_6b494785.jpg", description: "Nourishing cuticle oil, portable pen applicator", rating: 4.7, reviews: 189, supplier: "CJ Dropshipping" },
    { id: 16, name: "Nail Polish Remover Bottle", category: "care", price: "$3.99", cost: 1.20, image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/B98P4q7Eu5xg_092370d6.jpg", description: "Acetone-free, gentle nail polish remover", rating: 4.6, reviews: 156, supplier: "CJ Dropshipping" },
    { id: 17, name: "Base Coat & Top Coat Duo", category: "care", price: "$7.99", cost: 2.50, image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/hjPLR7GAeXxS_2f36a687.jpg", description: "Essential base and top coat for gel nails", rating: 4.8, reviews: 345, supplier: "CJ Dropshipping" },
    // Equipment & Supplies
    { id: 18, name: "UV LED Nail Lamp 48W", category: "equipment", price: "$29.99", cost: 12.00, image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/lA0O7S1CNf0T_6b494785.jpg", description: "Professional 48W UV LED lamp, fast curing, auto-timer", rating: 4.9, reviews: 612, supplier: "CJ Dropshipping" },
    { id: 19, name: "Acrylic Powder Set 5 Colors", category: "supplies", price: "$11.99", cost: 4.50, image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/B98P4q7Eu5xg_092370d6.jpg", description: "Professional grade acrylic powder, 5 trending colors", rating: 4.7, reviews: 289, supplier: "CJ Dropshipping" },
    { id: 20, name: "Nail Glue & Adhesive", category: "supplies", price: "$4.99", cost: 1.50, image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/hjPLR7GAeXxS_2f36a687.jpg", description: "Strong hold, long-lasting nail glue and adhesive", rating: 4.6, reviews: 267, supplier: "CJ Dropshipping" },
  ];

  const categories = [
    { id: "all", label: "All Products" },
    { id: "wraps", label: "Nail Wraps" },
    { id: "press-ons", label: "Press-On Nails" },
    { id: "gel-kits", label: "Gel Kits" },
    { id: "accessories", label: "Accessories" },
    { id: "care", label: "Care" },
    { id: "equipment", label: "Equipment" },
    { id: "supplies", label: "Supplies" },
  ];

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleQuickAdd = (product: Product) => {
    const price = parseFloat(product.price.replace("$", "")) || 0;
    addItem({
      id: String(product.id),
      name: product.name,
      price,
      imageUrl: product.image,
      category: product.category,
    });
    toast.success(`${product.name} added to cart`);
    setCartOpen(true);
  };

  const toQuickViewProduct = (p: Product): QuickViewProduct => ({
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    category: p.category,
    image: p.image,
    rating: p.rating,
    reviews: p.reviews,
  });

  return (
    <div className="min-h-screen bg-background">
      <LuxuryNav onCartOpen={() => setCartOpen(true)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onOpenCart={() => setCartOpen(true)}
      />

      {/* Header */}
      <section className="pt-32 pb-16 px-6 bg-background border-b border-accent/10">
        <div className="container">
          <h1 className="text-5xl md:text-6xl font-display font-bold text-foreground mb-4">
            Shop Our Collection
          </h1>
          <p className="text-lg text-foreground/70 max-w-2xl">
            {products.length} premium nail products — tap any item to Quick View and add to cart.
          </p>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="py-8 px-6 bg-background border-b border-accent/10">
        <div className="container space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-foreground/50" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 py-3 bg-card border-accent/20 text-foreground placeholder:text-foreground/50"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                size="sm"
                className={selectedCategory === cat.id ? "bg-accent text-foreground" : "border-accent/30"}
              >
                {cat.label}
              </Button>
            ))}
          </div>
          <p className="text-sm text-foreground/60">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>
      </section>

      {/* Products Grid — no auth required */}
      <section className="py-12 px-6 bg-background">
        <div className="container">
          {filteredProducts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="group overflow-hidden bg-card/50 border-accent/20 hover:border-accent/50 transition-all cursor-pointer"
                  onClick={() => setQuickViewProduct(toQuickViewProduct(product))}
                >
                  <div className="aspect-square overflow-hidden bg-muted relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://via.placeholder.com/300x300?text=" +
                          encodeURIComponent(product.name);
                      }}
                    />
                    {/* Quick View overlay */}
                    <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-accent text-background text-sm font-medium px-4 py-2 rounded-sm">
                        Quick View
                      </span>
                    </div>
                  </div>
                  <div className="p-5 space-y-3">
                    <div>
                      <p className="text-xs text-accent/70 uppercase tracking-wider mb-1">
                        {product.category}
                      </p>
                      <h3 className="font-display text-base text-foreground font-semibold line-clamp-2">
                        {product.name}
                      </h3>
                    </div>
                    <p className="text-sm text-foreground/60 line-clamp-2">{product.description}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < Math.floor(product.rating) ? "fill-current" : "fill-gray-400"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-foreground/50">
                        {product.rating} ({product.reviews})
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-accent/10">
                      <p className="text-accent font-semibold text-lg">{product.price}</p>
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
          ) : (
            <div className="text-center py-12">
              <p className="text-foreground/60 text-lg mb-4">No products found matching your search.</p>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
