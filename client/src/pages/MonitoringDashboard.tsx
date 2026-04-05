import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
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
import {
  Zap,
  TrendingUp,
  ShoppingCart,
  Users,
  AlertCircle,
  CheckCircle,
  Clock,
  Sparkles,
  Wand2,
  BarChart3,
} from "lucide-react";
import { toast } from "sonner";

export default function MonitoringDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  // Queries
  const adminDashboardQuery = trpc.admin.getDashboardStats.useQuery();
  const marketingAnalyticsQuery = trpc.marketing.getAnalytics.useQuery({ days: 30 });
  const ordersQuery = trpc.orders.getCustomerOrders.useQuery({ page: 1, limit: 100 });

  // Mutations
  const generateProductsMutation = trpc.automation.generateTrendingProducts.useMutation();
  const createMarketingCampaignMutation = trpc.automation.createMarketingCampaign.useMutation();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">You need to be logged in to access the monitoring dashboard.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleGenerateTrendingProducts = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setGenerationProgress((prev) => Math.min(prev + 10, 90));
      }, 500);

      const result = await generateProductsMutation.mutateAsync({
        count: 10,
        trendingCategory: "nail-art",
      });

      clearInterval(progressInterval);
      setGenerationProgress(100);

      toast.success(`✨ Generated ${result.productsCreated} new trending products!`);
      adminDashboardQuery.refetch();

      setTimeout(() => {
        setIsGenerating(false);
        setGenerationProgress(0);
      }, 1000);
    } catch (error) {
      toast.error("Failed to generate products");
      console.error(error);
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  const handleCreateMarketingCampaign = async () => {
    try {
      const result = await createMarketingCampaignMutation.mutateAsync({
        name: "Trending Nail Art Campaign",
        description: "Auto-generated campaign for trending nail art designs",
        platforms: ["instagram", "tiktok", "facebook"],
        autoPost: true,
      });

      toast.success(`🎯 Campaign created: ${result.campaignName}`);
      marketingAnalyticsQuery.refetch();
    } catch (error) {
      toast.error("Failed to create campaign");
      console.error(error);
    }
  };

  const metrics = adminDashboardQuery.data;
  const analytics = marketingAnalyticsQuery.data;

  // Sample data for charts
  const revenueData = [
    { day: "Mon", revenue: 2400, orders: 4 },
    { day: "Tue", revenue: 1398, orders: 3 },
    { day: "Wed", revenue: 9800, orders: 12 },
    { day: "Thu", revenue: 3908, orders: 5 },
    { day: "Fri", revenue: 4800, orders: 8 },
    { day: "Sat", revenue: 3800, orders: 6 },
    { day: "Sun", revenue: 4300, orders: 7 },
  ];

  const platformData = [
    { name: "Instagram", value: 45, fill: "#E1306C" },
    { name: "TikTok", value: 30, fill: "#000000" },
    { name: "Facebook", value: 25, fill: "#1877F2" },
  ];

  const systemHealth = [
    { name: "Database", status: "healthy", uptime: "99.9%" },
    { name: "Stripe API", status: "healthy", uptime: "99.99%" },
    { name: "Printful API", status: "healthy", uptime: "99.8%" },
    { name: "Email Service", status: "healthy", uptime: "99.95%" },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2">Nail'd Command Center</h1>
          <p className="text-muted-foreground">Real-time monitoring, analytics, and automation</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">${typeof metrics?.totalRevenue === 'string' ? parseFloat(metrics.totalRevenue) / 100 : (metrics?.totalRevenue || 0) / 100}</div>
              <p className="text-xs text-green-600 mt-1">↑ 12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Total Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{metrics?.monthlyOrders || 0}</div>
              <p className="text-xs text-green-600 mt-1">↑ 8% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Active Customers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{metrics?.totalCustomers || 0}</div>
              <p className="text-xs text-green-600 mt-1">↑ 5% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Conversion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">2.5%</div>
              <p className="text-xs text-green-600 mt-1">↑ 2% from last month</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="automation">Automation</TabsTrigger>
            <TabsTrigger value="marketing">Marketing</TabsTrigger>
            <TabsTrigger value="health">System Health</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Orders Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Orders by Day</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="orders" fill="#ec4899" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Platform Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Marketing Platform Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={platformData} cx="50%" cy="50%" labelLine={false} label dataKey="value">
                      {platformData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Automation Tab */}
          <TabsContent value="automation" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Content Generation Wizard */}
              <Card className="border-2 border-purple-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wand2 className="h-5 w-5 text-purple-600" />
                    AI Content Creator
                  </CardTitle>
                  <CardDescription>Auto-generate trending nail art products</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-purple-50 p-4 rounded-lg space-y-3">
                    <div>
                      <p className="text-sm font-medium mb-2">What it does:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>✨ Researches trending nail art designs</li>
                        <li>🎨 Generates 10 new product variations</li>
                        <li>📸 Creates product descriptions & pricing</li>
                        <li>🖼️ Generates product images</li>
                      </ul>
                    </div>
                  </div>

                  {isGenerating && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Generating products...</span>
                        <span>{generationProgress}%</span>
                      </div>
                      <Progress value={generationProgress} className="h-2" />
                    </div>
                  )}

                  <Button
                    onClick={handleGenerateTrendingProducts}
                    disabled={isGenerating}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    size="lg"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    {isGenerating ? "Generating..." : "Generate 10 Trending Products"}
                  </Button>
                </CardContent>
              </Card>

              {/* Marketing Campaign Wizard */}
              <Card className="border-2 border-pink-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-pink-600" />
                    Campaign Automation
                  </CardTitle>
                  <CardDescription>Create and auto-post marketing campaigns</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-pink-50 p-4 rounded-lg space-y-3">
                    <div>
                      <p className="text-sm font-medium mb-2">What it does:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>📱 Creates multi-platform campaigns</li>
                        <li>✍️ Generates AI captions & hashtags</li>
                        <li>📅 Schedules posts automatically</li>
                        <li>📊 Tracks engagement in real-time</li>
                      </ul>
                    </div>
                  </div>

                  <Button
                    onClick={handleCreateMarketingCampaign}
                    disabled={isGenerating}
                    className="w-full bg-pink-600 hover:bg-pink-700"
                    size="lg"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Create Auto-Post Campaign
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Automation Runs */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Automation Runs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "Product Generation", status: "completed", time: "2 hours ago", items: 10 },
                    { name: "Marketing Campaign", status: "completed", time: "4 hours ago", items: 3 },
                    { name: "Email Notifications", status: "running", time: "Just now", items: 45 },
                  ].map((run, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {run.status === "completed" ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <Clock className="h-5 w-5 text-blue-600 animate-spin" />
                        )}
                        <div>
                          <p className="font-medium text-sm">{run.name}</p>
                          <p className="text-xs text-muted-foreground">{run.time}</p>
                        </div>
                      </div>
                      <Badge variant="outline">{run.items} items</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Marketing Tab */}
          <TabsContent value="marketing" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Total Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics?.totalPosts || 0}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Total Engagement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics?.totalEngagement || 0}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Total Reach</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics?.totalReach || 0}</div>
                </CardContent>
              </Card>
            </div>

            {/* Platform Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {analytics?.byPlatform &&
                Object.entries(analytics.byPlatform).map(([platform, stats]: any) => (
                  <Card key={platform}>
                    <CardHeader>
                      <CardTitle className="capitalize text-lg">{platform}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Likes</span>
                        <span className="font-semibold">{stats.likes}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Comments</span>
                        <span className="font-semibold">{stats.comments}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Shares</span>
                        <span className="font-semibold">{stats.shares}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Views</span>
                        <span className="font-semibold">{stats.views}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          {/* System Health Tab */}
          <TabsContent value="health" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Health Status</CardTitle>
                <CardDescription>All critical services and integrations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {systemHealth.map((service) => (
                  <div key={service.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium text-sm">{service.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{service.status}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-green-50">
                      {service.uptime}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Infrastructure Status */}
            <Card>
              <CardHeader>
                <CardTitle>Infrastructure</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Database</span>
                  <Badge className="bg-green-600">Connected</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">API Server</span>
                  <Badge className="bg-green-600">Running</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">CDN</span>
                  <Badge className="bg-green-600">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">SSL Certificate</span>
                  <Badge className="bg-green-600">Valid</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
