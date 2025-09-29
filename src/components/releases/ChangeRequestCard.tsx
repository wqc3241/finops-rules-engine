import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronRight, CheckCircle, XCircle, Eye, Rocket } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface ChangeRequestCardProps {
  request: any;
  onApprove: (requestId: string) => void;
  onReject: (requestId: string) => void;
  onViewDetails: (requestId: string) => void;
  showDeployButton?: boolean;
}

const ChangeRequestCard = ({
  request,
  onApprove,
  onReject,
  onViewDetails,
  showDeployButton = false
}: ChangeRequestCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
      case 'IN_REVIEW':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case 'APPROVED':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Approved</Badge>;
      case 'REJECTED':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Get table changes from the request
  const tableChanges = request.tableChanges || [];
  const totalChanges = request.totalChanges || 0;

  return (
    <Card className="p-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="p-0 h-auto">
                  {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              <div>
                <p className="font-mono text-sm font-medium">Request #{request.versionId}</p>
                <p className="text-xs text-muted-foreground">
                  Created {request.createdAt && !isNaN(new Date(request.createdAt).getTime()) 
                    ? formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })
                    : 'recently'}
                </p>
              </div>
              {getStatusBadge(request.status)}
              {request.deployment_version_id && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  Deployed
                </Badge>
              )}
            </div>

            <div className="ml-7 space-y-1">
              <p className="text-sm text-muted-foreground">
                {tableChanges.length} table(s) affected • {totalChanges} total changes
              </p>
              {request.comment && (
                <p className="text-sm italic text-muted-foreground">"{request.comment}"</p>
              )}
            </div>
          </div>

          <div className="flex gap-2 ml-4">
            {request.status === 'PENDING' || request.status === 'IN_REVIEW' ? (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onApprove(request.id)}
                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onReject(request.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Reject
                </Button>
              </>
            ) : showDeployButton && request.status === 'APPROVED' && !request.deployment_version_id ? (
              <Button
                size="sm"
                onClick={() => onViewDetails(request.id)}
              >
                <Rocket className="h-4 w-4 mr-1" />
                Deploy
              </Button>
            ) : null}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onViewDetails(request.id)}
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
          </div>
        </div>

        <CollapsibleContent className="ml-7 mt-4">
          <div className="border-l-2 border-muted pl-4 space-y-2">
            <p className="text-xs font-medium text-muted-foreground mb-2">Changes by Table:</p>
            {tableChanges.map((tableChange: any) => (
              <div key={tableChange.table} className="flex justify-between text-sm">
                <span className="font-mono">{tableChange.table}</span>
                <span className="text-muted-foreground">{tableChange.changedRowsCount} changes</span>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default ChangeRequestCard;
