
import React from 'react';
import { Button } from '@/components/ui/button';
import { DealStructureItem, DealStructureStipulation } from '@/types/application';
import StipulationsTable from './StipulationsTable';
import { BarChart2 } from 'lucide-react';
import RequestedDealStructure from './RequestedDealStructure';
import ApprovedDealStructure from './ApprovedDealStructure';
import CustomerDealStructure from './CustomerDealStructure';
import { Separator } from '@/components/ui/separator';

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
  return (
    <>
      <div className="grid grid-cols-3 gap-6 mb-6">
        <RequestedDealStructure 
          items={requested}
          applicationType={applicationType}
          lenderName={lenderName}
          onViewFinancialSummary={onViewRequestedFinancial}
          showFinancialDetailButton={showFinancialDetailButton}
        />
        
        <Separator orientation="vertical" className="mx-auto h-full" />
        
        <ApprovedDealStructure 
          items={approved}
          applicationType={applicationType}
          lenderName={lenderName}
          onViewFinancialSummary={onViewApprovedFinancial}
          showFinancialDetailButton={showFinancialDetailButton}
        />
        
        <Separator orientation="vertical" className="mx-auto h-full" />
        
        <CustomerDealStructure 
          items={customer}
          applicationType={applicationType}
          lenderName={lenderName}
          onViewFinancialSummary={onViewCustomerFinancial}
          showFinancialDetailButton={showFinancialDetailButton}
        />
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
      
      {showFinancialDetailButton && onViewFinancialDetail && (
        <div className="mt-6 flex justify-end">
          <Button 
            variant="outline" 
            onClick={onViewFinancialDetail}
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
