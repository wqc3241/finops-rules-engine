
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { applicationDetails } from '@/data/mockApplications';
import { applications } from '@/data/mock/applications'; // Import applications directly
import ApplicationHeader from '@/components/applications/ApplicationDetails/ApplicationHeader';
import ApplicationTabs from '@/components/applications/ApplicationDetails/ApplicationTabs';
import ApplicationData from '@/components/applications/ApplicationDetails/ApplicationData';
import DealStructureSection from '@/components/applications/ApplicationDetails/DealStructure/DealStructureSection';
import OrderDetailsView from '@/components/applications/ApplicationDetails/OrderDetailsView';
import ApplicationHistoryView from '@/components/applications/ApplicationDetails/ApplicationHistoryView';
import NotesView from '@/components/applications/ApplicationDetails/NotesView';
import FinancialSummaryView from '@/components/applications/ApplicationDetails/FinancialSummaryView';
import { notes as defaultNotes } from '@/data/mock/history';
import { ApplicationDetails } from '@/types/application';
import { getMockApplicationDetailsById } from '@/data/mock/applicationDetailsMock';

const tabs = [
  { id: 'details', label: 'Application Details' },
  { id: 'financial-summary', label: 'Financial Summary' },
  { id: 'order-details', label: 'Order Details' },
  { id: 'history', label: 'Application History' },
  { id: 'notes', label: 'Notes' },
];

const ApplicationDetail = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [activeItem, setActiveItem] = React.useState('Applications');
  const { id, tab = 'details' } = useParams<{ id: string; tab?: string }>();
  const [currentNotes, setCurrentNotes] = useState(defaultNotes);
  const [currentApplicationDetails, setCurrentApplicationDetails] = useState<ApplicationDetails>(applicationDetails.details);
  const [currentApplicationFullDetails, setCurrentApplicationFullDetails] = useState(applicationDetails);

  // Find current application and use its data
  useEffect(() => {
    if (id) {
      const currentApp = applications.find(app => app.id === id);
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
        
        // Set notes if available
        if (currentApp.notesArray && currentApp.notesArray.length > 0) {
          setCurrentNotes(currentApp.notesArray);
        }
        
        // Try to get extended mock data for this application
        try {
          const mockDetails = getMockApplicationDetailsById(id);
          if (mockDetails) {
            setCurrentApplicationFullDetails(mockDetails);
            // Use the more detailed application details if available
            setCurrentApplicationDetails(mockDetails.details);
            // Use the more detailed notes if available
            if (mockDetails.notes && mockDetails.notes.length > 0) {
              setCurrentNotes(mockDetails.notes);
            }
          }
        } catch (error) {
          console.log('No extended mock data found for this application ID, using default data');
        }
      }
    }
  }, [id]);

  // Subscribe to global notes updates
  useEffect(() => {
    const originalUpdateFn = (window as any).updateApplicationNotes;
    
    if (typeof window !== 'undefined') {
      (window as any).updateApplicationNotes = (appId: string, newNote: any) => {
        // Call the original function to update the global state
        if (originalUpdateFn) {
          originalUpdateFn(appId, newNote);
        }
        
        // Update local state if this is the current application
        if (appId === id) {
          setCurrentNotes(prev => [newNote, ...prev]);
        }
      };
    }
    
    return () => {
      // Restore the original function when component unmounts
      if (typeof window !== 'undefined') {
        (window as any).updateApplicationNotes = originalUpdateFn;
      }
    };
  }, [id]);

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
