
import { useState } from "react";
import TabComponent, { TabItem } from "./TabComponent";
import DynamicFinancialSection from "./DynamicFinancialSection";

interface FinancingDataTableTabsProps {
  onSelectionChange?: (items: string[]) => void;
  selectedItems?: string[];
  onSetBatchDeleteCallback?: (callback: () => void) => void;
}

const FinancingDataTableTabs = ({
  onSelectionChange,
  selectedItems = [],
  onSetBatchDeleteCallback
}: FinancingDataTableTabsProps) => {
  const [activeTab, setActiveTab] = useState("pricing-types");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Reset selections when changing tabs
    if (onSelectionChange) {
      onSelectionChange([]);
    }
  };

  const tabItems: TabItem[] = [
    {
      value: "pricing-types",
      label: "Pricing Types",
      content: (
        <DynamicFinancialSection 
          schemaId="pricing-types"
          title="Pricing Types"
          onSelectionChange={onSelectionChange}
          selectedItems={selectedItems}
          onSetBatchDeleteCallback={onSetBatchDeleteCallback}
        />
      )
    },
    {
      value: "financial-products",
      label: "Financial Products",
      content: (
        <DynamicFinancialSection 
          schemaId="financial-products"
          title="Financial Products"
          onSelectionChange={onSelectionChange}
          selectedItems={selectedItems}
          onSetBatchDeleteCallback={onSetBatchDeleteCallback}
        />
      )
    },
    {
      value: "gateway",
      label: "Gateway",
      content: (
        <DynamicFinancialSection 
          schemaId="gateway"
          title="Gateway Rules"
          onSelectionChange={onSelectionChange}
          selectedItems={selectedItems}
          onSetBatchDeleteCallback={onSetBatchDeleteCallback}
        />
      )
    },
    {
      value: "dealer",
      label: "Dealer",
      content: (
        <DynamicFinancialSection 
          schemaId="dealer"
          title="Dealer Rules"
          onSelectionChange={onSelectionChange}
          selectedItems={selectedItems}
          onSetBatchDeleteCallback={onSetBatchDeleteCallback}
        />
      )
    },
    {
      value: "lender",
      label: "Lender",
      content: (
        <DynamicFinancialSection 
          schemaId="lender"
          title="Lender Rules"
          onSelectionChange={onSelectionChange}
          selectedItems={selectedItems}
          onSetBatchDeleteCallback={onSetBatchDeleteCallback}
        />
      )
    },
    {
      value: "country",
      label: "Country",
      content: (
        <DynamicFinancialSection 
          schemaId="country"
          title="Country Data"
          onSelectionChange={onSelectionChange}
          selectedItems={selectedItems}
          onSetBatchDeleteCallback={onSetBatchDeleteCallback}
        />
      )
    },
    {
      value: "state",
      label: "State",
      content: (
        <DynamicFinancialSection 
          schemaId="state"
          title="State Data"
          onSelectionChange={onSelectionChange}
          selectedItems={selectedItems}
          onSetBatchDeleteCallback={onSetBatchDeleteCallback}
        />
      )
    },
    {
      value: "location",
      label: "Location",
      content: (
        <DynamicFinancialSection 
          schemaId="geo-location"
          title="Location Data"
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
        defaultValue="pricing-types" 
        items={tabItems} 
        onValueChange={handleTabChange}
      />
    </div>
  );
};

export default FinancingDataTableTabs;
