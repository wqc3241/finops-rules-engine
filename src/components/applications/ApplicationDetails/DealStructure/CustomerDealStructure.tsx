
import React from 'react';
import { DealStructureItem } from '@/types/application';
import DealStructureView from './DealStructureView';
import { useDealFinancialNavigation } from '@/hooks/useDealFinancialNavigation';

interface CustomerDealStructureProps {
  items: DealStructureItem[];
  applicationType?: 'Lease' | 'Loan';
  lenderName?: string;
  onViewFinancialSummary?: () => void;
  showFinancialDetailButton?: boolean;
  isCustomer?: boolean;
}

const CustomerDealStructure: React.FC<CustomerDealStructureProps> = ({
  items,
  applicationType = 'Lease',
  lenderName,
  onViewFinancialSummary,
  showFinancialDetailButton = false,
  isCustomer = true
}) => {
  const { navigateToFinancialSection } = useDealFinancialNavigation();
  
  const handleViewFinancialSummary = () => {
    if (onViewFinancialSummary) {
      onViewFinancialSummary();
    } else if (lenderName) {
      navigateToFinancialSection(lenderName, 'customer');
    }
  };
  
  return (
    <DealStructureView
      items={items}
      title="Customer"
      applicationType={applicationType}
      lenderName={lenderName}
      section="customer"
      onViewFinancialSummary={handleViewFinancialSummary}
      showFinancialDetailButton={showFinancialDetailButton}
      isCustomer={isCustomer}
    />
  );
};

export default CustomerDealStructure;
