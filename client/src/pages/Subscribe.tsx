import { useMemo, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ChevronLeft, Crown, Heart, PackageCheck, Sparkles, Wand2, Zap } from "lucide-react";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import {
  BOX_CHOICES,
  getBoxChoices,
  getSubscriptionPlan,
  saveSubscriptionBoxDraft,
  SUBSCRIPTION_PLANS,
  type SubscriptionSelectionMode,
  type SubscriptionTierId,
} from "@/lib/subscription-box";

const tierIcons = {
  monthly: Sparkles,
  quarterly: Zap,
  biannual: Heart,
  annual: Crown,
};

const tierDescriptions: Record<SubscriptionTierId, string> = {
  monthly: "A low-commitment edit for trying your first Nail'd box.",
  quarterly: "A flexible best-value plan for a fresh rotation every season.",
  biannual: "A premium plan for bigger style refreshes and priority support.",
  annual: "Our highest-value membership with premium extras and first access.",
};

const tierFeatures: Record<SubscriptionTierId, string[]> = {
  monthly: ["3 nail-wrap kits", "Mini nail files", "Free shipping"],
  quarterly: ["3 nail-wrap kits", "Early collection access", "Free shipping"],
  biannual: ["4 nail-wrap kits", "Premium nail files", "Priority support"],
  annual: ["4 nail-wrap kits", "Premium aftercare kit", "Exclusive annual gift"],
};

