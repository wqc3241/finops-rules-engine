
import React, { useState, useEffect } from 'react';
import FinancialSummaryView from './FinancialSummaryView';
import DealStructureContainer from './DealStructure/DealStructureContainer';
import { FinancialSummary, DealStructureOffer } from '@/types/application';
import { useDealFinancialNavigation } from '@/hooks/useDealFinancialNavigation';

interface CombinedFinancialViewProps {
  financialSummary: FinancialSummary;
  dealStructure: DealStructureOffer[];
  applicationType: 'Lease' | 'Loan';
}

const CombinedFinancialView: React.FC<CombinedFinancialViewProps> = ({ 
  financialSummary, 
  dealStructure,
  applicationType
}) => {
  const [showFinancialDetail, setShowFinancialDetail] = useState(false);
  const { getCurrentLender, getCurrentSection } = useDealFinancialNavigation();
  
  const section = getCurrentSection();
  const lender = getCurrentLender();
  const initialSection = section ? 
    (section.charAt(0).toUpperCase() + section.slice(1)) as 'Requested' | 'Approved' | 'Customer' : 
    undefined;
  
  // Check URL parameters to determine if we should show financial detail
  useEffect(() => {
    const viewMode = new URLSearchParams(window.location.search).get('view');
    if (viewMode === 'financial-detail') {
      setShowFinancialDetail(true);
    } else {
      setShowFinancialDetail(false);
    }
  }, []);

  const handleViewFinancialDetail = (lenderName: string) => {
    setShowFinancialDetail(true);
  };

  const handleViewRequestedFinancial = (lenderName: string) => {
    setShowFinancialDetail(true);
  };

  const handleViewApprovedFinancial = (lenderName: string) => {
    setShowFinancialDetail(true);
  };

  const handleViewCustomerFinancial = (lenderName: string) => {
    setShowFinancialDetail(true);
  };

  const handleBackClick = () => {
    setShowFinancialDetail(false);
  };

  // If there's no deal structure data, just show the financial summary
  if (dealStructure.length === 0) {
    return <FinancialSummaryView financialSummary={financialSummary} initialSection={initialSection} />;
  }

  return (
    <>
      {showFinancialDetail ? (
        <FinancialSummaryView 
          financialSummary={financialSummary} 
          showBackButton={true}
          onBackClick={handleBackClick}
          initialSection={initialSection}
        />
      ) : (
        <DealStructureContainer 
          dealStructure={dealStructure}
          applicationType={applicationType}
          showFinancialDetailButton={true}
          onViewFinancialDetail={handleViewFinancialDetail}
          financialSummary={financialSummary}
          onViewRequestedFinancial={handleViewRequestedFinancial}
          onViewApprovedFinancial={handleViewApprovedFinancial}
          onViewCustomerFinancial={handleViewCustomerFinancial}
        />
      )}
    </>
  );
};

export default CombinedFinancialView;
