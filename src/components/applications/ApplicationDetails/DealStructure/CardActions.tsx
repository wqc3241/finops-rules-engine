
import React from 'react';
import { User, ArrowRight, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CardActionsProps {
  isSelected: boolean;
  onPresentToCustomer: () => void;
  onSendToDT: () => void;
  showFinancialDetailButton?: boolean;
  onViewFinancialSummary?: (e?: React.MouseEvent) => void;
}

const CardActions: React.FC<CardActionsProps> = ({
  isSelected,
  onPresentToCustomer,
  onSendToDT,
  showFinancialDetailButton = false,
  onViewFinancialSummary
}) => {
  return (
    <div className="flex space-x-1 items-center">
      <Button 
        variant="outline" 
        size="sm"
        onClick={onPresentToCustomer}
        className={`flex items-center gap-1 ${isSelected ? 'bg-green-50' : ''}`}
      >
        <User className="h-3 w-3" />
        Present
      </Button>
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={onSendToDT}
        disabled={!isSelected}
        className={`flex items-center gap-1 ${!isSelected ? 'opacity-50' : ''}`}
      >
        <ArrowRight className="h-3 w-3" />
        Send to DT
      </Button>

      {showFinancialDetailButton && (
        <Button 
          variant="outline" 
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onViewFinancialSummary?.(e);
          }}
          className="flex items-center gap-1"
          data-prevent-toggle
        >
          <BarChart2 className="h-3 w-3" />
          Summary
        </Button>
      )}
    </div>
  );
};

export default CardActions;
