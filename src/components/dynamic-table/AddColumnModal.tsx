
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDefinition } from "@/types/dynamicTable";
import { toast } from "sonner";

interface AddColumnModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddColumn: (column: ColumnDefinition) => void;
  existingColumns: ColumnDefinition[];
}

const AddColumnModal = ({ open, onOpenChange, onAddColumn, existingColumns }: AddColumnModalProps) => {
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
      editable: formData.inputType === "Input" ? formData.editable : false
    };

    onAddColumn(newColumn);
    toast.success(`Column "${formData.name}" added successfully`);
    
    // Reset form
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Column</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Column Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Enter column name"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="key">Column Key</Label>
              <Input
                id="key"
                value={formData.key}
                onChange={(e) => setFormData(prev => ({ ...prev, key: e.target.value }))}
                placeholder="Generated from name"
              />
            </div>

            <div className="grid gap-2">
              <Label>Data Type</Label>
              <Select value={formData.type} onValueChange={(value: "string" | "boolean" | "number") => 
                setFormData(prev => ({ ...prev, type: value }))
              }>
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
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Input" id="input" />
                  <Label htmlFor="input">Input</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Output" id="output" />
                  <Label htmlFor="output">Output</Label>
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
              <Label htmlFor="required">Required field</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="sortable"
                checked={formData.sortable}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, sortable: !!checked }))
                }
              />
              <Label htmlFor="sortable">Sortable</Label>
            </div>

            {formData.inputType === "Input" && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="editable"
                  checked={formData.editable}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, editable: !!checked }))
                  }
                />
                <Label htmlFor="editable">Editable</Label>
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
