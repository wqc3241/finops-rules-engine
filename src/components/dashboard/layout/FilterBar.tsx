import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import { DashboardFilter } from '@/hooks/useDashboardFilters';

interface FilterBarProps {
  filters: DashboardFilter[];
  onFilterChange: (filterId: string, value: any) => void;
  onClearFilters: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
}) => {
  if (filters.length === 0) return null;

  const hasActiveFilters = filters.some(f => f.value !== null && f.value !== undefined && f.value !== '');

  return (
    <div className="border-b bg-muted/50 p-4">
      <div className="flex items-center gap-4 flex-wrap">
        <span className="text-sm font-medium">Filters:</span>
        {filters.map((filter) => (
          <div key={filter.id} className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{filter.label}:</span>
            {filter.type === 'select' && (
              <Select
                value={filter.value || ''}
                onValueChange={(value) => onFilterChange(filter.id, value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  {filter.options?.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {filter.type === 'text' && (
              <Input
                className="w-[180px]"
                placeholder="Search..."
                value={filter.value || ''}
                onChange={(e) => onFilterChange(filter.id, e.target.value)}
              />
            )}
          </div>
        ))}
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            <X className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
