
import React, { useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useSupabaseApplicationDetail } from '@/hooks/useSupabaseApplicationDetail';
import ApplicationDetailLayout from '@/components/applications/ApplicationDetails/ApplicationDetailLayout';

// Define the tabs configuration at the module level
const tabs = [
  { id: 'details', label: 'Application Details' },
  { id: 'financial-summary', label: 'Financial Summary' },
  { id: 'order-details', label: 'Order Details' },
  { id: 'funding', label: 'Funding' },
  { id: 'risk-compliance', label: 'Risk & Compliance' },
  { id: 'documents', label: 'Documents' },
  { id: 'history', label: 'Application History' },
  { id: 'notes', label: 'Notes' },
];

const ApplicationDetail = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [activeItem, setActiveItem] = React.useState('Applications');
  const { id, tab = 'details' } = useParams<{ id: string; tab?: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const { 
    application,
    loading
  } = useSupabaseApplicationDetail(id);

  // When lender or section params are present, ensure we're on the financial-summary tab
  useEffect(() => {
    const lenderParam = searchParams.get('lender');
    const sectionParam = searchParams.get('section');
    
    if ((lenderParam || sectionParam) && tab !== 'financial-summary') {
      navigate(`/applications/${id}/financial-summary${window.location.search}`);
    }
  }, [searchParams, tab, id, navigate]);

  // Handle tab clicks for the combined view sections
  const handleTabNavigation = (tabId: string) => {
    // If clicking on details, financial-summary, or order-details, 
    // navigate to details tab but pass the section for scrolling
    if (['details', 'financial-summary', 'order-details'].includes(tabId)) {
      if (tabId === 'details') {
        navigate(`/applications/${id}`);
      } else {
        navigate(`/applications/${id}/${tabId}`);
      }
    } else {
      // For other tabs, navigate normally
      navigate(`/applications/${id}/${tabId}`);
    }
  };

  if (loading || !application) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <ApplicationDetailLayout
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      activeItem={activeItem}
      setActiveItem={setActiveItem}
      tabs={tabs}
      currentTab={tab}
      applicationId={id}
      applicationDetails={application as any}
      applicationFullDetails={application as any}
      notes={application.notesArray || []}
      onTabNavigation={handleTabNavigation}
    />
  );
};

export default ApplicationDetail;
