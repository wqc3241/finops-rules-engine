import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Folder, Plus, LayoutDashboard, FolderOpen } from 'lucide-react';
import { useDashboardFolders } from '@/hooks/useDashboardFolders';
import { useCustomDashboards } from '@/hooks/useCustomDashboards';
import { cn } from '@/lib/utils';

interface FolderSidebarProps {
  selectedFolderId: string | null;
  onFolderSelect: (folderId: string | null) => void;
  selectedDashboardId: string | null;
  onDashboardSelect: (dashboardId: string) => void;
  onCreateDashboard: () => void;
  onManageFolders: () => void;
}

const FolderSidebar: React.FC<FolderSidebarProps> = ({
  selectedFolderId,
  onFolderSelect,
  selectedDashboardId,
  onDashboardSelect,
  onCreateDashboard,
  onManageFolders,
}) => {
  const { data: folders } = useDashboardFolders();
  const { data: rootDashboards } = useCustomDashboards(null);
  const { data: folderDashboards } = useCustomDashboards(selectedFolderId);

  const dashboards = selectedFolderId ? folderDashboards : rootDashboards;

  return (
    <div className="w-64 border-r bg-muted/50 flex flex-col">
      <div className="p-4 border-b">
        <h2 className="font-semibold mb-2">Dashboards</h2>
        <div className="space-y-2">
          <Button className="w-full justify-start" size="sm" onClick={onCreateDashboard}>
            <Plus className="h-4 w-4 mr-2" />
            New Dashboard
          </Button>
          <Button className="w-full justify-start" size="sm" variant="outline" onClick={onManageFolders}>
            <Folder className="h-4 w-4 mr-2" />
            Manage Folders
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {/* Root Level */}
          <button
            onClick={() => onFolderSelect(null)}
            className={cn(
              "w-full text-left p-2 rounded hover:bg-accent transition-colors flex items-center gap-2",
              selectedFolderId === null && "bg-accent"
            )}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span className="text-sm">All Dashboards</span>
          </button>

          {/* Folders */}
          {folders?.map((folder) => (
            <div key={folder.id}>
              <button
                onClick={() => onFolderSelect(folder.id)}
                className={cn(
                  "w-full text-left p-2 rounded hover:bg-accent transition-colors flex items-center gap-2",
                  selectedFolderId === folder.id && "bg-accent"
                )}
              >
                {selectedFolderId === folder.id ? (
                  <FolderOpen className="h-4 w-4" />
                ) : (
                  <Folder className="h-4 w-4" />
                )}
                <span className="text-sm">{folder.name}</span>
              </button>
            </div>
          ))}
        </div>

        {/* Dashboards in selected folder/root */}
        {dashboards && dashboards.length > 0 && (
          <div className="px-4 pb-4">
            <div className="text-xs font-medium text-muted-foreground mb-2 px-2">
              {selectedFolderId ? 'Dashboards in folder' : 'Root dashboards'}
            </div>
            <div className="space-y-1">
              {dashboards.map((dashboard) => (
                <button
                  key={dashboard.id}
                  onClick={() => onDashboardSelect(dashboard.id)}
                  className={cn(
                    "w-full text-left p-2 pl-6 rounded hover:bg-accent transition-colors text-sm",
                    selectedDashboardId === dashboard.id && "bg-accent font-medium"
                  )}
                >
                  {dashboard.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default FolderSidebar;
