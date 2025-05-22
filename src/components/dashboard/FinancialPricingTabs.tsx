import { useState } from "react";
import TabComponent, { TabItem } from "./TabComponent";
import BusinessRulesSection from "./BusinessRulesSection";
import { toast } from "sonner";

interface FinancialPricingTabsProps {
  showAddPricingModal: boolean;
  setShowAddPricingModal: (show: boolean) => void;
  showAddPricingTypeModal: boolean;
  setShowAddPricingTypeModal: (show: boolean) => void;
  onSelectionChange?: (items: string[]) => void;
  selectedItems?: string[];
}

const FinancialPricingTabs = ({
  showAddPricingModal,
  setShowAddPricingModal,
  showAddPricingTypeModal,
  setShowAddPricingTypeModal,
  onSelectionChange,
  selectedItems = []
}: FinancialPricingTabsProps) => {
  const [activeTab, setActiveTab] = useState("business-rules");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const tabItems: TabItem[] = [
    {
      value: "business-rules",
      label: "Business Rules",
      content: (
        <BusinessRulesSection 
          showAddPricingModal={showAddPricingModal}
          setShowAddPricingModal={setShowAddPricingModal}
          showAddPricingTypeModal={showAddPricingTypeModal}
          setShowAddPricingTypeModal={setShowAddPricingTypeModal}
          onSelectionChange={onSelectionChange}
          selectedItems={selectedItems}
        />
      )
    }
    // Additional top-level tabs can be added here in the future
  ];

  return (
    <TabComponent 
      defaultValue="business-rules" 
      items={tabItems} 
      onValueChange={handleTabChange}
    />
  );
};

export default FinancialPricingTabs;
