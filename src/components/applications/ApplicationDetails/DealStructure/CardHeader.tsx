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
  onEditOffer: () => void;
}
const CardHeader: React.FC<CardHeaderProps> = ({
  lenderName,
  status,
  isExpanded,
  isSelected,
  onToggleExpand,
  onPresentToCustomer,
  onSendToDT,
  onEditOffer
}) => {
  return <div className="flex justify-between items-center mb-1">
      <div className="flex items-center">
        <h4 className="text-xl font-bold">{lenderName}</h4>
        <StatusBadge status={status} />
      </div>
      <div className="flex space-x-2 items-center">
        <CardActions isSelected={isSelected} onPresentToCustomer={onPresentToCustomer} onSendToDT={onSendToDT} onEditOffer={onEditOffer} />
        
        <Button variant="ghost" size="icon" onClick={onToggleExpand}>
          {isExpanded ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
        </Button>
      </div>
    </div>;
};
export default CardHeader;