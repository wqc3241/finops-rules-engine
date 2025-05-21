
import React from 'react';
import { ChevronUp, ChevronDown, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SummaryHeaderProps {
  expanded: boolean;
  toggleExpanded: () => void;
  showBackButton?: boolean;
  onBackClick?: () => void;
  summaryType: 'Loan' | 'Lease';
}

const SummaryHeader: React.FC<SummaryHeaderProps> = ({
  expanded,
  toggleExpanded,
  showBackButton = false,
  onBackClick,
  summaryType
}) => {
  return (
    <div className="flex justify-between items-center mb-2">
      <div className="flex items-center">
        {showBackButton && onBackClick && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBackClick} 
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Deal Structure
          </Button>
        )}
        <h3 className="text-base font-medium">
          Financial Summary ({summaryType}) 
        </h3>
      </div>
      <div className="flex items-center cursor-pointer" onClick={toggleExpanded}>
        {expanded ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
      </div>
    </div>
  );
};

export default SummaryHeader;
