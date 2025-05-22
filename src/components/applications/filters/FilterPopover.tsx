
import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SlidersHorizontal, X } from 'lucide-react';
import StatusFilters from './StatusFilters';
import TypeFilters from './TypeFilters';
import StateFilters from './StateFilters';

interface FilterPopoverProps {
  uniqueStatuses: string[];
  uniqueTypes: string[];
  uniqueStates: string[];
  statusFilters: string[];
  typeFilters: string[];
  stateFilters: string[];
  toggleStatusFilter: (status: string) => void;
  toggleTypeFilter: (type: string) => void;
  toggleStateFilter: (state: string) => void;
  clearFilters: () => void;
}

const FilterPopover: React.FC<FilterPopoverProps> = ({
  uniqueStatuses,
  uniqueTypes,
  uniqueStates,
  statusFilters,
  typeFilters,
  stateFilters,
  toggleStatusFilter,
  toggleTypeFilter,
  toggleStateFilter,
  clearFilters
}) => {
  const activeFiltersCount = statusFilters.length + typeFilters.length + stateFilters.length;
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center justify-between border border-gray-300 relative"
        >
          <span>Filters</span>
          <SlidersHorizontal className="ml-2 h-4 w-4" />
          {activeFiltersCount > 0 && (
            <Badge 
              variant="secondary" 
              className="ml-2 h-5 w-5 p-0 flex items-center justify-center rounded-full"
            >
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="end">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Filter Applications</h3>
          {activeFiltersCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters}
              className="h-8 flex items-center text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              Clear filters
            </Button>
          )}
        </div>
        
        <div className="space-y-4">
          {/* Status filters */}
          <StatusFilters 
            uniqueStatuses={uniqueStatuses}
            statusFilters={statusFilters}
            toggleStatusFilter={toggleStatusFilter}
          />
          
          {/* Type filters */}
          <TypeFilters 
            uniqueTypes={uniqueTypes}
            typeFilters={typeFilters}
            toggleTypeFilter={toggleTypeFilter}
          />

          {/* State filters */}
          <StateFilters 
            uniqueStates={uniqueStates}
            stateFilters={stateFilters}
            toggleStateFilter={toggleStateFilter}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default FilterPopover;
