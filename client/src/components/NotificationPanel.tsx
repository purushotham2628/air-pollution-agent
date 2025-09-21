import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, X, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: 'alert' | 'info' | 'warning';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface NotificationPanelProps {
  notifications: Notification[];
}

function getNotificationIcon(type: string) {
  switch (type) {
    case 'alert': return AlertTriangle;
    case 'info': return CheckCircle;
    case 'warning': return Clock;
    default: return Bell;
  }
}

function getNotificationColor(type: string) {
  switch (type) {
    case 'alert': return 'text-chart-4 bg-chart-4/10';
    case 'info': return 'text-chart-1 bg-chart-1/10';
    case 'warning': return 'text-chart-2 bg-chart-2/10';
    default: return 'text-muted-foreground bg-muted';
  }
}

export default function NotificationPanel({ notifications: initialNotifications }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    console.log(`Marked notification ${id} as read`); //todo: remove mock functionality
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    console.log(`Dismissed notification ${id}`); //todo: remove mock functionality
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Card className="hover-elevate" data-testid="card-notifications">
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg font-medium">Notifications</CardTitle>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="text-xs" data-testid="badge-unread-count">
              {unreadCount}
            </Badge>
          )}
        </div>
        <Bell className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No notifications</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {notifications.map((notification) => {
              const Icon = getNotificationIcon(notification.type);
              return (
                <div
                  key={notification.id}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg border transition-colors",
                    notification.read ? "bg-muted/30" : "bg-card",
                    "hover-elevate"
                  )}
                  data-testid={`notification-${notification.id}`}
                >
                  <div className={cn(
                    "p-1.5 rounded-full",
                    getNotificationColor(notification.type)
                  )}>
                    <Icon className="h-3 w-3" />
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between">
                      <h4 className={cn(
                        "text-sm font-medium",
                        !notification.read && "font-semibold"
                      )}>
                        {notification.title}
                      </h4>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 -mt-1"
                        onClick={() => dismissNotification(notification.id)}
                        data-testid={`button-dismiss-${notification.id}`}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <p className="text-xs text-muted-foreground">
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs text-muted-foreground">
                        {notification.timestamp}
                      </span>
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs"
                          onClick={() => markAsRead(notification.id)}
                          data-testid={`button-mark-read-${notification.id}`}
                        >
                          Mark as read
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}