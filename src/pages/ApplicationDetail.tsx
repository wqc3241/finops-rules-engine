
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { applicationDetails, getMockApplicationDetailsById } from '@/data/mockApplications';
import { applications } from '@/data/mock/applicationsData';
import ApplicationHeader from '@/components/applications/ApplicationDetails/ApplicationHeader';
import ApplicationTabs from '@/components/applications/ApplicationDetails/ApplicationTabs';
import ApplicationData from '@/components/applications/ApplicationDetails/ApplicationData';
import DealStructureSection from '@/components/applications/ApplicationDetails/DealStructure/DealStructureSection';
import OrderDetailsView from '@/components/applications/ApplicationDetails/OrderDetailsView';
import ApplicationHistoryView from '@/components/applications/ApplicationDetails/ApplicationHistoryView';
import NotesView from '@/components/applications/ApplicationDetails/NotesView';
import FinancialSummaryView from '@/components/applications/ApplicationDetails/FinancialSummaryView';
import { notes as defaultNotes } from '@/data/mock/history';
import { ApplicationDetails, Note } from '@/types/application';

const tabs = [
  { id: 'details', label: 'Application Details' },
  { id: 'financial-summary', label: 'Financial Summary' },
  { id: 'order-details', label: 'Order Details' },
  { id: 'history', label: 'Application History' },
  { id: 'notes', label: 'Notes' },
];

// Storage key for applications data
const APPLICATIONS_STORAGE_KEY = 'lucidApplicationsData';

const ApplicationDetail = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [activeItem, setActiveItem] = React.useState('Applications');
  const { id, tab = 'details' } = useParams<{ id: string; tab?: string }>();
  const [currentNotes, setCurrentNotes] = useState<Note[]>(defaultNotes);
  const [currentApplicationDetails, setCurrentApplicationDetails] = useState<ApplicationDetails>(applicationDetails.details);
  const [currentApplicationFullDetails, setCurrentApplicationFullDetails] = useState(applicationDetails);
  const [lastRefreshTime, setLastRefreshTime] = useState(Date.now());

  // Load applications from localStorage
  const getStoredApplications = () => {
    try {
      const storedApps = localStorage.getItem(APPLICATIONS_STORAGE_KEY);
      if (storedApps) {
        return JSON.parse(storedApps);
      }
    } catch (error) {
      console.error("Error loading stored applications:", error);
    }
    return applications; // Fallback to static data
  };

  // Find current application and use its data
  useEffect(() => {
    if (id) {
      // Try to get application from localStorage first
      const storedApplications = getStoredApplications();
      const currentApp = storedApplications.find((app: any) => app.id === id);

      if (currentApp) {
        // If we found the application, create application details object with the correct status
        setCurrentApplicationDetails({
          ...applicationDetails.details,
          status: currentApp.status,
          orderNumber: currentApp.orderNumber,
          orderedBy: currentApp.name,
          // Keep other properties from applicationDetails.details
          model: applicationDetails.details.model,
          edition: applicationDetails.details.edition
        });
        
        // Set notes if available - directly from localStorage
        if (currentApp.notesArray && currentApp.notesArray.length > 0) {
          setCurrentNotes(currentApp.notesArray);
        } else {
          setCurrentNotes([]); // Reset notes if none found
        }
        
        // Try to get extended mock data for this application
        try {
          const mockDetails = getMockApplicationDetailsById(id);
          if (mockDetails) {
            setCurrentApplicationFullDetails({
              ...mockDetails,
              // Ensure we use the correct notes from localStorage
              notes: currentApp.notesArray || []
            });
            
            // Use the more detailed application details if available
            setCurrentApplicationDetails({
              ...mockDetails.details,
              // Make sure we're using accurate information from the card
              status: currentApp.status,
              orderNumber: currentApp.orderNumber,
              orderedBy: currentApp.name
            });
          }
        } catch (error) {
          console.log('No extended mock data found for this application ID, using default data');
        }
      }
    }
  }, [id, lastRefreshTime]);

  // Function to refresh notes from localStorage
  const refreshNotesFromStorage = () => {
    if (id) {
      const storedApplications = getStoredApplications();
      const updatedApp = storedApplications.find((app: any) => app.id === id);
      
      if (updatedApp && updatedApp.notesArray) {
        setCurrentNotes(updatedApp.notesArray);
      }
    }
  };

  // Setup the global notes update function
  useEffect(() => {
    const originalUpdateFn = (window as any).updateApplicationNotes;
    
    // Define our new update function that will also update local state
    const updateNotesFunction = (appId: string, newNote: Note) => {
      // Call original function if it exists (to update global state)
      if (originalUpdateFn) {
        originalUpdateFn(appId, newNote);
      }
      
      // Update local state immediately if this is the current application
      if (appId === id) {
        setCurrentNotes(prev => [newNote, ...prev]);
        setLastRefreshTime(Date.now()); // Trigger a refresh
      }
    };
    
    // Set the global function
    if (typeof window !== 'undefined') {
      (window as any).updateApplicationNotes = updateNotesFunction;
    }
    
    // Clean up - restore original function when unmounting
    return () => {
      if (typeof window !== 'undefined') {
        (window as any).updateApplicationNotes = originalUpdateFn;
      }
    };
  }, [id]);
  
  // Refresh notes when tab changes to Notes tab
  useEffect(() => {
    if (tab === 'notes') {
      refreshNotesFromStorage();
    }
  }, [tab]);

  // Determine which content to show based on the current tab
  const renderTabContent = () => {
    switch (tab) {
      case 'financial-summary':
        return <FinancialSummaryView financialSummary={currentApplicationFullDetails.financialSummary} />;
      case 'order-details':
        return <OrderDetailsView orderDetails={currentApplicationFullDetails.orderDetails} />;
      case 'history':
        return <ApplicationHistoryView history={currentApplicationFullDetails.history} />;
      case 'notes':
        return <NotesView notes={currentNotes} />;
      case 'details':
      default:
        return (
          <>
            <ApplicationData
              applicantInfo={currentApplicationFullDetails.applicantInfo}
              coApplicantInfo={currentApplicationFullDetails.coApplicantInfo}
              vehicleData={currentApplicationFullDetails.vehicleData}
              appDtReferences={currentApplicationFullDetails.appDtReferences}
            />
            <DealStructureSection dealStructure={currentApplicationFullDetails.dealStructure} />
          </>
        );
    }
  };

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
            <ApplicationHeader details={currentApplicationDetails} />
            <ApplicationTabs tabs={tabs} baseUrl={`/applications/${id}`} />
            {renderTabContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ApplicationDetail;
