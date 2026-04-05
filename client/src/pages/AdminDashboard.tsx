import { useEffect, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import type { Router } from "wouter";
import { useRouter } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { AlertCircle, CheckCircle, AlertTriangle, TrendingUp, Users, ShoppingCart, DollarSign } from "lucide-react";

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useRouter() as any;
  const [selectedTab, setSelectedTab] = useState("overview");

  // Redirect if not admin
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    } else if (user?.role !== "admin") {
      navigate("/");
    }
  }, [isAuthenticated, user, navigate]);

  // Fetch all admin data
  const dashboardStats = trpc.admin.getDashboardStats.useQuery();
  const revenueAnalytics = trpc.admin.getRevenueAnalytics.useQuery({ days: 30 });
  const subscriptionAnalytics = trpc.admin.getSubscriptionAnalytics.useQuery();
  const systemHealth = trpc.admin.getSystemHealth.useQuery();
  const recentOrders = trpc.admin.getRecentOrders.useQuery({ page: 1, limit: 10 });

  if (!isAuthenticated || user?.role !== "admin") {
    return null;
  }

  const stats = dashboardStats.data;
  const revenue = revenueAnalytics.data;
  const subscriptions = subscriptionAnalytics.data;
  const health = systemHealth.data;
  const orders = recentOrders.data;

  const COLORS = ["#f5e6e0", "#d4a5a5", "#a8696b", "#6b4c47"];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor orders, revenue, and system health
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="health">System Health</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Revenue */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${stats && ((stats.totalRevenue as number) / 100).toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground">All-time revenue</p>
                </CardContent>
              </Card>

              {/* Monthly Orders */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.monthlyOrders ?? 0}</div>
                  <p className="text-xs text-muted-foreground">Last 30 days</p>
                </CardContent>
              </Card>

              {/* Active Subscriptions */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.activeSubscriptions ?? 0}</div>
                  <p className="text-xs text-muted-foreground">Recurring revenue</p>
                </CardContent>
              </Card>

              {/* Total Customers */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalCustomers ?? 0}</div>
                  <p className="text-xs text-muted-foreground">Registered users</p>
                </CardContent>
              </Card>
            </div>

            {/* Pending Orders Alert */}
            {stats && (stats.pendingOrders ?? 0) > 0 && (
              <Card className="border-yellow-200 bg-yellow-50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    Pending Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-yellow-800">
                    {stats?.pendingOrders} order{(stats?.pendingOrders ?? 0) !== 1 ? "s" : ""} waiting for fulfillment
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Revenue Chart */}
            {revenue?.dailyRevenue && revenue.dailyRevenue.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trend (30 Days)</CardTitle>
                  <CardDescription>Daily revenue over the last month</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenue.dailyRevenue as any}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={(value: any) => `$${((value as number) / 100).toFixed(2)}`} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#a8696b"
                        dot={false}
                        name="Revenue"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* Subscription Status */}
            {subscriptions?.byStatus && subscriptions.byStatus.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Subscription Status</CardTitle>
                  <CardDescription>Distribution of subscription states</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={subscriptions.byStatus as any}
                        dataKey="count"
                        nameKey="status"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {subscriptions.byStatus.map((_: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Last 10 orders placed</CardDescription>
              </CardHeader>
              <CardContent>
                {orders?.orders && orders.orders.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="border-b border-border">
                        <tr>
                          <th className="text-left py-2 px-4 font-semibold">Order ID</th>
                          <th className="text-left py-2 px-4 font-semibold">Amount</th>
                          <th className="text-left py-2 px-4 font-semibold">Status</th>
                          <th className="text-left py-2 px-4 font-semibold">Date</th>
                          <th className="text-left py-2 px-4 font-semibold">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.orders.map((order: any) => (
                          <tr key={order.id} className="border-b border-border hover:bg-muted/50">
                            <td className="py-2 px-4">#{order.id}</td>
                            <td className="py-2 px-4 font-semibold">
                              ${(((order.amount as number) || 0) / 100).toFixed(2)}
                            </td>
                            <td className="py-2 px-4">
                              <span
                                className={`px-2 py-1 rounded text-xs font-semibold ${
                                  order.status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : order.status === "processing"
                                      ? "bg-blue-100 text-blue-800"
                                      : order.status === "pending"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-red-100 text-red-800"
                                }`}
                              >
                                {order.status}
                              </span>
                            </td>
                            <td className="py-2 px-4">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-2 px-4">
                              <Button variant="outline" size="sm">
                                View
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">No orders yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6 mt-6">
            {revenue?.revenueByStatus && revenue.revenueByStatus.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Order Status</CardTitle>
                  <CardDescription>Total revenue broken down by order status</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={revenue.revenueByStatus as any}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="status" />
                      <YAxis />
                      <Tooltip formatter={(value: any) => `$${((value as number) / 100).toFixed(2)}`} />
                      <Legend />
                      <Bar dataKey="revenue" fill="#a8696b" name="Revenue" />
                      <Bar dataKey="count" fill="#d4a5a5" name="Orders" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* System Health Tab */}
          <TabsContent value="health" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Database */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-medium">Database</CardTitle>
                  {health?.database === "healthy" ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                </CardHeader>
                <CardContent>
                  <p className="text-sm capitalize font-semibold">{health?.database || "checking"}</p>
                  <p className="text-xs text-muted-foreground mt-1">MySQL connection</p>
                </CardContent>
              </Card>

              {/* Printful */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-medium">Printful API</CardTitle>
                  {health?.printful === "healthy" ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                </CardHeader>
                <CardContent>
                  <p className="text-sm capitalize font-semibold">{health?.printful || "checking"}</p>
                  <p className="text-xs text-muted-foreground mt-1">Fulfillment service</p>
                </CardContent>
              </Card>

              {/* Stripe */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-medium">Stripe API</CardTitle>
                  {health?.stripe === "healthy" ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                </CardHeader>
                <CardContent>
                  <p className="text-sm capitalize font-semibold">{health?.stripe || "checking"}</p>
                  <p className="text-xs text-muted-foreground mt-1">Payment processing</p>
                </CardContent>
              </Card>
            </div>

            {/* Last Updated */}
            <Card>
              <CardContent className="pt-6">
                <p className="text-xs text-muted-foreground">
                  Last updated: {health?.timestamp ? new Date(health.timestamp).toLocaleTimeString() : "—"}
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
