import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RotateCcw, Package, Clock, User } from 'lucide-react';
import { DeploymentVersion } from '@/types/deployment';
import { formatVersionNumber, formatDeploymentType, getDeploymentStatusColor } from '@/utils/deploymentUtils';
import { format } from 'date-fns';
import RevertVersionModal from './RevertVersionModal';
import { useDeploymentVersions } from '@/hooks/useDeploymentVersions';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DeploymentHistoryListProps {
  versions: DeploymentVersion[];
}

const DeploymentHistoryList = ({ versions }: DeploymentHistoryListProps) => {
  const [filterType, setFilterType] = useState<'all' | 'auto' | 'manual'>('all');
  const [showRevertModal, setShowRevertModal] = useState(false);
  const [targetVersion, setTargetVersion] = useState<DeploymentVersion | null>(null);
  const { revertToVersion, isLoading } = useDeploymentVersions();

  const currentVersion = versions.find(v => v.status === 'active');
  
  const filteredVersions = versions.filter(v => {
    if (filterType === 'all') return true;
    return v.deployment_type === filterType;
  });

  const handleRevert = (version: DeploymentVersion) => {
    setTargetVersion(version);
    setShowRevertModal(true);
  };

  const confirmRevert = async (reason: string) => {
    if (!targetVersion) return;
    
    await revertToVersion(targetVersion.id, reason);
    setShowRevertModal(false);
    setTargetVersion(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Showing deployments from the last 7 days
        </p>
        <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Deployments</SelectItem>
            <SelectItem value="manual">Manual Only</SelectItem>
            <SelectItem value="auto">Automatic Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filteredVersions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No deployments found</p>
            </CardContent>
          </Card>
        ) : (
          filteredVersions.map((version) => {
            const isActive = version.status === 'active';
            const canRevert = !isActive && version.status !== 'reverted';

            return (
              <Card key={version.id} className={isActive ? 'border-primary shadow-md' : ''}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="font-mono text-lg font-bold">
                          v{formatVersionNumber(version.version_number)}
                        </h3>
                        <Badge
                          variant="outline"
                          className={version.deployment_type === 'auto' ? 'bg-blue-50' : 'bg-purple-50'}
                        >
                          {formatDeploymentType(version.deployment_type)}
                        </Badge>
                        <div className={`h-2 w-2 rounded-full ${getDeploymentStatusColor(version.status)}`} />
                        <span className="text-sm capitalize text-muted-foreground">
                          {version.status}
                        </span>
                        {version.is_rollback && (
                          <Badge variant="outline" className="bg-orange-50 text-orange-700">
                            Rollback
                          </Badge>
                        )}
                        {isActive && (
                          <Badge className="bg-green-500">Current</Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{format(new Date(version.deployed_at), 'PPpp')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <User className="h-4 w-4" />
                          <span>Deployed by User</span>
                        </div>
                      </div>

                      <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Changes:</span>
                          <span className="font-medium">{version.snapshot_metadata?.totalChanges || 0}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Tables Affected:</span>
                          <span className="font-medium">{version.snapshot_metadata?.totalTables || 0}</span>
                        </div>
                        {version.snapshot_metadata?.tables && (
                          <div className="border-t pt-2 mt-2">
                            <p className="text-xs text-muted-foreground mb-1">Tables:</p>
                            <div className="flex flex-wrap gap-1">
                              {Object.keys(version.snapshot_metadata.tables).map(table => (
                                <Badge key={table} variant="outline" className="text-xs">
                                  {table}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {version.notes && (
                        <p className="text-sm text-muted-foreground italic mt-3">
                          "{version.notes}"
                        </p>
                      )}
                    </div>

                    {canRevert && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRevert(version)}
                        className="ml-4 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Revert to This Version
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <RevertVersionModal
        open={showRevertModal}
        onOpenChange={setShowRevertModal}
        onConfirm={confirmRevert}
        targetVersion={targetVersion}
        currentVersion={currentVersion || null}
        isLoading={isLoading}
      />
    </div>
  );
};

export default DeploymentHistoryList;
