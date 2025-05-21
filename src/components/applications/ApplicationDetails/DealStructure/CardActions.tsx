
import React from 'react';
import { User, ArrowRight, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CardActionsProps {
  isSelected: boolean;
  onPresentToCustomer: () => void;
  onSendToDT: () => void;
  onEditOffer: () => void;
}

const CardActions: React.FC<CardActionsProps> = ({
  isSelected,
  onPresentToCustomer,
  onSendToDT,
  onEditOffer
}) => {
  return (
    <div className="flex space-x-2 items-center">
      <Button 
        variant="outline" 
        onClick={onPresentToCustomer}
        className={`flex items-center ${isSelected ? 'bg-green-50' : ''}`}
      >
        <User className="h-4 w-4 mr-1" />
        Present to Customer
      </Button>
      
      <Button 
        variant="outline" 
        onClick={onSendToDT}
        disabled={!isSelected}
        className={`flex items-center ${!isSelected ? 'opacity-50' : ''}`}
      >
        <ArrowRight className="h-4 w-4 mr-1" />
        Send Deal To DT
      </Button>
      
      <Button 
        variant="outline" 
        onClick={onEditOffer}
        className="flex items-center"
      >
        <Pencil className="h-4 w-4 mr-1" />
        Edit
      </Button>
    </div>
  );
};

export default CardActions;
