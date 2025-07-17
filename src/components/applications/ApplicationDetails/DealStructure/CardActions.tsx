
import React from 'react';
import { User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CardActionsProps {
  isSelected: boolean;
  onPresentToCustomer: () => void;
  onSendToDT: () => void;
}

const CardActions: React.FC<CardActionsProps> = ({
  isSelected,
  onPresentToCustomer,
  onSendToDT
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
    </div>
  );
};

export default CardActions;
