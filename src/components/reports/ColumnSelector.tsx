import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TableColumn } from '@/types/dashboard';
import { ForeignKeyRelation } from '@/types/report';
import { Link2 } from 'lucide-react';

interface ColumnSelectorProps {
  columns: TableColumn[];
  foreignKeys: ForeignKeyRelation[];
  selectedColumns: string[];
  onChange: (columns: string[] | ((prev: string[]) => string[])) => void;
  foreignColumns: Record<string, TableColumn[]>;
}

const ColumnSelector: React.FC<ColumnSelectorProps> = ({
  columns,
  foreignKeys,
  selectedColumns,
  onChange,
  foreignColumns
}) => {
  const toggleColumn = (columnName: string) => {
    console.log('[ColumnSelector] toggleColumn called:', columnName);
    console.log('[ColumnSelector] Current selected:', selectedColumns);
    if (selectedColumns.includes(columnName)) {
      console.log('[ColumnSelector] Removing column:', columnName);
      onChange(selectedColumns.filter(col => col !== columnName));
    } else {
      console.log('[ColumnSelector] Adding column:', columnName);
      onChange([...selectedColumns, columnName]);
    }
  };

  const directColumns = columns.filter(col => 
    !foreignKeys.some(fk => fk.sourceColumn === col.name)
  );

  return (
    <ScrollArea className="h-[300px] pr-4">
      <div className="space-y-6">
        {/* Direct Columns */}
        <div>
          <h4 className="text-sm font-semibold mb-3">Direct Columns</h4>
          <div className="space-y-2">
            {directColumns.map(column => (
              <div 
                key={column.name} 
                className="flex items-center space-x-2"
              >
                <Checkbox
                  id={`col-${column.name}`}
                  checked={selectedColumns.includes(column.name)}
                  onCheckedChange={(checked) => {
                    console.log('[ColumnSelector] Direct Column Checkbox onCheckedChange:', { 
                      column: column.name, 
                      checked
                    });
                    onChange((prevSelected: string[]) => {
                      console.log('[ColumnSelector] prevSelected:', prevSelected);
                      if (checked) {
                        if (prevSelected.includes(column.name)) {
                          return prevSelected;
                        }
                        const newSelection = [...prevSelected, column.name];
                        console.log('[ColumnSelector] Adding column, new selection:', newSelection);
                        return newSelection;
                      } else {
                        const newSelection = prevSelected.filter(col => col !== column.name);
                        console.log('[ColumnSelector] Removing column, new selection:', newSelection);
                        return newSelection;
                      }
                    });
                  }}
                />
                <div 
                  className="flex-1 cursor-pointer" 
                  onClick={() => {
                    console.log('[ColumnSelector] Direct Column Label clicked:', {
                      column: column.name
                    });
                    onChange((prevSelected: string[]) => {
                      if (prevSelected.includes(column.name)) {
                        return prevSelected.filter(col => col !== column.name);
                      } else {
                        return [...prevSelected, column.name];
                      }
                    });
                  }}
                >
                  <span className="font-medium">{column.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">({column.type})</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Foreign Key Columns */}
        {foreignKeys.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Link2 className="h-4 w-4" />
              Related Columns (via Foreign Keys)
            </h4>
            {foreignKeys.map(fk => (
              <div key={fk.sourceColumn} className="mb-4 ml-4">
                <p className="text-sm font-medium mb-2 text-primary">
                  {fk.sourceColumn} → {fk.foreignTable}
                </p>
                <div className="space-y-2 ml-4">
                  {foreignColumns[fk.foreignTable]?.map(column => {
                    const fkColumnName = `${fk.sourceColumn}.${column.name}`;
                    return (
                      <div 
                        key={fkColumnName} 
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`col-${fkColumnName}`}
                          checked={selectedColumns.includes(fkColumnName)}
                          onCheckedChange={(checked) => {
                            console.log('[ColumnSelector] FK Column Checkbox onCheckedChange:', { 
                              column: fkColumnName, 
                              checked
                            });
                            onChange((prevSelected: string[]) => {
                              console.log('[ColumnSelector] FK prevSelected:', prevSelected);
                              if (checked) {
                                if (prevSelected.includes(fkColumnName)) {
                                  return prevSelected;
                                }
                                const newSelection = [...prevSelected, fkColumnName];
                                console.log('[ColumnSelector] Adding FK column, new selection:', newSelection);
                                return newSelection;
                              } else {
                                const newSelection = prevSelected.filter(col => col !== fkColumnName);
                                console.log('[ColumnSelector] Removing FK column, new selection:', newSelection);
                                return newSelection;
                              }
                            });
                          }}
                        />
                        <div 
                          className="flex-1 cursor-pointer" 
                          onClick={() => {
                            console.log('[ColumnSelector] FK Column Label clicked:', {
                              column: fkColumnName
                            });
                            onChange((prevSelected: string[]) => {
                              if (prevSelected.includes(fkColumnName)) {
                                return prevSelected.filter(col => col !== fkColumnName);
                              } else {
                                return [...prevSelected, fkColumnName];
                              }
                            });
                          }}
                        >
                          <span className="font-medium">{column.name}</span>
                          <span className="text-xs text-muted-foreground ml-2">({column.type})</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default ColumnSelector;
