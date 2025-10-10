
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
            console.log('=== Summary Button Click Debug ===');
            console.log('Event target:', e.target);
            console.log('Target tagName:', (e.target as HTMLElement).tagName);
            console.log('Target className:', (e.target as HTMLElement).className);
            console.log('Current target (button):', e.currentTarget);
            console.log('Has data-prevent-toggle:', (e.currentTarget as HTMLElement).hasAttribute('data-prevent-toggle'));
            console.log('Closest button:', (e.target as HTMLElement).closest('button'));
            console.log('Closest [data-prevent-toggle]:', (e.target as HTMLElement).closest('[data-prevent-toggle]'));
            console.log('==================================');
            
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
