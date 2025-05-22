
import React from 'react';
import { Button } from '@/components/ui/button';
import { DealStructureItem, DealStructureStipulation } from '@/types/application';
import StipulationsTable from './StipulationsTable';
import { BarChart2 } from 'lucide-react';
import RequestedDealStructure from './RequestedDealStructure';
import ApprovedDealStructure from './ApprovedDealStructure';
import CustomerDealStructure from './CustomerDealStructure';
import { Separator } from '@/components/ui/separator';
import { useDealFinancialNavigation } from '@/hooks/useDealFinancialNavigation';

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
  onViewCustomerFinancial
}) => {
  const { navigateToFinancialSection } = useDealFinancialNavigation();

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
          />
        </div>
      </div>

      {stipulations.length > 0 && (
        <>
          <div className="flex justify-between items-center my-6">
            <h4 className="text-md font-medium">Stipulations</h4>
            <div className="space-x-2">
              <Button variant="outline">Send Documents To DT</Button>
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
      
      {showFinancialDetailButton && (
        <div className="mt-6 flex justify-end">
          <Button 
            variant="outline" 
            onClick={handleViewFinancialDetail}
            className="flex items-center"
          >
            <BarChart2 className="h-4 w-4 mr-1" />
            View Complete Financial Summary
          </Button>
        </div>
      )}
    </>
  );
};

export default ExpandedView;
