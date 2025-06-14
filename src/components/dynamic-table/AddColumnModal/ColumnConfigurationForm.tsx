
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

interface FormData {
  name: string;
  key: string;
  type: "string" | "boolean" | "number";
  inputType: "Input" | "Output";
  isRequired: boolean;
  sortable: boolean;
  editable: boolean;
}

interface ColumnConfigurationFormProps {
  formData: FormData;
  onFormDataChange: (updates: Partial<FormData>) => void;
  onNameChange: (name: string) => void;
  isFromExisting: boolean;
  selectedColumn: string;
}

const ColumnConfigurationForm = ({ 
  formData, 
  onFormDataChange, 
  onNameChange, 
  isFromExisting, 
  selectedColumn 
}: ColumnConfigurationFormProps) => {
  const isDisabled = isFromExisting && selectedColumn !== "";

  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="name">Column Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Enter column name"
          disabled={isDisabled}
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="key">Column Key</Label>
        <Input
          id="key"
          value={formData.key}
          onChange={(e) => onFormDataChange({ key: e.target.value })}
          placeholder="Generated from name"
          disabled={isDisabled}
        />
      </div>

      <div className="grid gap-2">
        <Label>Data Type</Label>
        <Select 
          value={formData.type} 
          onValueChange={(value: "string" | "boolean" | "number") => 
            onFormDataChange({ type: value })
          }
          disabled={isDisabled}
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
            onFormDataChange({ 
              inputType: value,
              editable: value === "Input" ? formData.editable : false
            })
          }
          className="flex gap-4"
          disabled={isDisabled}
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
            onFormDataChange({ isRequired: !!checked })
          }
        />
        <Label htmlFor="required" className="cursor-pointer">Required field</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="sortable"
          checked={formData.sortable}
          onCheckedChange={(checked) => 
            onFormDataChange({ sortable: !!checked })
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
              onFormDataChange({ editable: !!checked })
            }
            disabled={isFromExisting}
          />
          <Label htmlFor="editable" className="cursor-pointer">Editable</Label>
        </div>
      )}
    </>
  );
};

export default ColumnConfigurationForm;
