
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { WizardData } from "../FinancialProgramWizard";

interface PricingConfigStepProps {
  data: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
}

const PricingConfigStep = ({ data, onUpdate }: PricingConfigStepProps) => {
  const [formData, setFormData] = useState({
    minLTV: "",
    maxLTV: "",
    minTerm: "",
    maxTerm: "",
    minLeaseMileage: "",
    maxLeaseMileage: "",
    priority: "1"
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateConfig = () => {
    const configId = `PC${Date.now()}`;
    const config = {
      id: configId,
      creditProfile: data.creditProfile?.id || "",
      minLTV: formData.minLTV ? parseFloat(formData.minLTV) : null,
      maxLTV: formData.maxLTV ? parseFloat(formData.maxLTV) : null,
      minTerm: formData.minTerm ? parseInt(formData.minTerm) : null,
      maxTerm: formData.maxTerm ? parseInt(formData.maxTerm) : null,
      minLeaseMileage: formData.minLeaseMileage ? parseInt(formData.minLeaseMileage) : null,
      maxLeaseMileage: formData.maxLeaseMileage ? parseInt(formData.maxLeaseMileage) : null,
      priority: parseInt(formData.priority)
    };
    
    onUpdate({ pricingConfig: config });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Pricing Configuration</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Configure the pricing parameters linked to the credit profile.
        </p>
      </div>

      {data.creditProfile && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Linked Credit Profile:</strong> {data.creditProfile.id}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="priority">Priority *</Label>
          <Input
            id="priority"
            type="number"
            value={formData.priority}
            onChange={(e) => handleInputChange("priority", e.target.value)}
            placeholder="1"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="minLTV">Min LTV (%)</Label>
          <Input
            id="minLTV"
            type="number"
            step="0.1"
            value={formData.minLTV}
            onChange={(e) => handleInputChange("minLTV", e.target.value)}
            placeholder="e.g., 80"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxLTV">Max LTV (%)</Label>
          <Input
            id="maxLTV"
            type="number"
            step="0.1"
            value={formData.maxLTV}
            onChange={(e) => handleInputChange("maxLTV", e.target.value)}
            placeholder="e.g., 100"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="minTerm">Min Term (months)</Label>
          <Input
            id="minTerm"
            type="number"
            value={formData.minTerm}
            onChange={(e) => handleInputChange("minTerm", e.target.value)}
            placeholder="e.g., 24"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxTerm">Max Term (months)</Label>
          <Input
            id="maxTerm"
            type="number"
            value={formData.maxTerm}
            onChange={(e) => handleInputChange("maxTerm", e.target.value)}
            placeholder="e.g., 72"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="minLeaseMileage">Min Lease Mileage</Label>
          <Input
            id="minLeaseMileage"
            type="number"
            value={formData.minLeaseMileage}
            onChange={(e) => handleInputChange("minLeaseMileage", e.target.value)}
            placeholder="e.g., 10000"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxLeaseMileage">Max Lease Mileage</Label>
          <Input
            id="maxLeaseMileage"
            type="number"
            value={formData.maxLeaseMileage}
            onChange={(e) => handleInputChange("maxLeaseMileage", e.target.value)}
            placeholder="e.g., 15000"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleCreateConfig} disabled={!data.creditProfile}>
          Create Pricing Config
        </Button>
      </div>

      {data.pricingConfig && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800 font-medium">
            Pricing Configuration Created Successfully!
          </p>
          <p className="text-xs text-green-700 mt-1">
            Config ID: {data.pricingConfig.id} | Priority: {data.pricingConfig.priority}
          </p>
        </div>
      )}
    </div>
  );
};

export default PricingConfigStep;
