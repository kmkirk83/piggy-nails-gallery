import { useEffect, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Loader2, Sparkles, Lock } from "lucide-react";
import { useLocation, useSearch } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";
import { Capacitor } from "@capacitor/core";

const PRODUCTION_URL = 'https://naild.manus.space';

// Use production URL as origin in Capacitor so Stripe can redirect back correctly
const getCheckoutOrigin = () =>
  Capacitor.isNativePlatform() ? PRODUCTION_URL : window.location.origin;

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  features?: string[];
}

export default function Checkout() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const search = useSearch();
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const createCheckoutMutation = trpc.stripe.createCheckoutSession.useMutation();
  const getProductQuery = trpc.stripe.getProduct.useQuery(selectedProductId || "", {
    enabled: !!selectedProductId && isAuthenticated,
  });

  useEffect(() => {
    // Parse product ID from URL
    const params = new URLSearchParams(search);
    const productId = params.get("product") || params.get("tier");

    // Map old tier names to new product IDs
    const tierMap: Record<string, string> = {
      monthly: "starter-monthly",
      quarterly: "trendsetter-quarterly",
      biannual: "vip-biannual",
      annual: "elite-annual",
    };

    const mappedId = tierMap[productId || ""] || productId;
    if (mappedId) {
      setSelectedProductId(mappedId);
    }
  }, [search]);

  useEffect(() => {
    if (getProductQuery.data) {
      setProduct(getProductQuery.data as Product);
    }
  }, [getProductQuery.data]);

  // Auth gate — shown ONLY at checkout, not during browsing
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6 text-accent" />
            </div>
            <CardTitle>Sign In to Complete Your Order</CardTitle>
            <CardDescription>
              You're almost there! Sign in to securely complete your purchase.
              Your cart items will be waiting.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
              onClick={() => { window.location.href = getLoginUrl(); }}
            >
              Sign In &amp; Continue
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setLocation("/gallery")}
            >
              Keep Browsing
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleCheckout = async () => {
    if (!selectedProductId) {
      toast.error("Please select a product");
      return;
    }

    setIsLoading(true);
    try {
      const result = await createCheckoutMutation.mutateAsync({
        productId: selectedProductId,
        origin: getCheckoutOrigin(),
      });

      if (result.url) {
        // Open checkout in new tab
        window.open(result.url, "_blank");
        toast.success("Redirecting to checkout...");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to create checkout session. Please try again.");
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Product Not Found</CardTitle>
            <CardDescription>The product you're looking for doesn't exist</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full"
              onClick={() => setLocation("/shop")}
            >
              Back to Shop
            </Button>
          </CardContent>
        </Card>
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
            <span className="font-medium">Back</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-display font-bold">Checkout</h1>
          </div>
          <div className="w-20" />
        </div>
      </nav>

      {/* Checkout Content */}
      <section className="py-12">
        <div className="container max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Complete Your Order</CardTitle>
              <CardDescription>
                Review your selection and proceed to payment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Order Summary */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Order Summary</h3>
                <div className="border border-border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-foreground">{product.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {product.description}
                      </p>
                    </div>
                    <span className="font-semibold text-lg text-accent">
                      ${(product.price / 100).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* What's Included */}
              {product.features && product.features.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">What's Included</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-accent" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Payment Info */}
              <div className="bg-secondary/5 rounded-lg p-4 space-y-2">
                <p className="text-sm font-medium text-foreground">Secure Payment</p>
                <p className="text-sm text-muted-foreground">
                  We use Stripe to securely process your payment. Your card information is never stored on our servers.
                </p>
              </div>

              {/* Total */}
              <div className="border-t border-border pt-4">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-2xl font-bold text-accent">
                    ${(product.price / 100).toFixed(2)}
                  </span>
                </div>

                {/* CTA Button */}
                <Button
                  size="lg"
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                  onClick={handleCheckout}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Proceed to Payment"
                  )}
                </Button>
              </div>

              {/* Terms */}
              <p className="text-xs text-muted-foreground text-center">
                By clicking "Proceed to Payment", you agree to our Terms of Service and Privacy Policy.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-background mt-12">
        <div className="container text-center text-sm text-muted-foreground">
          <p>&copy; 2026 Nail'd. Premium trending nail art delivered.</p>
        </div>
      </footer>
    </div>
  );
}
