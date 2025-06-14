
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
  const handleProductSelect = (value: string) => {
    onUpdate({ financialProduct: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Financial Product</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Select the single financial product that will be available in this program.
        </p>
      </div>

      <RadioGroup
        value={data.financialProduct}
        onValueChange={handleProductSelect}
        className="space-y-4"
      >
        {financialProducts.map((product) => (
          <div key={product.id} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50">
            <RadioGroupItem
              value={product.id}
              id={product.id}
              className="mt-1"
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
      </RadioGroup>

      {data.financialProduct && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Selected Product:</strong>
            {" "}
            {financialProducts.find(p => p.id === data.financialProduct)?.label}
          </p>
        </div>
      )}
    </div>
  );
};

export default FinancialProductStep;
