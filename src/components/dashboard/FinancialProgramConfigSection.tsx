
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

interface FinancialProgramConfigSectionProps {
  title: string;
  showAddModal?: boolean;
  setShowAddModal?: (show: boolean) => void;
}

const FinancialProgramConfigSection = ({ 
  title, 
  showAddModal = false, 
  setShowAddModal = () => {} 
}: FinancialProgramConfigSectionProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [localShowAddModal, setLocalShowAddModal] = useState(false);
  const [newConfig, setNewConfig] = useState({
    name: "",
    programType: "",
    description: ""
  });
  
  // Use either the prop or local state
  const effectiveShowAddModal = showAddModal || localShowAddModal;
  const effectiveSetShowAddModal = (show: boolean) => {
    setShowAddModal(show);
    setLocalShowAddModal(show);
  };
  
  const handleAddClick = () => {
    effectiveSetShowAddModal(true);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`New financial program config added: ${newConfig.name}`);
    setNewConfig({ name: "", programType: "", description: "" });
    effectiveSetShowAddModal(false);
  };
  
  return (
    <div className="p-6">
      <SectionHeader 
        title={title.replace(" Rules", "")} 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed}
      >
        <Button onClick={handleAddClick}>Add New Record</Button>
      </SectionHeader>
      
      {!isCollapsed && <FinancialProgramConfigTable />}
      
      <Dialog open={effectiveShowAddModal} onOpenChange={effectiveSetShowAddModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Financial Program Config</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input
                  id="name"
                  value={newConfig.name}
                  onChange={(e) => setNewConfig({...newConfig, name: e.target.value})}
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
    </div>
  );
};

export default FinancialProgramConfigSection;
