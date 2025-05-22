
import React from 'react';
import { DealStructureItem } from '@/types/application';
import DealStructureView from './DealStructureView';
import { useDealFinancialNavigation } from '@/hooks/useDealFinancialNavigation';

interface ApprovedDealStructureProps {
  items: DealStructureItem[];
  applicationType?: 'Lease' | 'Loan';
  lenderName?: string;
  onViewFinancialSummary?: () => void;
  showFinancialDetailButton?: boolean;
}

const ApprovedDealStructure: React.FC<ApprovedDealStructureProps> = ({
  items,
  applicationType = 'Lease',
  lenderName,
  onViewFinancialSummary,
  showFinancialDetailButton = false
}) => {
  const { navigateToFinancialSection } = useDealFinancialNavigation();
  
  const handleViewFinancialSummary = () => {
    if (onViewFinancialSummary) {
      onViewFinancialSummary();
    } else if (lenderName) {
      navigateToFinancialSection(lenderName, 'approved');
    }
  };
  
  return (
    <DealStructureView
      items={items}
      title="Approved"
      applicationType={applicationType}
      lenderName={lenderName}
      section="approved"
      onViewFinancialSummary={handleViewFinancialSummary}
      showFinancialDetailButton={showFinancialDetailButton}
    />
  );
};

export default ApprovedDealStructure;
