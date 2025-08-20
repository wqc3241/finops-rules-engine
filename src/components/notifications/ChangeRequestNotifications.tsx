import { useState, useEffect } from 'react';
import { Bell, Check, X, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { useSupabaseApprovalWorkflow } from '@/hooks/useSupabaseApprovalWorkflow';
import { ChangeRequestWithDetails } from '@/types/approval';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface NotificationItem {
  id: string;
  type: 'pending' | 'approved' | 'rejected';
  title: string;
  description: string;
  createdAt: string;
  requestId: string;
}

const ChangeRequestNotifications = () => {
  const navigate = useNavigate();
  const { user, profile, isFSAdmin } = useAuth();
  const { getPendingRequestsForAdmin, changeRequests, changeDetails } = useSupabaseApprovalWorkflow();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Generate notifications based on user role
  useEffect(() => {
    if (!user || !profile) return;

    const newNotifications: NotificationItem[] = [];

    if (isFSAdmin()) {
      // FS_Admin sees pending change requests
      const pendingRequests = getPendingRequestsForAdmin();
      pendingRequests.forEach(request => {
        newNotifications.push({
          id: `pending-${request.id}`,
          type: 'pending',
          title: 'Pending Change Request',
          description: `${request.totalChanges} rule changes awaiting review`,
          createdAt: request.createdAt,
          requestId: request.id
        });
      });
    } else {
      // FS_Ops sees notifications about their submitted requests
      const userRequests = changeRequests.filter(req => req.createdBy === user.id);
      
      userRequests.forEach(request => {
        const requestDetails = changeDetails.filter(d => d.requestId === request.id);
        const approvedCount = requestDetails.filter(d => d.status === 'APPROVED').length;
        const rejectedCount = requestDetails.filter(d => d.status === 'REJECTED').length;
        
        if (request.status === 'APPROVED' && approvedCount > 0) {
          newNotifications.push({
            id: `approved-${request.id}`,
            type: 'approved',
            title: 'Change Request Approved',
            description: `${approvedCount} rule changes have been approved`,
            createdAt: request.reviewedAt || request.createdAt,
            requestId: request.id
          });
        } else if (request.status === 'REJECTED' || rejectedCount > 0) {
          newNotifications.push({
            id: `rejected-${request.id}`,
            type: 'rejected',
            title: 'Change Request Rejected',
            description: `${rejectedCount} rule changes have been rejected`,
            createdAt: request.reviewedAt || request.createdAt,
            requestId: request.id
          });
        }
      });
    }

    // Sort by most recent first
    newNotifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    setNotifications(newNotifications.slice(0, 10)); // Limit to 10 most recent
  }, [user, profile, isFSAdmin, changeRequests, changeDetails, getPendingRequestsForAdmin]);

  const handleNotificationClick = (notification: NotificationItem) => {
    if (notification.type === 'pending' && isFSAdmin()) {
      // Navigate to review page for FS_Admin
      navigate(`/financial-pricing?review=${notification.requestId}`);
    } else {
      // Navigate to financial pricing page for FS_Ops to see their changes
      navigate('/financial-pricing');
    }
    setIsOpen(false);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'pending':
        return <Clock className="h-4 w-4 text-orange-500" />;
      case 'approved':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const unreadCount = notifications.length;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative p-2 text-gray-500 hover:text-gray-700">
          <Bell className="h-6 w-6" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-80 max-h-96"
        sideOffset={8}
      >
        <div className="px-3 py-2 border-b">
          <h3 className="font-semibold text-sm">Notifications</h3>
          {unreadCount > 0 && (
            <p className="text-xs text-muted-foreground">
              {unreadCount} new notification{unreadCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        
        <ScrollArea className="max-h-80">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No notifications
            </div>
          ) : (
            notifications.map((notification, index) => (
              <div key={notification.id}>
                <DropdownMenuItem
                  className="flex items-start gap-3 p-3 cursor-pointer hover:bg-accent"
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-tight">
                      {notification.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {notification.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </DropdownMenuItem>
                {index < notifications.length - 1 && <DropdownMenuSeparator />}
              </div>
            ))
          )}
        </ScrollArea>
        
        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full text-xs"
                onClick={() => {
                  navigate('/financial-pricing');
                  setIsOpen(false);
                }}
              >
                View All Changes
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ChangeRequestNotifications;