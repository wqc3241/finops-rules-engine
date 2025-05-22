
import React from 'react';
import { DealStructureOffer, FinancialSummary } from '@/types/application';
import DealStructureSection from './DealStructureSection';

interface LeaseDealStructureSectionProps {
  dealStructure: DealStructureOffer[];
  showFinancialDetailButton?: boolean;
  onViewFinancialDetail?: (lenderName: string) => void;
  onViewRequestedFinancial?: (lenderName: string) => void;
  onViewApprovedFinancial?: (lenderName: string) => void;
  onViewCustomerFinancial?: (lenderName: string) => void;
  financialSummary?: FinancialSummary;
}

const LeaseDealStructureSection: React.FC<LeaseDealStructureSectionProps> = ({ 
  dealStructure,
  showFinancialDetailButton = false,
  financialSummary
}) => {
  return (
    <DealStructureSection
      dealStructure={dealStructure}
      title="Deal Structure (Lease Offers)"
      applicationType="Lease"
      showFinancialDetailButton={showFinancialDetailButton}
      financialSummary={financialSummary}
    />
  );
};

export default LeaseDealStructureSection;
