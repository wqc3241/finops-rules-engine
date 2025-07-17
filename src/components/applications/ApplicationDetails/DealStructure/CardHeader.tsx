
import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StatusBadge from './StatusBadge';
import CardActions from './CardActions';

interface CardHeaderProps {
  lenderName: string;
  status?: string;
  isExpanded: boolean;
  isSelected: boolean;
  onToggleExpand: () => void;
  onPresentToCustomer: () => void;
  onSendToDT: () => void;
}

const CardHeader: React.FC<CardHeaderProps> = ({
  lenderName,
  status,
  isExpanded,
  isSelected,
  onToggleExpand,
  onPresentToCustomer,
  onSendToDT
}) => {
  return (
    <div className="flex justify-between items-center mb-2">
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
  );
};

export default CardHeader;
