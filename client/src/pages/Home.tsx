import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, Sparkles } from "lucide-react";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  const subscriptionTiers = [
    {
      id: "monthly",
      name: "Keep it casual",
      duration: "1 Month",
      price: "$34.50",
      savings: "23%",
      description: "3 nail wrap kits + mini nail files",
    },
    {
      id: "quarterly",
      name: "Friends with benefits",
      duration: "3 Months",
      price: "$99",
      savings: "27%",
      description: "3 nail wrap kits + mini nail files per month",
      featured: true,
    },
    {
      id: "biannual",
      name: "Committed",
      duration: "6 Months",
      price: "$189",
      savings: "30%",
      description: "3 nail wrap kits + mini nail files per month",
    },
    {
      id: "annual",
      name: "Ride or die",
      duration: "12 Months",
      price: "$360",
      savings: "33%",
      description: "3 nail wrap kits + mini nail files per month",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-display font-bold text-foreground">Piggy Nails</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLocation("/gallery")}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Gallery
            </button>
            {isAuthenticated ? (
              <button
                onClick={() => setLocation("/account")}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                Account
              </button>
            ) : (
              <a href={getLoginUrl()}>
                <Button size="sm" variant="default">
                  Sign In
                </Button>
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-5xl md:text-6xl font-display font-bold text-foreground leading-tight">
                  Nail Art
                  <span className="block text-primary">Every Month</span>
                </h2>
                <p className="text-lg text-muted-foreground max-w-md">
                  Discover fresh, stunning nail designs delivered to your door. Subscribe to our monthly nail wrap collection and express yourself with every manicure.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={() => setLocation("/subscribe")}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Subscribe Now
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setLocation("/gallery")}
                >
                  View Gallery
                </Button>
              </div>
            </div>
            <div className="relative h-96 md:h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl" />
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/aXImH6bF4dK2_18cf2855.jpg"
                alt="Piggy Nails Studio"
                className="w-full h-full object-cover rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>

        {/* Decorative gold line */}
        <div className="h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
      </section>

      {/* How It Works */}
      <section className="py-20 bg-secondary/5">
        <div className="container">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-display font-bold text-foreground mb-4">
              How It Works
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to get your nails looking fabulous every month
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Choose Your Plan",
                description: "Select a subscription that fits your style and budget",
              },
              {
                step: "2",
                title: "Receive Monthly",
                description: "Get 3 nail wrap kits + files delivered each month",
              },
              {
                step: "3",
                title: "Enjoy & Repeat",
                description: "Apply your wraps and enjoy beautiful nails all month long",
              },
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                      <span className="text-2xl font-display font-bold text-accent">
                        {item.step}
                      </span>
                    </div>
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
                {idx < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-px bg-accent/30" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscription Tiers */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-display font-bold text-foreground mb-4">
              Choose Your Plan
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The longer you commit, the more you save. All plans include free shipping.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {subscriptionTiers.map((tier) => (
              <Card
                key={tier.id}
                className={`relative border transition-all ${
                  tier.featured
                    ? "border-accent shadow-lg scale-105"
                    : "border-border/50 hover:border-accent/50"
                }`}
              >
                {tier.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader className="pt-8">
                  <CardTitle className="text-lg">{tier.name}</CardTitle>
                  <CardDescription>{tier.duration}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="text-4xl font-display font-bold text-foreground">
                      {tier.price}
                    </div>
                    <p className="text-sm text-accent font-medium mt-2">
                      Save {tier.savings}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">{tier.description}</p>
                  <Button
                    className={`w-full ${
                      tier.featured
                        ? "bg-accent hover:bg-accent/90 text-accent-foreground"
                        : "bg-primary hover:bg-primary/90 text-primary-foreground"
                    }`}
                    onClick={() => setLocation("/subscribe")}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Designs */}
      <section className="py-20 bg-secondary/5">
        <div className="container">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-display font-bold text-foreground mb-4">
              Featured Designs
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our curated collection of nail art designs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Geometric Patterns",
                image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/B98P4q7Eu5xg_092370d6.jpg",
              },
              {
                title: "Floral Designs",
                image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/hjPLR7GAeXxS_2f36a687.jpg",
              },
              {
                title: "Seasonal Collections",
                image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/QFIFJu3FSsLE_c546cf86.jpg",
              },
            ].map((design, idx) => (
              <div
                key={idx}
                className="group cursor-pointer overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all"
                onClick={() => setLocation("/gallery")}
              >
                <div className="relative h-64 overflow-hidden bg-muted">
                  <img
                    src={design.image}
                    alt={design.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h4 className="text-lg font-display font-bold text-white">
                    {design.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              variant="outline"
              onClick={() => setLocation("/gallery")}
            >
              View All Designs
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="container text-center">
          <h3 className="text-4xl font-display font-bold text-foreground mb-6">
            Ready to Transform Your Nails?
          </h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Join thousands of nail art enthusiasts who love receiving fresh designs every month.
          </p>
          <Button
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
            onClick={() => setLocation("/subscribe")}
          >
            Start Your Subscription
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-background">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-display font-bold text-foreground mb-4">Piggy Nails</h4>
              <p className="text-sm text-muted-foreground">
                Premium nail art subscriptions delivered monthly.
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-foreground mb-4">Shop</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <button
                    onClick={() => setLocation("/gallery")}
                    className="hover:text-primary transition-colors"
                  >
                    Gallery
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setLocation("/subscribe")}
                    className="hover:text-primary transition-colors"
                  >
                    Subscribe
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-foreground mb-4">Support</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-foreground mb-4">Follow</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    TikTok
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2026 Piggy Nails. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
