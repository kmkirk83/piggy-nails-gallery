import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronRight, Star } from "lucide-react";
import { useLocation } from "wouter";
import LuxuryNav from "@/components/LuxuryNav";

export default function LuxuryHome() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    document.title = "Nail'd - Premium Nail Art & Subscription Boxes";
  }, []);

  const featuredDesigns = [
    {
      id: 1,
      name: "Checkmate Nail Wraps",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/B98P4q7Eu5xg_092370d6.jpg",
      price: "$12.99",
    },
    {
      id: 2,
      name: "3D Blossom Nail Art",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/hjPLR7GAeXxS_2f36a687.jpg",
      price: "$14.99",
    },
    {
      id: 3,
      name: "3D Blossom Collection",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/qx6uSZMlysqb_8d98a6c3.jpg",
      price: "$14.99",
    },
    {
      id: 4,
      name: "3D Heart Nail Art",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/lA0O7S1CNf0T_6b494785.jpg",
      price: "$13.99",
    },
  ];

  const subscriptionTiers = [
    {
      name: "Starter",
      price: "$34.99",
      period: "Monthly",
      items: ["3 nail wrap kits", "Mini nail files", "Exclusive designs"],
    },
    {
      name: "Trendsetter",
      price: "$99.99",
      period: "Quarterly",
      items: ["3 kits per month", "Premium files", "Exclusive access"],
      featured: true,
    },
    {
      name: "VIP",
      price: "$189.99",
      period: "6 Months",
      items: ["4 kits monthly", "Premium support", "Free aftercare kit"],
    },
    {
      name: "Elite",
      price: "$360.00",
      period: "Yearly",
      items: ["4 kits monthly", "VIP support", "Exclusive events"],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <LuxuryNav />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <p className="text-accent font-display text-lg tracking-widest uppercase">
              Luxury Nail Art
            </p>
            <h1 className="text-6xl md:text-7xl font-display font-bold text-foreground leading-tight">
              Salon Quality.
              <br />
              <span className="text-accent">At Home.</span>
            </h1>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed">
              Curated collections of trending nail wraps inspired by luxury fashion. Subscribe monthly or shop individual designs.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button
              size="lg"
              onClick={() => setLocation("/subscribe")}
              className="bg-accent hover:bg-accent/90 text-background font-display text-lg px-8 py-6 rounded-sm"
            >
              Subscribe Now
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setLocation("/gallery")}
              className="border-accent text-accent hover:bg-accent/10 font-display text-lg px-8 py-6 rounded-sm"
            >
              Shop Designs
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Designs */}
      <section className="py-20 px-6 border-t border-accent/10">
        <div className="container">
          <div className="text-center mb-16">
            <p className="text-accent font-display text-sm tracking-widest uppercase mb-2">
              Trending Now
            </p>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground">
              Featured Collections
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDesigns.map((design) => (
              <Card
                key={design.id}
                className="group overflow-hidden bg-card/50 border-accent/10 hover:border-accent/30 transition-all cursor-pointer"
                onClick={() => setLocation("/gallery")}
              >
                <div className="aspect-square overflow-hidden bg-muted">
                  <img
                    src={design.image}
                    alt={design.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="font-display text-lg text-foreground font-semibold">
                    {design.name}
                  </h3>
                  <p className="text-accent font-semibold text-lg">{design.price}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Subscription Tiers */}
      <section className="py-20 px-6 border-t border-accent/10">
        <div className="container">
          <div className="text-center mb-16">
            <p className="text-accent font-display text-sm tracking-widest uppercase mb-2">
              Subscription Plans
            </p>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground">
              Choose Your Plan
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {subscriptionTiers.map((tier) => (
              <Card
                key={tier.name}
                className={`p-8 border transition-all ${
                  tier.featured
                    ? "border-accent bg-accent/5 ring-2 ring-accent/30"
                    : "border-accent/10 bg-card/50 hover:border-accent/30"
                }`}
              >
                {tier.featured && (
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="w-4 h-4 fill-accent text-accent" />
                    <span className="text-xs font-display text-accent uppercase tracking-widest">
                      Most Popular
                    </span>
                  </div>
                )}
                <h3 className="text-2xl font-display font-bold text-foreground mb-2">
                  {tier.name}
                </h3>
                <p className="text-foreground/60 text-sm mb-6">{tier.period}</p>
                <p className="text-4xl font-display font-bold text-accent mb-8">
                  {tier.price}
                </p>
                <ul className="space-y-3 mb-8">
                  {tier.items.map((item) => (
                    <li key={item} className="text-sm text-foreground/70 flex items-start gap-3">
                      <span className="text-accent mt-1">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => setLocation("/subscribe")}
                  className={`w-full rounded-sm font-display uppercase tracking-wide ${
                    tier.featured
                      ? "bg-accent text-background hover:bg-accent/90"
                      : "border border-accent/30 text-accent hover:bg-accent/10"
                  }`}
                  variant={tier.featured ? "default" : "outline"}
                >
                  Subscribe
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 border-t border-accent/10">
        <div className="container max-w-3xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground">
              Ready to Transform Your Nails?
            </h2>
            <p className="text-lg text-foreground/70">
              Join thousands of customers enjoying salon-quality nail art at home.
            </p>
          </div>
          <Button
            size="lg"
            onClick={() => setLocation("/subscribe")}
            className="bg-accent hover:bg-accent/90 text-background font-display text-lg px-12 py-6 rounded-sm"
          >
            Start Your Subscription
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-accent/10 py-12 px-6">
        <div className="container text-center text-foreground/60 text-sm">
          <p>&copy; 2026 Nail'd. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
