
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { WizardData } from "../FinancialProgramWizard";

// Mock data from Financial Products table
const financialProducts = [
  { id: "USLN", label: "USLN - US Loan", type: "Loan", geoCode: "NA-US" },
  { id: "USLE", label: "USLE - US Lease", type: "Lease", geoCode: "NA-US" },
  { id: "KSABM", label: "KSABM - KSA Balloon Mortgage", type: "Loan", geoCode: "ME-KSA" },
  { id: "KSABA5050", label: "KSABA5050 - KSA Balloon 50/50", type: "Loan", geoCode: "ME-KSA" }
];

interface FinancialProductStepProps {
  data: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
}

const FinancialProductStep = ({ data, onUpdate }: FinancialProductStepProps) => {
  const handleProductToggle = (productId: string, checked: boolean) => {
    const updatedProducts = checked
      ? [...data.financialProducts, productId]
      : data.financialProducts.filter(id => id !== productId);
    
    onUpdate({ financialProducts: updatedProducts });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Financial Products</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Select one or more financial products that will be available in this program.
        </p>
      </div>

      <div className="space-y-4">
        {financialProducts.map((product) => (
          <div key={product.id} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50">
            <Checkbox
              id={product.id}
              checked={data.financialProducts.includes(product.id)}
              onCheckedChange={(checked) => handleProductToggle(product.id, checked as boolean)}
            />
            <div className="flex-1">
              <Label htmlFor={product.id} className="text-sm font-medium cursor-pointer">
                {product.label}
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                Type: {product.type} | Geo: {product.geoCode}
              </p>
            </div>
          </div>
        ))}
      </div>

      {data.financialProducts.length > 0 && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Selected Products:</strong> {data.financialProducts.length} product(s)
          </p>
          <ul className="text-xs text-blue-700 mt-2 space-y-1">
            {data.financialProducts.map(id => (
              <li key={id}>• {financialProducts.find(p => p.id === id)?.label}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FinancialProductStep;
