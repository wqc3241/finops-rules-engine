
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { WizardData } from "../FinancialProgramWizard";
import { getInitialData } from "@/utils/mockDataUtils";

interface CreditProfileStepProps {
  data: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
}

const CreditProfileStep = ({ data, onUpdate }: CreditProfileStepProps) => {
  const [selectionMode, setSelectionMode] = useState<"existing" | "new">("existing");
  const [selectedExistingId, setSelectedExistingId] = useState("");
  const [formData, setFormData] = useState({
    priority: 1,
    minCreditScore: "",
    maxCreditScore: "",
    minIncome: "",
    maxIncome: "",
    minAge: "",
    maxAge: "",
    minPTI: "",
    maxPTI: "",
    minDTI: "",
    maxDTI: "",
    employmentType: ""
  });

  const existingProfiles = getInitialData('credit-profile');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleExistingSelection = (profileId: string) => {
    setSelectedExistingId(profileId);
    const selectedProfile = existingProfiles.find(p => p.id === profileId);
    if (selectedProfile) {
      onUpdate({ creditProfile: selectedProfile });
    }
  };

  const handleCreateProfile = () => {
    const profileId = `CP${Date.now()}`;
    const profile = {
      id: profileId,
      uuid: crypto.randomUUID(),
      ...formData,
      minCreditScore: formData.minCreditScore ? parseInt(formData.minCreditScore) : null,
      maxCreditScore: formData.maxCreditScore ? parseInt(formData.maxCreditScore) : null,
      minIncome: formData.minIncome ? parseInt(formData.minIncome) : null,
      maxIncome: formData.maxIncome ? parseInt(formData.maxIncome) : null,
      minAge: formData.minAge ? parseInt(formData.minAge) : null,
      maxAge: formData.maxAge ? parseInt(formData.maxAge) : null,
      minPTI: formData.minPTI ? parseFloat(formData.minPTI) : null,
      maxPTI: formData.maxPTI ? parseFloat(formData.maxPTI) : null,
      minDTI: formData.minDTI ? parseFloat(formData.minDTI) : null,
      maxDTI: formData.maxDTI ? parseFloat(formData.maxDTI) : null
    };
    
    onUpdate({ creditProfile: profile });
  };

  const formatProfileLabel = (profile: any) => {
    const creditRange = profile.minCreditScore && profile.maxCreditScore 
      ? `${profile.minCreditScore}-${profile.maxCreditScore}` 
      : 'No range';
    const incomeRange = profile.minIncome && profile.maxIncome 
      ? `$${profile.minIncome}-$${profile.maxIncome}` 
      : 'No range';
    return `${profile.id} | Credit: ${creditRange} | Income: ${incomeRange} | Priority: ${profile.priority}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Credit Profile Configuration</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Select an existing credit profile or create a new one for this financial program.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium">Credit Profile Option</Label>
          <RadioGroup
            value={selectionMode}
            onValueChange={(value) => setSelectionMode(value as "existing" | "new")}
            className="flex gap-6 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="existing" id="existing" />
              <Label htmlFor="existing">Select Existing Profile</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="new" id="new" />
              <Label htmlFor="new">Create New Profile</Label>
            </div>
          </RadioGroup>
        </div>

        {selectionMode === "existing" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="existingProfile">Select Credit Profile *</Label>
              <Select value={selectedExistingId} onValueChange={handleExistingSelection}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an existing credit profile" />
                </SelectTrigger>
                <SelectContent>
                  {existingProfiles.map((profile) => (
                    <SelectItem key={profile.id} value={profile.id}>
                      {formatProfileLabel(profile)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedExistingId && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800 font-medium">Selected Profile Details:</p>
                {(() => {
                  const selected = existingProfiles.find(p => p.id === selectedExistingId);
                  return selected ? (
                    <div className="text-xs text-blue-700 mt-2 space-y-1">
                      <p><strong>ID:</strong> {selected.id}</p>
                      <p><strong>Priority:</strong> {selected.priority}</p>
                      <p><strong>Credit Score:</strong> {selected.minCreditScore || 'N/A'} - {selected.maxCreditScore || 'N/A'}</p>
                      <p><strong>Income:</strong> ${selected.minIncome || 'N/A'} - ${selected.maxIncome || 'N/A'}</p>
                      <p><strong>Employment:</strong> {selected.employmentType || 'N/A'}</p>
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
                <Label htmlFor="minCreditScore">Min Credit Score</Label>
                <Input
                  id="minCreditScore"
                  type="number"
                  value={formData.minCreditScore}
                  onChange={(e) => handleInputChange("minCreditScore", e.target.value)}
                  placeholder="e.g., 650"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxCreditScore">Max Credit Score</Label>
                <Input
                  id="maxCreditScore"
                  type="number"
                  value={formData.maxCreditScore}
                  onChange={(e) => handleInputChange("maxCreditScore", e.target.value)}
                  placeholder="e.g., 850"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="minIncome">Min Income</Label>
                <Input
                  id="minIncome"
                  type="number"
                  value={formData.minIncome}
                  onChange={(e) => handleInputChange("minIncome", e.target.value)}
                  placeholder="e.g., 50000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxIncome">Max Income</Label>
                <Input
                  id="maxIncome"
                  type="number"
                  value={formData.maxIncome}
                  onChange={(e) => handleInputChange("maxIncome", e.target.value)}
                  placeholder="e.g., 200000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="employmentType">Employment Type</Label>
                <Select
                  value={formData.employmentType}
                  onValueChange={(value) => handleInputChange("employmentType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select employment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Payroll">Payroll</SelectItem>
                    <SelectItem value="Self-Employed">Self-Employed</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Retired">Retired</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="minAge">Min Age</Label>
                <Input
                  id="minAge"
                  type="number"
                  value={formData.minAge}
                  onChange={(e) => handleInputChange("minAge", e.target.value)}
                  placeholder="e.g., 18"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxAge">Max Age</Label>
                <Input
                  id="maxAge"
                  type="number"
                  value={formData.maxAge}
                  onChange={(e) => handleInputChange("maxAge", e.target.value)}
                  placeholder="e.g., 75"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="minDTI">Min DTI</Label>
                <Input
                  id="minDTI"
                  type="number"
                  step="0.01"
                  value={formData.minDTI}
                  onChange={(e) => handleInputChange("minDTI", e.target.value)}
                  placeholder="e.g., 20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxDTI">Max DTI</Label>
                <Input
                  id="maxDTI"
                  type="number"
                  step="0.01"
                  value={formData.maxDTI}
                  onChange={(e) => handleInputChange("maxDTI", e.target.value)}
                  placeholder="e.g., 60"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleCreateProfile} disabled={!formData.priority}>
                Create Credit Profile
              </Button>
            </div>
          </div>
        )}
      </div>

      {data.creditProfile && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800 font-medium">
            Credit Profile {selectionMode === "existing" ? "Selected" : "Created"} Successfully!
          </p>
          <p className="text-xs text-green-700 mt-1">
            Profile ID: {data.creditProfile.id} | Priority: {data.creditProfile.priority}
          </p>
        </div>
      )}
    </div>
  );
};

export default CreditProfileStep;
