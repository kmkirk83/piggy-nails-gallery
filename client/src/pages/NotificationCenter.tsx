import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Check, Trash2, Settings } from "lucide-react";
import { Link } from "wouter";

export default function NotificationCenter() {
  const { user, isAuthenticated } = useAuth();
  const [filter, setFilter] = useState<"all" | "unread">("unread");

  // Fetch notifications
  const { data: notifications = [], isLoading } = trpc.notifications.list.useQuery(
    { filter },
    { enabled: isAuthenticated }
  );

  // Mutations
  const markAsReadMutation = trpc.notifications.markAsRead.useMutation();
  const markAllAsReadMutation = trpc.notifications.markAllAsRead.useMutation();
  const deleteNotificationMutation = trpc.notifications.delete.useMutation();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-foreground mb-4">Please log in to view notifications</p>
          <Link href="/account">
            <Button>Go to Account</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  const handleMarkAsRead = async (notificationId: number) => {
    await markAsReadMutation.mutateAsync({ notificationId });
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsReadMutation.mutateAsync();
  };

  const handleDelete = async (notificationId: number) => {
    await deleteNotificationMutation.mutateAsync({ notificationId });
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      success: "bg-green-100 text-green-800",
      error: "bg-red-100 text-red-800",
      warning: "bg-yellow-100 text-yellow-800",
      info: "bg-blue-100 text-blue-800",
    };
    return colors[type] || colors.info;
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      order: "📦",
      subscription: "🎁",
      promotion: "🎉",
      system: "⚙️",
    };
    return icons[category] || "📢";
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Bell className="w-8 h-8 text-foreground" />
            <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-lg">
                {unreadCount}
              </Badge>
            )}
          </div>
          <Link href="/account/notification-preferences">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Preferences
            </Button>
          </Link>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="unread" className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="unread" onClick={() => setFilter("unread")}>
              Unread ({unreadCount})
            </TabsTrigger>
            <TabsTrigger value="all" onClick={() => setFilter("all")}>
              All
            </TabsTrigger>
          </TabsList>

          <TabsContent value="unread" className="space-y-4">
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="w-full"
              >
                <Check className="w-4 h-4 mr-2" />
                Mark all as read
              </Button>
            )}
          </TabsContent>

          <TabsContent value="all" className="space-y-4" />
        </Tabs>

        {/* Notifications List */}
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <Card className="p-8 text-center">
            <Bell className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No notifications yet</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification: any) => (
              <Card
                key={notification.id}
                className={`p-4 transition-colors ${
                  !notification.isRead ? "bg-accent/50 border-accent" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="text-2xl mt-1">{getCategoryIcon(notification.category)}</div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-foreground truncate">
                        {notification.title}
                      </h3>
                      <Badge className={getTypeColor(notification.type)}>
                        {notification.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{notification.message}</p>

                    {/* Timestamp */}
                    <p className="text-xs text-muted-foreground">
                      {new Date(notification.createdAt).toLocaleDateString()} at{" "}
                      {new Date(notification.createdAt).toLocaleTimeString()}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {!notification.isRead && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMarkAsRead(notification.id)}
                        title="Mark as read"
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(notification.id)}
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Action Link */}
                {notification.actionUrl && (
                  <div className="mt-3 pt-3 border-t">
                    <Link href={notification.actionUrl}>
                      <Button variant="link" size="sm" className="p-0">
                        View Details →
                      </Button>
                    </Link>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
