
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useApplicationDetail } from '@/hooks/useApplicationDetail';
import ApplicationDetailLayout from '@/components/applications/ApplicationDetails/ApplicationDetailLayout';

// Define the tabs configuration at the module level
const tabs = [
  { id: 'details', label: 'Application Details' },
  { id: 'financial-summary', label: 'Financial Summary' },
  { id: 'order-details', label: 'Order Details' },
  { id: 'funding', label: 'Funding' },
  { id: 'risk-compliance', label: 'Risk & Compliance' },
  { id: 'history', label: 'Application History' },
  { id: 'notes', label: 'Notes' },
];

const ApplicationDetail = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [activeItem, setActiveItem] = React.useState('Applications');
  const { id, tab = 'details' } = useParams<{ id: string; tab?: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Use our custom hook to manage application details
  const { 
    currentNotes,
    currentApplicationDetails,
    currentApplicationFullDetails,
    refreshNotesFromStorage
  } = useApplicationDetail(id);
  
  // Refresh notes when tab changes to Notes tab
  useEffect(() => {
    if (tab === 'notes') {
      refreshNotesFromStorage();
    }
  }, [tab, refreshNotesFromStorage]);

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

  return (
    <ApplicationDetailLayout
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      activeItem={activeItem}
      setActiveItem={setActiveItem}
      tabs={tabs}
      currentTab={tab}
      applicationId={id}
      applicationDetails={currentApplicationDetails}
      applicationFullDetails={currentApplicationFullDetails}
      notes={currentNotes}
      onTabNavigation={handleTabNavigation}
    />
  );
};

export default ApplicationDetail;
