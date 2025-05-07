
import { useState } from "react";
import { Button } from "@/components/ui/button";
import PricingConfigRulesTable from "../PricingConfigRulesTable";
import SectionHeader from "./SectionHeader";
import { toast } from "sonner";

interface PricingConfigRulesSectionProps {
  title: string;
  showAddModal?: boolean;
  setShowAddModal?: (show: boolean) => void;
  onSelectionChange?: (items: string[]) => void;
  selectedItems?: string[];
}

const PricingConfigRulesSection = ({ 
  title,
  showAddModal: externalShowAddModal,
  setShowAddModal: externalSetShowAddModal,
  onSelectionChange,
  selectedItems = []
}: PricingConfigRulesSectionProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [internalShowAddModal, setInternalShowAddModal] = useState(false);
  
  // Use either external state (if provided) or internal state
  const showAddModal = externalShowAddModal !== undefined ? externalShowAddModal : internalShowAddModal;
  const setShowAddModal = externalSetShowAddModal || setInternalShowAddModal;
  
  const handleAddClick = () => {
    setShowAddModal(true);
    // Here you would typically open a modal for adding a new record
    console.log("Add new config rule clicked");
    toast.info("Add new config rule functionality to be implemented");
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
      
      {!isCollapsed && <PricingConfigRulesTable />}
    </div>
  );
};

export default PricingConfigRulesSection;
