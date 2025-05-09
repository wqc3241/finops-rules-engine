
import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import ApplicationList from "@/components/applications/ApplicationList";
import { TooltipProvider } from "@/components/ui/tooltip";

const Applications = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [activeItem, setActiveItem] = React.useState('Applications');
  const [refreshTrigger, setRefreshTrigger] = React.useState(0);

  // Set up a global listener for note updates
  useEffect(() => {
    const originalUpdateFn = (window as any).updateApplicationNotes;
    
    if (typeof window !== 'undefined') {
      (window as any).updateApplicationNotes = (appId: string, newNote: any) => {
        // Call the original function to update the global state
        if (originalUpdateFn) {
          originalUpdateFn(appId, newNote);
        }
        
        // Trigger a refresh by updating the state, but only if the original function didn't handle it
        // This is a fallback for when we're on the applications list page
        setRefreshTrigger(prev => prev + 1);
      };
    }
    
    return () => {
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
