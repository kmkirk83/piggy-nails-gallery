import { useEffect, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Loader2, Sparkles, AlertCircle, CheckCircle } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface Subscription {
  id: string;
  status: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
}

interface Order {
  id: number;
  userId: number;
  subscriptionId: number | null;
  stripeInvoiceId: string | null;
  status: string;
  amount: number;
  currency: string | null;
  shippingAddress: string | null;
  trackingNumber: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export default function Account() {
  const { user, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const subscriptionQuery = trpc.stripe.getSubscriptionStatus.useQuery();
  const orderHistoryQuery = trpc.stripe.getOrderHistory.useQuery();
  const cancelSubscriptionMutation = trpc.stripe.cancelSubscription.useMutation();

  useEffect(() => {
    if (subscriptionQuery.data) {
      setSubscription(subscriptionQuery.data);
    }
    if (orderHistoryQuery.data) {
      setOrders(orderHistoryQuery.data);
    }
    setIsLoading(subscriptionQuery.isLoading || orderHistoryQuery.isLoading);
  }, [subscriptionQuery.data, orderHistoryQuery.data, subscriptionQuery.isLoading, orderHistoryQuery.isLoading]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>Please sign in to view your account</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full"
              onClick={() => setLocation("/")}
            >
              Go Back Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleCancelSubscription = async () => {
    try {
      await cancelSubscriptionMutation.mutateAsync();
      toast.success("Subscription cancelled successfully");
      setShowCancelConfirm(false);
      subscriptionQuery.refetch();
    } catch (error) {
      console.error("Cancel error:", error);
      toast.error("Failed to cancel subscription");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <button
            onClick={() => setLocation("/")}
            className="flex items-center gap-2 hover:opacity-80 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-display font-bold">My Account</h1>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => logout()}
          >
            Sign Out
          </Button>
        </div>
      </nav>

      {/* Account Content */}
      <section className="py-12">
        <div className="container max-w-4xl">
          {/* User Profile */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Name</p>
                  <p className="font-semibold">{user?.name || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Email</p>
                  <p className="font-semibold">{user?.email || "Not provided"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Status */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Subscription Status</CardTitle>
              <CardDescription>Manage your active subscription</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-accent" />
                </div>
              ) : subscription ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-secondary/5 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-1">Status</p>
                      <div className="flex items-center gap-2">
                        {subscription.status === "active" ? (
                          <>
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span className="font-semibold text-green-600">Active</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-5 h-5 text-yellow-500" />
                            <span className="font-semibold capitalize">{subscription.status}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="bg-secondary/5 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-1">Current Period</p>
                      <p className="font-semibold text-sm">
                        {subscription.currentPeriodStart.toLocaleDateString()} -{" "}
                        {subscription.currentPeriodEnd.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="bg-secondary/5 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-1">Renewal</p>
                      <p className="font-semibold text-sm">
                        {subscription.cancelAtPeriodEnd ? "Cancels at period end" : "Auto-renews"}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      variant="outline"
                      disabled={subscription.cancelAtPeriodEnd}
                    >
                      Pause Subscription
                    </Button>
                    {!subscription.cancelAtPeriodEnd && (
                      <Button
                        variant="destructive"
                        onClick={() => setShowCancelConfirm(true)}
                      >
                        Cancel Subscription
                      </Button>
                    )}
                  </div>

                  {/* Cancel Confirmation */}
                  {showCancelConfirm && (
                    <Card className="border-red-200 bg-red-50">
                      <CardHeader>
                        <CardTitle className="text-red-600">Cancel Subscription?</CardTitle>
                        <CardDescription>
                          Your subscription will end at the end of your current billing period.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex gap-3">
                        <Button
                          variant="destructive"
                          onClick={handleCancelSubscription}
                          disabled={cancelSubscriptionMutation.isPending}
                        >
                          {cancelSubscriptionMutation.isPending ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Cancelling...
                            </>
                          ) : (
                            "Yes, Cancel"
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setShowCancelConfirm(false)}
                        >
                          Keep Subscription
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No active subscription</p>
                  <Button
                    onClick={() => setLocation("/subscribe")}
                    className="bg-accent hover:bg-accent/90 text-accent-foreground"
                  >
                    Start a Subscription
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order History */}
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>Your past purchases and orders</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-accent" />
                </div>
              ) : orders && orders.length > 0 ? (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-secondary/5 transition-colors"
                    >
                      <div>
                        <p className="font-semibold">Order #{order.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-accent">
                          ${(order.amount / 100).toFixed(2)}
                        </p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {order.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No orders yet</p>
                  <Button
                    onClick={() => setLocation("/shop")}
                    className="bg-accent hover:bg-accent/90 text-accent-foreground"
                  >
                    Start Shopping
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-background mt-12">
        <div className="container text-center text-sm text-muted-foreground">
          <p>&copy; 2026 Nail'd. Premium trending nail art delivered.</p>
        </div>
      </footer>
    </div>
  );
}
