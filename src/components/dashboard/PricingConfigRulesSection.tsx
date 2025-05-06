
import { useState } from "react";
import { Button } from "@/components/ui/button";
import PricingConfigRulesTable from "../PricingConfigRulesTable";
import SectionHeader from "./SectionHeader";

interface PricingConfigRulesSectionProps {
  title: string;
}

const PricingConfigRulesSection = ({ title }: PricingConfigRulesSectionProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  
  return (
    <div className="p-6">
      <SectionHeader 
        title={title.replace(" Rules", "")} 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed}
      >
        <Button onClick={() => setShowAddModal(true)}>Add New Config Rule</Button>
      </SectionHeader>
      
      {!isCollapsed && <PricingConfigRulesTable />}
    </div>
  );
};

export default PricingConfigRulesSection;
