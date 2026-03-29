import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-background">
      <LuxuryNav />

      {/* Hero Section with Full-Screen Image Background */}
      <section 
        className="relative h-screen pt-32 flex items-center justify-start overflow-hidden"
        style={{
          backgroundImage: `url('https://d2xsxph8kpxj0f.cloudfront.net/310519663459203647/dRb95yLqjVJjURAkEbJK85/lA0O7S1CNf0T_6b494785.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center right',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-transparent"></div>
        
        {/* Hero Content */}
        <div className="container relative z-10 max-w-2xl space-y-8">
          <div className="space-y-6">
            <p className="text-accent font-display text-lg tracking-widest uppercase">
              Luxury Nail Art
            </p>
            <h1 className="text-6xl md:text-7xl font-display font-bold text-foreground leading-tight">
              Beyond
              <br />
              <span className="italic">Salon.</span>
            </h1>
            <p className="text-xl text-foreground/80 max-w-xl leading-relaxed">
              Engineered for 18-day wear. Hand-painted aesthetics. The world's first truly sustainable luxury press-on.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-8">
            <Button
              size="lg"
              onClick={() => setLocation("/gallery")}
              className="bg-white hover:bg-white/90 text-background font-display text-lg px-8 py-6 rounded-sm font-semibold"
            >
              Shop The Drop
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setLocation("/studio")}
              className="border-foreground/30 text-foreground hover:bg-foreground/10 font-display text-lg px-8 py-6 rounded-sm"
            >
              Design Studio
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-20 px-6 bg-background border-t border-accent/10">
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
                className="group overflow-hidden bg-card/50 border-accent/20 hover:border-accent/50 transition-all cursor-pointer"
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

      {/* The Feed Section */}
      <section className="py-20 px-6 bg-background border-t border-accent/10">
        <div className="container">
          <div className="space-y-8">
            <div>
              <p className="text-accent font-display text-sm tracking-widest uppercase mb-4">
                Shop Our Socials
              </p>
              <h2 className="text-5xl md:text-6xl font-display font-bold text-foreground leading-tight">
                The
                <br />
                Feed
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card
                  key={i}
                  className="aspect-square overflow-hidden bg-muted border-accent/10 hover:border-accent/30 transition-all cursor-pointer group"
                >
                  <img
                    src={featuredDesigns[i - 1]?.image}
                    alt={`Feed ${i}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Card>
              ))}
            </div>

            <Button
              onClick={() => setLocation("/gallery")}
              className="w-full bg-accent hover:bg-accent/90 text-foreground font-display text-lg px-8 py-6 rounded-sm"
            >
              View All Designs
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-background border-t border-accent/10">
        <div className="container max-w-3xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground">
              Ready to Elevate Your Nails?
            </h2>
            <p className="text-lg text-foreground/70">
              Join thousands of customers enjoying salon-quality nail art at home.
            </p>
          </div>
          <Button
            size="lg"
            onClick={() => setLocation("/subscribe")}
            className="bg-accent hover:bg-accent/90 text-foreground font-display text-lg px-12 py-6 rounded-sm"
          >
            Subscribe Now
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
