
import TabComponent, { TabItem } from "./TabComponent";
import { toast } from "sonner";
import GeoTable from "./GeoTable";
import LeaseConfigTable from "./LeaseConfigTable";
import GatewayTable from "./GatewayTable";
import FinancialProductsTable from "./FinancialProductsTable";
import DealerTable from "./DealerTable";
import LenderTable from "./LenderTable";
import VehicleConditionTable from "./VehicleConditionTable";
import RoutingRuleTable from "./RoutingRuleTable";
import StipulationTable from "./StipulationTable";
import VehicleOptionsTable from "./VehicleOptionsTable";
import VehicleStyleDecodingTable from "./VehicleStyleDecodingTable";
import LFSSetupTabContent from "./LFSSetupTabContent";

const LFSSetupTabs = () => {
  const handleEditClick = (id: string) => {
    console.log(`Edit rule ${id} clicked`);
    toast.info(`Edit rule ${id} functionality to be implemented`);
  };
  
  const handleCopyClick = (id: string) => {
    console.log(`Copy rule ${id} clicked`);
    toast.info(`Rule ${id} has been copied`);
  };
  
  const handleRemoveClick = (id: string) => {
    console.log(`Remove rule ${id} clicked`);
    toast.info(`Rule ${id} has been removed`);
  };

  const tabItems: TabItem[] = [
    {
      value: "geo",
      label: "Geo",
      content: (
        <LFSSetupTabContent title="Geo Rules">
          <GeoTable 
            onEdit={handleEditClick}
            onCopy={handleCopyClick}
            onRemove={handleRemoveClick}
          />
        </LFSSetupTabContent>
      )
    },
    {
      value: "lease-config",
      label: "Lease Config",
      content: (
        <LFSSetupTabContent title="Lease Config Rules">
          <LeaseConfigTable 
            onEdit={handleEditClick}
            onCopy={handleCopyClick}
            onRemove={handleRemoveClick}
          />
        </LFSSetupTabContent>
      )
    },
    {
      value: "gateway",
      label: "Gateway",
      content: (
        <LFSSetupTabContent title="Gateway Rules">
          <GatewayTable 
            onEdit={handleEditClick}
            onCopy={handleCopyClick}
            onRemove={handleRemoveClick}
          />
        </LFSSetupTabContent>
      )
    },
    {
      value: "financial-products",
      label: "Financial Products",
      content: (
        <LFSSetupTabContent title="Financial Products">
          <FinancialProductsTable 
            onEdit={handleEditClick}
            onCopy={handleCopyClick}
            onRemove={handleRemoveClick}
          />
        </LFSSetupTabContent>
      )
    },
    {
      value: "dealer",
      label: "Dealer",
      content: (
        <LFSSetupTabContent title="Dealer Rules">
          <DealerTable 
            onEdit={handleEditClick}
            onCopy={handleCopyClick}
            onRemove={handleRemoveClick}
          />
        </LFSSetupTabContent>
      )
    },
    {
      value: "lender",
      label: "Lender",
      content: (
        <LFSSetupTabContent title="Lender Rules">
          <LenderTable 
            onEdit={handleEditClick}
            onCopy={handleCopyClick}
            onRemove={handleRemoveClick}
          />
        </LFSSetupTabContent>
      )
    },
    {
      value: "vehicle-condition",
      label: "Vehicle Condition",
      content: (
        <LFSSetupTabContent title="Vehicle Condition Rules">
          <VehicleConditionTable 
            onEdit={handleEditClick}
            onCopy={handleCopyClick}
            onRemove={handleRemoveClick}
          />
        </LFSSetupTabContent>
      )
    },
    {
      value: "routing-rule",
      label: "Routing Rule",
      content: (
        <LFSSetupTabContent title="Routing Rules">
          <RoutingRuleTable 
            onEdit={handleEditClick}
            onCopy={handleCopyClick}
            onRemove={handleRemoveClick}
          />
        </LFSSetupTabContent>
      )
    },
    {
      value: "stipulation",
      label: "Stipulation",
      content: (
        <LFSSetupTabContent title="Stipulation Rules">
          <StipulationTable 
            onEdit={handleEditClick}
            onCopy={handleCopyClick}
            onRemove={handleRemoveClick}
          />
        </LFSSetupTabContent>
      )
    },
    {
      value: "vehicle-options",
      label: "Vehicle Options",
      content: (
        <LFSSetupTabContent title="Vehicle Options Rules">
          <VehicleOptionsTable 
            onEdit={handleEditClick}
            onCopy={handleCopyClick}
            onRemove={handleRemoveClick}
          />
        </LFSSetupTabContent>
      )
    },
    {
      value: "vehicle-style-coding",
      label: "Vehicle Style Coding",
      content: (
        <LFSSetupTabContent title="Vehicle Style Coding Rules">
          <VehicleStyleDecodingTable 
            onEdit={handleEditClick}
            onCopy={handleCopyClick}
            onRemove={handleRemoveClick}
          />
        </LFSSetupTabContent>
      )
    }
  ];

  return <TabComponent defaultValue="geo" items={tabItems} />;
};

export default LFSSetupTabs;
