import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Edit, Save, Plus, Settings } from 'lucide-react';
import { CustomDashboard } from '@/hooks/useCustomDashboards';

interface DashboardHeaderProps {
  dashboard: CustomDashboard | null;
  editMode: boolean;
  onToggleEdit: () => void;
  onAddComponent?: () => void;
  onSettings?: () => void;
  onRefresh?: () => void;
  lastRefreshed?: string | null;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  dashboard,
  editMode,
  onToggleEdit,
  onAddComponent,
  onSettings,
  onRefresh,
  lastRefreshed,
}) => {
  if (!dashboard) {
    return (
      <div className="border-b bg-background p-4">
        <h1 className="text-2xl font-bold">Select a dashboard</h1>
      </div>
    );
  }

  return (
    <div className="border-b bg-background p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{dashboard.name}</h1>
          {dashboard.description && (
            <p className="text-sm text-muted-foreground">{dashboard.description}</p>
          )}
          {lastRefreshed && (
            <p className="text-xs text-muted-foreground mt-1">
              Last refreshed: {new Date(lastRefreshed).toLocaleString()}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {editMode && (
            <Button variant="outline" onClick={onAddComponent}>
              <Plus className="h-4 w-4 mr-2" />
              Add Component
            </Button>
          )}
          <Button variant="outline" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" onClick={onSettings}>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button onClick={onToggleEdit}>
            {editMode ? (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save
              </>
            ) : (
              <>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
