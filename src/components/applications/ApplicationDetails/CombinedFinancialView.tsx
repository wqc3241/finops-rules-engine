
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
  const [searchParams] = useSearchParams();
  const { id: applicationId } = useParams<{ id: string }>();
  
  // Check URL parameters to determine if we should show financial detail
  useEffect(() => {
    const viewMode = searchParams.get('view');
    if (viewMode === 'financial-detail') {
      setShowFinancialDetail(true);
    } else {
      setShowFinancialDetail(false);
    }
  }, [searchParams]);

  // If there's no deal structure data, just show the financial summary
  if (dealStructure.length === 0) {
    return <FinancialSummaryView financialSummary={financialSummary} />;
  }

  return (
    <Card className="mb-6">
      {showFinancialDetail ? (
        <FinancialSummaryView 
          financialSummary={financialSummary} 
          showBackButton={true}
          onBackClick={() => setShowFinancialDetail(false)}
        />
      ) : (
        <DealStructureContainer 
          dealStructure={dealStructure}
          applicationType={applicationType}
          showFinancialDetailButton={true}
          onViewFinancialDetail={() => setShowFinancialDetail(true)}
          financialSummary={financialSummary} // Pass financial summary to DealStructureContainer
        />
      )}
    </Card>
  );
};

export default CombinedFinancialView;
