
import { useState } from "react";
import { Button } from "@/components/ui/button";
import PricingRulesTable from "../PricingRulesTable";
import SectionHeader from "./SectionHeader";
import AddPricingRuleModal from "../AddPricingRuleModal";
import { toast } from "sonner";

interface PricingRulesSectionProps {
  title: string;
  showAddModal: boolean;
  setShowAddModal: (open: boolean) => void;
  onSelectionChange?: (items: string[]) => void;
  selectedItems?: string[];
}

const PricingRulesSection = ({ 
  title, 
  showAddModal, 
  setShowAddModal,
  onSelectionChange,
  selectedItems = []
}: PricingRulesSectionProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const handleSavePricingRule = (data: any) => {
    console.log("New pricing rule:", data);
    // Here you would normally save the data to your state or backend
    toast.success(`New pricing rule "${data.programName}" created`);
  };
  
  return (
    <div className="p-6">
      <SectionHeader 
        title={title.replace(" Rules", "")} 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed}
      >
        <Button onClick={() => setShowAddModal(true)}>Add New Record</Button>
      </SectionHeader>
      
      {!isCollapsed && <PricingRulesTable />}
      
      {/* Modal for adding new pricing rules */}
      <AddPricingRuleModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleSavePricingRule}
      />
    </div>
  );
};

export default PricingRulesSection;
