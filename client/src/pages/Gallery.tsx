import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ChevronRight, Search } from "lucide-react";
import { useLocation } from "wouter";
import LuxuryNav from "@/components/LuxuryNav";

export default function Gallery() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    document.title = "Nail'd Gallery - Premium Nail Art Collections";
  }, []);

  const products = [
    // Maximalist Collection
    { id: 1, name: "Neon Blob Chrome", category: "maximalist", price: "$15.99", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/B98P4q7Eu5xg_092370d6.jpg", description: "Y2K inspired 3D chrome blobs" },
    { id: 2, name: "Glitter Galaxy", category: "maximalist", price: "$14.99", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/hjPLR7GAeXxS_2f36a687.jpg", description: "Deep space design with glitter stars" },
    { id: 3, name: "Holographic Confetti", category: "maximalist", price: "$13.99", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/hjPLR7GAeXxS_2f36a687.jpg", description: "Rainbow confetti with mirror finish" },
    { id: 4, name: "3D Flower Explosion", category: "maximalist", price: "$16.99", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/lA0O7S1CNf0T_6b494785.jpg", description: "Hand-painted 3D floral designs" },
    { id: 5, name: "Metallic Marble", category: "maximalist", price: "$14.99", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/B98P4q7Eu5xg_092370d6.jpg", description: "Swirled metallic gold and silver" },
    { id: 6, name: "Neon Geometric", category: "maximalist", price: "$13.99", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/hjPLR7GAeXxS_2f36a687.jpg", description: "Bold geometric shapes in neon" },
    { id: 7, name: "Rainbow Ombre Wave", category: "maximalist", price: "$14.99", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/lA0O7S1CNf0T_6b494785.jpg", description: "Gradient from red to violet" },
    { id: 8, name: "Jeweled Luxury", category: "maximalist", price: "$17.99", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/B98P4q7Eu5xg_092370d6.jpg", description: "Rhinestone-studded with gold accents" },

    // Coquette Collection
    { id: 9, name: "Soft Pink Bows", category: "coquette", price: "$12.99", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/hjPLR7GAeXxS_2f36a687.jpg", description: "Pastel pink with bow designs" },
    { id: 10, name: "Blush Hearts", category: "coquette", price: "$12.99", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/lA0O7S1CNf0T_6b494785.jpg", description: "Nude with rose gold hearts" },
    { id: 11, name: "Romantic Lace", category: "coquette", price: "$13.99", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/B98P4q7Eu5xg_092370d6.jpg", description: "White lace on soft pink" },
    { id: 12, name: "Pearl Princess", category: "coquette", price: "$14.99", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/hjPLR7GAeXxS_2f36a687.jpg", description: "Ivory with pearl embellishments" },
    { id: 13, name: "Rose Gold Romance", category: "coquette", price: "$13.99", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/lA0O7S1CNf0T_6b494785.jpg", description: "Champagne with rose gold foil" },
    { id: 14, name: "Soft Lavender Dreams", category: "coquette", price: "$12.99", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/B98P4q7Eu5xg_092370d6.jpg", description: "Lavender gradient with stars" },
    { id: 15, name: "Cream & Roses", category: "coquette", price: "$14.99", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/hjPLR7GAeXxS_2f36a687.jpg", description: "Cream with hand-painted roses" },

    // Chrome & Metallic Collection
    { id: 16, name: "Silver Chrome Mirror", category: "chrome", price: "$15.99", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/lA0O7S1CNf0T_6b494785.jpg", description: "Full mirror chrome in silver" },
    { id: 17, name: "Gold Foil Luxury", category: "chrome", price: "$14.99", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/B98P4q7Eu5xg_092370d6.jpg", description: "Gold metallic with geometric lines" },
    { id: 18, name: "Copper Sunset", category: "chrome", price: "$15.99", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/hjPLR7GAeXxS_2f36a687.jpg", description: "Copper chrome with rose gold gradient" },
    { id: 19, name: "Holographic Chrome", category: "chrome", price: "$16.99", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/lA0O7S1CNf0T_6b494785.jpg", description: "Color-shifting chrome" },
    { id: 20, name: "Matte Chrome Black", category: "chrome", price: "$14.99", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/B98P4q7Eu5xg_092370d6.jpg", description: "Sophisticated matte black chrome" },

    // Minimalist & Elegant Collection
    { id: 21, name: "Negative Space French", category: "minimalist", price: "$11.99", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/hjPLR7GAeXxS_2f36a687.jpg", description: "Modern French manicure" },
    { id: 22, name: "Micro Floral", category: "minimalist", price: "$12.99", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/lA0O7S1CNf0T_6b494785.jpg", description: "Tiny flowers on nude base" },
    { id: 23, name: "Soft Aura", category: "minimalist", price: "$11.99", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/B98P4q7Eu5xg_092370d6.jpg", description: "Barely-there with glow effect" },
    { id: 24, name: "Neutral Cat Eye", category: "minimalist", price: "$12.99", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/hjPLR7GAeXxS_2f36a687.jpg", description: "Nude with metallic line" },
    { id: 25, name: "Minimalist Stripes", category: "minimalist", price: "$11.99", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/lA0O7S1CNf0T_6b494785.jpg", description: "Clean white and nude stripes" },
    { id: 26, name: "Subtle Metallic Accent", category: "minimalist", price: "$12.99", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/B98P4q7Eu5xg_092370d6.jpg", description: "Nude with gold accent line" },

    // Trendy Patterns Collection
    { id: 27, name: "Preppy Plaid", category: "patterns", price: "$13.99", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/hjPLR7GAeXxS_2f36a687.jpg", description: "Classic navy and white plaid" },
    { id: 28, name: "Gingham Glow", category: "patterns", price: "$12.99", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/lA0O7S1CNf0T_6b494785.jpg", description: "Checkered in soft pastels" },
    { id: 29, name: "Tweed Texture", category: "patterns", price: "$14.99", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/B98P4q7Eu5xg_092370d6.jpg", description: "Chanel-inspired tweed" },
    { id: 30, name: "Blooming Botanicals", category: "patterns", price: "$13.99", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/hjPLR7GAeXxS_2f36a687.jpg", description: "Spring floral with green leaves" },
    { id: 31, name: "Y2K Butterfly", category: "patterns", price: "$14.99", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/lA0O7S1CNf0T_6b494785.jpg", description: "Colorful retro butterflies" },
    { id: 32, name: "Sunset Gradient", category: "patterns", price: "$13.99", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/B98P4q7Eu5xg_092370d6.jpg", description: "Orange to pink to purple" },

    // Premium Collection
    { id: 33, name: "Hand-Painted Artisan", category: "premium", price: "$19.99", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/hjPLR7GAeXxS_2f36a687.jpg", description: "Custom hand-painted nail art" },
    { id: 34, name: "3D Embellished Luxury", category: "premium", price: "$21.99", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/lA0O7S1CNf0T_6b494785.jpg", description: "Premium 3D with Swarovski crystals" },
  ];

  const categories = [
    { id: "all", label: "All Collections" },
    { id: "maximalist", label: "Maximalist" },
    { id: "coquette", label: "Coquette" },
    { id: "chrome", label: "Chrome & Metallic" },
    { id: "minimalist", label: "Minimalist" },
    { id: "patterns", label: "Patterns" },
    { id: "premium", label: "Premium" },
  ];

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <LuxuryNav />

      {/* Header */}
      <section className="pt-32 pb-16 px-6 bg-background border-b border-accent/10">
        <div className="container">
          <h1 className="text-5xl md:text-6xl font-display font-bold text-foreground mb-4">
            Our Collections
          </h1>
          <p className="text-lg text-foreground/70 max-w-2xl">
            Discover {products.length}+ trending nail art designs inspired by Instagram and TikTok.
          </p>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="py-12 px-6 bg-background border-b border-accent/10">
        <div className="container space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-foreground/50" />
            <Input
              placeholder="Search designs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 py-3 bg-card border-accent/20 text-foreground placeholder:text-foreground/50"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <Button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                className={selectedCategory === cat.id ? "bg-accent text-foreground" : "border-accent/30"}
              >
                {cat.label}
              </Button>
            ))}
          </div>

          {/* Results Count */}
          <p className="text-sm text-foreground/60">
            Showing {filteredProducts.length} of {products.length} designs
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 px-6 bg-background">
        <div className="container">
          {filteredProducts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="group overflow-hidden bg-card/50 border-accent/20 hover:border-accent/50 transition-all cursor-pointer"
                  onClick={() => setLocation(`/product/${product.id}`)}
                >
                  <div className="aspect-square overflow-hidden bg-muted">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 space-y-3">
                    <div>
                      <p className="text-xs text-accent/70 uppercase tracking-wider mb-1">
                        {product.category}
                      </p>
                      <h3 className="font-display text-lg text-foreground font-semibold">
                        {product.name}
                      </h3>
                    </div>
                    <p className="text-sm text-foreground/60">{product.description}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-accent/10">
                      <p className="text-accent font-semibold text-lg">{product.price}</p>
                      <Button
                        size="sm"
                        className="bg-accent hover:bg-accent/90 text-foreground"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLocation("/subscribe");
                        }}
                      >
                        Add to Cart
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-foreground/60">No designs found matching your search.</p>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                }}
                className="mt-6 bg-accent hover:bg-accent/90 text-foreground"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-background border-t border-accent/10">
        <div className="container max-w-3xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground">
              Can't Find Your Perfect Design?
            </h2>
            <p className="text-lg text-foreground/70">
              Use our Design Studio to create custom nail art exactly how you want it.
            </p>
          </div>
          <Button
            size="lg"
            onClick={() => setLocation("/studio")}
            className="bg-accent hover:bg-accent/90 text-foreground font-display text-lg px-12 py-6 rounded-sm"
          >
            Create Custom Design
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
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
