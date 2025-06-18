
import { useState } from "react";
import TabComponent, { TabItem } from "./TabComponent";
import DynamicFinancialSection from "./DynamicFinancialSection";

interface FeeTaxTabsProps {
  onSelectionChange?: (items: string[]) => void;
  selectedItems?: string[];
  onSetBatchDeleteCallback?: (callback: () => void) => void;
}

const FeeTaxTabs = ({
  onSelectionChange,
  selectedItems = [],
  onSetBatchDeleteCallback
}: FeeTaxTabsProps) => {
  const [activeTab, setActiveTab] = useState("fee-rules");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Reset selections when changing tabs
    if (onSelectionChange) {
      onSelectionChange([]);
    }
  };

  const tabItems: TabItem[] = [
    {
      value: "fee-rules",
      label: "Fee Rules",
      content: (
        <DynamicFinancialSection 
          schemaId="fee-rules"
          title="Fee Rules"
          onSelectionChange={onSelectionChange}
          selectedItems={selectedItems}
          onSetBatchDeleteCallback={onSetBatchDeleteCallback}
        />
      )
    },
    {
      value: "tax-rules",
      label: "Tax Rules",
      content: (
        <DynamicFinancialSection 
          schemaId="tax-rules"
          title="Tax Rules"
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
        defaultValue="fee-rules" 
        items={tabItems} 
        onValueChange={handleTabChange}
      />
    </div>
  );
};

export default FeeTaxTabs;
