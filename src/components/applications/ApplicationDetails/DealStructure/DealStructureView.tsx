
import React from 'react';
import { Button } from '@/components/ui/button';
import { DealStructureItem } from '@/types/application';
import OfferParameters from './OfferParameters';
import { BarChart2, Edit, History } from 'lucide-react';

interface DealStructureViewProps {
  items: DealStructureItem[];
  title: string;
  applicationType?: 'Lease' | 'Loan';
  lenderName?: string;
  section: 'requested' | 'approved' | 'customer';
  onViewFinancialSummary?: () => void;
  showFinancialDetailButton?: boolean;
  isCustomer?: boolean;
  onEditRequested?: () => void;
  onViewHistory?: () => void;
  onEditCustomer?: () => void;
  onViewCustomerHistory?: () => void;
  isEditMode?: boolean;
  onSaveEdit?: (updatedItems: DealStructureItem[]) => void;
  onCancelEdit?: () => void;
}

const DealStructureView: React.FC<DealStructureViewProps> = ({
  items,
  title,
  applicationType = 'Lease',
  lenderName,
  section,
  onViewFinancialSummary,
  showFinancialDetailButton = false,
  isCustomer = false,
  onEditRequested,
  onViewHistory,
  onEditCustomer,
  onViewCustomerHistory,
  isEditMode = false,
  onSaveEdit,
  onCancelEdit
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h4 className="text-md font-medium">{title}</h4>
          {section === 'requested' && onEditRequested && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onEditRequested}
              className="h-6 w-6 p-0 hover:bg-muted"
              title="Edit Requested Deal"
            >
              <Edit className="h-3 w-3" />
            </Button>
          )}
          {section === 'customer' && onEditCustomer && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onEditCustomer}
              className="h-6 w-6 p-0 hover:bg-muted"
              title="Edit Customer Deal"
            >
              <Edit className="h-3 w-3" />
            </Button>
          )}
          {section === 'requested' && onViewHistory && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onViewHistory}
              className="h-6 w-6 p-0 hover:bg-muted"
              title="View Deal History"
            >
              <History className="h-3 w-3" />
            </Button>
          )}
          {section === 'customer' && onViewCustomerHistory && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onViewCustomerHistory}
              className="h-6 w-6 p-0 hover:bg-muted"
              title="View Customer Deal History"
            >
              <History className="h-3 w-3" />
            </Button>
          )}
        </div>
        {showFinancialDetailButton && (
          <button 
            onClick={onViewFinancialSummary} 
            className="text-blue-600 hover:text-blue-800 underline text-sm font-medium flex items-center transition-colors"
          >
            <BarChart2 className="h-3 w-3 mr-1" />
            Summary
          </button>
        )}
      </div>
      <OfferParameters 
        items={items} 
        isCustomer={isCustomer} 
        applicationType={applicationType} 
        lenderName={lenderName} 
        section={section}
        onViewFinancialSummary={onViewFinancialSummary}
        isEditMode={isEditMode}
        onSaveEdit={onSaveEdit}
        onCancelEdit={onCancelEdit}
      />
    </div>
  );
};

export default DealStructureView;
