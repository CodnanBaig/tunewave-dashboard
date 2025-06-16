"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell } from "lucide-react";

// This would typically come from your backend/API
const mockNotifications = [
  {
    id: 1,
    title: "New Release Published",
    message: "Your release 'Summer Vibes' has been successfully published.",
    timestamp: "2024-03-20T10:30:00Z",
    read: false,
  },
  {
    id: 2,
    title: "Payment Received",
    message: "You received a payment of $150.00 for your latest release.",
    timestamp: "2024-03-19T15:45:00Z",
    read: true,
  },
  {
    id: 3,
    title: "YouTube Connected",
    message: "Your YouTube channel has been successfully connected.",
    timestamp: "2024-03-18T09:15:00Z",
    read: true,
  },
];

export default function NotificationsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center gap-2 mb-6">
        <Bell className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Notifications</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
          <CardDescription>View and manage your notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-4">
              {mockNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border ${
                    notification.read ? "bg-background" : "bg-muted/50"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{notification.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(notification.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
} 