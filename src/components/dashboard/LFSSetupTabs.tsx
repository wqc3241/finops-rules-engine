
import { useState } from "react";
import TabComponent, { TabItem } from "./TabComponent";
import DynamicFinancialSection from "./DynamicFinancialSection";

interface LFSSetupTabsProps {
  onSelectionChange?: (items: string[]) => void;
  selectedItems?: string[];
}

const LFSSetupTabs = ({ onSelectionChange, selectedItems = [] }: LFSSetupTabsProps) => {
  const [activeTab, setActiveTab] = useState("location-geo");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Reset selections when changing tabs
    if (onSelectionChange) {
      onSelectionChange([]);
    }
  };

  const tabItems: TabItem[] = [
    {
      value: "location-geo",
      label: "Geo",
      content: (
        <DynamicFinancialSection 
          schemaId="location-geo"
          title="Geo Rules"
          onSelectionChange={onSelectionChange}
          selectedItems={selectedItems}
        />
      )
    },
    {
      value: "lease-config",
      label: "Lease Config",
      content: (
        <DynamicFinancialSection 
          schemaId="lease-config"
          title="Lease Config Rules"
          onSelectionChange={onSelectionChange}
          selectedItems={selectedItems}
        />
      )
    },
    {
      value: "vehicle-condition",
      label: "Vehicle Condition",
      content: (
        <DynamicFinancialSection 
          schemaId="vehicle-condition"
          title="Vehicle Condition Rules"
          onSelectionChange={onSelectionChange}
          selectedItems={selectedItems}
        />
      )
    },
    {
      value: "order-type",
      label: "Order Type",
      content: (
        <DynamicFinancialSection 
          schemaId="order-type"
          title="Order Type Rules"
          onSelectionChange={onSelectionChange}
          selectedItems={selectedItems}
        />
      )
    },
    {
      value: "vehicle-options",
      label: "Vehicle Options",
      content: (
        <DynamicFinancialSection 
          schemaId="vehicle-options"
          title="Vehicle Options Rules"
          onSelectionChange={onSelectionChange}
          selectedItems={selectedItems}
        />
      )
    },
    {
      value: "routing-rule",
      label: "Routing Rule",
      content: (
        <DynamicFinancialSection 
          schemaId="routing-rule"
          title="Routing Rules"
          onSelectionChange={onSelectionChange}
          selectedItems={selectedItems}
        />
      )
    },
    {
      value: "stipulation",
      label: "Stipulation",
      content: (
        <DynamicFinancialSection 
          schemaId="stipulation"
          title="Stipulation Rules"
          onSelectionChange={onSelectionChange}
          selectedItems={selectedItems}
        />
      )
    },
    {
      value: "vehicle-style-coding",
      label: "Vehicle Style Coding",
      content: (
        <DynamicFinancialSection 
          schemaId="vehicle-style-coding"
          title="Vehicle Style Coding Rules"
          onSelectionChange={onSelectionChange}
          selectedItems={selectedItems}
        />
      )
    }
  ];

  return <TabComponent defaultValue="location-geo" items={tabItems} onValueChange={handleTabChange} />;
};

export default LFSSetupTabs;
