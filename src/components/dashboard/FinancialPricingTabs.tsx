
import { useState } from "react";
import TabComponent, { TabItem } from "./TabComponent";
import DynamicFinancialSection from "./DynamicFinancialSection";
import { toast } from "sonner";

interface FinancialPricingTabsProps {
  showAddPricingModal: boolean;
  setShowAddPricingModal: (show: boolean) => void;
  showAddPricingTypeModal: boolean;
  setShowAddPricingTypeModal: (show: boolean) => void;
  onSelectionChange?: (items: string[]) => void;
  selectedItems?: string[];
  onSetBatchDeleteCallback?: (callback: () => void) => void;
}

const FinancialPricingTabs = ({
  showAddPricingModal,
  setShowAddPricingModal,
  showAddPricingTypeModal,
  setShowAddPricingTypeModal,
  onSelectionChange,
  selectedItems = [],
  onSetBatchDeleteCallback
}: FinancialPricingTabsProps) => {
  const [activeTab, setActiveTab] = useState("bulletin-pricing");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const tabItems: TabItem[] = [
    {
      value: "bulletin-pricing",
      label: "Bulletin Pricing",
      content: (
        <DynamicFinancialSection 
          schemaId="bulletin-pricing"
          title="Bulletin Pricing"
          onSelectionChange={onSelectionChange}
          selectedItems={selectedItems}
          onSetBatchDeleteCallback={onSetBatchDeleteCallback}
        />
      )
    },
    {
      value: "rules",
      label: "Credit Profile",
      content: (
        <DynamicFinancialSection 
          schemaId="credit-profile"
          title="Credit Profile"
          onSelectionChange={onSelectionChange}
          selectedItems={selectedItems}
          onSetBatchDeleteCallback={onSetBatchDeleteCallback}
        />
      )
    },
    {
      value: "pricing-config-rules",
      label: "Pricing Config",
      content: (
        <DynamicFinancialSection 
          schemaId="pricing-config"
          title="Pricing Config"
          onSelectionChange={onSelectionChange}
          selectedItems={selectedItems}
          onSetBatchDeleteCallback={onSetBatchDeleteCallback}
        />
      )
    },
    {
      value: "financial-program-config",
      label: "Financial Program Config",
      content: (
        <DynamicFinancialSection 
          schemaId="financial-program-config"
          title="Financial Program Config"
          onSelectionChange={onSelectionChange}
          selectedItems={selectedItems}
          onSetBatchDeleteCallback={onSetBatchDeleteCallback}
        />
      )
    },
    {
      value: "advertised-offers",
      label: "Advertised Offers",
      content: (
        <DynamicFinancialSection 
          schemaId="advertised-offers"
          title="Advertised Offers"
          onSelectionChange={onSelectionChange}
          selectedItems={selectedItems}
          onSetBatchDeleteCallback={onSetBatchDeleteCallback}
        />
      )
    }
  ];

  return (
    <div className="bg-gray-50 p-4">
      <TabComponent 
        defaultValue="bulletin-pricing" 
        items={tabItems} 
        onValueChange={handleTabChange}
      />
    </div>
  );
};

export default FinancialPricingTabs;
