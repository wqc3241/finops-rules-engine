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
import { applications as initialApplications } from '@/data/mockApplications';
import { useApplicationFiltering } from "@/hooks/useApplicationFiltering";

// Storage keys for applications data
const APPLICATIONS_STORAGE_KEY = 'lucidApplicationsData';
const APPLICATIONS_UPDATE_KEY = 'lucidApplicationsLastUpdate';

const Applications = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [activeItem, setActiveItem] = React.useState('Applications');
  const [refreshTrigger, setRefreshTrigger] = React.useState(0);
  const [currentView, setCurrentView] = React.useState<ViewType>('list');
  const [selectedDateRange, setSelectedDateRange] = React.useState<DateRange>('all');
  
  const {
    sortOption,
    setSortOption,
    sortDirection,
    setSortDirection,
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
    toggleSortDirection,
  } = useApplicationFiltering(initialApplications);
  
  // Only refresh when the component mounts to ensure state values are updated
  // without clearing existing application data
  useEffect(() => {
    // Create a small delay to avoid immediate refresh
    const timer = setTimeout(() => {
      setRefreshTrigger(prev => prev + 1);
    }, 100);
    return () => clearTimeout(timer);
  }, []);
  
  // Track localStorage changes to refresh the application list
  useEffect(() => {
    // Create a function to check for updates
    const checkForUpdates = () => {
      // Only refresh if there's an actual update
      const lastUpdate = localStorage.getItem(APPLICATIONS_UPDATE_KEY);
      if (lastUpdate) {
        const lastUpdateTime = new Date(lastUpdate).getTime();
        const lastRefreshTime = parseInt(localStorage.getItem('lastRefreshTime') || '0');
        
        // Only refresh if there's a new update since our last refresh
        if (lastUpdateTime > lastRefreshTime) {
          localStorage.setItem('lastRefreshTime', Date.now().toString());
          setRefreshTrigger(prev => prev + 1);
        }
      }
    };
    
    // Set initial refresh time
    if (!localStorage.getItem('lastRefreshTime')) {
      localStorage.setItem('lastRefreshTime', Date.now().toString());
    }
    
    // Listen for storage events from other tabs/windows
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === APPLICATIONS_STORAGE_KEY || event.key === APPLICATIONS_UPDATE_KEY) {
        checkForUpdates();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Initial check for updates
    checkForUpdates();
    
    // Set up a global listener for note updates
    const originalUpdateFn = (window as any).updateApplicationNotes;
    
    if (typeof window !== 'undefined') {
      (window as any).updateApplicationNotes = (appId: string, newNote: any) => {
        // Call the original function to update the global state
        if (originalUpdateFn) {
          originalUpdateFn(appId, newNote);
        }
        
        // Update lastUpdate time to trigger refresh
        localStorage.setItem(APPLICATIONS_UPDATE_KEY, new Date().toISOString());
        
        // Trigger a refresh of the applications list
        checkForUpdates();
        
        // Force refresh every time a note is added
        setRefreshTrigger(prev => prev + 1);
      };
    }
    
    return () => {
      // Clean up event listeners
      window.removeEventListener('storage', handleStorageChange);
      
      // Restore the original function when component unmounts
      if (typeof window !== 'undefined') {
        (window as any).updateApplicationNotes = originalUpdateFn;
      }
    };
  }, []);

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
                {currentView === 'list' ? (
                  <ApplicationList 
                    key={refreshTrigger} 
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
