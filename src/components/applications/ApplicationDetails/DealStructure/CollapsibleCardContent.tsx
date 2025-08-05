
import React from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { DealStructureOffer, FinancialSummary, DealStructureItem } from '@/types/application';
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
  onEditRequested?: () => void;
  onViewHistory?: () => void;
  onEditCustomer?: () => void;
  onViewCustomerHistory?: () => void;
  isRequestedEditMode?: boolean;
  isCustomerEditMode?: boolean;
  onSaveRequestedEdit?: (updatedItems: DealStructureItem[]) => void;
  onCancelRequestedEdit?: () => void;
  onSaveCustomerEdit?: (updatedItems: DealStructureItem[]) => void;
  onCancelCustomerEdit?: () => void;
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
  onViewCustomerFinancial,
  onEditRequested,
  onViewHistory,
  onEditCustomer,
  onViewCustomerHistory,
  isRequestedEditMode = false,
  isCustomerEditMode = false,
  onSaveRequestedEdit,
  onCancelRequestedEdit,
  onSaveCustomerEdit,
  onCancelCustomerEdit
}) => {
  const applicationType = offer.applicationType || 'Lease';

  return (
    <div>
      <Separator className="mb-1" />
      
      <Collapsible open={isCardExpanded}>
        {/* Show collapsed view when not expanded */}
        {!isCardExpanded && (
          <div className="py-2">
            {applicationType === 'Loan' ? (
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
            )}
          </div>
        )}
        
        {/* Expanded content */}
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
              onEditRequested={onEditRequested}
              onViewHistory={onViewHistory}
              onEditCustomer={onEditCustomer}
              onViewCustomerHistory={onViewCustomerHistory}
              isRequestedEditMode={isRequestedEditMode}
              isCustomerEditMode={isCustomerEditMode}
              onSaveRequestedEdit={onSaveRequestedEdit}
              onCancelRequestedEdit={onCancelRequestedEdit}
              onSaveCustomerEdit={onSaveCustomerEdit}
              onCancelCustomerEdit={onCancelCustomerEdit}
            />
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default CollapsibleCardContent;
