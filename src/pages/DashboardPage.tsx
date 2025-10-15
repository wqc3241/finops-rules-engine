import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { useCustomDashboards } from "@/hooks/useCustomDashboards";
import { useDashboardComponents } from "@/hooks/useDashboardComponents";
import { useDashboardLayout } from "@/hooks/useDashboardLayout";
import { useDashboardFilters } from "@/hooks/useDashboardFilters";
import CreateDashboardModal from "@/components/dashboard/CreateDashboardModal";
import FolderSidebar from "@/components/dashboard/sidebar/FolderSidebar";
import DashboardHeader from "@/components/dashboard/layout/DashboardHeader";
import FilterBar from "@/components/dashboard/layout/FilterBar";
import DashboardGrid from "@/components/dashboard/layout/DashboardGrid";
import AddComponentModal from "@/components/dashboard/modals/AddComponentModal";
import DashboardSettingsModal from "@/components/dashboard/modals/DashboardSettingsModal";
import FolderManagementModal from "@/components/dashboard/modals/FolderManagementModal";
import { Layout } from "react-grid-layout";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const DashboardPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeItem, setActiveItem] = useState('Dashboard');
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [selectedDashboardId, setSelectedDashboardId] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddComponentModal, setShowAddComponentModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);

  const { data: dashboards } = useCustomDashboards(selectedFolderId);
  const { data: components } = useDashboardComponents(selectedDashboardId);
  const { layout, setLayout, saveLayout } = useDashboardLayout(selectedDashboardId);
  const { filters, updateFilter, clearFilters } = useDashboardFilters([]);
  
  const queryClient = useQueryClient();

  const selectedDashboard = dashboards?.find(d => d.id === selectedDashboardId);

  const handleLayoutChange = (newLayout: Layout[]) => {
    setLayout(newLayout);
    if (editMode) {
      saveLayout.mutate(newLayout);
    }
  };

  const refreshDashboard = useMutation({
    mutationFn: async () => {
      if (!selectedDashboardId) return;
      const { error } = await supabase
        .from('custom_dashboards')
        .update({ last_refreshed_at: new Date().toISOString() })
        .eq('id', selectedDashboardId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-dashboards'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-components'] });
    },
  });

  return (
    <div className="h-screen flex flex-col bg-background">
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar open={sidebarOpen} activeItem={activeItem} setActiveItem={setActiveItem} />
        <div className="flex-1 flex overflow-hidden">
          <FolderSidebar
            selectedFolderId={selectedFolderId}
            onFolderSelect={setSelectedFolderId}
            selectedDashboardId={selectedDashboardId}
            onDashboardSelect={setSelectedDashboardId}
            onCreateDashboard={() => setShowCreateModal(true)}
            onManageFolders={() => setShowFolderModal(true)}
          />
          <main className="flex-1 flex flex-col overflow-hidden">
            {selectedDashboard ? (
              <>
                <DashboardHeader
                  dashboard={selectedDashboard}
                  editMode={editMode}
                  onToggleEdit={() => setEditMode(!editMode)}
                  onAddComponent={() => setShowAddComponentModal(true)}
                  onSettings={() => setShowSettingsModal(true)}
                  onRefresh={() => refreshDashboard.mutate()}
                  lastRefreshed={selectedDashboard.last_refreshed_at}
                />
                <FilterBar
                  filters={filters}
                  onFilterChange={updateFilter}
                  onClearFilters={clearFilters}
                />
                <div className="flex-1 overflow-auto p-4 bg-muted/30">
                  {components && components.length > 0 ? (
                    <DashboardGrid
                      components={components}
                      layout={layout}
                      editMode={editMode}
                      onLayoutChange={handleLayoutChange}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <p className="text-muted-foreground mb-4">
                          No components yet. {editMode ? 'Click "Add Component" to get started.' : 'Enable edit mode to add components.'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-4">Welcome to Dashboards</h2>
                  <p className="text-muted-foreground mb-4">
                    Select a dashboard from the sidebar or create a new one
                  </p>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      <CreateDashboardModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />

      {selectedDashboardId && (
        <>
          <AddComponentModal
            open={showAddComponentModal}
            onOpenChange={setShowAddComponentModal}
            dashboardId={selectedDashboardId}
          />
          {selectedDashboard && (
            <DashboardSettingsModal
              open={showSettingsModal}
              onOpenChange={setShowSettingsModal}
              dashboard={selectedDashboard}
            />
          )}
        </>
      )}

      <FolderManagementModal
        open={showFolderModal}
        onOpenChange={setShowFolderModal}
      />
    </div>
  );
};

export default DashboardPage;
