import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Package, Truck, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { format } from "date-fns";

export default function OrderTracking() {
  const { user, isAuthenticated } = useAuth();
  const getOrdersQuery = trpc.orders.getCustomerOrders.useQuery({ page: 1, limit: 20 });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Please log in</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">You need to be logged in to track your orders.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const orders = getOrdersQuery.data?.orders || [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case "processing":
        return <Package className="h-5 w-5 text-blue-600" />;
      case "shipped":
        return <Truck className="h-5 w-5 text-purple-600" />;
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-red-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-50 border-yellow-200";
      case "processing":
        return "bg-blue-50 border-blue-200";
      case "shipped":
        return "bg-purple-50 border-purple-200";
      case "delivered":
        return "bg-green-50 border-green-200";
      default:
        return "bg-red-50 border-red-200";
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Order Tracking</h1>
          <p className="text-muted-foreground">Track your orders and view shipping details.</p>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No orders yet</h3>
                <p className="text-sm text-muted-foreground">Start shopping to track your orders here.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order: any) => (
              <Card key={order.id} className={`border ${getStatusColor(order.status)}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusIcon(order.status)}
                        <h3 className="font-semibold">Order #{order.id}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Placed on {format(new Date(order.createdAt), "MMM dd, yyyy HH:mm")}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">
                        ${(order.amount / 100).toFixed(2)}
                      </div>
                      <Badge variant="outline" className="capitalize mt-2">
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Status Timeline */}
                  <div className="space-y-3">
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          ["pending", "processing", "shipped", "delivered"].includes(order.status)
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}>
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                        <div className={`w-0.5 h-12 ${
                          ["processing", "shipped", "delivered"].includes(order.status)
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`} />
                      </div>
                      <div className="pb-6">
                        <p className="font-semibold text-sm">Order Placed</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(order.createdAt), "MMM dd, yyyy")}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          ["processing", "shipped", "delivered"].includes(order.status)
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}>
                          <Package className="h-4 w-4 text-white" />
                        </div>
                        <div className={`w-0.5 h-12 ${
                          ["shipped", "delivered"].includes(order.status)
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`} />
                      </div>
                      <div className="pb-6">
                        <p className="font-semibold text-sm">Processing</p>
                        <p className="text-xs text-muted-foreground">
                          {order.status === "processing" || ["shipped", "delivered"].includes(order.status)
                            ? "Your order is being prepared"
                            : "Waiting to process"}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          ["shipped", "delivered"].includes(order.status)
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}>
                          <Truck className="h-4 w-4 text-white" />
                        </div>
                        <div className={`w-0.5 h-12 ${
                          order.status === "delivered"
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`} />
                      </div>
                      <div className="pb-6">
                        <p className="font-semibold text-sm">Shipped</p>
                        <p className="text-xs text-muted-foreground">
                          {order.trackingNumber
                            ? `Tracking: ${order.trackingNumber}`
                            : "Tracking info coming soon"}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          order.status === "delivered"
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}>
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-sm">Delivered</p>
                        <p className="text-xs text-muted-foreground">
                          {order.status === "delivered"
                            ? `Delivered on ${format(new Date(order.updatedAt), "MMM dd, yyyy")}`
                            : "Estimated delivery coming soon"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-sm mb-3">Order Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Order ID</span>
                        <span className="font-mono">#{order.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status</span>
                        <span className="capitalize font-semibold">{order.status}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Amount</span>
                        <span className="font-semibold">${(order.amount / 100).toFixed(2)}</span>
                      </div>
                      {order.trackingNumber && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tracking Number</span>
                          <span className="font-mono">{order.trackingNumber}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
