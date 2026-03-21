import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Sparkles } from "lucide-react";
import { useLocation } from "wouter";

const products = [
  {
    id: 1,
    name: "Checkmate Nail Wraps",
    category: "Geometric",
    description: "Classic black and white checkmate pattern",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/B98P4q7Eu5xg_092370d6.jpg",
    price: 12.99,
  },
  {
    id: 2,
    name: "Nail Art Design Showcase",
    category: "Mixed",
    description: "Collection of various nail art designs",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/I2ySVxCEnfxd_b7e53c20.jpg",
    price: 14.99,
  },
  {
    id: 3,
    name: "Christmas Cutie Nail Art",
    category: "Seasonal",
    description: "Festive Christmas-themed designs",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/M2tb20TzCWVP_5f03f32f.jpg",
    price: 13.99,
  },
  {
    id: 4,
    name: "Fall Full Nail Wraps",
    category: "Seasonal",
    description: "Autumn-inspired nail wrap stickers",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/QFIFJu3FSsLE_c546cf86.jpg",
    price: 15.99,
  },
  {
    id: 5,
    name: "Beautiful Nail Art Tutorial",
    category: "Mixed",
    description: "Collection of beautiful nail art designs",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/QRfqOPbkeuVO_572e38f9.jpg",
    price: 12.99,
  },
  {
    id: 6,
    name: "Cute Piggy Nail Art Kit",
    category: "Playful",
    description: "Adorable piggy-themed nail art",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/UREkDhdJefLj_8d98a6c3.jpg",
    price: 11.99,
  },
  {
    id: 7,
    name: "Piggy Nails Suite Studio",
    category: "Professional",
    description: "Professional nail salon showcase",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/aXImH6bF4dK2_18cf2855.jpg",
    price: 16.99,
  },
  {
    id: 8,
    name: "3D Blossom Nail Art",
    category: "Floral",
    description: "3D blossom-themed nail art",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/hjPLR7GAeXxS_2f36a687.jpg",
    price: 14.99,
  },
  {
    id: 9,
    name: "3D Heart Nail Art",
    category: "Romantic",
    description: "3D heart-shaped nail art",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/lA0O7S1CNf0T_6b494785.jpg",
    price: 13.99,
  },
  {
    id: 10,
    name: "Nail Polish Art Strips",
    category: "Classic",
    description: "Premium nail polish art strips",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/oeGLK19nnivc_7338bdd9.jpg",
    price: 12.99,
  },
  {
    id: 11,
    name: "Cute Piggy Decorations",
    category: "Playful",
    description: "Cute piggy-themed nail decorations",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/p33GPlzLAeMA_0237fd16.jpg",
    price: 10.99,
  },
  {
    id: 12,
    name: "3D Blossom Collection",
    category: "Floral",
    description: "3D blossom nail art collection",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/qx6uSZMlysqb_8d98a6c3.jpg",
    price: 14.99,
  },
];

const categories = ["All", "Geometric", "Mixed", "Seasonal", "Playful", "Professional", "Floral", "Romantic", "Classic"];

export default function Gallery() {
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProducts = selectedCategory === "All"
    ? products
    : products.filter(p => p.category === selectedCategory);

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
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-display font-bold">Gallery</h1>
          </div>
          <div className="w-20" />
        </div>
      </nav>

      {/* Page Header */}
      <section className="py-12 border-b border-border">
        <div className="container">
          <h2 className="text-4xl font-display font-bold text-foreground mb-4">
            Nail Art Collection
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Browse our curated collection of stunning nail designs. Each month, we add new exclusive designs to our subscription boxes.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b border-border bg-secondary/5">
        <div className="container">
          <h3 className="text-sm font-semibold text-foreground mb-4">Filter by Category</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-accent text-accent-foreground shadow-md"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container">
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="group overflow-hidden border-border/50 hover:border-accent/50 hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="relative h-48 overflow-hidden bg-muted">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2">
                    <span className="bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full">
                      {product.category}
                    </span>
                  </div>
                </div>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base line-clamp-2">{product.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{product.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-display font-bold text-foreground">
                      ${product.price}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        setLocation("/subscribe");
                      }}
                    >
                      Subscribe
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                No products found in this category.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="container text-center">
          <h3 className="text-3xl font-display font-bold text-foreground mb-4">
            Get These Designs Monthly
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Subscribe to receive 3 new nail wrap kits every month. Never run out of fresh designs!
          </p>
          <Button
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
            onClick={() => setLocation("/subscribe")}
          >
            Start Subscription
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-background">
        <div className="container text-center text-sm text-muted-foreground">
          <p>&copy; 2026 Piggy Nails. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
