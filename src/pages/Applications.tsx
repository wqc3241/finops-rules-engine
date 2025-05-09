
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import ApplicationList from "@/components/applications/ApplicationList";
import { TooltipProvider } from "@/components/ui/tooltip";

// Storage key for detecting updates to applications
const APPLICATIONS_UPDATE_KEY = 'lucidApplicationsLastUpdate';

const Applications = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [activeItem, setActiveItem] = React.useState('Applications');
  const [refreshTrigger, setRefreshTrigger] = React.useState(0);
  
  // Track localStorage changes to refresh the application list
  useEffect(() => {
    // Create a function to check for updates
    const checkForUpdates = () => {
      setRefreshTrigger(prev => prev + 1);
    };
    
    // Listen for storage events from other tabs/windows
    window.addEventListener('storage', (event) => {
      if (event.key === 'lucidApplicationsData') {
        checkForUpdates();
      }
    });
    
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
      };
    }
    
    // Set up an interval to periodically check for updates
    const intervalId = setInterval(checkForUpdates, 5000);
    
    return () => {
      // Clean up event listeners and intervals
      window.removeEventListener('storage', checkForUpdates);
      clearInterval(intervalId);
      
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
              <h1 className="text-2xl font-semibold mb-6">Applications</h1>
              <TooltipProvider>
                <ApplicationList key={refreshTrigger} />
              </TooltipProvider>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Applications;