export default function Subscribe() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedTier, setSelectedTier] = useState<SubscriptionTierId>("quarterly");
  const [selectionMode, setSelectionMode] = useState<SubscriptionSelectionMode>("custom");
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const selectedPlan = useMemo(() => getSubscriptionPlan(selectedTier)!, [selectedTier]);
  const selectedChoices = useMemo(() => getBoxChoices(selectedProductIds), [selectedProductIds]);
  const isSelectionComplete = selectionMode === "seasonal" || selectedProductIds.length === selectedPlan.kitsPerShipment;

  const selectTier = (tierId: SubscriptionTierId) => {
    setSelectedTier(tierId);
    setSelectedProductIds((current) => current.slice(0, getSubscriptionPlan(tierId)!.kitsPerShipment));
  };

  const chooseMode = (mode: SubscriptionSelectionMode) => {
    setSelectionMode(mode);
    if (mode === "seasonal") {
      setSelectedProductIds([]);
    }
  };

  const toggleChoice = (productId: string) => {
    setSelectedProductIds((current) => {
      if (current.includes(productId)) {
        return current.filter((id) => id !== productId);
      }
      if (current.length >= selectedPlan.kitsPerShipment) {
        return current;
      }
      return [...current, productId];
    });
  };

  const handleCheckout = () => {
    if (!isSelectionComplete) return;

    saveSubscriptionBoxDraft({
      version: 1,
      tierId: selectedTier,
      mode: selectionMode,
      seasonalOptIn: selectionMode === "seasonal",
      selectedProductIds,
      createdAt: new Date().toISOString(),
    });

    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }

    setLocation(`/checkout?tier=${selectedPlan.productId}&box=${selectionMode}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <button onClick={() => setLocation("/")} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-display font-bold">Nail&apos;d Subscription Boxes</h1>
          </div>
          <div className="w-20" />
        </div>
      </nav>

      <main>
        <section className="py-12 md:py-20 bg-gradient-to-br from-background to-primary/5">
          <div className="container max-w-6xl">
            <div className="text-center space-y-4 mb-12">
              <p className="text-sm font-semibold tracking-[0.2em] text-accent uppercase">Make it yours</p>
              <h2 className="text-4xl md:text-5xl font-display font-bold">Build your Nail&apos;d box</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Choose every set yourself, or let us curate a seasonal edit. You are never locked into seasonal choices.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
              {SUBSCRIPTION_PLANS.map((tier) => {
                const Icon = tierIcons[tier.id];
                const isSelected = selectedTier === tier.id;
                return (
                  <Card key={tier.id} className={`relative cursor-pointer transition-all ${isSelected ? "ring-2 ring-accent shadow-lg" : "hover:border-accent/50"}`} onClick={() => selectTier(tier.id)}>
                    {tier.id === "quarterly" && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-accent text-accent-foreground text-xs font-bold rounded-full">MOST POPULAR</div>
                    )}
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{tier.name}</CardTitle>
                        <Icon className="w-5 h-5 text-accent" />
                      </div>
                      <CardDescription>{tierDescriptions[tier.id]}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-2xl font-bold text-accent">${tier.price.toFixed(2)}</div>
                      <p className="text-xs text-muted-foreground">{tier.cadenceLabel} · {tier.savings}</p>
                      <p className="text-sm font-medium">{tier.kitsPerShipment} kits per box</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <section className="grid lg:grid-cols-[1.5fr_1fr] gap-8 items-start">
              <div className="space-y-6">
                <Card className="border-accent/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Wand2 className="w-5 h-5 text-accent" /> Step 1: Choose your box style</CardTitle>
                    <CardDescription>You can switch this preference before every renewal.</CardDescription>
                  </CardHeader>
                  <CardContent className="grid sm:grid-cols-2 gap-4">
                    <button type="button" onClick={() => chooseMode("custom")} className={`text-left p-5 rounded-xl border transition-all ${selectionMode === "custom" ? "border-accent bg-accent/10 ring-1 ring-accent" : "border-border hover:border-accent/60"}`}>
                      <PackageCheck className="w-6 h-6 text-accent mb-3" />
                      <p className="font-semibold">Build my box</p>
                      <p className="text-sm text-muted-foreground mt-1">Pick every kit yourself. No seasonal substitutions.</p>
                    </button>
                    <button type="button" onClick={() => chooseMode("seasonal")} className={`text-left p-5 rounded-xl border transition-all ${selectionMode === "seasonal" ? "border-accent bg-accent/10 ring-1 ring-accent" : "border-border hover:border-accent/60"}`}>
                      <Sparkles className="w-6 h-6 text-accent mb-3" />
                      <p className="font-semibold">Curate it for me</p>
                      <p className="text-sm text-muted-foreground mt-1">Receive a seasonal edit built around fresh, limited designs.</p>
                    </button>
                  </CardContent>
                </Card>

                {selectionMode === "custom" ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Step 2: Pick {selectedPlan.kitsPerShipment} kits</CardTitle>
                      <CardDescription>{selectedProductIds.length} of {selectedPlan.kitsPerShipment} selected. Your exact picks are saved with your subscription.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {BOX_CHOICES.map((choice) => {
                        const selected = selectedProductIds.includes(choice.id);
                        const disabled = !selected && selectedProductIds.length >= selectedPlan.kitsPerShipment;
                        return (
                          <button key={choice.id} type="button" disabled={disabled} onClick={() => toggleChoice(choice.id)} className={`flex gap-3 text-left rounded-xl border p-3 transition-all disabled:opacity-45 ${selected ? "border-accent bg-accent/10 ring-1 ring-accent" : "border-border hover:border-accent/60"}`}>
                            <img src={choice.imageUrl} alt="" className="w-16 h-16 rounded-lg object-cover bg-secondary" />
                            <span className="flex-1 min-w-0">
                              <span className="flex items-start justify-between gap-2"><span className="font-medium leading-tight">{choice.name}</span>{selected && <Check className="w-4 h-4 text-accent shrink-0" />}</span>
                              <span className="block text-xs text-muted-foreground mt-1">{choice.description}</span>
                              <span className="block text-sm font-semibold text-accent mt-2">${choice.price.toFixed(2)} value</span>
                            </span>
                          </button>
                        );
                      })}
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="border-accent/30 bg-accent/5">
                    <CardHeader>
                      <CardTitle>Seasonal edit selected</CardTitle>
                      <CardDescription>We&apos;ll curate {selectedPlan.kitsPerShipment} current-season kits. Prefer certainty? Switch to “Build my box” at any time and skip seasonal choices entirely.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid sm:grid-cols-3 gap-3">
                        {BOX_CHOICES.filter((choice) => choice.seasonal).map((choice) => (
                          <div key={choice.id} className="rounded-lg bg-background border border-border p-3">
                            <p className="font-medium text-sm">{choice.name}</p>
                            <p className="text-xs text-muted-foreground mt-1">A seasonal-style example</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              <aside className="lg:sticky lg:top-24">
                <Card className="border-accent/40 shadow-lg">
                  <CardHeader>
                    <CardTitle>Your {selectedPlan.name} box</CardTitle>
                    <CardDescription>{selectedPlan.cadenceLabel}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="flex justify-between items-baseline"><span className="text-sm text-muted-foreground">Today&apos;s plan</span><span className="text-2xl font-bold text-accent">${selectedPlan.price.toFixed(2)}</span></div>
                    <div className="border-t border-border pt-4 space-y-2">
                      <p className="text-sm font-medium">Selection</p>
                      {selectionMode === "seasonal" ? <p className="text-sm text-muted-foreground">Seasonal curation enabled. You can switch to custom before a future renewal.</p> : selectedChoices.length ? <ul className="space-y-2">{selectedChoices.map((choice) => <li key={choice.id} className="text-sm flex items-center gap-2"><Check className="w-4 h-4 text-accent" />{choice.name}</li>)}</ul> : <p className="text-sm text-muted-foreground">Choose your {selectedPlan.kitsPerShipment} kits to continue.</p>}
                    </div>
                    <ul className="border-t border-border pt-4 space-y-2">
                      {tierFeatures[selectedTier].map((feature) => <li key={feature} className="text-sm flex items-center gap-2"><Check className="w-4 h-4 text-accent" />{feature}</li>)}
                    </ul>
                    <Button size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={!isSelectionComplete} onClick={handleCheckout}>
                      {isSelectionComplete ? "Continue to secure checkout" : `Choose ${selectedPlan.kitsPerShipment - selectedProductIds.length} more kit${selectedPlan.kitsPerShipment - selectedProductIds.length === 1 ? "" : "s"}`}
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">Cancel, pause, or update your next box before the renewal cutoff.</p>
                  </CardContent>
                </Card>
              </aside>
            </section>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-secondary/5">
          <div className="container max-w-3xl">
            <h3 className="text-3xl font-display font-bold text-center mb-10">Subscription questions</h3>
            <div className="space-y-3">
              {[
                ["Can I avoid seasonal selections?", "Yes. Choose Build my box and select every kit yourself. Seasonal curation is optional, not a surprise substitution."],
                ["Can I update my choices?", "Yes. Your selection is saved for the current order and can be changed for a future renewal before the stated cutoff."],
                ["Can I pause or cancel?", "Yes. You can pause or cancel before the next renewal. Your access continues through the paid period."],
                ["What happens if a chosen item is unavailable?", "We will not silently replace a customer-picked item. We will ask you to choose an alternative or wait for availability."],
              ].map(([question, answer], index) => (
                <Card key={question} className="cursor-pointer hover:border-accent/50 transition-colors" onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}>
                  <CardHeader className="py-4"><CardTitle className="text-base flex justify-between gap-4">{question}<span className="text-accent">{expandedFaq === index ? "−" : "+"}</span></CardTitle></CardHeader>
                  {expandedFaq === index && <CardContent className="pt-0"><p className="text-sm text-muted-foreground">{answer}</p></CardContent>}
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
