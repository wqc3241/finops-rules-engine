import { useEffect, useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WizardData } from "../FinancialProgramWizard";
import { supabase } from "@/integrations/supabase/client";

interface VehicleSelectionStepProps {
  data: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
}

const VehicleSelectionStep = ({ data, onUpdate }: VehicleSelectionStepProps) => {
  const [styles, setStyles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("vehicle_style_coding")
        .select("*");
      setStyles(data || []);
      setLoading(false);
    };
    load();
  }, []);

  const styleOptions = useMemo(() => {
    return styles.map((row: any) => {
      const id = row.style_code ?? row.vehicle_style_id ?? row.id;
      const parts = [row.model_year, row.make, row.model, row.trim, row.style_name, row.variant]
        .filter(Boolean)
        .join(" ");
      const label = id ? (parts ? `${id} - ${parts}` : `${id}`) : parts || "Unknown Style";
      return { id: String(id), label };
    });
  }, [styles]);

  const vehicleConditions = [
    { id: "New", label: "New" },
    { id: "Used", label: "Used" },
    { id: "Demo", label: "Demo" },
    { id: "CPO", label: "Certified Pre-Owned" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Vehicle Selection</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Select the vehicle style and condition for this financial program.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="vehicleStyle">Vehicle Style *</Label>
          <Select value={data.vehicleStyleId} onValueChange={(value) => onUpdate({ vehicleStyleId: value })}>
            <SelectTrigger>
              <SelectValue placeholder={loading ? "Loading vehicle styles..." : "Select vehicle style"} />
            </SelectTrigger>
            <SelectContent>
              {styleOptions.map((style) => (
                <SelectItem key={style.id} value={style.id}>
                  {style.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="vehicleCondition">Financing Vehicle Condition *</Label>
          <Select value={data.vehicleCondition} onValueChange={(value) => onUpdate({ vehicleCondition: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select vehicle condition" />
            </SelectTrigger>
            <SelectContent>
              {vehicleConditions.map((condition) => (
                <SelectItem key={condition.id} value={condition.id}>
                  {condition.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {data.vehicleStyleId && data.vehicleCondition && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            <strong>Selected:</strong> {styleOptions.find((s) => s.id === data.vehicleStyleId)?.label || data.vehicleStyleId} - {data.vehicleCondition}
          </p>
        </div>
      )}
    </div>
  );
};
export default VehicleSelectionStep;
