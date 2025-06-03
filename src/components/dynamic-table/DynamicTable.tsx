import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Edit, Copy, Trash2, Plus } from "lucide-react";
import { DynamicTableProps, TableData, ColumnDefinition } from "@/types/dynamicTable";
import { toast } from "sonner";
import ColumnManagementModal from "./ColumnManagementModal";
import AddColumnModal from "./AddColumnModal";

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

  const handleCopyRow = (rowId: string) => {
    const rowToCopy = data.find(row => row.id === rowId);
    if (rowToCopy) {
      const newId = `${rowId}_copy_${Date.now()}`;
      const newRow = { ...rowToCopy, id: newId };
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

  const renderCellContent = (row: TableData, column: ColumnDefinition) => {
    const isEditing = editingCell?.rowId === row.id && editingCell?.columnKey === column.key;
    const value = row[column.key];

    if (isEditing && column.editable) {
      if (column.type === 'boolean') {
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={editValue}
              onCheckedChange={setEditValue}
            />
            <div className="space-x-2">
              <Button size="sm" onClick={handleSaveEdit}>Save</Button>
              <Button size="sm" variant="outline" onClick={handleCancelEdit}>Cancel</Button>
            </div>
          </div>
        );
      }

      return (
        <div className="flex items-center space-x-2">
          <Input
            value={editValue}
            onChange={(e) => setEditValue(column.type === 'number' ? Number(e.target.value) : e.target.value)}
            type={column.type === 'number' ? 'number' : 'text'}
            className="w-32"
          />
          <div className="space-x-2">
            <Button size="sm" onClick={handleSaveEdit}>Save</Button>
            <Button size="sm" variant="outline" onClick={handleCancelEdit}>Cancel</Button>
          </div>
        </div>
      );
    }

    if (column.type === 'boolean') {
      return (
        <Badge className={value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
          {value ? 'Yes' : 'No'}
        </Badge>
      );
    }

    if (column.type === 'number' && typeof value === 'number') {
      return value.toLocaleString();
    }

    return value || '';
  };

  const getHeaderClassName = (column: ColumnDefinition) => {
    return column.inputType === 'Input' 
      ? 'bg-blue-50 text-blue-900' 
      : 'bg-gray-50 text-gray-700';
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                {/* Removed select all checkbox */}
              </TableHead>
              {schema.columns.map((column, index) => (
                <TableHead key={column.id} className={`${getHeaderClassName(column)} relative`}>
                  <span>{column.name}</span>
                  
                  {/* Delete button at top edge */}
                  {allowColumnManagement && column.key !== 'id' && (
                    <div
                      className="absolute top-0 left-0 right-0 h-2 cursor-pointer group z-20"
                      onMouseEnter={() => setHoveredDeleteButton(column.id)}
                      onMouseLeave={() => setHoveredDeleteButton(null)}
                    >
                      {hoveredDeleteButton === column.id && (
                        <div 
                          className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors shadow-lg"
                          onClick={() => handleRemoveColumn(column.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Column divider with hover effect */}
                  {allowColumnManagement && index < schema.columns.length - 1 && (
                    <div
                      className="absolute top-0 right-0 w-2 h-full cursor-pointer group z-10"
                      onMouseEnter={() => setHoveredDivider(index)}
                      onMouseLeave={() => setHoveredDivider(null)}
                      onClick={() => handleDividerClick(index)}
                    >
                      <div className="w-px h-full bg-gray-200 group-hover:bg-blue-300 transition-colors" />
                      {hoveredDivider === index && (
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-blue-600 transition-colors">
                          <Plus className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  )}
                </TableHead>
              ))}
              <TableHead className="text-right">Actions</TableHead>
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
                    {renderCellContent(row, column)}
                  </TableCell>
                ))}
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toast.info("Edit functionality integrated in cell editing")}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopyRow(row.id)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteRow(row.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
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
