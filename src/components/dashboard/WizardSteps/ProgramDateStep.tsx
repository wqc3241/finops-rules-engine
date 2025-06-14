
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { WizardData } from "../FinancialProgramWizard";

interface ProgramDateStepProps {
  data: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
}

const ProgramDateStep = ({ data, onUpdate }: ProgramDateStepProps) => {
  const handleDateChange = (field: 'programStartDate' | 'programEndDate', value: string) => {
    onUpdate({ [field]: value });
  };

  const isEndDateValid = () => {
    if (!data.programStartDate || !data.programEndDate) return true;
    return new Date(data.programEndDate) > new Date(data.programStartDate);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Program Date Range</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Define the active period for this financial program.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="startDate">Program Start Date *</Label>
          <Input
            id="startDate"
            type="date"
            value={data.programStartDate}
            onChange={(e) => handleDateChange('programStartDate', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">Program End Date *</Label>
          <Input
            id="endDate"
            type="date"
            value={data.programEndDate}
            onChange={(e) => handleDateChange('programEndDate', e.target.value)}
            min={data.programStartDate || new Date().toISOString().split('T')[0]}
          />
          {!isEndDateValid() && (
            <p className="text-sm text-red-600">End date must be after start date</p>
          )}
        </div>
      </div>

      {data.programStartDate && data.programEndDate && isEndDateValid() && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Program Duration:</strong> {new Date(data.programStartDate).toLocaleDateString()} to {new Date(data.programEndDate).toLocaleDateString()}
          </p>
          <p className="text-xs text-blue-700 mt-1">
            Duration: {Math.ceil((new Date(data.programEndDate).getTime() - new Date(data.programStartDate).getTime()) / (1000 * 60 * 60 * 24))} days
          </p>
        </div>
      )}
    </div>
  );
};

export default ProgramDateStep;
