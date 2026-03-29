import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Lock, Unlock, Zap, Crown } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Studio() {
  const { user, isAuthenticated } = useAuth();
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);

  const { data: studioAccess, isLoading: accessLoading } =
    trpc.design.getStudioAccess.useQuery(undefined, {
      enabled: isAuthenticated,
    });

  const { data: handTemplates, isLoading: templatesLoading } =
    trpc.design.getHandTemplates.useQuery();

  const { data: paywallProducts } = trpc.design.getPaywallProducts.useQuery();

  const createCheckoutSession =
    trpc.stripe.createCheckoutSession.useMutation();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10 flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold mb-4">Sign In to Create</h1>
          <p className="text-muted-foreground mb-6">
            Create and design your own nail art with our studio tools
          </p>
          <Button className="w-full">Sign In to Get Started</Button>
        </Card>
      </div>
    );
  }

  if (accessLoading || templatesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  const features = studioAccess?.features;
  const accessLevel = studioAccess?.accessLevel;

  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > (features?.maxUploadSizeMB || 2) * 1024 * 1024) {
      toast.error(
        `File too large. Max size: ${features?.maxUploadSizeMB}MB`
      );
      return;
    }

    setUploadedImage(file);
    toast.success("Image uploaded successfully");
  };

  const handleUpgradeClick = (productId: string) => {
    if (!user) return;

    createCheckoutSession.mutate(
      {
        productId,
        origin: window.location.origin,
      },
      {
        onSuccess: (data) => {
          if (data.url) {
            window.open(data.url, "_blank");
          }
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Nail Art Studio</h1>
          <p className="text-lg text-muted-foreground">
            Create stunning nail designs with our advanced tools
          </p>
        </div>

        {/* Access Level Banner */}
        <Card className="mb-8 p-6 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {accessLevel === "lifetime" ? (
                <Crown className="w-6 h-6 text-yellow-500" />
              ) : accessLevel === "premium" ? (
                <Zap className="w-6 h-6 text-blue-500" />
              ) : (
                <Unlock className="w-6 h-6 text-gray-500" />
              )}
              <div>
                <h3 className="font-semibold capitalize">
                  {accessLevel} Access
                </h3>
                <p className="text-sm text-muted-foreground">
                  {accessLevel === "free" &&
                    "Limited features - Upgrade to unlock more"}
                  {accessLevel === "premium" &&
                    "Full access to premium features"}
                  {accessLevel === "lifetime" &&
                    "Unlimited lifetime access"}
                </p>
              </div>
            </div>
            {accessLevel === "free" && (
              <Button
                onClick={() =>
                  handleUpgradeClick(
                    paywallProducts?.lifetime?.id || "studio-lifetime-access"
                  )
                }
                variant="default"
              >
                Upgrade Now
              </Button>
            )}
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Studio Area */}
          <div className="lg:col-span-2">
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6">Create Your Design</h2>

              {/* Hand Selection */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">
                  Step 1: Choose Your Hand
                </h3>

                {/* Template Gallery */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Hand Templates</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {handTemplates?.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => setSelectedTemplate(template.id)}
                        className={`p-4 rounded-lg border-2 transition ${
                          selectedTemplate === template.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="text-sm font-medium">
                          {template.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {template.skinTone}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Upload Custom Hand */}
                {features?.canUploadCustomHand ? (
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadImage}
                      className="hidden"
                      id="hand-upload"
                    />
                    <label
                      htmlFor="hand-upload"
                      className="cursor-pointer block"
                    >
                      <p className="font-medium mb-2">
                        Or upload your own hand image
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Max {features.maxUploadSizeMB}MB
                      </p>
                      {uploadedImage && (
                        <p className="text-sm text-green-600 mt-2">
                          ✓ {uploadedImage.name}
                        </p>
                      )}
                    </label>
                  </div>
                ) : (
                  <div className="border-2 border-dashed rounded-lg p-6 text-center opacity-50">
                    <Lock className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                    <p className="font-medium mb-2">Upload Custom Hand</p>
                    <p className="text-sm text-muted-foreground mb-3">
                      Upgrade to premium to upload your own hand images
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleUpgradeClick(
                          paywallProducts?.lifetime?.id ||
                            "studio-lifetime-access"
                        )
                      }
                    >
                      Unlock Feature
                    </Button>
                  </div>
                )}
              </div>

              {/* Design Tools */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">
                  Step 2: Design Your Nails
                </h3>
                <div className="bg-secondary/50 rounded-lg p-8 text-center">
                  <p className="text-muted-foreground mb-4">
                    Design canvas coming soon
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Advanced design tools with color picker, patterns, and more
                  </p>
                </div>
              </div>

              {/* Export Options */}
              {features?.canExportDesigns ? (
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Step 3: Export & Share
                  </h3>
                  <div className="flex gap-3">
                    <Button variant="outline">Export as PNG</Button>
                    <Button variant="outline">Export as PDF</Button>
                    <Button variant="outline">Share Design</Button>
                  </div>
                </div>
              ) : (
                <div className="border rounded-lg p-4 opacity-50">
                  <div className="flex items-center gap-2 mb-2">
                    <Lock className="w-4 h-4" />
                    <h3 className="font-semibold">Export & Share</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Upgrade to premium to export and share your designs
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      handleUpgradeClick(
                        paywallProducts?.lifetime?.id ||
                          "studio-lifetime-access"
                      )
                    }
                  >
                    Unlock Feature
                  </Button>
                </div>
              )}
            </Card>
          </div>

          {/* Features & Pricing Sidebar */}
          <div className="space-y-4">
            {/* Current Features */}
            <Card className="p-6">
              <h3 className="font-bold mb-4">Your Features</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-1">
                    {features?.maxDesignsPerMonth}/mo
                  </Badge>
                  <div>
                    <p className="font-medium text-sm">Designs per Month</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-1">
                    {features?.maxUploadSizeMB}MB
                  </Badge>
                  <div>
                    <p className="font-medium text-sm">Max Upload Size</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  {features?.canUploadCustomHand ? (
                    <Badge variant="default" className="mt-1">
                      ✓
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="mt-1">
                      ✗
                    </Badge>
                  )}
                  <div>
                    <p className="font-medium text-sm">Upload Custom Hand</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  {features?.canExportDesigns ? (
                    <Badge variant="default" className="mt-1">
                      ✓
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="mt-1">
                      ✗
                    </Badge>
                  )}
                  <div>
                    <p className="font-medium text-sm">Export Designs</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  {features?.canAccessAITools ? (
                    <Badge variant="default" className="mt-1">
                      ✓
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="mt-1">
                      ✗
                    </Badge>
                  )}
                  <div>
                    <p className="font-medium text-sm">AI Design Tools</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Upgrade Options */}
            {accessLevel === "free" && (
              <>
                <Card className="p-6 border-primary/50 bg-primary/5">
                  <h3 className="font-bold mb-4">Lifetime Access</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Get unlimited access to all studio features forever
                  </p>
                  <div className="text-2xl font-bold mb-4">
                    ${(
                      (paywallProducts?.lifetime?.price || 9999) / 100
                    ).toFixed(2)}
                  </div>
                  <Button
                    className="w-full"
                              onClick={() =>
                      handleUpgradeClick(
                        paywallProducts?.lifetime?.id || "studio-lifetime-access"
                      )
                    }
                    disabled={createCheckoutSession.isPending || !user}
                  >
                    {createCheckoutSession.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Upgrade Now"
                    )}
                  </Button>
                </Card>

                <Card className="p-6">
                  <h3 className="font-bold mb-4">Monthly Premium</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Premium features for one month
                  </p>
                  <div className="text-2xl font-bold mb-4">
                    ${(
                      (paywallProducts?.monthlyPremium?.price || 999) / 100
                    ).toFixed(2)}/mo
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() =>
                      handleUpgradeClick(
                        paywallProducts?.monthlyPremium?.id ||
                          "studio-monthly-premium"
                      )
                    }
                  >
                    Try Premium
                  </Button>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
