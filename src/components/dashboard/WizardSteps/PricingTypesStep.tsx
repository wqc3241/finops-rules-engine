
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { WizardData } from "../FinancialProgramWizard";

// Mock data from Pricing Types table
const pricingTypes = [
  { code: "STDAPR", name: "Standard APR" },
  { code: "SUBAPR", name: "Subvented APR" },
  { code: "MINDWPAY", name: "Min Down Payment" },
  { code: "SPR", name: "Special Rate" },
  { code: "INR", name: "Interest Rate" },
  { code: "ENHRV", name: "Enhanced Residual Value" },
  { code: "SUBMF", name: "Subvented Money Factor" },
  { code: "MAXBDAPR", name: "Max Base Down APR" },
  { code: "MAXMUAPR", name: "Max Markup APR" },
  { code: "ADF", name: "Additional Dealer Fee" }
];

interface PricingTypesStepProps {
  data: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
}

const PricingTypesStep = ({ data, onUpdate }: PricingTypesStepProps) => {
  const handlePricingTypeToggle = (typeCode: string, checked: boolean) => {
    const updatedTypes = checked
      ? [...data.pricingTypes, typeCode]
      : data.pricingTypes.filter(code => code !== typeCode);
    
    onUpdate({ pricingTypes: updatedTypes });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Available Pricing Types</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Select the pricing types that will be available for this financial program.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pricingTypes.map((type) => (
          <div key={type.code} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
            <Checkbox
              id={type.code}
              checked={data.pricingTypes.includes(type.code)}
              onCheckedChange={(checked) => handlePricingTypeToggle(type.code, checked as boolean)}
            />
            <div className="flex-1">
              <Label htmlFor={type.code} className="text-sm font-medium cursor-pointer">
                {type.code}
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                {type.name}
              </p>
            </div>
          </div>
        ))}
      </div>

      {data.pricingTypes.length > 0 && (
        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <p className="text-sm text-purple-800">
            <strong>Selected Pricing Types:</strong> {data.pricingTypes.length} type(s)
          </p>
          <div className="text-xs text-purple-700 mt-2">
            {data.pricingTypes.join(", ")}
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingTypesStep;
