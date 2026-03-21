import { useEffect, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Loader2, Sparkles, Check } from "lucide-react";
import { useLocation, useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  subcategory?: string;
  trending?: boolean;
  features?: string[];
}

export default function ProductDetail() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { productId } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const getProductQuery = trpc.stripe.getProduct.useQuery(productId || "", {
    enabled: !!productId,
  });

  const createCheckoutMutation = trpc.stripe.createCheckoutSession.useMutation();

  useEffect(() => {
    if (getProductQuery.data) {
      setProduct(getProductQuery.data as Product);
    }
  }, [getProductQuery.data]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }

    if (!product) return;

    setIsLoading(true);
    try {
      const result = await createCheckoutMutation.mutateAsync({
        productId: product.id,
        origin: window.location.origin,
        quantity,
      });

      if (result.url) {
        window.open(result.url, "_blank");
        toast.success("Opening checkout...");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to proceed to checkout");
    } finally {
      setIsLoading(false);
    }
  };

  if (getProductQuery.isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <nav className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
          <div className="container flex items-center justify-between h-16">
            <button
              onClick={() => setLocation("/shop")}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>
          </div>
        </nav>
        <div className="container py-12 text-center">
          <p className="text-lg text-muted-foreground">Product not found</p>
          <Button
            className="mt-4"
            onClick={() => setLocation("/shop")}
          >
            Back to Shop
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <button
            onClick={() => setLocation("/shop")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium">Back to Shop</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-display font-bold">Nail'd</h1>
          </div>
          <div className="w-32" />
        </div>
      </nav>

      {/* Product Detail */}
      <section className="py-12">
        <div className="container max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="flex items-center justify-center">
              <div className="aspect-square w-full max-w-md bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                {product.trending && (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-accent text-accent-foreground text-xs font-bold rounded">
                    TRENDING
                  </div>
                )}
                <Sparkles className="w-24 h-24 text-accent/30" />
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-semibold text-accent uppercase">
                    {product.category}
                  </span>
                  {product.trending && (
                    <span className="text-xs px-2 py-1 bg-accent/10 text-accent rounded">
                      Trending
                    </span>
                  )}
                </div>
                <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">
                  {product.name}
                </h1>
                <p className="text-lg text-muted-foreground">
                  {product.description}
                </p>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Price</p>
                <div className="text-4xl font-bold text-accent">
                  ${(product.price / 100).toFixed(2)}
                </div>
              </div>

              {/* Features */}
              {product.features && product.features.length > 0 && (
                <div className="space-y-3">
                  <p className="font-semibold">What's Included:</p>
                  <ul className="space-y-2">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-accent flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Quantity Selector */}
              {product.category !== "subscription" && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold">Quantity</p>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded border border-border hover:border-accent transition-colors flex items-center justify-center"
                    >
                      −
                    </button>
                    <span className="text-lg font-semibold w-8 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded border border-border hover:border-accent transition-colors flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* CTA */}
              <Button
                size="lg"
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                onClick={handleAddToCart}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : product.category === "subscription" ? (
                  "Subscribe Now"
                ) : (
                  "Add to Cart"
                )}
              </Button>

              {/* Additional Info */}
              <Card className="border-0 bg-secondary/5">
                <CardHeader>
                  <CardTitle className="text-base">Free Shipping</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    All orders ship free worldwide. Delivery within 7-14 business days.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="py-16 bg-secondary/5">
        <div className="container">
          <h2 className="text-3xl font-display font-bold mb-8">You Might Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow cursor-pointer">
                <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center rounded-t-lg">
                  <Sparkles className="w-12 h-12 text-accent/30" />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">Related Product {idx}</CardTitle>
                  <CardDescription>Premium nail art collection</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-accent">$12.99</span>
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
