import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useFinancialProducts } from "@/hooks/useFinancialProducts";

interface FinancialProductMultiSelectProps {
  value: string[] | string;
  onChange: (value: string[]) => void;
  onSave: () => void;
  onCancel: () => void;
}

const FinancialProductMultiSelect = ({
  value,
  onChange,
  onSave,
  onCancel
}: FinancialProductMultiSelectProps) => {
  const financialProducts = useFinancialProducts();

  // Parse the current value - handle both string and array formats
  const selectedValues = Array.isArray(value) 
    ? value 
    : typeof value === 'string' 
      ? value ? value.split(',').map(v => v.trim()).filter(Boolean) : []
      : [];

  const handleProductChange = (productId: string, isSelected: boolean) => {
    let newValues;
    
    if (isSelected) {
      newValues = [...selectedValues, productId];
    } else {
      newValues = selectedValues.filter(v => v !== productId);
    }
    
    onChange(newValues);
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="space-y-2 p-2 border rounded min-w-64 max-h-48 overflow-y-auto">
        {financialProducts.map(product => (
          <div key={product.id} className="flex items-center space-x-2">
            <Checkbox
              checked={selectedValues.includes(product.id)}
              onCheckedChange={(checked) => 
                handleProductChange(product.id, checked as boolean)
              }
            />
            <span className="text-sm">
              {product.productType} ({product.id})
              {product.geoCode && ` - ${product.geoCode}`}
            </span>
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

export default FinancialProductMultiSelect;