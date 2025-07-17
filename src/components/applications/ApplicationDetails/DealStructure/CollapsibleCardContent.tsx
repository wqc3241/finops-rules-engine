
import React from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { DealStructureOffer, FinancialSummary } from '@/types/application';
import CollapsedView from './CollapsedView';
import LoanCollapsedView from './LoanCollapsedView';
import ExpandedView from './ExpandedView';
import FinancialSummarySection from './FinancialSummarySection';

interface CollapsibleCardContentProps {
  offer: DealStructureOffer;
  isCardExpanded: boolean;
  isSelected: boolean;
  showFinancialSummary: boolean;
  selectedSection: 'requested' | 'approved' | 'customer';
  financialSummary?: FinancialSummary;
  showFinancialDetailButton?: boolean;
  onToggleExpand: () => void;
  onBackToDealStructure: () => void;
  onViewFinancialDetail: (section: 'requested' | 'approved' | 'customer') => void;
  onViewRequestedFinancial?: () => void;
  onViewApprovedFinancial?: () => void;
  onViewCustomerFinancial?: () => void;
}

const CollapsibleCardContent: React.FC<CollapsibleCardContentProps> = ({
  offer,
  isCardExpanded,
  isSelected,
  showFinancialSummary,
  selectedSection,
  financialSummary,
  showFinancialDetailButton,
  onToggleExpand,
  onBackToDealStructure,
  onViewFinancialDetail,
  onViewRequestedFinancial,
  onViewApprovedFinancial,
  onViewCustomerFinancial
}) => {
  const applicationType = offer.applicationType || 'Lease';

  return (
    <div>
      <Collapsible open={isCardExpanded}>
        <Separator className="mb-1" />

        {!isCardExpanded && (applicationType === 'Loan' ? (
          <LoanCollapsedView 
            termLength={offer.collapsedView.termLength} 
            monthlyPayments={offer.collapsedView.monthlyPayments} 
            downPayment={offer.collapsedView.downPayment || "N/A"} 
          />
        ) : (
          <CollapsedView 
            termLength={offer.collapsedView.termLength} 
            monthlyPayments={offer.collapsedView.monthlyPayments} 
            dueAtSigning={offer.collapsedView.dueAtSigning || "N/A"} 
          />
        ))}
        
        <CollapsibleContent>
          {showFinancialSummary ? (
            <FinancialSummarySection 
              lenderName={offer.lenderName} 
              section={selectedSection} 
              financialSummary={financialSummary} 
              onBackToDealStructure={onBackToDealStructure} 
            />
          ) : (
            <ExpandedView 
              requested={offer.requested} 
              approved={offer.approved} 
              customer={offer.customer} 
              stipulations={offer.stipulations} 
              contractStatus={offer.contractStatus} 
              applicationType={applicationType} 
              lenderName={offer.lenderName} 
              showFinancialDetailButton={showFinancialDetailButton && financialSummary !== undefined} 
              onViewFinancialDetail={() => onViewFinancialDetail('approved')} 
              onViewRequestedFinancial={onViewRequestedFinancial ? () => onViewRequestedFinancial() : undefined} 
              onViewApprovedFinancial={onViewApprovedFinancial ? () => onViewApprovedFinancial() : undefined} 
              onViewCustomerFinancial={onViewCustomerFinancial ? () => onViewCustomerFinancial() : undefined} 
            />
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default CollapsibleCardContent;
