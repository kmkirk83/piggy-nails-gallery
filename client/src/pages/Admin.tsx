import { useEffect, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Users, ShoppingCart, TrendingUp, Loader2, AlertCircle } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
}

interface SubscriptionStats {
  activeSubscriptions: number;
  monthlyRecurringRevenue: number;
  churnRate: number;
  newSubscriptionsThisMonth: number;
}

export default function Admin() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [orderStats, setOrderStats] = useState<OrderStats | null>(null);
  const [subscriptionStats, setSubscriptionStats] = useState<SubscriptionStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is admin
  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      setLocation("/");
    }
  }, [isAuthenticated, user?.role, setLocation]);

  useEffect(() => {
    // Simulate loading stats
    setTimeout(() => {
      setOrderStats({
        totalOrders: 1247,
        totalRevenue: 42890,
        pendingOrders: 23,
        completedOrders: 1224,
      });
      setSubscriptionStats({
        activeSubscriptions: 456,
        monthlyRecurringRevenue: 15840,
        churnRate: 2.3,
        newSubscriptionsThisMonth: 67,
      });
      setIsLoading(false);
    }, 500);
  }, []);

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You need admin privileges to access this page</CardDescription>
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

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-display font-bold">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">Manage orders, subscriptions, and revenue</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-secondary rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-sm font-medium">Live</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-8">
        <div className="container">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
          ) : (
            <>
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {/* Total Revenue */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-accent" />
                      Total Revenue
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">${(orderStats?.totalRevenue || 0).toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground mt-1">All time</p>
                  </CardContent>
                </Card>

                {/* Active Subscriptions */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Users className="w-4 h-4 text-accent" />
                      Active Subscriptions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{subscriptionStats?.activeSubscriptions}</p>
                    <p className="text-xs text-muted-foreground mt-1">Current</p>
                  </CardContent>
                </Card>

                {/* Monthly Recurring Revenue */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-accent" />
                      Monthly Recurring
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">${(subscriptionStats?.monthlyRecurringRevenue || 0).toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground mt-1">MRR</p>
                  </CardContent>
                </Card>

                {/* Total Orders */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4 text-accent" />
                      Total Orders
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{orderStats?.totalOrders}</p>
                    <p className="text-xs text-muted-foreground mt-1">All time</p>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Tabs */}
              <Tabs defaultValue="orders" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="orders">Orders</TabsTrigger>
                  <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>

                {/* Orders Tab */}
                <TabsContent value="orders" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Order Management</CardTitle>
                      <CardDescription>View and manage all customer orders</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-secondary/5 rounded-lg p-4">
                            <p className="text-sm text-muted-foreground mb-1">Pending Orders</p>
                            <p className="text-3xl font-bold text-yellow-600">{orderStats?.pendingOrders}</p>
                          </div>
                          <div className="bg-secondary/5 rounded-lg p-4">
                            <p className="text-sm text-muted-foreground mb-1">Completed Orders</p>
                            <p className="text-3xl font-bold text-green-600">{orderStats?.completedOrders}</p>
                          </div>
                        </div>
                        <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                          View All Orders
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Subscriptions Tab */}
                <TabsContent value="subscriptions" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Subscription Management</CardTitle>
                      <CardDescription>Monitor and manage active subscriptions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-secondary/5 rounded-lg p-4">
                            <p className="text-sm text-muted-foreground mb-1">Churn Rate</p>
                            <p className="text-3xl font-bold text-orange-600">{subscriptionStats?.churnRate}%</p>
                          </div>
                          <div className="bg-secondary/5 rounded-lg p-4">
                            <p className="text-sm text-muted-foreground mb-1">New This Month</p>
                            <p className="text-3xl font-bold text-blue-600">{subscriptionStats?.newSubscriptionsThisMonth}</p>
                          </div>
                        </div>
                        <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                          Manage Subscriptions
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Analytics Tab */}
                <TabsContent value="analytics" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Revenue Analytics</CardTitle>
                      <CardDescription>Detailed revenue breakdown and trends</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="bg-gradient-to-r from-accent/10 to-primary/10 rounded-lg p-6">
                          <p className="text-sm text-muted-foreground mb-2">Average Order Value</p>
                          <p className="text-3xl font-bold">
                            ${orderStats?.totalOrders ? (orderStats.totalRevenue / orderStats.totalOrders).toFixed(2) : "0"}
                          </p>
                        </div>
                        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6">
                          <p className="text-sm text-muted-foreground mb-2">Subscription Revenue %</p>
                          <p className="text-3xl font-bold">
                            {subscriptionStats?.monthlyRecurringRevenue && orderStats?.totalRevenue
                              ? ((subscriptionStats.monthlyRecurringRevenue / orderStats.totalRevenue) * 100).toFixed(1)
                              : "0"}
                            %
                          </p>
                        </div>
                        <Button variant="outline" className="w-full">
                          Export Analytics Report
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
