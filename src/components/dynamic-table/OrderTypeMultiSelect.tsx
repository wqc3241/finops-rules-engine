
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

interface OrderTypeMultiSelectProps {
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

const OrderTypeMultiSelect = ({
  value,
  onChange,
  onSave,
  onCancel
}: OrderTypeMultiSelectProps) => {
  const orderTypeOptions = [
    { id: "INV", label: "Inventory", code: "INV" },
    { id: "CON", label: "Configurator", code: "CON" }
  ];

  const selectedValues = value ? value.split(', ').filter(Boolean) : [];

  const handleOrderTypeChange = (optionCode: string, isSelected: boolean) => {
    let newValues;
    
    if (isSelected) {
      newValues = [...selectedValues, optionCode];
    } else {
      newValues = selectedValues.filter(v => v !== optionCode);
    }
    
    onChange(newValues.join(', '));
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="space-y-2 p-2 border rounded min-w-48">
        {orderTypeOptions.map(orderType => (
          <div key={orderType.id} className="flex items-center space-x-2">
            <Checkbox
              checked={selectedValues.includes(orderType.code)}
              onCheckedChange={(checked) => 
                handleOrderTypeChange(orderType.code, checked as boolean)
              }
            />
            <span className="text-sm">{orderType.label} ({orderType.code})</span>
          </div>
        ))}
      </div>
      <div className="space-x-2">
        <Button size="sm" onClick={onSave}>Save</Button>
        <Button size="sm" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
};

export default OrderTypeMultiSelect;
