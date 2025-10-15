import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TableColumn } from '@/types/dashboard';
import { ForeignKeyRelation, ReportFilter } from '@/types/report';
import { Plus, Trash2, Link2 } from 'lucide-react';

interface AdvancedFilterBuilderProps {
  columns: TableColumn[];
  foreignKeys: ForeignKeyRelation[];
  filters: ReportFilter[];
  onChange: (filters: ReportFilter[]) => void;
  foreignColumns: Record<string, TableColumn[]>;
}

const operators = [
  { value: 'eq', label: 'Equals' },
  { value: 'neq', label: 'Not Equals' },
  { value: 'gt', label: 'Greater Than' },
  { value: 'gte', label: 'Greater or Equal' },
  { value: 'lt', label: 'Less Than' },
  { value: 'lte', label: 'Less or Equal' },
  { value: 'ilike', label: 'Contains (case-insensitive)' },
  { value: 'like', label: 'Contains (case-sensitive)' },
  { value: 'is', label: 'Is (null/not null)' },
  { value: 'in', label: 'In (comma-separated)' },
];

const AdvancedFilterBuilder: React.FC<AdvancedFilterBuilderProps> = ({
  columns,
  foreignKeys,
  filters,
  onChange,
  foreignColumns
}) => {
  const addFilter = () => {
    onChange([
      ...filters,
      { column: '', operator: 'eq', value: '' }
    ]);
  };

  const updateFilter = (index: number, updates: Partial<ReportFilter>) => {
    const newFilters = [...filters];
    newFilters[index] = { ...newFilters[index], ...updates };
    onChange(newFilters);
  };

  const removeFilter = (index: number) => {
    onChange(filters.filter((_, i) => i !== index));
  };

  const handleColumnChange = (index: number, column: string) => {
    const fk = foreignKeys.find(fk => fk.sourceColumn === column);
    if (fk) {
      updateFilter(index, {
        column,
        isForeignKey: true,
        foreignTable: fk.foreignTable,
        foreignColumn: '',
        value: ''
      });
    } else {
      updateFilter(index, {
        column,
        isForeignKey: false,
        foreignTable: undefined,
        foreignColumn: undefined,
        value: ''
      });
    }
  };

  return (
    <div className="space-y-4">
      {filters.map((filter, index) => {
        const isFKColumn = foreignKeys.some(fk => fk.sourceColumn === filter.column);
        const fkRelation = foreignKeys.find(fk => fk.sourceColumn === filter.column);

        return (
          <div key={index} className="flex gap-2 items-end p-4 border rounded-lg">
            <div className="flex-1 space-y-2">
              <Label>Column</Label>
              <Select
                value={filter.column}
                onValueChange={(value) => handleColumnChange(index, value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select column" />
                </SelectTrigger>
                <SelectContent>
                  {columns.map(col => {
                    const isFK = foreignKeys.some(fk => fk.sourceColumn === col.name);
                    return (
                      <SelectItem key={col.name} value={col.name}>
                        <div className="flex items-center gap-2">
                          {isFK && <Link2 className="h-3 w-3" />}
                          {col.name}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {isFKColumn && fkRelation && (
              <div className="flex-1 space-y-2">
                <Label>Related Column</Label>
                <Select
                  value={filter.foreignColumn || ''}
                  onValueChange={(value) => updateFilter(index, { foreignColumn: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select related column" />
                  </SelectTrigger>
                  <SelectContent>
                    {foreignColumns[fkRelation.foreignTable]?.map(col => (
                      <SelectItem key={col.name} value={col.name}>
                        {col.name} ({col.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex-1 space-y-2">
              <Label>Operator</Label>
              <Select
                value={filter.operator}
                onValueChange={(value: any) => updateFilter(index, { operator: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {operators.map(op => (
                    <SelectItem key={op.value} value={op.value}>
                      {op.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 space-y-2">
              <Label>Value</Label>
              <Input
                value={filter.value}
                onChange={(e) => updateFilter(index, { value: e.target.value })}
                placeholder={filter.operator === 'is' ? 'null or not null' : 'Enter value'}
                disabled={!filter.column || (isFKColumn && !filter.foreignColumn)}
              />
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeFilter(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      })}

      <Button type="button" variant="outline" onClick={addFilter} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Filter
      </Button>
    </div>
  );
};

export default AdvancedFilterBuilder;
