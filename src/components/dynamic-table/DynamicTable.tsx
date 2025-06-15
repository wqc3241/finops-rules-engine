
import { useState } from "react";
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

const DynamicTable = ({ 
  schema, 
  data, 
  onDataChange, 
  onSchemaChange, 
  onSelectionChange,
  selectedItems = [],
  allowColumnManagement = true
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
      if (row.id === editingCell.rowId) {
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
    if (column?.key === 'id') {
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
      const newRow: TableData = { ...template, id: newId, version: 1 };
      // Reset relevant values for a new row (set empty string or default for all non-id fields)
      schema.columns.forEach((col) => {
        if (col.key !== "id") {
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
      const newRow: TableData = { id: `new_${Date.now()}` };
      schema.columns.forEach((col: any) => {
        if (col.key !== 'id') {
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
    const rowToCopy = data.find(row => row.id === rowId);
    if (rowToCopy) {
      let newId = "";
      if (schema.id === "financial-program-config") {
        newId = getNextFPCId(data);
      } else {
        newId = `${rowId}_copy_${Date.now()}`;
      }
      const newRow = { ...rowToCopy, id: newId, version: (rowToCopy.version || 1) + 1, cloneFrom: rowToCopy.programCode || null };
      onDataChange([...data, newRow]);
      toast.success("Row copied successfully");
    }
  };

  const handleDeleteRow = (rowId: string) => {
    const updatedData = data.filter(row => row.id !== rowId);
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
                columns={schema.columns}
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
              <TableRow key={row.id} className="hover:bg-gray-50">
                <TableCell>
                  <Checkbox
                    checked={selectedItems.includes(row.id)}
                    onCheckedChange={() => handleSelectRow(row.id)}
                  />
                </TableCell>
                {schema.columns.map((column) => (
                  <TableCell
                    key={column.id}
                    className={`${column.editable ? 'cursor-pointer hover:bg-blue-50' : ''}`}
                    onClick={() => {
                      if (column.editable && !editingCell) {
                        handleCellEdit(row.id, column.key, row[column.key]);
                      }
                    }}
                  >
                    <TableCellRenderer
                      row={row}
                      column={column}
                      isEditing={editingCell?.rowId === row.id && editingCell?.columnKey === column.key}
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
                    rowId={row.id}
                    onEdit={() => toast.info("Edit functionality integrated in cell editing")}
                    onCopy={handleCopyRow}
                    onDelete={handleDeleteRow}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

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
