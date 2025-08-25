import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Filter, X } from 'lucide-react';
import { ColumnDefinition } from '@/types/dynamicTable';
import { TableFilter, TEXT_OPERATORS, NUMBER_OPERATORS, BOOLEAN_OPERATORS, DATE_OPERATORS } from '@/types/tableFilters';

interface TableFiltersProps {
  column: ColumnDefinition;
  filter?: TableFilter;
  onFilterChange: (filter: TableFilter | null) => void;
}

const TableFilters = ({ column, filter, onFilterChange }: TableFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempFilter, setTempFilter] = useState<Partial<TableFilter>>(
    filter || {
      columnKey: column.key,
      type: column.type as any,
      operator: getDefaultOperator(column.type as any),
      value: null,
    }
  );

  function getDefaultOperator(type: string) {
    switch (type) {
      case 'string':
        return 'contains';
      case 'number':
        return 'equals';
      case 'boolean':
        return 'is';
      default:
        return 'contains';
    }
  }

  const getOperators = () => {
    switch (column.type) {
      case 'string':
        return TEXT_OPERATORS;
      case 'number':
        return NUMBER_OPERATORS;
      case 'boolean':
        return BOOLEAN_OPERATORS;
      default:
        return TEXT_OPERATORS;
    }
  };

  const handleApplyFilter = () => {
    if (tempFilter.value !== null && tempFilter.value !== undefined && tempFilter.value !== '') {
      onFilterChange({
        columnKey: column.key,
        type: column.type as any,
        operator: tempFilter.operator || getDefaultOperator(column.type as any),
        value: tempFilter.value,
        value2: tempFilter.value2,
      } as TableFilter);
    } else {
      onFilterChange(null);
    }
    setIsOpen(false);
  };

  const handleClearFilter = () => {
    setTempFilter({
      columnKey: column.key,
      type: column.type as any,
      operator: getDefaultOperator(column.type as any),
      value: null,
    });
    onFilterChange(null);
    setIsOpen(false);
  };

  const renderValueInput = () => {
    switch (column.type) {
      case 'number':
        return (
          <div className="space-y-2">
            <Input
              type="number"
              placeholder="Value"
              value={tempFilter.value ? String(tempFilter.value) : ''}
              onChange={(e) => setTempFilter(prev => ({ ...prev, value: e.target.value ? Number(e.target.value) : null }))}
            />
            {tempFilter.operator === 'between' && (
              <Input
                type="number"
                placeholder="Second value"
                value={tempFilter.value2 ? String(tempFilter.value2) : ''}
                onChange={(e) => setTempFilter(prev => ({ ...prev, value2: e.target.value ? Number(e.target.value) : undefined }))}
              />
            )}
          </div>
        );
      
      case 'boolean':
        return (
          <Select
            value={tempFilter.value !== null ? String(tempFilter.value) : ''}
            onValueChange={(value) => setTempFilter(prev => ({ ...prev, value: value === 'true' }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select value" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">True</SelectItem>
              <SelectItem value="false">False</SelectItem>
            </SelectContent>
          </Select>
        );
      
      default:
        return (
          <div className="space-y-2">
            <Input
              placeholder="Value"
              value={String(tempFilter.value || '')}
              onChange={(e) => setTempFilter(prev => ({ ...prev, value: e.target.value || null }))}
            />
            {tempFilter.operator === 'between' && (
              <Input
                placeholder="Second value"
                value={String(tempFilter.value2 || '')}
                onChange={(e) => setTempFilter(prev => ({ ...prev, value2: e.target.value || undefined }))}
              />
            )}
          </div>
        );
    }
  };

  return (
    <div className="flex items-center gap-1">
      {filter && (
        <Badge variant="secondary" className="text-xs">
          Filtered
        </Badge>
      )}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={`h-6 w-6 p-0 ${filter ? 'text-blue-600' : ''}`}
          >
            <Filter className="h-3 w-3" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="start">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Filter {column.name}</h4>
              {filter && (
                <Button variant="ghost" size="sm" onClick={handleClearFilter}>
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Operator</label>
              <Select
                value={tempFilter.operator}
                onValueChange={(value) => setTempFilter(prev => ({ ...prev, operator: value as any, value2: undefined }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getOperators().map(op => (
                    <SelectItem key={op.value} value={op.value}>
                      {op.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Value</label>
              {renderValueInput()}
            </div>

            <div className="flex gap-2">
              <Button onClick={handleApplyFilter} size="sm">
                Apply
              </Button>
              <Button variant="outline" onClick={() => setIsOpen(false)} size="sm">
                Cancel
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TableFilters;