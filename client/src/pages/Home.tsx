import { useAuth } from "@/_core/hooks/useAuth";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, Sparkles, Zap, Heart, Crown } from "lucide-react";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    document.title = "Nail'd - Premium Nail Art & Subscription Boxes";
  }, []);

  const subscriptionTiers = [
    {
      id: "monthly",
      name: "Starter",
      duration: "1 Month",
      price: "$34.99",
      savings: "Save 15%",
      description: "3 nail wrap kits + mini nail files",
      icon: Sparkles,
    },
    {
      id: "quarterly",
      name: "Trendsetter",
      duration: "3 Months",
      price: "$99.99",
      savings: "Save 20%",
      description: "3 nail wrap kits + mini nail files per month + exclusive access",
      featured: true,
      icon: Zap,
    },
    {
      id: "biannual",
      name: "VIP",
      duration: "6 Months",
      price: "$189.99",
      savings: "Save 25%",
      description: "4 nail wrap kits + premium files + exclusive designs",
      icon: Heart,
    },
    {
      id: "annual",
      name: "Elite",
      duration: "12 Months",
      price: "$360.00",
      savings: "Save 30%",
      description: "4 kits monthly + premium support + free aftercare kit",
      icon: Crown,
    },
  ];

  const featuredDesigns = [
    {
      id: 1,
      name: "Checkmate Nail Wraps",
      category: "Trending",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/B98P4q7Eu5xg_092370d6.jpg",
    },
    {
      id: 2,
      name: "3D Blossom Nail Art",
      category: "Elegant",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/hjPLR7GAeXxS_2f36a687.jpg",
    },
    {
      id: 3,
      name: "3D Blossom Collection",
      category: "Nature",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/qx6uSZMlysqb_8d98a6c3.jpg",
    },
    {
      id: 4,
      name: "3D Heart Nail Art",
      category: "Sparkle",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/lA0O7S1CNf0T_6b494785.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Nail'd
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLocation("/gallery")}
              className="text-sm font-medium hover:text-accent transition-colors"
            >
              Shop
            </button>
            <button
              onClick={() => setLocation("/studio")}
              className="text-sm font-medium hover:text-accent transition-colors"
            >
              Design Studio
            </button>
            <button
              onClick={() => setLocation("/subscribe")}
              className="text-sm font-medium hover:text-accent transition-colors"
            >
              Subscribe
            </button>
            {isAuthenticated ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setLocation("/account")}
              >
                Account
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => (window.location.href = getLoginUrl())}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-block px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
              <p className="text-sm font-medium text-accent">
                ✨ Trending Designs Every Month
              </p>
            </div>
            <h2 className="text-5xl md:text-7xl font-display font-bold leading-tight">
              Premium Nail Art,{" "}
              <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                Delivered
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Curated collections of trending nail wraps inspired by TikTok and Instagram. Subscribe monthly or shop individual designs. Salon-quality nails at home.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
                onClick={() => setLocation("/subscribe")}
              >
                Start Subscription
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setLocation("/gallery")}
              >
                Shop One-Time
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Designs */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-display font-bold mb-3">
              This Month's Trending
            </h3>
            <p className="text-muted-foreground text-lg">
              Handpicked designs from the top creators
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDesigns.map((design) => (
              <div
                key={design.id}
                className="group cursor-pointer"
                onClick={() => setLocation("/gallery")}
              >
                <div className="relative overflow-hidden rounded-lg aspect-square mb-4 bg-secondary/10">
                  <img
                    src={design.image}
                    alt={design.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                </div>
                <h4 className="font-semibold text-foreground">{design.name}</h4>
                <p className="text-sm text-accent">{design.category}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscription Tiers */}
      <section className="py-16 md:py-24 bg-secondary/5">
        <div className="container">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-display font-bold mb-3">
              Choose Your Plan
            </h3>
            <p className="text-muted-foreground text-lg">
              Flexible subscriptions that fit your style
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {subscriptionTiers.map((tier) => {
              const IconComponent = tier.icon;
              return (
                <Card
                  key={tier.id}
                  className={`relative transition-all ${
                    tier.featured
                      ? "ring-2 ring-accent scale-105 md:scale-110"
                      : ""
                  }`}
                >
                  {tier.featured && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-accent text-accent-foreground text-xs font-bold rounded-full">
                      MOST POPULAR
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-xl">{tier.name}</CardTitle>
                      <IconComponent className="w-5 h-5 text-accent" />
                    </div>
                    <CardDescription>{tier.duration}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="text-3xl font-bold text-accent">
                        {tier.price}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {tier.savings}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {tier.description}
                    </p>
                    <Button
                      className="w-full"
                      variant={tier.featured ? "default" : "outline"}
                      onClick={() => {
                        if (!isAuthenticated) {
                          window.location.href = getLoginUrl();
                        } else {
                          setLocation(`/checkout?tier=${tier.id}`);
                        }
                      }}
                    >
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Nail'd */}
      <section className="py-16 md:py-24">
        <div className="container">
          <h3 className="text-3xl md:text-4xl font-display font-bold text-center mb-12">
            Why Choose Nail'd
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 bg-secondary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-accent" />
                  Trending Designs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Curated collections updated monthly from top TikTok and Instagram creators
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 bg-secondary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-accent" />
                  Premium Quality
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Salon-quality nail wraps with long-lasting wear and vibrant colors
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 bg-secondary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-accent" />
                  Easy Application
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Simple DIY application with included files and aftercare kits available
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="container text-center space-y-6">
          <h3 className="text-3xl md:text-4xl font-display font-bold">
            Ready to Nail It?
          </h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of nail art lovers getting trending designs delivered to their door
          </p>
          <Button
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
            onClick={() => {
              if (!isAuthenticated) {
                window.location.href = getLoginUrl();
              } else {
                setLocation("/subscribe");
              }
            }}
          >
            Start Your Subscription Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-display font-bold mb-4">Nail'd</h4>
              <p className="text-sm text-muted-foreground">
                Premium trending nail art delivered monthly
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Shop</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <button
                    onClick={() => setLocation("/gallery")}
                    className="hover:text-accent transition-colors"
                  >
                    Browse Designs
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setLocation("/gallery?category=trending")}
                    className="hover:text-accent transition-colors"
                  >
                    Trending
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Subscriptions</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <button
                    onClick={() => setLocation("/subscribe")}
                    className="hover:text-accent transition-colors"
                  >
                    Plans
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setLocation("/subscribe#faq")}
                    className="hover:text-accent transition-colors"
                  >
                    FAQ
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Support</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Contact: hello@naild.com</li>
                <li>
                  <button className="hover:text-accent transition-colors">
                    Help Center
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2026 Nail'd. All rights reserved. | Premium nail art delivered.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
