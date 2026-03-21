import { useEffect, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Loader2, Sparkles } from "lucide-react";
import { useLocation, useSearch } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Checkout() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const search = useSearch();
  const [selectedTier, setSelectedTier] = useState<"monthly" | "quarterly" | "biannual" | "annual" | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const createCheckoutMutation = trpc.stripe.createCheckoutSession.useMutation();

  useEffect(() => {
    // Parse tier from URL if available
    const params = new URLSearchParams(search);
    const tier = params.get("tier");
    if (tier === "monthly" || tier === "quarterly" || tier === "biannual" || tier === "annual") {
      setSelectedTier(tier);
    }
  }, [search]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>Please sign in to complete your subscription</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full"
              onClick={() => setLocation("/")}
            >
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleCheckout = async () => {
    if (!selectedTier) {
      toast.error("Please select a subscription tier");
      return;
    }

    setIsLoading(true);
    try {
      const result = await createCheckoutMutation.mutateAsync({
        tier: selectedTier,
        origin: window.location.origin,
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

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <button
            onClick={() => setLocation("/subscribe")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
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
              <CardTitle className="text-2xl">Complete Your Subscription</CardTitle>
              <CardDescription>
                Review your selection and proceed to payment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Order Summary */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Order Summary</h3>
                {selectedTier && (
                  <div className="border border-border rounded-lg p-4 space-y-3">
                    {selectedTier === "monthly" && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Keep it casual (1 Month)</span>
                          <span className="font-semibold">$34.50</span>
                        </div>
                        <p className="text-sm text-muted-foreground">3 nail wrap kits + mini files</p>
                      </>
                    )}
                    {selectedTier === "quarterly" && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Friends with benefits (3 Months)</span>
                          <span className="font-semibold">$99.00</span>
                        </div>
                        <p className="text-sm text-muted-foreground">$33/month • 3 nail wrap kits + mini files per month</p>
                      </>
                    )}
                    {selectedTier === "biannual" && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Committed (6 Months)</span>
                          <span className="font-semibold">$189.00</span>
                        </div>
                        <p className="text-sm text-muted-foreground">$31.50/month • 3 nail wrap kits + mini files per month</p>
                      </>
                    )}
                    {selectedTier === "annual" && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Ride or die (12 Months)</span>
                          <span className="font-semibold">$360.00</span>
                        </div>
                        <p className="text-sm text-muted-foreground">$30/month • 3 nail wrap kits + mini files per month</p>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* What's Included */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">What's Included</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                    3 nail wrap kits delivered monthly
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                    Mini nail files included
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                    Free shipping worldwide
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                    Exclusive designs
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                    Cancel anytime (month-to-month only)
                  </li>
                </ul>
              </div>

              {/* Payment Info */}
              <div className="bg-secondary/5 rounded-lg p-4 space-y-2">
                <p className="text-sm font-medium text-foreground">Secure Payment</p>
                <p className="text-sm text-muted-foreground">
                  We use Stripe to securely process your payment. Your card information is never stored on our servers.
                </p>
              </div>

              {/* CTA Button */}
              <Button
                size="lg"
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                onClick={handleCheckout}
                disabled={isLoading || !selectedTier}
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
          <p>&copy; 2026 Piggy Nails. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
