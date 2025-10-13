
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Truck } from "lucide-react";
import { useUpcomingDeliveries } from "@/hooks/useTasks";

interface UpcomingDeliveriesProps {
  showMyTasksOnly?: boolean;
  currentUser?: string;
}

const UpcomingDeliveries: React.FC<UpcomingDeliveriesProps> = ({ showMyTasksOnly = false, currentUser = "" }) => {
  const { data: deliveries, isLoading, error } = useUpcomingDeliveries(showMyTasksOnly ? currentUser : undefined);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            {showMyTasksOnly ? "My Upcoming Deliveries by Date" : "Upcoming Deliveries by Date"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading deliveries...</p>
        </CardContent>
      </Card>
    );
  }

  if (error || !deliveries) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            {showMyTasksOnly ? "My Upcoming Deliveries by Date" : "Upcoming Deliveries by Date"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">Error loading deliveries</p>
        </CardContent>
      </Card>
    );
  }

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
          {showMyTasksOnly ? "My Upcoming Deliveries by Date" : "Upcoming Deliveries by Date"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {deliveries.length === 0 ? (
          <p className="text-muted-foreground">No upcoming deliveries</p>
        ) : (
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
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingDeliveries;
