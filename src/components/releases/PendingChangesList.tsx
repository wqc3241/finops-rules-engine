import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle, XCircle, Rocket } from 'lucide-react';
import ChangeRequestCard from './ChangeRequestCard';
import DeployNowModal from './DeployNowModal';
import { useDeploymentVersions } from '@/hooks/useDeploymentVersions';
import { calculateSnapshotMetadata } from '@/utils/deploymentUtils';

interface PendingChangesListProps {
  changeRequests: any[];
  onApprove: (requestId: string) => void;
  onReject: (requestId: string) => void;
  onViewDetails: (requestId: string) => void;
}

const PendingChangesList = ({
  changeRequests,
  onApprove,
  onReject,
  onViewDetails
}: PendingChangesListProps) => {
  const [showDeployModal, setShowDeployModal] = useState(false);
  const { deployApprovedChanges, isLoading } = useDeploymentVersions();

  const pendingApproval = changeRequests.filter(r => r.status === 'PENDING' || r.status === 'IN_REVIEW');
  const approved = changeRequests.filter(r => r.status === 'APPROVED' && !r.deployment_version_id);
  const rejected = changeRequests.filter(r => r.status === 'REJECTED');

  const handleDeployAll = async (notes?: string) => {
    if (approved.length === 0) return;
    
    const requestIds = approved.map(r => r.id);
    await deployApprovedChanges(requestIds, notes);
    setShowDeployModal(false);
  };

  // Calculate summary for approved changes
  const approvedSummary = approved.length > 0
    ? (() => {
        const allDetails: any[] = [];
        approved.forEach(req => {
          // Assuming change_details are loaded with the request
          if (req.change_details) {
            allDetails.push(...req.change_details);
          }
        });
        return calculateSnapshotMetadata(allDetails);
      })()
    : { totalTables: 0, totalChanges: 0, tables: {} };

  return (
    <div className="space-y-6">
      {/* Pending Approval Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <CardTitle>Pending Approval</CardTitle>
              <Badge variant="outline">{pendingApproval.length}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {pendingApproval.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No changes pending approval
            </p>
          ) : (
            <div className="space-y-4">
              {pendingApproval.map(request => (
                <ChangeRequestCard
                  key={request.id}
                  request={request}
                  onApprove={onApprove}
                  onReject={onReject}
                  onViewDetails={onViewDetails}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Approved - Ready to Deploy Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <CardTitle>Approved (Ready to Deploy)</CardTitle>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {approved.length}
              </Badge>
            </div>
            {approved.length > 0 && (
              <Button
                onClick={() => setShowDeployModal(true)}
                disabled={isLoading}
                size="sm"
              >
                <Rocket className="h-4 w-4 mr-2" />
                Deploy All Approved
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {approved.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No approved changes ready to deploy
            </p>
          ) : (
            <div className="space-y-4">
              {approved.map(request => (
                <ChangeRequestCard
                  key={request.id}
                  request={request}
                  onApprove={onApprove}
                  onReject={onReject}
                  onViewDetails={onViewDetails}
                  showDeployButton
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rejected Section */}
      {rejected.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <CardTitle>Rejected</CardTitle>
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                {rejected.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rejected.map(request => (
                <ChangeRequestCard
                  key={request.id}
                  request={request}
                  onApprove={onApprove}
                  onReject={onReject}
                  onViewDetails={onViewDetails}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Deploy Modal */}
      <DeployNowModal
        open={showDeployModal}
        onOpenChange={setShowDeployModal}
        onConfirm={handleDeployAll}
        changeRequestIds={approved.map(r => r.id)}
        summary={approvedSummary}
        isLoading={isLoading}
      />
    </div>
  );
};

export default PendingChangesList;
