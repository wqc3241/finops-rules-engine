import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import ApplicationList from "@/components/applications/ApplicationList";
import KanbanView from "@/components/applications/KanbanView";
import ViewSelector, { ViewType } from "@/components/applications/ViewSelector";
import { TooltipProvider } from "@/components/ui/tooltip";
import SortPopover from "@/components/applications/filters/SortPopover";
import FilterPopover from "@/components/applications/filters/FilterPopover";
import DateRangeFilter, { DateRange } from "@/components/applications/filters/DateRangeFilter";
import { useSupabaseApplications } from "@/hooks/useSupabaseApplications";

const Applications = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [activeItem, setActiveItem] = React.useState('Applications');
  const [currentView, setCurrentView] = React.useState<ViewType>('list');
  const [selectedDateRange, setSelectedDateRange] = React.useState<DateRange>('all');
  
  const {
    loading,
    sortOption,
    setSortOption,
    sortDirection,
    setSortDirection,
    toggleSortDirection,
    statusFilters,
    typeFilters,
    stateFilters,
    uniqueStatuses,
    uniqueTypes,
    uniqueStates,
    filteredApplications,
    toggleStatusFilter,
    toggleTypeFilter,
    toggleStateFilter,
    clearFilters,
  } = useSupabaseApplications();

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          open={sidebarOpen}
          activeItem={activeItem}
          setActiveItem={setActiveItem} 
        />
        <main className="flex-1 overflow-auto p-4">
          <div className="container mx-auto px-4 py-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">Applications</h1>
                <div className="flex gap-4 items-center">
                  <ViewSelector 
                    currentView={currentView}
                    onViewChange={setCurrentView}
                  />
                  <SortPopover 
                    sortOption={sortOption}
                    sortDirection={sortDirection}
                    setSortOption={setSortOption}
                    setSortDirection={setSortDirection}
                    toggleSortDirection={toggleSortDirection}
                  />
                  <DateRangeFilter
                    selectedRange={selectedDateRange}
                    onRangeChange={setSelectedDateRange}
                  />
                  <FilterPopover 
                    uniqueStatuses={uniqueStatuses}
                    uniqueTypes={uniqueTypes}
                    uniqueStates={uniqueStates}
                    statusFilters={statusFilters}
                    typeFilters={typeFilters}
                    stateFilters={stateFilters}
                    toggleStatusFilter={toggleStatusFilter}
                    toggleTypeFilter={toggleTypeFilter}
                    toggleStateFilter={toggleStateFilter}
                    clearFilters={clearFilters}
                  />
                </div>
              </div>
              <TooltipProvider>
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : currentView === 'list' ? (
                  <ApplicationList 
                    applications={filteredApplications}
                    clearFilters={clearFilters}
                  />
                ) : (
                  <KanbanView applications={filteredApplications} />
                )}
              </TooltipProvider>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Applications;
