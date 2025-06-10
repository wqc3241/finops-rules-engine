
import { useState } from "react";
import TabComponent, { TabItem } from "./TabComponent";
import { toast } from "sonner";
import GeoTable from "./GeoTable";
import LeaseConfigTable from "./LeaseConfigTable";
import VehicleConditionTable from "./VehicleConditionTable";
import RoutingRuleTable from "./RoutingRuleTable";
import StipulationTable from "./StipulationTable";
import VehicleStyleDecodingTable from "./VehicleStyleDecodingTable";
import VehicleOptionsTable from "./VehicleOptionsTable";
import LFSSetupTabContent from "./LFSSetupTabContent";

interface LFSSetupTabsProps {
  onSelectionChange?: (items: string[]) => void;
  selectedItems?: string[];
}

const LFSSetupTabs = ({ onSelectionChange, selectedItems = [] }: LFSSetupTabsProps) => {
  const [activeTab, setActiveTab] = useState("geo");

  const handleEditClick = (id: string) => {
    console.log(`Edit rule ${id} clicked`);
    toast.info(`Edit rule ${id} functionality to be implemented`);
  };
  
  const handleCopyClick = (id: string) => {
    console.log(`Copy rule ${id} clicked`);
    toast.success(`Rule ${id} has been copied`);
  };
  
  const handleRemoveClick = (id: string) => {
    console.log(`Remove rule ${id} clicked`);
    toast.success(`Rule ${id} has been removed`);
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
      value: "geo",
      label: "Geo",
      content: (
        <LFSSetupTabContent 
          title="Geo Rules"
          onAddRecord={() => handleAddRecord("Geo")}
        >
          <GeoTable 
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
      value: "lease-config",
      label: "Lease Config",
      content: (
        <LFSSetupTabContent 
          title="Lease Config Rules"
          onAddRecord={() => handleAddRecord("Lease Config")}
        >
          <LeaseConfigTable 
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
      value: "vehicle-condition",
      label: "Vehicle Condition",
      content: (
        <LFSSetupTabContent 
          title="Vehicle Condition Rules"
          onAddRecord={() => handleAddRecord("Vehicle Condition")}
        >
          <VehicleConditionTable 
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
      value: "routing-rule",
      label: "Routing Rule",
      content: (
        <LFSSetupTabContent 
          title="Routing Rules"
          onAddRecord={() => handleAddRecord("Routing Rules")}
        >
          <RoutingRuleTable 
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
      value: "stipulation",
      label: "Stipulation",
      content: (
        <LFSSetupTabContent 
          title="Stipulation Rules"
          onAddRecord={() => handleAddRecord("Stipulation")}
        >
          <StipulationTable 
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
      value: "vehicle-style-coding",
      label: "Vehicle Style Coding",
      content: (
        <LFSSetupTabContent 
          title="Vehicle Style Coding Rules"
          onAddRecord={() => handleAddRecord("Vehicle Style Coding")}
        >
          <VehicleStyleDecodingTable 
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

  return <TabComponent defaultValue="geo" items={tabItems} onValueChange={handleTabChange} />;
};

export default LFSSetupTabs;
