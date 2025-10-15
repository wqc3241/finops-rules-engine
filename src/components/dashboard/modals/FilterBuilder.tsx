import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Plus } from 'lucide-react';
import { Filter, TableColumn } from '@/types/dashboard';

interface FilterBuilderProps {
  columns: TableColumn[];
  filters: Filter[];
  onChange: (filters: Filter[]) => void;
}

const FilterBuilder: React.FC<FilterBuilderProps> = ({ columns, filters, onChange }) => {
  const addFilter = () => {
    onChange([...filters, { column: '', operator: 'equals', value: '' }]);
  };

  const updateFilter = (index: number, updates: Partial<Filter>) => {
    const newFilters = [...filters];
    newFilters[index] = { ...newFilters[index], ...updates };
    onChange(newFilters);
  };

  const removeFilter = (index: number) => {
    onChange(filters.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <Label>Filters</Label>
      {filters.length === 0 && (
        <p className="text-sm text-muted-foreground">No filters added</p>
      )}
      {filters.map((filter, idx) => (
        <div key={idx} className="flex gap-2 items-center">
          <Select 
            value={filter.column} 
            onValueChange={(val) => updateFilter(idx, { column: val })}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Column" />
            </SelectTrigger>
            <SelectContent>
              {columns.map(col => (
                <SelectItem key={col.name} value={col.name}>
                  {col.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select 
            value={filter.operator}
            onValueChange={(val) => updateFilter(idx, { operator: val as any })}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="equals">Equals</SelectItem>
              <SelectItem value="not_equals">Not Equals</SelectItem>
              <SelectItem value="greater_than">Greater Than</SelectItem>
              <SelectItem value="less_than">Less Than</SelectItem>
              <SelectItem value="contains">Contains</SelectItem>
            </SelectContent>
          </Select>

          <Input
            value={filter.value}
            onChange={(e) => updateFilter(idx, { value: e.target.value })}
            placeholder="Value"
            className="flex-1"
          />

          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => removeFilter(idx)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      
      <Button 
        variant="outline" 
        onClick={addFilter} 
        className="w-full"
        size="sm"
      >
        <Plus className="h-4 w-4 mr-2" /> Add Filter
      </Button>
    </div>
  );
};

export default FilterBuilder;
