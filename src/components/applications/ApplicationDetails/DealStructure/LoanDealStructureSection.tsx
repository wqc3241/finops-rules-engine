
import React from 'react';
import { DealStructureOffer, FinancialSummary } from '@/types/application';
import DealStructureSection from './DealStructureSection';

interface LoanDealStructureSectionProps {
  dealStructure: DealStructureOffer[];
  showFinancialDetailButton?: boolean;
  onViewFinancialDetail?: (lenderName: string) => void;
  onViewRequestedFinancial?: (lenderName: string) => void;
  onViewApprovedFinancial?: (lenderName: string) => void;
  onViewCustomerFinancial?: (lenderName: string) => void;
  financialSummary?: FinancialSummary;
}

const LoanDealStructureSection: React.FC<LoanDealStructureSectionProps> = ({ 
  dealStructure,
  showFinancialDetailButton = false,
  financialSummary
}) => {
  return (
    <DealStructureSection
      dealStructure={dealStructure}
      title="Deal Structure (Loan Offers)"
      applicationType="Loan"
      showFinancialDetailButton={showFinancialDetailButton}
      financialSummary={financialSummary}
    />
  );
};

export default LoanDealStructureSection;
