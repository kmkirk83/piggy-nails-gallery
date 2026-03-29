import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, Star } from 'lucide-react';
import LuxuryNav from '@/components/LuxuryNav';

interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  billingPeriod: string;
  description: string;
  products: string[];
  features: string[];
  highlight: boolean;
  monthlyValue: string;
  savings: string;
}

const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: 'starter',
    name: 'Starter Box',
    price: 34.99,
    billingPeriod: '/month',
    description: 'Perfect for first-time nail enthusiasts',
    monthlyValue: '$45+',
    savings: 'Save 25%',
    highlight: false,
    products: [
      'Holographic Nail Wraps Set',
      'Chrome Mirror Nail Wraps',
      'Nail Art Rhinestones Mix',
      'Cuticle Oil Pen',
    ],
    features: [
      'Curated nail wraps',
      'Accessories included',
      'Free shipping',
      'Cancel anytime',
      'Monthly surprise item',
    ],
  },
  {
    id: 'trendsetter',
    name: 'Trendsetter Box',
    price: 49.99,
    billingPeriod: '/month',
    description: 'For the nail art enthusiasts',
    monthlyValue: '$75+',
    savings: 'Save 33%',
    highlight: true,
    products: [
      'Holographic Nail Wraps Set',
      'Press-On Nails Coffin',
      'Gel Polish Set 12 Colors',
      'Nail Art Decals Stickers',
      'Manicure Tool Kit 12pcs',
    ],
    features: [
      'Premium nail wraps',
      'Press-on nails',
      'Professional tools',
      'Gel polish set',
      'Priority shipping',
      'VIP community access',
      'Monthly tutorials',
    ],
  },
  {
    id: 'vip',
    name: 'VIP Box',
    price: 69.99,
    billingPeriod: '/month',
    description: 'The ultimate luxury nail experience',
    monthlyValue: '$110+',
    savings: 'Save 36%',
    highlight: false,
    products: [
      'Press-On Nails Stiletto',
      'Gel Nail Kit with LED Lamp',
      'Gel Polish Set 12 Colors',
      'Nail Buffer & File Set',
      'Base Coat & Top Coat Duo',
      'Nail Sticker Sheets',
      'Exclusive HUIZI design wrap',
    ],
    features: [
      'Premium press-on nails',
      'LED gel lamp included',
      'Professional gel kit',
      'Luxury packaging',
      'Express shipping',
      'Exclusive designs',
      'Personal nail stylist chat',
      'Early access to new products',
      '20% discount on extras',
    ],
  },
];

