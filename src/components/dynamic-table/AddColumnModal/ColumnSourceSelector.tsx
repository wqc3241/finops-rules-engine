
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ColumnSourceSelectorProps {
  value: "new" | "existing";
  onChange: (value: "new" | "existing") => void;
}

const ColumnSourceSelector = ({ value, onChange }: ColumnSourceSelectorProps) => {
  return (
    <div className="grid gap-2">
      <Label>Column Source</Label>
      <RadioGroup 
        value={value} 
        onValueChange={onChange}
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
  );
};

export default ColumnSourceSelector;
