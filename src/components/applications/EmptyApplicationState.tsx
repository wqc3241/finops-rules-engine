
import React from 'react';
import { Button } from '@/components/ui/button';

interface EmptyApplicationStateProps {
  clearFilters: () => void;
}

const EmptyApplicationState: React.FC<EmptyApplicationStateProps> = ({ clearFilters }) => {
  return (
    <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
      <p className="text-gray-500">No applications match the selected filters.</p>
      <Button 
        variant="link" 
        onClick={clearFilters} 
        className="text-primary mt-2"
      >
        Clear filters
      </Button>
    </div>
  );
};

export default EmptyApplicationState;
