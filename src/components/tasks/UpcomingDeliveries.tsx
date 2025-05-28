
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Truck } from "lucide-react";

const UpcomingDeliveries = () => {
  const deliveries = [
    { date: "2024-01-15", count: 8, status: "today" },
    { date: "2024-01-16", count: 12, status: "tomorrow" },
    { date: "2024-01-17", count: 6, status: "upcoming" },
    { date: "2024-01-18", count: 9, status: "upcoming" },
    { date: "2024-01-19", count: 4, status: "upcoming" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "today": return "bg-red-100 text-red-800";
      case "tomorrow": return "bg-orange-100 text-orange-800";
      default: return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Upcoming Deliveries by Date
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {deliveries.map((delivery, index) => (
            <div key={index} className="text-center p-3 border rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">
                {new Date(delivery.date).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
              <div className="text-2xl font-bold mb-1">{delivery.count}</div>
              <Badge className={getStatusColor(delivery.status)}>
                {delivery.status === "today" ? "Today" : 
                 delivery.status === "tomorrow" ? "Tomorrow" : "Upcoming"}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingDeliveries;
