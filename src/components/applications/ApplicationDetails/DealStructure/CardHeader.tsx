
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
  showFinancialDetailButton?: boolean;
  onViewFinancialSummary?: (e?: React.MouseEvent) => void;
  orderNumber?: string;
  onStatusChange?: (newStatus: string) => void;
}

const CardHeader: React.FC<CardHeaderProps> = ({
  lenderName,
  status,
  isExpanded,
  isSelected,
  onToggleExpand,
  onPresentToCustomer,
  onSendToDT,
  offer,
  showFinancialDetailButton = false,
  onViewFinancialSummary,
  orderNumber,
  onStatusChange
}) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h4 className="text-lg font-semibold">{lenderName}</h4>
          <StatusBadge status={status} orderNumber={orderNumber} onStatusChange={onStatusChange} />
        </div>
        <div className="flex space-x-1 items-center" data-prevent-toggle>
          <CardActions 
            isSelected={isSelected} 
            onPresentToCustomer={onPresentToCustomer} 
            onSendToDT={onSendToDT}
            showFinancialDetailButton={showFinancialDetailButton}
            onViewFinancialSummary={onViewFinancialSummary}
          />
          
          <Button variant="ghost" size="sm" onClick={onToggleExpand}>
            {isExpanded ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
          </Button>
        </div>
      </div>
      
    </div>
  );
};

export default CardHeader;
