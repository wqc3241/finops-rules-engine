
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WizardData } from "../FinancialProgramWizard";
import { supabase } from "@/integrations/supabase/client";

interface PricingConfigStepProps {
  data: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
}

const PricingConfigStep = ({ data, onUpdate }: PricingConfigStepProps) => {
  const [selectionMode, setSelectionMode] = useState<"existing" | "new">("existing");
  const [selectedExistingId, setSelectedExistingId] = useState("");
  const [formData, setFormData] = useState({
    minLTV: "",
    maxLTV: "",
    minTerm: "",
    maxTerm: "",
    minLeaseMileage: "",
    maxLeaseMileage: "",
    priority: "1"
  });

  const [existingConfigs, setExistingConfigs] = useState<any[]>([]);

  // Load existing configs from Supabase
  useEffect(() => {
    const loadConfigs = async () => {
      const { data } = await supabase.from('pricing_configs').select('*');
      const mapped = (data || []).map((r: any) => ({
        id: r.pricing_rule_id,
        minLTV: r.min_ltv,
        maxLTV: r.max_ltv,
        minTerm: r.min_term,
        maxTerm: r.max_term,
        minLeaseMileage: r.min_lease_mileage,
        maxLeaseMileage: r.max_lease_mileage,
        priority: r.priority,
      }));
      setExistingConfigs(mapped);
    };
    loadConfigs();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleExistingSelection = (configId: string) => {
    setSelectedExistingId(configId);
    const selectedConfig = existingConfigs.find(c => c.id === configId);
    if (selectedConfig) {
      onUpdate({ pricingConfig: selectedConfig });
    }
  };

  const handleCreateConfig = () => {
    const configId = `PC${Date.now()}`;
    const config = {
      id: configId,
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

  const formatConfigLabel = (config: any) => {
    const ltvRange = config.minLTV && config.maxLTV 
      ? `${config.minLTV}%-${config.maxLTV}%` 
      : 'No LTV range';
    const termRange = config.minTerm && config.maxTerm 
      ? `${config.minTerm}-${config.maxTerm} months` 
      : 'No term range';
    return `${config.id} | LTV: ${ltvRange} | Term: ${termRange} | Priority: ${config.priority}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Pricing Configuration</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Select an existing pricing configuration or create a new one.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium">Pricing Configuration Option</Label>
          <RadioGroup
            value={selectionMode}
            onValueChange={(value) => setSelectionMode(value as "existing" | "new")}
            className="flex gap-6 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="existing" id="existing-config" />
              <Label htmlFor="existing-config">Select Existing Configuration</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="new" id="new-config" />
              <Label htmlFor="new-config">Create New Configuration</Label>
            </div>
          </RadioGroup>
        </div>

        {selectionMode === "existing" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="existingConfig">Select Pricing Configuration *</Label>
              <Select value={selectedExistingId} onValueChange={handleExistingSelection}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an existing pricing configuration" />
                </SelectTrigger>
                <SelectContent>
                  {existingConfigs.length > 0 ? (
                    existingConfigs.map((config) => (
                      <SelectItem key={config.id} value={config.id}>
                        {formatConfigLabel(config)}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-configs" disabled>
                      No configurations found
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            {selectedExistingId && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800 font-medium">Selected Configuration Details:</p>
                {(() => {
                  const selected = existingConfigs.find(c => c.id === selectedExistingId);
                  return selected ? (
                    <div className="text-xs text-blue-700 mt-2 space-y-1">
                      <p><strong>ID:</strong> {selected.id}</p>
                      <p><strong>Priority:</strong> {selected.priority}</p>
                      <p><strong>LTV Range:</strong> {selected.minLTV || 'N/A'}% - {selected.maxLTV || 'N/A'}%</p>
                      <p><strong>Term Range:</strong> {selected.minTerm || 'N/A'} - {selected.maxTerm || 'N/A'} months</p>
                      {selected.minLeaseMileage && (
                        <p><strong>Lease Mileage:</strong> {selected.minLeaseMileage} - {selected.maxLeaseMileage}</p>
                      )}
                    </div>
                  ) : null;
                })()}
              </div>
            )}
          </div>
        )}

        {selectionMode === "new" && (
          <div className="space-y-4">
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
              <Button onClick={handleCreateConfig}>
                Create Pricing Config
              </Button>
            </div>
          </div>
        )}
      </div>

      {data.pricingConfig && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800 font-medium">
            Pricing Configuration {selectionMode === "existing" ? "Selected" : "Created"} Successfully!
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
