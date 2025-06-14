
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { DynamicTableSchema } from "@/types/dynamicTable";

interface ExistingColumnSelectorProps {
  availableTables: DynamicTableSchema[];
  selectedTable: string;
  selectedColumn: string;
  onTableChange: (tableId: string) => void;
  onColumnChange: (columnId: string) => void;
  selectedTableColumns: any[];
}

const ExistingColumnSelector = ({ 
  availableTables, 
  selectedTable, 
  selectedColumn, 
  onTableChange, 
  onColumnChange,
  selectedTableColumns 
}: ExistingColumnSelectorProps) => {
  return (
    <>
      {/* Table Selection */}
      <div className="grid gap-2">
        <Label>Select Table</Label>
        <Select value={selectedTable} onValueChange={onTableChange}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a table" />
          </SelectTrigger>
          <SelectContent>
            {availableTables.map(table => (
              <SelectItem key={table.id} value={table.id}>
                {table.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Column Selection */}
      {selectedTable && (
        <div className="grid gap-2">
          <Label>Select Column</Label>
          <Select value={selectedColumn} onValueChange={onColumnChange}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a column" />
            </SelectTrigger>
            <SelectContent>
              {selectedTableColumns.map(column => (
                <SelectItem key={column.id} value={column.id}>
                  {column.name} ({column.type})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </>
  );
};

export default ExistingColumnSelector;
