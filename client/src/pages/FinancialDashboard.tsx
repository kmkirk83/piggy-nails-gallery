import { useEffect, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface FinancialMetrics {
  totalRevenue: number;
  totalCosts: number;
  grossProfit: number;
  netProfit: number;
  profitMargin: number;
  orderCount: number;
  averageOrderValue: number;
  averageProductCost: number;
  processingFees: number;
  shippingCosts: number;
}

interface DailyFinancials {
  date: string;
  revenue: number;
  costs: number;
  profit: number;
  orderCount: number;
}

export default function FinancialDashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const [metrics, setMetrics] = useState<FinancialMetrics | null>(null);
  const [dailyData, setDailyData] = useState<DailyFinancials[]>([]);
  const [dateRange, setDateRange] = useState<"week" | "month" | "year">("month");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !user?.role || user.role !== "admin") {
      return;
    }

    const fetchFinancials = async () => {
      try {
        setIsLoading(true);
        const endDate = new Date();
        let startDate = new Date();

        if (dateRange === "week") {
          startDate.setDate(endDate.getDate() - 7);
        } else if (dateRange === "month") {
          startDate.setMonth(endDate.getMonth() - 1);
        } else if (dateRange === "year") {
          startDate.setFullYear(endDate.getFullYear() - 1);
        }

        // Fetch financial data from API
        const response = await fetch("/api/financial", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          }),
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setMetrics(data.metrics);
          setDailyData(data.daily);
        }
      } catch (error) {
        console.error("Failed to fetch financial data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFinancials();
  }, [isAuthenticated, user, dateRange]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-3xl font-bold">Financial Dashboard</h1>
        <p className="text-gray-600">Please log in to view financial data</p>
        <Button onClick={() => (window.location.href = getLoginUrl())}>Log In</Button>
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-3xl font-bold">Access Denied</h1>
        <p className="text-gray-600">Only admins can view financial data</p>
      </div>
    );
  }

  const costBreakdown = metrics
    ? [
        { name: "Product Costs", value: metrics.totalCosts, fill: "#ef4444" },
        { name: "Processing Fees", value: metrics.processingFees, fill: "#f97316" },
        { name: "Shipping", value: metrics.shippingCosts, fill: "#eab308" },
      ]
    : [];

  const formatCurrency = (cents: number) => `$${(cents / 100).toFixed(2)}`;
  const formatPercent = (num: number) => `${num.toFixed(1)}%`;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Financial Dashboard</h1>
            <p className="text-muted-foreground mt-2">Track revenue, costs, and profit metrics</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={dateRange === "week" ? "default" : "outline"}
              onClick={() => setDateRange("week")}
            >
              Week
            </Button>
            <Button
              variant={dateRange === "month" ? "default" : "outline"}
              onClick={() => setDateRange("month")}
            >
              Month
            </Button>
            <Button
              variant={dateRange === "year" ? "default" : "outline"}
              onClick={() => setDateRange("year")}
            >
              Year
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-96">Loading financial data...</div>
        ) : metrics ? (
          <>
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{formatCurrency(metrics.totalRevenue)}</div>
                  <p className="text-xs text-muted-foreground mt-1">{metrics.orderCount} orders</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Costs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600">{formatCurrency(metrics.totalCosts)}</div>
                  <p className="text-xs text-muted-foreground mt-1">Product & operational</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Net Profit</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">{formatCurrency(metrics.netProfit)}</div>
                  <p className="text-xs text-muted-foreground mt-1">{formatPercent(metrics.profitMargin)} margin</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Avg Order Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{formatCurrency(metrics.averageOrderValue)}</div>
                  <p className="text-xs text-muted-foreground mt-1">Per transaction</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Revenue vs Costs Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue vs Costs</CardTitle>
                  <CardDescription>Daily breakdown over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dailyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Legend />
                      <Line type="monotone" dataKey="revenue" stroke="#10b981" name="Revenue" />
                      <Line type="monotone" dataKey="costs" stroke="#ef4444" name="Costs" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Profit Trend */}
              <Card>
                <CardHeader>
                  <CardTitle>Daily Profit</CardTitle>
                  <CardDescription>Profit trend over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dailyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Bar dataKey="profit" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Cost Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Cost Breakdown</CardTitle>
                  <CardDescription>Distribution of expenses</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={costBreakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {costBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Order Volume */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Volume</CardTitle>
                  <CardDescription>Orders per day</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dailyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="orderCount" fill="#8b5cf6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Detailed Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Gross Profit</p>
                    <p className="text-2xl font-bold">{formatCurrency(metrics.grossProfit)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Processing Fees</p>
                    <p className="text-2xl font-bold">{formatCurrency(metrics.processingFees)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Shipping Costs</p>
                    <p className="text-2xl font-bold">{formatCurrency(metrics.shippingCosts)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Product Cost</p>
                    <p className="text-2xl font-bold">{formatCurrency(metrics.averageProductCost)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Profit Margin</p>
                    <p className="text-2xl font-bold">{formatPercent(metrics.profitMargin)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                    <p className="text-2xl font-bold">{metrics.orderCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No financial data available</p>
          </div>
        )}
      </div>
    </div>
  );
}
