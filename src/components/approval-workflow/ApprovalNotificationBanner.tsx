import { Bell, Clock, Users, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSupabaseApprovalWorkflow } from "@/hooks/useSupabaseApprovalWorkflow";
import { useAuth } from "@/hooks/useSupabaseAuth";
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";

interface ApprovalNotificationBannerProps {
  onOpenReview: () => void;
}

const ApprovalNotificationBanner = ({ onOpenReview }: ApprovalNotificationBannerProps) => {
  const { getPendingRequestsForAdmin, forceRefresh } = useSupabaseApprovalWorkflow();
  const { profile, isFSAdmin } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const pendingRequests = getPendingRequestsForAdmin();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await forceRefresh();
      toast({
        title: "Data refreshed",
        description: "Approval workflow data has been updated."
      });
    } catch (error) {
      console.error("Failed to refresh approval data:", error);
      toast({
        title: "Refresh failed",
        description: "Failed to refresh approval data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  // Only show for admins and if there are pending requests
  if (!profile || !isFSAdmin() || pendingRequests.length === 0) {
    return null;
  }

  return (
    <Alert className="mb-4 border-warning bg-warning/5">
      <Bell className="h-4 w-4 text-warning" />
      <AlertDescription className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="font-medium">
              {pendingRequests.length} Rule Change{pendingRequests.length !== 1 ? 's' : ''} Awaiting Review
            </span>
          </div>
          
          <div className="flex gap-2">
            {pendingRequests.map(request => (
              <Badge key={request.id} variant="outline" className="text-xs">
                <Users className="h-3 w-3 mr-1" />
                {request.createdBy.split('@')[0]} - {request.totalChanges} changes
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="text-warning hover:bg-warning/10"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenReview()}
            className="text-warning border-warning hover:bg-warning/10"
          >
            Review All Changes
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default ApprovalNotificationBanner;