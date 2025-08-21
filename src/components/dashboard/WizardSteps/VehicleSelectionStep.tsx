import { useEffect, useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
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
          <Label>Vehicle Styles * ({data.vehicleStyleIds.length} selected)</Label>
          <div className="space-y-1 max-h-48 overflow-y-auto border rounded-lg p-2">
            {loading ? (
              <div className="text-center text-sm text-muted-foreground p-4">Loading vehicle styles...</div>
            ) : (
              styleOptions.map((style) => (
                <div key={style.id} className="flex items-start space-x-2">
                  <Checkbox
                    id={`vehicle-${style.id}`}
                    checked={data.vehicleStyleIds.includes(style.id)}
                    onCheckedChange={(checked) => {
                      const updated = checked
                        ? [...data.vehicleStyleIds, style.id]
                        : data.vehicleStyleIds.filter(id => id !== style.id);
                      onUpdate({ vehicleStyleIds: updated });
                    }}
                    className="mt-0.5 scale-75"
                  />
                  <Label htmlFor={`vehicle-${style.id}`} className="text-xs cursor-pointer flex-1 min-w-0">
                    {style.label}
                  </Label>
                </div>
              ))
            )}
          </div>
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

      {data.vehicleStyleIds.length > 0 && data.vehicleCondition && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            <strong>Selected:</strong> {data.vehicleStyleIds.length} vehicle style{data.vehicleStyleIds.length > 1 ? 's' : ''} - {data.vehicleCondition}
          </p>
          <div className="mt-2 text-xs text-green-700">
            {data.vehicleStyleIds.slice(0, 3).map(id => 
              styleOptions.find(s => s.id === id)?.label || id
            ).join(', ')}
            {data.vehicleStyleIds.length > 3 && ` and ${data.vehicleStyleIds.length - 3} more`}
          </div>
        </div>
      )}
    </div>
  );
};
export default VehicleSelectionStep;