export default function Subscriptions() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'quarterly' | 'annual'>('monthly');

  const getPrice = (basePrice: number) => {
    switch (billingCycle) {
      case 'quarterly':
        return (basePrice * 3 * 0.9).toFixed(2); // 10% discount
      case 'annual':
        return (basePrice * 12 * 0.85).toFixed(2); // 15% discount
      default:
        return basePrice.toFixed(2);
    }
  };

  const getPricePerMonth = (basePrice: number) => {
    switch (billingCycle) {
      case 'quarterly':
        return ((basePrice * 3 * 0.9) / 3).toFixed(2);
      case 'annual':
        return ((basePrice * 12 * 0.85) / 12).toFixed(2);
      default:
        return basePrice.toFixed(2);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <LuxuryNav />

      {/* Header */}
      <section className="pt-32 pb-16 px-6 bg-background border-b border-accent/10">
        <div className="container max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-display font-bold text-foreground mb-4">
            Monthly Nail Subscriptions
          </h1>
          <p className="text-lg text-foreground/70 mb-8">
            Curated nail boxes delivered to your door every month. Cancel anytime.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-accent text-foreground'
                  : 'bg-card border border-accent/20 text-foreground/70 hover:text-foreground'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('quarterly')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                billingCycle === 'quarterly'
                  ? 'bg-accent text-foreground'
                  : 'bg-card border border-accent/20 text-foreground/70 hover:text-foreground'
              }`}
            >
              Quarterly <span className="text-xs ml-1 text-accent">-10%</span>
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                billingCycle === 'annual'
                  ? 'bg-accent text-foreground'
                  : 'bg-card border border-accent/20 text-foreground/70 hover:text-foreground'
              }`}
            >
              Annual <span className="text-xs ml-1 text-accent">-15%</span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 px-6 bg-background">
        <div className="container max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {SUBSCRIPTION_TIERS.map((tier) => (
              <Card
                key={tier.id}
                className={`relative overflow-hidden border transition-all ${
                  tier.highlight
                    ? 'border-accent/50 bg-card/80 ring-2 ring-accent/30'
                    : 'border-accent/20 bg-card/50'
                }`}
              >
                {/* Popular Badge */}
                {tier.highlight && (
                  <div className="absolute top-0 right-0 bg-accent text-foreground px-4 py-1 text-sm font-semibold">
                    MOST POPULAR
                  </div>
                )}

                <div className="p-8 space-y-6">
                  {/* Tier Name */}
                  <div>
                    <h3 className="text-2xl font-display font-bold text-foreground mb-2">
                      {tier.name}
                    </h3>
                    <p className="text-sm text-foreground/60">{tier.description}</p>
                  </div>

                  {/* Pricing */}
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-accent">
                        ${getPrice(tier.price)}
                      </span>
                      <span className="text-foreground/60">
                        {billingCycle === 'monthly' ? '/month' : `/${billingCycle}`}
                      </span>
                    </div>
                    {billingCycle !== 'monthly' && (
                      <p className="text-sm text-foreground/60">
                        ${getPricePerMonth(tier.price)}/month when billed {billingCycle}
                      </p>
                    )}
                    <p className="text-sm font-semibold text-accent">{tier.savings}</p>
                  </div>

                  {/* Value */}
                  <div className="bg-accent/10 rounded-lg p-3 text-center">
                    <p className="text-sm text-foreground/70">Monthly Value</p>
                    <p className="text-xl font-bold text-accent">{tier.monthlyValue}</p>
                  </div>

                  {/* CTA Button */}
                  <Button
                    className={`w-full py-3 font-semibold transition-all ${
                      tier.highlight
                        ? 'bg-accent hover:bg-accent/90 text-foreground'
                        : 'bg-foreground/10 hover:bg-foreground/20 text-foreground border border-accent/20'
                    }`}
                  >
                    Subscribe Now
                  </Button>

                  {/* Products */}
                  <div className="space-y-3 pt-4 border-t border-accent/10">
                    <p className="text-sm font-semibold text-foreground/70">This Month's Items:</p>
                    <ul className="space-y-2">
                      {tier.products.map((product, idx) => (
                        <li key={idx} className="text-sm text-foreground/60 flex items-start gap-2">
                          <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                          <span>{product}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 pt-4 border-t border-accent/10">
                    <p className="text-sm font-semibold text-foreground/70">Subscription Perks:</p>
                    <ul className="space-y-2">
                      {tier.features.map((feature, idx) => (
                        <li key={idx} className="text-sm text-foreground/60 flex items-start gap-2">
                          <Star className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-6 bg-background border-t border-accent/10">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-3xl font-display font-bold text-foreground mb-12 text-center">
            Subscription FAQs
          </h2>

          <div className="space-y-6">
            <div className="bg-card/50 border border-accent/20 rounded-lg p-6">
              <h3 className="font-semibold text-foreground mb-2">Can I cancel anytime?</h3>
              <p className="text-foreground/70">
                Yes! Cancel your subscription anytime with no penalties. You'll have access until the end of your billing period.
              </p>
            </div>

            <div className="bg-card/50 border border-accent/20 rounded-lg p-6">
              <h3 className="font-semibold text-foreground mb-2">When do I receive my box?</h3>
              <p className="text-foreground/70">
                Boxes ship on the 1st of each month. Standard shipping takes 5-7 business days. Express shipping available for VIP members.
              </p>
            </div>

            <div className="bg-card/50 border border-accent/20 rounded-lg p-6">
              <h3 className="font-semibold text-foreground mb-2">Can I skip a month?</h3>
              <p className="text-foreground/70">
                Absolutely! You can pause your subscription for up to 3 months and resume whenever you're ready.
              </p>
            </div>

            <div className="bg-card/50 border border-accent/20 rounded-lg p-6">
              <h3 className="font-semibold text-foreground mb-2">What if I don't like a product?</h3>
              <p className="text-foreground/70">
                We offer a 30-day satisfaction guarantee. If you're not happy with your box, contact us for a full refund.
              </p>
            </div>

            <div className="bg-card/50 border border-accent/20 rounded-lg p-6">
              <h3 className="font-semibold text-foreground mb-2">Do you offer gift subscriptions?</h3>
              <p className="text-foreground/70">
                Yes! Gift subscriptions are available for 1, 3, 6, or 12 months. Perfect for nail lovers!
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
