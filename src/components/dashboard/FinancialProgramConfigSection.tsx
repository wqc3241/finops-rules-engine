import { useState } from "react";
import { Button } from "@/components/ui/button";
import FinancialProgramConfigTable from "../FinancialProgramConfigTable";
import SectionHeader from "./SectionHeader";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FinancialProgramWizard, { WizardData } from "./FinancialProgramWizard";
import { FinancialProgramRecord } from "@/types/financialProgram";

interface FinancialProgramConfigSectionProps {
  title: string;
  showAddModal?: boolean;
  setShowAddModal?: (show: boolean) => void;
  onSelectionChange?: (items: string[]) => void;
  selectedItems?: string[];
}

const FinancialProgramConfigSection = ({
  title,
  showAddModal: externalShowAddModal,
  setShowAddModal: externalSetShowAddModal,
  onSelectionChange,
  selectedItems = []
}: FinancialProgramConfigSectionProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [internalShowAddModal, setInternalShowAddModal] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [editingProgram, setEditingProgram] = useState<string | null>(null);
  const [newConfig, setNewConfig] = useState({
    programName: "",
    programType: "",
    description: ""
  });

  // Use either external state (if provided) or internal state
  const showAddModal = externalShowAddModal !== undefined ? externalShowAddModal : internalShowAddModal;
  const setShowAddModal = externalSetShowAddModal || setInternalShowAddModal;

  const handleAddClick = () => {
    setShowAddModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`New financial program config added: ${newConfig.programName}`);
    setNewConfig({ programName: "", programType: "", description: "" });
    setShowAddModal(false);
  };

  const handleEditProgram = (programId: string) => {
    setEditingProgram(programId);
    setShowWizard(true);
  };

  const handleWizardComplete = (programData: FinancialProgramRecord[]) => {
    toast.success(`${programData.length} financial program${programData.length > 1 ? 's' : ''} created successfully!`);
    setShowWizard(false);
  };

  // Mock function to get program data for editing
  const getEditData = (programId: string): WizardData => {
    // In a real app, this would fetch the actual program data
    return {
      vehicleStyleIds: ["L25A1"],
      vehicleCondition: "New",
      financialProduct: "USLN",
      pricingTypes: ["RATE", "MARKUP"],
      creditProfiles: ["PROFILE1"],
      pricingConfigs: ["CONFIG1"],
      programStartDate: "2025-02-01",
      programEndDate: "2025-02-28",
      lenders: ["LENDER1"],
      geoCodes: ["US"]
    };
  };

  return (
    <div className="p-6">
      <SectionHeader
        title={title}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      >
        <Button onClick={handleAddClick}>Add New Record</Button>
      </SectionHeader>

      {!isCollapsed && <FinancialProgramConfigTable onEditProgram={handleEditProgram} />}

      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Financial Program Config</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="programName" className="text-right">Program Name</Label>
                <Input
                  id="programName"
                  value={newConfig.programName}
                  onChange={(e) => setNewConfig({...newConfig, programName: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="programType" className="text-right">Program Type</Label>
                <Input
                  id="programType"
                  value={newConfig.programType}
                  onChange={(e) => setNewConfig({...newConfig, programType: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Input
                  id="description"
                  value={newConfig.description}
                  onChange={(e) => setNewConfig({...newConfig, description: e.target.value})}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Add Config</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <FinancialProgramWizard
        open={showWizard}
        onOpenChange={setShowWizard}
        onComplete={handleWizardComplete}
        editData={editingProgram ? getEditData(editingProgram) : undefined}
        isEditMode={!!editingProgram}
      />
    </div>
  );
};

export default FinancialProgramConfigSection;