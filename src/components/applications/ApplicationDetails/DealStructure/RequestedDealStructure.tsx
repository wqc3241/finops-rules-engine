
import React from 'react';
import { DealStructureItem } from '@/types/application';
import DealStructureView from './DealStructureView';
import { useDealFinancialNavigation } from '@/hooks/useDealFinancialNavigation';

interface RequestedDealStructureProps {
  items: DealStructureItem[];
  applicationType?: 'Lease' | 'Loan';
  lenderName?: string;
  onViewFinancialSummary?: () => void;
  showFinancialDetailButton?: boolean;
}

const RequestedDealStructure: React.FC<RequestedDealStructureProps> = ({
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
      navigateToFinancialSection(lenderName, 'requested');
    }
  };
  
  return (
    <DealStructureView
      items={items}
      title="Requested"
      applicationType={applicationType}
      lenderName={lenderName}
      section="requested"
      onViewFinancialSummary={handleViewFinancialSummary}
      showFinancialDetailButton={showFinancialDetailButton}
    />
  );
};

export default RequestedDealStructure;
