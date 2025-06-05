
import React from 'react';
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import ApplicationHeader from '@/components/applications/ApplicationDetails/ApplicationHeader';
import ApplicationTabs from '@/components/applications/ApplicationDetails/ApplicationTabs';
import TabContent from '@/components/applications/ApplicationDetails/TabContent';
import { ApplicationDetails, Note } from '@/types/application';

interface ApplicationDetailLayoutProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeItem: string;
  setActiveItem: (item: string) => void;
  tabs: Array<{ id: string; label: string }>;
  currentTab?: string;
  applicationId?: string;
  applicationDetails: ApplicationDetails;
  applicationFullDetails: any;
  notes: Note[];
  onTabNavigation?: (tabId: string) => void;
}

const ApplicationDetailLayout: React.FC<ApplicationDetailLayoutProps> = ({
  sidebarOpen,
  setSidebarOpen,
  activeItem,
  setActiveItem,
  tabs,
  currentTab,
  applicationId,
  applicationDetails,
  applicationFullDetails,
  notes,
  onTabNavigation
}) => {
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
            <ApplicationHeader details={applicationDetails} />
            <ApplicationTabs 
              tabs={tabs} 
              baseUrl={`/applications/${applicationId}`}
              onTabClick={onTabNavigation}
            />
            <TabContent 
              tab={currentTab} 
              applicationFullDetails={applicationFullDetails}
              notes={notes}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ApplicationDetailLayout;
