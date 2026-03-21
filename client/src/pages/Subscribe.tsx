import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Check, Sparkles } from "lucide-react";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";

const subscriptionTiers = [
  {
    id: "monthly",
    name: "Keep it casual",
    duration: "1 Month",
    price: 34.50,
    savings: "23%",
    billingCycle: "every month",
    description: "Perfect for trying out our service",
    features: [
      "3 nail wrap kits per month",
      "Mini nail files included",
      "Free shipping",
      "Cancel anytime",
    ],
  },
  {
    id: "quarterly",
    name: "Friends with benefits",
    duration: "3 Months",
    price: 99.00,
    savings: "27%",
    billingCycle: "every 3 months",
    description: "Best for regular nail art lovers",
    features: [
      "3 nail wrap kits per month",
      "Mini nail files included",
      "Free shipping",
      "Exclusive designs",
      "Early access to new collections",
    ],
    featured: true,
  },
  {
    id: "biannual",
    name: "Committed",
    duration: "6 Months",
    price: 189.00,
    savings: "30%",
    billingCycle: "every 6 months",
    description: "Great value for dedicated fans",
    features: [
      "3 nail wrap kits per month",
      "Mini nail files included",
      "Free shipping",
      "Exclusive designs",
      "Early access to new collections",
      "Priority customer support",
    ],
  },
  {
    id: "annual",
    name: "Ride or die",
    duration: "12 Months",
    price: 360.00,
    savings: "33%",
    billingCycle: "every 12 months",
    description: "Maximum savings and commitment",
    features: [
      "3 nail wrap kits per month",
      "Mini nail files included",
      "Free shipping",
      "Exclusive designs",
      "Early access to new collections",
      "Priority customer support",
      "Exclusive annual gift",
    ],
  },
];

export default function Subscribe() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedTier, setSelectedTier] = useState("quarterly");

  const handleSubscribe = (tierId: string) => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    setLocation(`/checkout?tier=${tierId}`);
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
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-display font-bold">Subscribe</h1>
          </div>
          <div className="w-20" />
        </div>
      </nav>

      {/* Page Header */}
      <section className="py-12 border-b border-border">
        <div className="container text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
            Choose Your Plan
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select a subscription that works for you. All plans include 3 nail wrap kits and mini files delivered monthly.
          </p>
        </div>
      </section>

      {/* Subscription Tiers */}
      <section className="py-16">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {subscriptionTiers.map((tier) => (
              <Card
                key={tier.id}
                className={`relative border transition-all cursor-pointer ${
                  selectedTier === tier.id
                    ? tier.featured
                      ? "border-accent shadow-2xl scale-105 ring-2 ring-accent"
                      : "border-accent shadow-lg ring-2 ring-accent"
                    : tier.featured
                    ? "border-accent shadow-lg scale-105"
                    : "border-border/50 hover:border-accent/50"
                }`}
                onClick={() => setSelectedTier(tier.id)}
              >
                {tier.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader className={tier.featured ? "pt-8" : ""}>
                  <CardTitle className="text-xl">{tier.name}</CardTitle>
                  <CardDescription>{tier.duration}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="text-4xl font-display font-bold text-foreground">
                      ${tier.price.toFixed(2)}
                    </div>
                    <p className="text-sm text-accent font-medium mt-2">
                      Save {tier.savings}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Billed {tier.billingCycle}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {tier.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    className={`w-full ${
                      selectedTier === tier.id
                        ? tier.featured
                          ? "bg-accent hover:bg-accent/90 text-accent-foreground"
                          : "bg-primary hover:bg-primary/90 text-primary-foreground"
                        : tier.featured
                        ? "bg-accent/80 hover:bg-accent text-accent-foreground"
                        : "bg-muted hover:bg-muted/80 text-muted-foreground"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSubscribe(tier.id);
                    }}
                  >
                    {selectedTier === tier.id ? "Selected" : "Select Plan"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 bg-secondary/5">
        <div className="container">
          <h3 className="text-3xl font-display font-bold text-foreground mb-8 text-center">
            What's Included
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 font-semibold text-foreground">Feature</th>
                  {subscriptionTiers.map((tier) => (
                    <th
                      key={tier.id}
                      className="text-center py-4 px-4 font-semibold text-foreground"
                    >
                      {tier.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "Nail Wrap Kits/Month", value: "3" },
                  { label: "Mini Nail Files", value: "✓" },
                  { label: "Free Shipping", value: "✓" },
                  { label: "Exclusive Designs", value: "After 3 months" },
                  { label: "Early Access", value: "After 3 months" },
                  { label: "Priority Support", value: "After 6 months" },
                  { label: "Annual Gift", value: "12-month only" },
                ].map((row, idx) => (
                  <tr key={idx} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="py-4 px-4 font-medium text-foreground">{row.label}</td>
                    {subscriptionTiers.map((tier) => (
                      <td key={tier.id} className="text-center py-4 px-4 text-muted-foreground">
                        {row.value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container max-w-3xl">
          <h3 className="text-3xl font-display font-bold text-foreground mb-8 text-center">
            Frequently Asked Questions
          </h3>
          <div className="space-y-6">
            {[
              {
                q: "Can I cancel my subscription anytime?",
                a: "Yes! Month-to-month subscriptions can be canceled anytime. Pre-paid plans (3, 6, 12 months) cannot be canceled mid-term but you can opt-out of auto-renewal.",
              },
              {
                q: "When will I receive my first box?",
                a: "Your first box ships within 3-5 business days. Subsequent boxes ship on the first week of each month.",
              },
              {
                q: "What if I don't like the designs?",
                a: "We're confident you'll love our designs! If you're not satisfied, contact our support team and we'll work with you to make it right.",
              },
              {
                q: "Can I change my subscription plan?",
                a: "Yes, you can upgrade or downgrade your plan anytime from your account dashboard.",
              },
              {
                q: "Do you offer gift subscriptions?",
                a: "Absolutely! Gift subscriptions are available and come with a special gift card. Perfect for nail art lovers!",
              },
            ].map((faq, idx) => (
              <div key={idx} className="border border-border rounded-lg p-6">
                <h4 className="font-semibold text-foreground mb-2">{faq.q}</h4>
                <p className="text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="container text-center">
          <h3 className="text-3xl font-display font-bold text-foreground mb-4">
            Ready to Get Started?
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            {selectedTier && `You've selected the ${subscriptionTiers.find(t => t.id === selectedTier)?.name} plan.`}
          </p>
          <Button
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
            onClick={() => setLocation(`/checkout?tier=${selectedTier}`)}
          >
            Continue to Checkout
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
