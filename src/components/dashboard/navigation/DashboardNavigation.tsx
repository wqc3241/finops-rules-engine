import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Folder, Plus, LayoutDashboard, FolderOpen } from 'lucide-react';
import { useDashboardFolders } from '@/hooks/useDashboardFolders';
import { useCustomDashboards } from '@/hooks/useCustomDashboards';
import { cn } from '@/lib/utils';

interface DashboardNavigationProps {
  selectedFolderId: string | null;
  onFolderSelect: (folderId: string | null) => void;
  selectedDashboardId: string | null;
  onDashboardSelect: (dashboardId: string) => void;
  onCreateDashboard: () => void;
  onManageFolders: () => void;
}

const DashboardNavigation: React.FC<DashboardNavigationProps> = ({
  selectedFolderId,
  onFolderSelect,
  selectedDashboardId,
  onDashboardSelect,
  onCreateDashboard,
  onManageFolders,
}) => {
  const { data: folders } = useDashboardFolders();
  const { data: dashboards } = useCustomDashboards(selectedFolderId);

  const selectedDashboard = dashboards?.find(d => d.id === selectedDashboardId);

  return (
    <div className="border-b bg-background sticky top-0 z-10">
      <div className="flex items-center gap-4 px-4 py-3">
        {/* Left: Action Buttons */}
        <div className="flex gap-2 shrink-0">
          <Button size="sm" onClick={onCreateDashboard}>
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline ml-2">New Dashboard</span>
          </Button>
          <Button size="sm" variant="outline" onClick={onManageFolders}>
            <Folder className="h-4 w-4" />
            <span className="hidden sm:inline ml-2">Manage Folders</span>
          </Button>
        </div>

        {/* Middle: Folder Tabs */}
        <ScrollArea className="flex-1 max-w-2xl">
          <div className="flex gap-2 pb-2">
            <button
              onClick={() => onFolderSelect(null)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
                selectedFolderId === null
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              )}
            >
              <LayoutDashboard className="h-4 w-4" />
              All Dashboards
            </button>
            {folders?.map((folder) => (
              <button
                key={folder.id}
                onClick={() => onFolderSelect(folder.id)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
                  selectedFolderId === folder.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                )}
              >
                {selectedFolderId === folder.id ? (
                  <FolderOpen className="h-4 w-4" />
                ) : (
                  <Folder className="h-4 w-4" />
                )}
                {folder.name}
              </button>
            ))}
          </div>
        </ScrollArea>

        {/* Right: Dashboard Selector */}
        {dashboards && dashboards.length > 0 && (
          <Select value={selectedDashboardId || ''} onValueChange={onDashboardSelect}>
            <SelectTrigger className="w-[250px] shrink-0">
              <SelectValue placeholder="Select dashboard...">
                {selectedDashboard?.name || 'Select dashboard...'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {dashboards.map((dashboard) => (
                <SelectItem key={dashboard.id} value={dashboard.id}>
                  {dashboard.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
};

export default DashboardNavigation;
