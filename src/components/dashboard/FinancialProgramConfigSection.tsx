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
  const [editingProgramData, setEditingProgramData] = useState<any>(null);
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

  const handleEditProgram = (program: any) => {
    setEditingProgramData(program);
    setShowWizard(true);
  };

  const handleWizardComplete = (programData: FinancialProgramRecord[]) => {
    toast.success(`${programData.length} financial program${programData.length > 1 ? 's' : ''} created successfully!`);
    setShowWizard(false);
  };

  // Transform program data to wizard format
  const getEditData = (program: any): WizardData => {
    const templateMetadata = program.templateMetadata || {};
    
    // Convert date format from "2/1/2025" to "2025-02-01"
    const formatDateForInput = (dateStr: string) => {
      if (!dateStr) return "";
      try {
        const date = new Date(dateStr);
        return date.toISOString().split('T')[0];
      } catch {
        return dateStr;
      }
    };

    return {
      vehicleStyleIds: [program.vehicleStyleId].filter(Boolean),
      vehicleCondition: program.financingVehicleCondition || "New",
      orderTypes: program.orderTypes ? program.orderTypes.split(', ').filter(Boolean) : ["INV"],
      financialProduct: program.financialProductId || "",
      pricingTypes: templateMetadata.pricingTypes || [],
      pricingTypeConfigs: templateMetadata.pricingTypeConfigs || {},
      programStartDate: formatDateForInput(program.programStartDate),
      programEndDate: formatDateForInput(program.programEndDate),
      lenders: templateMetadata.lenders || [],
      geoCodes: templateMetadata.geoCodes || []
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
        editData={editingProgramData ? getEditData(editingProgramData) : undefined}
        isEditMode={!!editingProgramData}
      />
    </div>
  );
};

export default FinancialProgramConfigSection;