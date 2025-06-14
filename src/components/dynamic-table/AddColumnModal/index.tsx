
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ColumnDefinition } from "@/types/dynamicTable";
import { useDynamicTableSchemas } from "@/hooks/useDynamicTableSchemas";
import { toast } from "sonner";
import ColumnSourceSelector from "./ColumnSourceSelector";
import ExistingColumnSelector from "./ExistingColumnSelector";
import ColumnConfigurationForm from "./ColumnConfigurationForm";
import DependencyInfo from "./DependencyInfo";

interface AddColumnModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddColumn: (column: ColumnDefinition) => void;
  existingColumns: ColumnDefinition[];
}

const AddColumnModal = ({ open, onOpenChange, onAddColumn, existingColumns }: AddColumnModalProps) => {
  const { schemas } = useDynamicTableSchemas();
  const [columnSource, setColumnSource] = useState<"new" | "existing">("new");
  const [selectedTable, setSelectedTable] = useState("");
  const [selectedColumn, setSelectedColumn] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    key: "",
    type: "string" as "string" | "boolean" | "number",
    inputType: "Input" as "Input" | "Output",
    isRequired: false,
    sortable: true,
    editable: true
  });

  const generateKey = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '');
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      key: generateKey(name)
    }));
  };

  const handleFormDataChange = (updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleColumnSourceChange = (value: "new" | "existing") => {
    setColumnSource(value);
    if (value === "new") {
      setSelectedTable("");
      setSelectedColumn("");
    }
  };

  const handleTableChange = (tableId: string) => {
    setSelectedTable(tableId);
    setSelectedColumn("");
  };

  const handleColumnChange = (columnId: string) => {
    setSelectedColumn(columnId);
    handleExistingColumnSelect(selectedTable, columnId);
  };

  const handleExistingColumnSelect = (tableId: string, columnId: string) => {
    const table = schemas[tableId];
    const column = table?.columns.find(col => col.id === columnId);
    
    if (column) {
      setFormData({
        name: `${table.name} - ${column.name}`,
        key: `${tableId}_${column.key}`,
        type: column.type,
        inputType: "Output",
        isRequired: false,
        sortable: true,
        editable: false
      });
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Column name is required");
      return false;
    }
    
    if (!formData.key.trim()) {
      toast.error("Column key is required");
      return false;
    }

    if (existingColumns.some(col => col.key === formData.key)) {
      toast.error("Column key must be unique");
      return false;
    }

    if (columnSource === "existing" && (!selectedTable || !selectedColumn)) {
      toast.error("Please select a table and column");
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const newColumn: ColumnDefinition = {
      id: formData.key,
      name: formData.name,
      key: formData.key,
      type: formData.type,
      inputType: formData.inputType,
      isRequired: formData.isRequired,
      sortable: formData.sortable,
      editable: formData.inputType === "Input" ? formData.editable : false,
      ...(columnSource === "existing" && {
        sourceTable: selectedTable,
        sourceColumn: selectedColumn
      })
    };

    onAddColumn(newColumn);
    toast.success(`Column "${formData.name}" added successfully`);
    
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setColumnSource("new");
    setSelectedTable("");
    setSelectedColumn("");
    setFormData({
      name: "",
      key: "",
      type: "string",
      inputType: "Input",
      isRequired: false,
      sortable: true,
      editable: true
    });
  };

  // Include ALL available tables from all sections - don't filter any out
  const availableTables = Object.values(schemas);
  const selectedTableColumns = selectedTable ? schemas[selectedTable]?.columns || [] : [];

  console.log("Available tables for selection:", availableTables.map(t => ({ id: t.id, name: t.name })));

  return (
    <Dialog open={open} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) resetForm();
    }}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Column</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <ColumnSourceSelector 
              value={columnSource} 
              onChange={handleColumnSourceChange} 
            />

            {columnSource === "existing" && (
              <ExistingColumnSelector
                availableTables={availableTables}
                selectedTable={selectedTable}
                selectedColumn={selectedColumn}
                onTableChange={handleTableChange}
                onColumnChange={handleColumnChange}
                selectedTableColumns={selectedTableColumns}
              />
            )}

            <ColumnConfigurationForm
              formData={formData}
              onFormDataChange={handleFormDataChange}
              onNameChange={handleNameChange}
              isFromExisting={columnSource === "existing"}
              selectedColumn={selectedColumn}
            />

            {columnSource === "existing" && (
              <DependencyInfo 
                selectedTable={selectedTable} 
                selectedColumn={selectedColumn} 
              />
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Column</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddColumnModal;
