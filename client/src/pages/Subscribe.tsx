import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Check, Sparkles, Zap, Heart, Crown } from "lucide-react";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";

const subscriptionTiers = [
  {
    id: "monthly",
    name: "Starter",
    duration: "1 Month",
    price: 34.99,
    savings: "Save 15%",
    billingCycle: "every month",
    description: "Perfect for trying trending designs",
    icon: Sparkles,
    features: [
      "3 nail wrap kits per month",
      "20 wraps per kit (60 total)",
      "Mini nail files included",
      "Free worldwide shipping",
      "Cancel anytime",
    ],
  },
  {
    id: "quarterly",
    name: "Trendsetter",
    duration: "3 Months",
    price: 99.99,
    savings: "Save 20%",
    billingCycle: "every 3 months",
    description: "Best for nail art enthusiasts",
    icon: Zap,
    features: [
      "3 nail wrap kits per month",
      "20 wraps per kit (60 total)",
      "Mini nail files included",
      "Free worldwide shipping",
      "Exclusive design access",
      "Early access to new collections",
    ],
    featured: true,
  },
  {
    id: "biannual",
    name: "VIP",
    duration: "6 Months",
    price: 189.99,
    savings: "Save 25%",
    billingCycle: "every 6 months",
    description: "Premium experience for dedicated fans",
    icon: Heart,
    features: [
      "4 nail wrap kits per month",
      "20 wraps per kit (80 total)",
      "Premium nail files included",
      "Free worldwide shipping",
      "Exclusive designs",
      "Early access to new collections",
      "Priority customer support",
      "Quarterly bonus designs",
    ],
  },
  {
    id: "annual",
    name: "Elite",
    duration: "12 Months",
    price: 360.00,
    savings: "Save 30%",
    billingCycle: "every 12 months",
    description: "Maximum value and exclusive perks",
    icon: Crown,
    features: [
      "4 nail wrap kits per month",
      "20 wraps per kit (80 total)",
      "Premium nail files included",
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

const faqs = [
  {
    question: "How often do designs change?",
    answer:
      "We curate new trending designs every month, inspired by TikTok and Instagram creators. You'll always get fresh, on-trend styles.",
  },
  {
    question: "Can I cancel my subscription?",
    answer:
      "Yes! You can cancel anytime, no questions asked. Your subscription will end at the end of your current billing cycle.",
  },
  {
    question: "What if I don't like the designs?",
    answer:
      "We offer a 30-day satisfaction guarantee. If you're not happy, we'll refund your subscription or send you alternative designs.",
  },
  {
    question: "How long do the nail wraps last?",
    answer:
      "Our premium nail wraps last 7-14 days depending on your nail care routine. We include aftercare tips with every box.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Yes! We ship worldwide with free shipping on all subscriptions. Orders typically arrive within 7-14 business days.",
  },
  {
    question: "Can I pause my subscription?",
    answer:
      "Absolutely! You can pause your subscription for up to 3 months and resume whenever you're ready.",
  },
];

export default function Subscribe() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedTier, setSelectedTier] = useState("quarterly");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

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
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-display font-bold">Nail'd Subscriptions</h1>
          </div>
          <div className="w-20" />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-background to-primary/5">
        <div className="container max-w-4xl">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl md:text-5xl font-display font-bold">
              Choose Your Nail'd Plan
            </h2>
            <p className="text-lg text-muted-foreground">
              Trending designs delivered monthly. Flexible plans for every style.
            </p>
          </div>

          {/* Subscription Tiers */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {subscriptionTiers.map((tier) => {
              const IconComponent = tier.icon;
              const isSelected = selectedTier === tier.id;
              return (
                <Card
                  key={tier.id}
                  className={`relative cursor-pointer transition-all ${
                    isSelected ? "ring-2 ring-accent" : ""
                  } ${tier.featured ? "lg:scale-105" : ""}`}
                  onClick={() => setSelectedTier(tier.id)}
                >
                  {tier.featured && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-accent text-accent-foreground text-xs font-bold rounded-full">
                      MOST POPULAR
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-lg">{tier.name}</CardTitle>
                      <IconComponent className="w-5 h-5 text-accent" />
                    </div>
                    <CardDescription>{tier.duration}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <div className="text-2xl font-bold text-accent">
                        {tier.price === Math.floor(tier.price)
                          ? `$${tier.price}`
                          : `$${tier.price.toFixed(2)}`}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {tier.savings}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {tier.description}
                    </p>
                    <Button
                      className="w-full"
                      variant={isSelected ? "default" : "outline"}
                      onClick={() => handleSubscribe(tier.id)}
                    >
                      Select Plan
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Selected Tier Details */}
          {selectedTier && (
            <Card className="mb-12 border-accent/50 bg-accent/5">
              <CardHeader>
                <CardTitle className="text-2xl">
                  {subscriptionTiers.find((t) => t.id === selectedTier)?.name}{" "}
                  Plan
                </CardTitle>
                <CardDescription>
                  {
                    subscriptionTiers.find((t) => t.id === selectedTier)
                      ?.description
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">What's Included:</h4>
                    <ul className="space-y-2">
                      {subscriptionTiers
                        .find((t) => t.id === selectedTier)
                        ?.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                  <div className="bg-background rounded-lg p-6 space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Billing Cycle
                      </p>
                      <p className="font-semibold">
                        {
                          subscriptionTiers.find((t) => t.id === selectedTier)
                            ?.billingCycle
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Total Price
                      </p>
                      <p className="text-2xl font-bold text-accent">
                        $
                        {subscriptionTiers
                          .find((t) => t.id === selectedTier)
                          ?.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                  onClick={() => setLocation(`/checkout?tier=${selectedTier}`)}
                >
                  Continue to Checkout
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-secondary/5">
        <div className="container max-w-3xl">
          <h3 className="text-3xl md:text-4xl font-display font-bold text-center mb-12">
            Frequently Asked Questions
          </h3>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <Card
                key={idx}
                className="cursor-pointer hover:border-accent/50 transition-colors"
                onClick={() =>
                  setExpandedFaq(expandedFaq === idx ? null : idx)
                }
              >
                <CardHeader>
                  <CardTitle className="text-base flex items-center justify-between">
                    {faq.question}
                    <span className="text-accent text-xl">
                      {expandedFaq === idx ? "−" : "+"}
                    </span>
                  </CardTitle>
                </CardHeader>
                {expandedFaq === idx && (
                  <CardContent>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container text-center space-y-6">
          <h3 className="text-3xl md:text-4xl font-display font-bold">
            Ready to Get Started?
          </h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of nail art lovers getting trending designs delivered
            to their door every month.
          </p>
          <Button
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
            onClick={() => setLocation(`/checkout?tier=${selectedTier}`)}
          >
            Start Your Subscription
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-background">
        <div className="container text-center text-sm text-muted-foreground">
          <p>&copy; 2026 Nail'd. Premium trending nail art delivered monthly.</p>
        </div>
      </footer>
    </div>
  );
}
