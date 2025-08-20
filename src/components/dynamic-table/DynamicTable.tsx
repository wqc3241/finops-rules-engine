
import { useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { DynamicTableProps, TableData, ColumnDefinition } from "@/types/dynamicTable";
import { toast } from "sonner";
import ColumnManagementModal from "./ColumnManagementModal";
import AddColumnModal from "./AddColumnModal";
import TableCellRenderer from "./TableCellRenderer";
import TableRowActions from "./TableRowActions";
import TableHeaderComponent from "./TableHeader";
import { getNextFPCId } from "./utils/tableUtils";
import { TablePagination } from "@/components/ui/table-pagination";

// Helper to determine the primary key column for any schema
const getPrimaryKey = (schema: { columns: ColumnDefinition[] }, data: TableData[]): string => {
  // If data rows have an explicit id, prefer it
  if (data?.length && Object.prototype.hasOwnProperty.call(data[0], 'id')) return 'id';
  // Prefer explicit id column from schema
  const explicitId = schema.columns.find(c => c.key === 'id');
  if (explicitId) return explicitId.key;
  // Prefer columns ending with _id
  const endsWithId = schema.columns.find(c => c.key.endsWith('_id'));
  if (endsWithId) return endsWithId.key;
  // Prefer columns that include 'id'
  const includesId = schema.columns.find(c => c.key.toLowerCase().includes('id'));
  if (includesId) return includesId.key;
  // Fallback to first key in data if available
  if (data?.length) return Object.keys(data[0])[0];
  // Ultimate fallback
  return 'id';
};

const DynamicTable = ({ 
  schema, 
  data, 
  onDataChange, 
  onSchemaChange, 
  onSelectionChange,
  selectedItems = [],
  allowColumnManagement = true,
  onEditRow,
  // Pagination props
  totalCount = 0,
  pageSize = 100,
  currentPage = 1,
  onPageChange
}: DynamicTableProps) => {
  const [showColumnManagement, setShowColumnManagement] = useState(false);
  const [showAddColumn, setShowAddColumn] = useState(false);
  const [insertPosition, setInsertPosition] = useState<number>(0);
  const [editingCell, setEditingCell] = useState<{rowId: string, columnKey: string} | null>(null);
  const [editValue, setEditValue] = useState<any>("");
  const [hoveredDivider, setHoveredDivider] = useState<number | null>(null);
  const [hoveredDeleteButton, setHoveredDeleteButton] = useState<string | null>(null);

  // Demo options for program config dropdowns (should be fetched in a real app)
  const programConfigOptions = {
    financialProducts: [
      { id: "USLN", label: "USLN - US Loan" },
      { id: "USLE", label: "USLE - US Lease" },
      { id: "KSABM", label: "KSABM - KSA Balloon Mortgage" },
      { id: "KSABA5050", label: "KSABA5050 - KSA Balloon 50/50" }
    ],
    vehicleStyles: [
      { id: "L25A1", label: "L25A1 - 2025 Lucid Air Grand Touring" },
      { id: "L25A2", label: "L25A2 - 2025 Lucid Air Pure" },
      { id: "L25A3", label: "L25A3 - 2025 Lucid Air Pure" },
      { id: "KSA25A1", label: "KSA25A1 - 2025 Lucid Air Pure (KSA)" }
    ],
    vehicleConditions: [
      { id: "New", label: "New" },
      { id: "Used", label: "Used" },
      { id: "Demo", label: "Demo" },
      { id: "CPO", label: "Certified Pre-Owned" }
    ]
  };

  const primaryKey = useMemo(() => getPrimaryKey(schema, data), [schema, data]);
  const visibleColumns = useMemo(() => {
    const cols = schema.columns.filter(c => c.key !== 'id');
    const rest = cols.filter(c => !(c.key === 'created_at' || c.name.toLowerCase() === 'created at'));
    const created = cols.filter(c => (c.key === 'created_at' || c.name.toLowerCase() === 'created at'));
    return [...rest, ...created];
  }, [schema.columns]);

  const handleSelectRow = (id: string) => {
    const updatedSelection = selectedItems.includes(id)
      ? selectedItems.filter(item => item !== id)
      : [...selectedItems, id];
    onSelectionChange?.(updatedSelection);
  };
  const handleCellEdit = (rowId: string, columnKey: string, currentValue: any) => {
    setEditingCell({ rowId, columnKey });
    setEditValue(currentValue);
  };

  const handleSaveEdit = () => {
    if (!editingCell) return;
    
    const updatedData = data.map(row => {
      if ((row as any)[primaryKey] === editingCell.rowId) {
        return { ...row, [editingCell.columnKey]: editValue };
      }
      return row;
    });
    
    onDataChange(updatedData);
    setEditingCell(null);
    setEditValue("");
    toast.success("Cell updated successfully");
  };

  const handleCancelEdit = () => {
    setEditingCell(null);
    setEditValue("");
  };

  const handleAddColumn = (column: ColumnDefinition) => {
    const updatedColumns = [...schema.columns];
    updatedColumns.splice(insertPosition + 1, 0, column);
    
    const updatedSchema = {
      ...schema,
      columns: updatedColumns
    };
    onSchemaChange(updatedSchema);
  };

  const handleRemoveColumn = (columnId: string) => {
    const column = schema.columns.find(col => col.id === columnId);
    if (column?.key === 'id' || column?.key === primaryKey) {
      toast.error("Cannot delete ID column");
      return;
    }
    
    const updatedSchema = {
      ...schema,
      columns: schema.columns.filter(col => col.id !== columnId)
    };
    onSchemaChange(updatedSchema);
    toast.success("Column removed successfully");
  };

  const handleUpdateColumn = (columnId: string, updates: Partial<ColumnDefinition>) => {
    const updatedSchema = {
      ...schema,
      columns: schema.columns.map(col => 
        col.id === columnId ? { ...col, ...updates } : col
      )
    };
    onSchemaChange(updatedSchema);
  };

  const handleAddNewRow = () => {
    // Only custom for financial-program-config table (otherwise fallback)
    if (schema.id === "financial-program-config") {
      const newId = getNextFPCId(data);
      // Clone the first row as template or create empty row
      const template = data[0] || {};
      const newRow: any = { ...template, id: newId, version: 1 };
      // Ensure primary key is set
      if (primaryKey !== 'id') newRow[primaryKey] = newId;
      // Reset relevant values for a new row (set empty string or default for all non-PK fields)
      schema.columns.forEach((col) => {
        if (col.key !== primaryKey) {
          switch (col.type) {
            case 'number': newRow[col.key] = 0; break;
            case 'boolean': newRow[col.key] = false; break;
            default: newRow[col.key] = ""; break;
          }
        }
      });
      onDataChange([...data, newRow]);
    } else {
      // Default: mimic old add logic
      const newRow: any = { [primaryKey]: `new_${Date.now()}` };
      schema.columns.forEach((col: any) => {
        if (col.key !== primaryKey) {
          switch (col.type) {
            case 'string': newRow[col.key] = ''; break;
            case 'boolean': newRow[col.key] = false; break;
            case 'number': newRow[col.key] = 0; break;
          }
        }
      });
      onDataChange([...data, newRow]);
    }
  };

  const handleCopyRow = (rowId: string) => {
    const rowToCopy = data.find(row => (row as any)[primaryKey] === rowId);
    if (rowToCopy) {
      let newId = "";
      if (schema.id === "financial-program-config") {
        newId = getNextFPCId(data);
      } else {
        newId = `${rowId}_copy_${Date.now()}`;
      }
      const newRow: any = { ...rowToCopy, [primaryKey]: newId, version: ((rowToCopy as any).version || 1) + 1, cloneFrom: (rowToCopy as any).programCode || null };
      onDataChange([...data, newRow]);
      toast.success("Row copied successfully");
    }
  };

  const handleDeleteRow = (rowId: string) => {
    const updatedData = data.filter(row => (row as any)[primaryKey] !== rowId);
    onDataChange(updatedData);
    onSelectionChange?.(selectedItems.filter(id => id !== rowId));
    toast.success("Row deleted successfully");
  };

  const handleDividerClick = (index: number) => {
    setInsertPosition(index);
    setShowAddColumn(true);
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderComponent
                columns={visibleColumns}
                allowColumnManagement={allowColumnManagement}
                hoveredDeleteButton={hoveredDeleteButton}
                setHoveredDeleteButton={setHoveredDeleteButton}
                hoveredDivider={hoveredDivider}
                setHoveredDivider={setHoveredDivider}
                onRemoveColumn={handleRemoveColumn}
                onDividerClick={handleDividerClick}
              />
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={String((row as any)[primaryKey] ?? (row as any).id)} className="hover:bg-gray-50">
                <TableCell>
                  <Checkbox
                    checked={selectedItems.includes((row as any)[primaryKey])}
                    onCheckedChange={() => handleSelectRow((row as any)[primaryKey])}
                  />
                </TableCell>
                {visibleColumns.map((column) => (
                  <TableCell
                    key={column.id}
                    className={`${column.editable ? 'cursor-pointer hover:bg-blue-50' : ''}`}
                    onClick={() => {
                      if (column.editable && !editingCell) {
                        handleCellEdit((row as any)[primaryKey], column.key, (row as any)[column.key]);
                      }
                    }}
                  >
                    <TableCellRenderer
                      row={row}
                      column={column}
                      isEditing={editingCell?.rowId === (row as any)[primaryKey] && editingCell?.columnKey === column.key}
                      editValue={editValue}
                      setEditValue={setEditValue}
                      handleSaveEdit={handleSaveEdit}
                      handleCancelEdit={handleCancelEdit}
                      programConfigOptions={programConfigOptions}
                      editingCell={editingCell}
                    />
                  </TableCell>
                ))}
                <TableCell className="text-right">
                  <TableRowActions
                    rowId={(row as any)[primaryKey]}
                    onEdit={() => onEditRow ? onEditRow((row as any)[primaryKey], row) : toast.info("Edit functionality integrated in cell editing")}
                    onCopy={handleCopyRow}
                    onDelete={handleDeleteRow}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {totalCount > 0 && onPageChange && (
        <TablePagination
          totalCount={totalCount}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={onPageChange}
        />
      )}

      <ColumnManagementModal
        open={showColumnManagement}
        onOpenChange={setShowColumnManagement}
        columns={schema.columns}
        onAddColumn={handleAddColumn}
        onRemoveColumn={handleRemoveColumn}
        onUpdateColumn={handleUpdateColumn}
      />

      <AddColumnModal
        open={showAddColumn}
        onOpenChange={setShowAddColumn}
        onAddColumn={handleAddColumn}
        existingColumns={schema.columns}
      />
    </div>
  );
};

export default DynamicTable;
