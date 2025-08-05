import { Bell, Clock, Users } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useApprovalWorkflow } from "@/hooks/useApprovalWorkflow";
import { useAuth } from "@/hooks/useAuth";

interface ApprovalNotificationBannerProps {
  onOpenReview: (requestId: string) => void;
}

const ApprovalNotificationBanner = ({ onOpenReview }: ApprovalNotificationBannerProps) => {
  const { getPendingRequestsForAdmin } = useApprovalWorkflow();
  const { user } = useAuth();
  
  const pendingRequests = getPendingRequestsForAdmin();

  // Only show for admins and if there are pending requests
  if (!user || user.role !== 'admin' || pendingRequests.length === 0) {
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
          {pendingRequests.map(request => (
            <Button
              key={request.id}
              variant="outline"
              size="sm"
              onClick={() => onOpenReview(request.id)}
              className="text-warning border-warning hover:bg-warning/10"
            >
              Review {request.id.split('_')[1]}
            </Button>
          ))}
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default ApprovalNotificationBanner;