
import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StatusBadge from './StatusBadge';
import CardActions from './CardActions';
import { DealStructureOffer } from '@/types/application';

interface CardHeaderProps {
  lenderName: string;
  status?: string;
  isExpanded: boolean;
  isSelected: boolean;
  onToggleExpand: () => void;
  onPresentToCustomer: () => void;
  onSendToDT: () => void;
  offer?: DealStructureOffer;
}

const CardHeader: React.FC<CardHeaderProps> = ({
  lenderName,
  status,
  isExpanded,
  isSelected,
  onToggleExpand,
  onPresentToCustomer,
  onSendToDT,
  offer
}) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h4 className="text-lg font-semibold">{lenderName}</h4>
          <StatusBadge status={status} />
        </div>
        <div className="flex space-x-1 items-center">
          <CardActions 
            isSelected={isSelected} 
            onPresentToCustomer={onPresentToCustomer} 
            onSendToDT={onSendToDT} 
          />
          
          <Button variant="ghost" size="sm" onClick={onToggleExpand}>
            {isExpanded ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
          </Button>
        </div>
      </div>
      
      {/* Show financial info when expanded */}
      {isExpanded && offer?.collapsedView && (
        <div className="flex flex-wrap gap-3 items-center pt-2 border-t border-border/50">
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground">Term:</span>
            <span className="text-xs font-medium bg-secondary px-2 py-1 rounded">{offer.collapsedView.termLength} mo</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground">Payment:</span>
            <span className="text-xs font-medium bg-secondary px-2 py-1 rounded">{offer.collapsedView.monthlyPayments}</span>
          </div>
          {offer.applicationType === 'Lease' && offer.collapsedView.dueAtSigning && (
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground">Due:</span>
              <span className="text-xs font-medium bg-secondary px-2 py-1 rounded">{offer.collapsedView.dueAtSigning}</span>
            </div>
          )}
          {offer.applicationType === 'Loan' && offer.collapsedView.downPayment && (
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground">Down:</span>
              <span className="text-xs font-medium bg-secondary px-2 py-1 rounded">{offer.collapsedView.downPayment}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CardHeader;
