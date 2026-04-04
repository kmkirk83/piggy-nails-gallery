import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/useToast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Settings, Save } from "lucide-react";

export default function NotificationPreferences() {
  const { user, isAuthenticated } = useAuth();
  const { success, error } = useToast();

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    inAppNotifications: true,
    orderUpdates: true,
    subscriptionAlerts: true,
    promotionalEmails: true,
    weeklyDigest: false,
  });

  const [isSaving, setIsSaving] = useState(false);

  // Fetch preferences
  const { data: fetchedPreferences } = trpc.notifications.getPreferences.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  // Update mutation
  const updateMutation = trpc.notifications.updatePreferences.useMutation();

  // Load preferences when fetched
  useEffect(() => {
    if (fetchedPreferences) {
      setPreferences({
        emailNotifications: fetchedPreferences.emailNotifications ?? true,
        inAppNotifications: fetchedPreferences.inAppNotifications ?? true,
        orderUpdates: fetchedPreferences.orderUpdates ?? true,
        subscriptionAlerts: fetchedPreferences.subscriptionAlerts ?? true,
        promotionalEmails: fetchedPreferences.promotionalEmails ?? true,
        weeklyDigest: fetchedPreferences.weeklyDigest ?? false,
      });
    }
  }, [fetchedPreferences]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-foreground mb-4">Please log in to manage preferences</p>
        </Card>
      </div>
    );
  }

  const handleToggle = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateMutation.mutateAsync(preferences);
      success("Preferences updated successfully!");
    } catch (err) {
      error("Failed to update preferences");
    } finally {
      setIsSaving(false);
    }
  };

  const preferenceGroups = [
    {
      title: "Notification Channels",
      description: "Choose how you want to receive notifications",
      items: [
        {
          key: "emailNotifications" as const,
          label: "Email Notifications",
          description: "Receive notifications via email",
        },
        {
          key: "inAppNotifications" as const,
          label: "In-App Notifications",
          description: "See notifications in your notification center",
        },
      ],
    },
    {
      title: "Notification Types",
      description: "Choose which types of notifications to receive",
      items: [
        {
          key: "orderUpdates" as const,
          label: "Order Updates",
          description: "Get notified about order status changes",
        },
        {
          key: "subscriptionAlerts" as const,
          label: "Subscription Alerts",
          description: "Get notified about subscription changes",
        },
        {
          key: "promotionalEmails" as const,
          label: "Promotional Emails",
          description: "Receive special offers and promotions",
        },
      ],
    },
    {
      title: "Digest Options",
      description: "Choose to receive a weekly summary",
      items: [
        {
          key: "weeklyDigest" as const,
          label: "Weekly Digest",
          description: "Receive a weekly summary of all activities",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Settings className="w-8 h-8 text-foreground" />
          <h1 className="text-3xl font-bold text-foreground">Notification Preferences</h1>
        </div>

        {/* Preference Groups */}
        <div className="space-y-6">
          {preferenceGroups.map((group) => (
            <Card key={group.title} className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-2">{group.title}</h2>
              <p className="text-sm text-muted-foreground mb-4">{group.description}</p>

              <div className="space-y-4">
                {group.items.map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex-1">
                      <Label className="text-base font-medium text-foreground cursor-pointer">
                        {item.label}
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                    </div>
                    <Switch
                      checked={preferences[item.key]}
                      onCheckedChange={() => handleToggle(item.key)}
                      className="ml-4"
                    />
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* Save Button */}
        <div className="mt-8 flex gap-3">
          <Button
            onClick={handleSave}
            disabled={isSaving || updateMutation.isPending}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Saving..." : "Save Preferences"}
          </Button>
        </div>

        {/* Info Box */}
        <Card className="mt-8 p-4 bg-accent/50 border-accent">
          <p className="text-sm text-muted-foreground">
            💡 Your notification preferences are saved immediately. You can change them anytime.
          </p>
        </Card>
      </div>
    </div>
  );
}
