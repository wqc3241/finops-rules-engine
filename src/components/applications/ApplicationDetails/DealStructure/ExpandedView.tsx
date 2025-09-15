
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DealStructureItem, DealStructureStipulation } from '@/types/application';
import StipulationsTable from './StipulationsTable';
import RequestedDealStructure from './RequestedDealStructure';
import ApprovedDealStructure from './ApprovedDealStructure';
import CustomerDealStructure from './CustomerDealStructure';
import { Separator } from '@/components/ui/separator';
import { useDealFinancialNavigation } from '@/hooks/useDealFinancialNavigation';
import { SendDocumentsToDTModal } from '../DocumentsView/SendDocumentsToDTModal';
import { useParams } from 'react-router-dom';

interface ExpandedViewProps {
  requested: DealStructureItem[];
  approved: DealStructureItem[];
  customer: DealStructureItem[];
  stipulations: DealStructureStipulation[];
  contractStatus?: string;
  applicationType?: 'Lease' | 'Loan';
  lenderName?: string;
  showFinancialDetailButton?: boolean;
  onViewFinancialDetail?: () => void;
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

const ExpandedView: React.FC<ExpandedViewProps> = ({
  requested,
  approved,
  customer,
  stipulations,
  contractStatus,
  applicationType = 'Lease',
  lenderName,
  showFinancialDetailButton = false,
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
  const { navigateToFinancialSection } = useDealFinancialNavigation();
  const { id: applicationId } = useParams();
  const [showSendDocumentsModal, setShowSendDocumentsModal] = useState(false);

  const handleViewFinancialDetail = () => {
    if (onViewFinancialDetail) {
      onViewFinancialDetail();
    } else if (lenderName) {
      navigateToFinancialSection(lenderName, 'approved');
    }
  };
  
  return (
    <>
      <div className="flex flex-row items-start mb-6 space-x-0">
        <div className="flex-1">
          <RequestedDealStructure 
            items={requested}
            applicationType={applicationType}
            lenderName={lenderName}
            onViewFinancialSummary={onViewRequestedFinancial}
            showFinancialDetailButton={showFinancialDetailButton}
            onEditRequested={onEditRequested}
            onViewHistory={onViewHistory}
            isEditMode={isRequestedEditMode}
            onSaveEdit={onSaveRequestedEdit}
            onCancelEdit={onCancelRequestedEdit}
          />
        </div>
        
        <div className="flex items-center self-stretch px-2">
          <Separator orientation="vertical" className="h-full" />
        </div>
        
        <div className="flex-1">
          <ApprovedDealStructure 
            items={approved}
            applicationType={applicationType}
            lenderName={lenderName}
            onViewFinancialSummary={onViewApprovedFinancial}
            showFinancialDetailButton={showFinancialDetailButton}
          />
        </div>
        
        <div className="flex items-center self-stretch px-2">
          <Separator orientation="vertical" className="h-full" />
        </div>
        
        <div className="flex-1">
          <CustomerDealStructure 
            items={customer}
            applicationType={applicationType}
            lenderName={lenderName}
            onViewFinancialSummary={onViewCustomerFinancial}
            showFinancialDetailButton={showFinancialDetailButton}
            onEditCustomer={onEditCustomer}
            onViewCustomerHistory={onViewCustomerHistory}
            isEditMode={isCustomerEditMode}
            onSaveEdit={onSaveCustomerEdit}
            onCancelEdit={onCancelCustomerEdit}
          />
        </div>
      </div>

      {stipulations.length > 0 && (
        <>
          <div className="flex justify-between items-center my-6">
            <h4 className="text-md font-medium">Stipulations</h4>
            <div className="space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setShowSendDocumentsModal(true)}
              >
                Send Documents To DT
              </Button>
              <Button variant="outline">Add Stipulation</Button>
            </div>
          </div>
          <StipulationsTable stipulations={stipulations} />
        </>
      )}

      {contractStatus && (
        <div className="mt-6">
          <h4 className="text-md font-medium mb-4">Contract Status</h4>
          <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
            {contractStatus}
          </span>
        </div>
      )}

      {/* Send Documents To DT Modal */}
      {applicationId && (
        <SendDocumentsToDTModal
          open={showSendDocumentsModal}
          onOpenChange={setShowSendDocumentsModal}
          applicationId={applicationId}
        />
      )}
    </>
  );
};

export default ExpandedView;
