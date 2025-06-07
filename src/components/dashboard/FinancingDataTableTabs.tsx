
import { useState } from "react";
import TabComponent, { TabItem } from "./TabComponent";
import { toast } from "sonner";
import DealerTable from "./DealerTable";
import LenderTable from "./LenderTable";
import VehicleOptionsTable from "./VehicleOptionsTable";
import CountryTable from "./CountryTable";
import StateTable from "./StateTable";
import LocationTable from "./LocationTable";
import LFSSetupTabContent from "./LFSSetupTabContent";
import PricingTypeSection from "./PricingTypeSection";

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

  const handleEditClick = (id: string) => {
    console.log(`Edit item ${id} clicked`);
    toast.info(`Edit item ${id} functionality to be implemented`);
  };
  
  const handleCopyClick = (id: string) => {
    console.log(`Copy item ${id} clicked`);
    toast.success(`Item ${id} has been copied`);
  };
  
  const handleRemoveClick = (id: string) => {
    console.log(`Remove item ${id} clicked`);
    toast.success(`Item ${id} has been removed`);
  };

  const handleAddRecord = (tabName: string) => {
    console.log(`Add new record in ${tabName} tab`);
    toast.info(`Add new ${tabName} record functionality activated`);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Reset selections when changing tabs
    if (onSelectionChange) {
      onSelectionChange([]);
    }
  };

  const handleSelectionChange = (items: string[]) => {
    if (onSelectionChange) {
      onSelectionChange(items);
    }
  };

  const tabItems: TabItem[] = [
    {
      value: "pricing-types",
      label: "Pricing Types",
      content: (
        <PricingTypeSection 
          title="Pricing Types"
          onSelectionChange={handleSelectionChange}
          selectedItems={selectedItems}
        />
      )
    },
    {
      value: "dealer",
      label: "Dealer",
      content: (
        <LFSSetupTabContent 
          title="Dealer Rules"
          onAddRecord={() => handleAddRecord("Dealer")}
        >
          <DealerTable 
            onEdit={handleEditClick}
            onCopy={handleCopyClick}
            onRemove={handleRemoveClick}
            onSelectionChange={handleSelectionChange}
            selectedItems={selectedItems}
          />
        </LFSSetupTabContent>
      )
    },
    {
      value: "lender",
      label: "Lender",
      content: (
        <LFSSetupTabContent 
          title="Lender Rules"
          onAddRecord={() => handleAddRecord("Lender")}
        >
          <LenderTable 
            onEdit={handleEditClick}
            onCopy={handleCopyClick}
            onRemove={handleRemoveClick}
            onSelectionChange={handleSelectionChange}
            selectedItems={selectedItems}
          />
        </LFSSetupTabContent>
      )
    },
    {
      value: "vehicle-options",
      label: "Vehicle Options",
      content: (
        <LFSSetupTabContent 
          title="Vehicle Options Rules"
          onAddRecord={() => handleAddRecord("Vehicle Options")}
        >
          <VehicleOptionsTable 
            onEdit={handleEditClick}
            onCopy={handleCopyClick}
            onRemove={handleRemoveClick}
            onSelectionChange={handleSelectionChange}
            selectedItems={selectedItems}
          />
        </LFSSetupTabContent>
      )
    },
    {
      value: "country",
      label: "Country",
      content: (
        <LFSSetupTabContent 
          title="Country Data"
          onAddRecord={() => handleAddRecord("Country")}
        >
          <CountryTable 
            onEdit={handleEditClick}
            onCopy={handleCopyClick}
            onRemove={handleRemoveClick}
            onSelectionChange={handleSelectionChange}
            selectedItems={selectedItems}
          />
        </LFSSetupTabContent>
      )
    },
    {
      value: "state",
      label: "State",
      content: (
        <LFSSetupTabContent 
          title="State Data"
          onAddRecord={() => handleAddRecord("State")}
        >
          <StateTable 
            onEdit={handleEditClick}
            onCopy={handleCopyClick}
            onRemove={handleRemoveClick}
            onSelectionChange={handleSelectionChange}
            selectedItems={selectedItems}
          />
        </LFSSetupTabContent>
      )
    },
    {
      value: "location",
      label: "Location",
      content: (
        <LFSSetupTabContent 
          title="Location Data"
          onAddRecord={() => handleAddRecord("Location")}
        >
          <LocationTable 
            onEdit={handleEditClick}
            onCopy={handleCopyClick}
            onRemove={handleRemoveClick}
            onSelectionChange={handleSelectionChange}
            selectedItems={selectedItems}
          />
        </LFSSetupTabContent>
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
