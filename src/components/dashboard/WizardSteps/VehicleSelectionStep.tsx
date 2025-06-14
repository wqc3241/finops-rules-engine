import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WizardData } from "../FinancialProgramWizard";

// Mock data from VehicleStyleDecodingTable and VehicleConditionTable
const vehicleStyles = [{
  id: "L25A1",
  label: "L25A1 - 2025 Lucid Air Grand Touring"
}, {
  id: "L25A2",
  label: "L25A2 - 2025 Lucid Air Pure"
}, {
  id: "L25A3",
  label: "L25A3 - 2025 Lucid Air Pure"
}, {
  id: "KSA25A1",
  label: "KSA25A1 - 2025 Lucid Air Pure (KSA)"
}];
const vehicleConditions = [{
  id: "New",
  label: "New"
}, {
  id: "Used",
  label: "Used"
}, {
  id: "Demo",
  label: "Demo"
}, {
  id: "CPO",
  label: "Certified Pre-Owned"
}];
interface VehicleSelectionStepProps {
  data: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
}
const VehicleSelectionStep = ({
  data,
  onUpdate
}: VehicleSelectionStepProps) => {
  return <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Vehicle Selection</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Select the vehicle style and condition for this financial program.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="vehicleStyle">Vehicle Style *</Label>
          <Select value={data.vehicleStyleId} onValueChange={value => onUpdate({
          vehicleStyleId: value
        })}>
            <SelectTrigger>
              <SelectValue placeholder="Select vehicle style" />
            </SelectTrigger>
            <SelectContent>
              {vehicleStyles.map(style => <SelectItem key={style.id} value={style.id}>
                  {style.label}
                </SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="vehicleCondition">Financing Vehicle Condition *</Label>
          <Select value={data.vehicleCondition} onValueChange={value => onUpdate({
          vehicleCondition: value
        })}>
            <SelectTrigger>
              <SelectValue placeholder="Select vehicle condition" />
            </SelectTrigger>
            <SelectContent>
              {vehicleConditions.map(condition => <SelectItem key={condition.id} value={condition.id}>
                  {condition.label}
                </SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {data.vehicleStyleId && data.vehicleCondition && <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            <strong>Selected:</strong> {vehicleStyles.find(s => s.id === data.vehicleStyleId)?.label} - {data.vehicleCondition}
          </p>
        </div>}
    </div>;
};
export default VehicleSelectionStep;