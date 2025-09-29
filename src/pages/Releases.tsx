import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GitBranch } from 'lucide-react';
import DeploymentScheduleBanner from '@/components/releases/DeploymentScheduleBanner';
import PendingChangesList from '@/components/releases/PendingChangesList';
import DeploymentHistoryList from '@/components/releases/DeploymentHistoryList';
import { useDeploymentVersions } from '@/hooks/useDeploymentVersions';
import { useSupabaseApprovalWorkflow } from '@/hooks/useSupabaseApprovalWorkflow';

const Releases = () => {
  const { versions, schedule, isLoading: versionsLoading } = useDeploymentVersions();
  const { 
    getPendingRequestsForAdmin, 
    approveChangeRequest, 
    rejectChangeRequest 
  } = useSupabaseApprovalWorkflow();
  
  const [changeRequests, setChangeRequests] = useState<any[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);

  useEffect(() => {
    loadChangeRequests();
  }, []);

  const loadChangeRequests = async () => {
    setIsLoadingRequests(true);
    const requests = await getPendingRequestsForAdmin();
    setChangeRequests(requests);
    setIsLoadingRequests(false);
  };

  const handleApprove = async (requestId: string) => {
    await approveChangeRequest(requestId);
    await loadChangeRequests();
  };

  const handleReject = async (requestId: string) => {
    await rejectChangeRequest(requestId);
    await loadChangeRequests();
  };

  const handleViewDetails = (requestId: string) => {
    // Navigate to approval workflow page with this request
    window.location.href = `/approval-workflow?requestId=${requestId}`;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <GitBranch className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Releases Management</h1>
          <p className="text-muted-foreground">
            Manage deployments and version control for your configuration changes
          </p>
        </div>
      </div>

      <DeploymentScheduleBanner schedule={schedule} />

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">
            Pending Changes
            {changeRequests.length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">
                {changeRequests.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="history">
            Deployment History
            {versions.length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-full">
                {versions.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {isLoadingRequests ? (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-4">Loading change requests...</p>
              </CardContent>
            </Card>
          ) : (
            <PendingChangesList
              changeRequests={changeRequests}
              onApprove={handleApprove}
              onReject={handleReject}
              onViewDetails={handleViewDetails}
            />
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {versionsLoading ? (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-4">Loading deployment history...</p>
              </CardContent>
            </Card>
          ) : (
            <DeploymentHistoryList versions={versions} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Releases;
