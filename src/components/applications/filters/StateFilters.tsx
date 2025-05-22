
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface StateFiltersProps {
  uniqueStates: string[];
  stateFilters: string[];
  toggleStateFilter: (state: string) => void;
}

const StateFilters: React.FC<StateFiltersProps> = ({
  uniqueStates,
  stateFilters,
  toggleStateFilter
}) => {
  return (
    <div>
      <h4 className="font-medium text-sm mb-2">State</h4>
      <div className="space-y-1">
        {uniqueStates.length > 0 ? (
          uniqueStates.map((state) => (
            <div key={state} className="flex items-center space-x-2">
              <Checkbox
                id={`state-${state}`}
                checked={stateFilters.includes(state)}
                onCheckedChange={() => toggleStateFilter(state)}
              />
              <Label 
                htmlFor={`state-${state}`} 
                className="text-sm cursor-pointer"
              >
                {state}
              </Label>
            </div>
          ))
        ) : (
          <p className="text-xs text-gray-500">No states available</p>
        )}
      </div>
    </div>
  );
};

export default StateFilters;
