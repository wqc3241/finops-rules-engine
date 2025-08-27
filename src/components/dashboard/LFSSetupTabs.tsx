import { useState } from "react";
import TabComponent, { TabItem } from "./TabComponent";
import DynamicFinancialSection from "./DynamicFinancialSection";

interface LFSSetupTabsProps {
  onSelectionChange?: (items: string[], schemaId?: string) => void;
  selectedItems?: string[];
  onSetBatchDeleteCallback?: (callback: () => void) => void;
  onSetBatchDownloadBulletinPricingCallback?: (callback: () => void) => void;
}

const LFSSetupTabs = ({ onSelectionChange, selectedItems = [], onSetBatchDeleteCallback, onSetBatchDownloadBulletinPricingCallback }: LFSSetupTabsProps) => {
  const [activeTab, setActiveTab] = useState("financial-program-config");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Reset selections when changing tabs and notify parent with schemaId
    if (onSelectionChange) {
      onSelectionChange([], value);
    }
  };

  const tabItems: TabItem[] = [
    {
      value: "financial-program-config",
      label: "Financial Program Config",
      content: (
        <DynamicFinancialSection 
          schemaId="financial-program-config"
          title="Financial Program Config Rules"
          onSelectionChange={(items) => onSelectionChange?.(items, "financial-program-config")}
          selectedItems={selectedItems}
          onSetBatchDeleteCallback={onSetBatchDeleteCallback}
          onSetBatchDownloadBulletinPricingCallback={onSetBatchDownloadBulletinPricingCallback}
        />
      )
    },
    {
      value: "geo-location",
      label: "Geo",
      content: (
        <DynamicFinancialSection 
          schemaId="geo-location"
          title="Geo Rules"
          onSelectionChange={(items) => onSelectionChange?.(items, "geo-location")}
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
          onSelectionChange={(items) => onSelectionChange?.(items, "lease-config")}
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
          onSelectionChange={(items) => onSelectionChange?.(items, "vehicle-condition")}
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
          onSelectionChange={(items) => onSelectionChange?.(items, "order-type")}
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
          onSelectionChange={(items) => onSelectionChange?.(items, "vehicle-options")}
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
          onSelectionChange={(items) => onSelectionChange?.(items, "routing-rule")}
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
          onSelectionChange={(items) => onSelectionChange?.(items, "stipulation")}
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
          onSelectionChange={(items) => onSelectionChange?.(items, "vehicle-style-coding")}
          selectedItems={selectedItems}
        />
      )
    }
  ];

  return <TabComponent defaultValue="financial-program-config" items={tabItems} onValueChange={handleTabChange} />;
};

export default LFSSetupTabs;