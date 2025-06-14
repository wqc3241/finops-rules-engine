
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDefinition } from "@/types/dynamicTable";
import { useDynamicTableSchemas } from "@/hooks/useDynamicTableSchemas";
import { toast } from "sonner";

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

  const handleExistingColumnSelect = (tableId: string, columnId: string) => {
    const table = schemas[tableId];
    const column = table?.columns.find(col => col.id === columnId);
    
    if (column) {
      setFormData({
        name: `${table.name} - ${column.name}`,
        key: `${tableId}_${column.key}`,
        type: column.type,
        inputType: "Output", // Referenced columns are typically output
        isRequired: false,
        sortable: true,
        editable: false // Referenced columns shouldn't be editable
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
      // Add reference information if it's from existing table
      ...(columnSource === "existing" && {
        sourceTable: selectedTable,
        sourceColumn: selectedColumn
      })
    };

    onAddColumn(newColumn);
    toast.success(`Column "${formData.name}" added successfully`);
    
    // Reset form
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

  const availableTables = Object.values(schemas).filter(schema => schema.id !== 'current');
  const selectedTableColumns = selectedTable ? schemas[selectedTable]?.columns || [] : [];

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
            {/* Column Source Selection */}
            <div className="grid gap-2">
              <Label>Column Source</Label>
              <RadioGroup 
                value={columnSource} 
                onValueChange={(value: "new" | "existing") => {
                  setColumnSource(value);
                  if (value === "new") {
                    setSelectedTable("");
                    setSelectedColumn("");
                  }
                }}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="new" id="new-column" className="cursor-pointer" />
                  <Label htmlFor="new-column" className="cursor-pointer">Create New Column</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="existing" id="existing-column" className="cursor-pointer" />
                  <Label htmlFor="existing-column" className="cursor-pointer">Reference Existing Column</Label>
                </div>
              </RadioGroup>
            </div>

            {columnSource === "existing" && (
              <>
                {/* Table Selection */}
                <div className="grid gap-2">
                  <Label>Select Table</Label>
                  <Select value={selectedTable} onValueChange={(value) => {
                    setSelectedTable(value);
                    setSelectedColumn("");
                  }}>
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
                    <Select value={selectedColumn} onValueChange={(value) => {
                      setSelectedColumn(value);
                      handleExistingColumnSelect(selectedTable, value);
                    }}>
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
            )}

            {/* Column Configuration */}
            <div className="grid gap-2">
              <Label htmlFor="name">Column Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Enter column name"
                disabled={columnSource === "existing" && selectedColumn !== ""}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="key">Column Key</Label>
              <Input
                id="key"
                value={formData.key}
                onChange={(e) => setFormData(prev => ({ ...prev, key: e.target.value }))}
                placeholder="Generated from name"
                disabled={columnSource === "existing" && selectedColumn !== ""}
              />
            </div>

            <div className="grid gap-2">
              <Label>Data Type</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value: "string" | "boolean" | "number") => 
                  setFormData(prev => ({ ...prev, type: value }))
                }
                disabled={columnSource === "existing" && selectedColumn !== ""}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="string">String</SelectItem>
                  <SelectItem value="boolean">Boolean</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Column Type</Label>
              <RadioGroup 
                value={formData.inputType} 
                onValueChange={(value: "Input" | "Output") => 
                  setFormData(prev => ({ 
                    ...prev, 
                    inputType: value,
                    editable: value === "Input" ? prev.editable : false
                  }))
                }
                className="flex gap-4"
                disabled={columnSource === "existing" && selectedColumn !== ""}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Input" id="input-type" className="cursor-pointer" />
                  <Label htmlFor="input-type" className="cursor-pointer">Input</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Output" id="output-type" className="cursor-pointer" />
                  <Label htmlFor="output-type" className="cursor-pointer">Output</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="required"
                checked={formData.isRequired}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, isRequired: !!checked }))
                }
              />
              <Label htmlFor="required" className="cursor-pointer">Required field</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="sortable"
                checked={formData.sortable}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, sortable: !!checked }))
                }
              />
              <Label htmlFor="sortable" className="cursor-pointer">Sortable</Label>
            </div>

            {formData.inputType === "Input" && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="editable"
                  checked={formData.editable}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, editable: !!checked }))
                  }
                  disabled={columnSource === "existing"}
                />
                <Label htmlFor="editable" className="cursor-pointer">Editable</Label>
              </div>
            )}

            {columnSource === "existing" && selectedTable && selectedColumn && (
              <div className="p-3 bg-blue-50 rounded-md">
                <p className="text-sm text-blue-800">
                  <strong>Dependency:</strong> This column will reference "{schemas[selectedTable]?.columns.find(col => col.id === selectedColumn)?.name}" from the "{schemas[selectedTable]?.name}" table.
                </p>
              </div>
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
