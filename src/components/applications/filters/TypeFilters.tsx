
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from "sonner";

interface TypeFiltersProps {
  uniqueTypes: string[];
  typeFilters: string[];
  toggleTypeFilter: (type: string) => void;
}

const TypeFilters: React.FC<TypeFiltersProps> = ({ 
  uniqueTypes, 
  typeFilters, 
  toggleTypeFilter 
}) => {
  return (
    <div>
      <h4 className="text-sm font-medium mb-2">Application Type</h4>
      <div className="space-y-2">
        {uniqueTypes.map(type => (
          <div key={type} className="flex items-center space-x-2">
            <Checkbox 
              id={`type-${type}`}
              checked={typeFilters.includes(type)}
              onCheckedChange={() => toggleTypeFilter(type)}
            />
            <label 
              htmlFor={`type-${type}`}
              className="text-sm cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {type}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TypeFilters;
