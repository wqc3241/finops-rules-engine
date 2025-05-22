
import React from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { DealStructureOffer, FinancialSummary } from '@/types/application';
import CollapsedView from './CollapsedView';
import LoanCollapsedView from './LoanCollapsedView';
import ExpandedView from './ExpandedView';
import FinancialSummarySection from './FinancialSummarySection';
import { Dialog } from '@/components/ui/dialog';
import EditOfferDialog from './EditOfferDialog';

interface CollapsibleCardContentProps {
  offer: DealStructureOffer;
  isCardExpanded: boolean;
  isSelected: boolean;
  showFinancialSummary: boolean;
  selectedSection: 'requested' | 'approved' | 'customer';
  isEditDialogOpen: boolean;
  financialSummary?: FinancialSummary;
  showFinancialDetailButton?: boolean;
  onToggleExpand: (value: boolean) => void;
  onBackToDealStructure: () => void;
  onViewFinancialDetail: (section: 'requested' | 'approved' | 'customer') => void;
  onEditDialogOpenChange: (open: boolean) => void;
  onEditSubmit: (data: any) => void;
}

const CollapsibleCardContent: React.FC<CollapsibleCardContentProps> = ({
  offer,
  isCardExpanded,
  isSelected,
  showFinancialSummary,
  selectedSection,
  isEditDialogOpen,
  financialSummary,
  showFinancialDetailButton,
  onToggleExpand,
  onBackToDealStructure,
  onViewFinancialDetail,
  onEditDialogOpenChange,
  onEditSubmit
}) => {
  const applicationType = offer.applicationType || 'Lease';

  // Default form values for edit dialog
  const editFormDefaults = applicationType === 'Loan' 
    ? {
        termLength: offer.customer.find(item => item.name === 'termLength')?.value || '',
        downPayment: offer.customer.find(item => item.name === 'downPayment')?.value || '',
        apr: offer.customer.find(item => item.name === 'apr')?.value || '',
      }
    : {
        termLength: offer.customer.find(item => item.name === 'termLength')?.value || '',
        mileageAllowance: offer.customer.find(item => item.name === 'mileageAllowance')?.value || '',
        downPayment: offer.customer.find(item => item.name === 'ccrDownPayment')?.value || '',
      };

  return (
    <>
      <Collapsible open={isCardExpanded} onOpenChange={onToggleExpand}>
        <Separator className="mb-6" />

        {!isCardExpanded && (
          applicationType === 'Loan' ? (
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
          )
        )}
        
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
              onViewRequestedFinancial={() => onViewFinancialDetail('requested')}
              onViewApprovedFinancial={() => onViewFinancialDetail('approved')}
              onViewCustomerFinancial={() => onViewFinancialDetail('customer')}
            />
          )}
        </CollapsibleContent>
      </Collapsible>

      <Dialog open={isEditDialogOpen} onOpenChange={onEditDialogOpenChange}>
        <EditOfferDialog 
          defaultValues={editFormDefaults}
          onSubmit={onEditSubmit}
          onCancel={() => onEditDialogOpenChange(false)}
          applicationType={applicationType}
        />
      </Dialog>
    </>
  );
};

export default CollapsibleCardContent;
