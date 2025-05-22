
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import FinancialSummaryView from './FinancialSummaryView';
import DealStructureContainer from './DealStructure/DealStructureContainer';
import { FinancialSummary, DealStructureOffer } from '@/types/application';
import { Card } from '@/components/ui/card';

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
  const [searchParams, setSearchParams] = useSearchParams();
  const { id: applicationId } = useParams<{ id: string }>();
  const section = searchParams.get('section') as 'requested' | 'approved' | 'customer' | null;
  const lender = searchParams.get('lender');
  const initialSection = section ? 
    (section.charAt(0).toUpperCase() + section.slice(1)) as 'Requested' | 'Approved' | 'Customer' : 
    undefined;
  
  // Check URL parameters to determine if we should show financial detail
  useEffect(() => {
    const viewMode = searchParams.get('view');
    if (viewMode === 'financial-detail') {
      setShowFinancialDetail(true);
    } else {
      setShowFinancialDetail(false);
    }
  }, [searchParams]);

  const handleViewFinancialDetail = (lenderName?: string) => {
    setShowFinancialDetail(true);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('view', 'financial-detail');
    if (lenderName) {
      newParams.set('lender', encodeURIComponent(lenderName));
    }
    setSearchParams(newParams);
  };

  const handleViewRequestedFinancial = (lenderName?: string) => {
    setShowFinancialDetail(true);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('view', 'financial-detail');
    newParams.set('section', 'requested');
    if (lenderName) {
      newParams.set('lender', encodeURIComponent(lenderName));
    }
    setSearchParams(newParams);
  };

  const handleViewApprovedFinancial = (lenderName?: string) => {
    setShowFinancialDetail(true);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('view', 'financial-detail');
    newParams.set('section', 'approved');
    if (lenderName) {
      newParams.set('lender', encodeURIComponent(lenderName));
    }
    setSearchParams(newParams);
  };

  const handleViewCustomerFinancial = (lenderName?: string) => {
    setShowFinancialDetail(true);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('view', 'financial-detail');
    newParams.set('section', 'customer');
    if (lenderName) {
      newParams.set('lender', encodeURIComponent(lenderName));
    }
    setSearchParams(newParams);
  };

  const handleBackClick = () => {
    setShowFinancialDetail(false);
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('view');
    setSearchParams(newParams);
  };

  // If there's no deal structure data, just show the financial summary
  if (dealStructure.length === 0) {
    return <FinancialSummaryView financialSummary={financialSummary} initialSection={initialSection} />;
  }

  return (
    <Card className="mb-6">
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
    </Card>
  );
};

export default CombinedFinancialView;
