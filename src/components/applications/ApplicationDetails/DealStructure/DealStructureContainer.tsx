
import React from 'react';
import { DealStructureOffer, FinancialSummary } from '@/types/application';
import LeaseDealStructureSection from './LeaseDealStructureSection';
import LoanDealStructureSection from './LoanDealStructureSection';

interface DealStructureContainerProps {
  dealStructure: DealStructureOffer[];
  applicationType?: 'Lease' | 'Loan';
  showFinancialDetailButton?: boolean;
  onViewFinancialDetail?: (lenderName: string) => void;
  onViewRequestedFinancial?: (lenderName: string) => void;
  onViewApprovedFinancial?: (lenderName: string) => void;
  onViewCustomerFinancial?: (lenderName: string) => void;
  financialSummary?: FinancialSummary;
}

const DealStructureContainer: React.FC<DealStructureContainerProps> = ({ 
  dealStructure, 
  applicationType = 'Lease',
  showFinancialDetailButton = false,
  onViewFinancialDetail,
  onViewRequestedFinancial,
  onViewApprovedFinancial,
  onViewCustomerFinancial,
  financialSummary
}) => {
  // Set application type for each offer if not already set
  const offersWithType = dealStructure.map(offer => ({
    ...offer,
    applicationType: offer.applicationType || applicationType
  }));

  // Filter offers based on application type
  const leaseOffers = offersWithType.filter(offer => offer.applicationType !== 'Loan');
  const loanOffers = offersWithType.filter(offer => offer.applicationType === 'Loan');

  if (applicationType === 'Loan') {
    return (
      <LoanDealStructureSection 
        dealStructure={loanOffers} 
        showFinancialDetailButton={showFinancialDetailButton}
        onViewFinancialDetail={onViewFinancialDetail}
        onViewRequestedFinancial={onViewRequestedFinancial}
        onViewApprovedFinancial={onViewApprovedFinancial}
        onViewCustomerFinancial={onViewCustomerFinancial}
        financialSummary={financialSummary}
      />
    );
  }

  return (
    <LeaseDealStructureSection 
      dealStructure={leaseOffers}
      showFinancialDetailButton={showFinancialDetailButton}
      onViewFinancialDetail={onViewFinancialDetail}
      onViewRequestedFinancial={onViewRequestedFinancial}
      onViewApprovedFinancial={onViewApprovedFinancial}
      onViewCustomerFinancial={onViewCustomerFinancial}
      financialSummary={financialSummary}
    />
  );
};

export default DealStructureContainer;
