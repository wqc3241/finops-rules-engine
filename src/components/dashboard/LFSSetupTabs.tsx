
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RulesSection from "./RulesSection";
import { toast } from "sonner";
import GeoTable from "./GeoTable";
import LeaseConfigTable from "./LeaseConfigTable";
import GatewayTable from "./GatewayTable";
import Button from "./Button"; // Import the Button component
import FinancialProductsTable from "./FinancialProductsTable"; // Import the FinancialProductsTable component
import DealerTable from "./DealerTable"; // Import the new DealerTable component
import LenderTable from "./LenderTable"; // Import the new LenderTable component
import VehicleConditionTable from "./VehicleConditionTable"; // Import the new VehicleConditionTable component
import RoutingRuleTable from "./RoutingRuleTable"; // Import the new RoutingRuleTable component

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

  return (
    <Tabs defaultValue="geo" className="w-full">
      <div className="border-b border-gray-200">
        <TabsList className="bg-transparent h-auto p-0 w-full flex overflow-x-auto">
          <TabsTrigger value="geo" className="py-3 px-6 data-[state=active]:border-b-2 data-[state=active]:border-gray-900 data-[state=active]:bg-transparent rounded-none">
            Geo
          </TabsTrigger>
          <TabsTrigger value="lease-config" className="py-3 px-6 data-[state=active]:border-b-2 data-[state=active]:border-gray-900 data-[state=active]:bg-transparent rounded-none">
            Lease Config
          </TabsTrigger>
          <TabsTrigger value="gateway" className="py-3 px-6 data-[state=active]:border-b-2 data-[state=active]:border-gray-900 data-[state=active]:bg-transparent rounded-none">
            Gateway
          </TabsTrigger>
          <TabsTrigger value="financial-products" className="py-3 px-6 data-[state=active]:border-b-2 data-[state=active]:border-gray-900 data-[state=active]:bg-transparent rounded-none">
            Financial Products
          </TabsTrigger>
          <TabsTrigger value="dealer" className="py-3 px-6 data-[state=active]:border-b-2 data-[state=active]:border-gray-900 data-[state=active]:bg-transparent rounded-none">
            Dealer
          </TabsTrigger>
          <TabsTrigger value="lender" className="py-3 px-6 data-[state=active]:border-b-2 data-[state=active]:border-gray-900 data-[state=active]:bg-transparent rounded-none">
            Lender
          </TabsTrigger>
          <TabsTrigger value="vehicle-condition" className="py-3 px-6 data-[state=active]:border-b-2 data-[state=active]:border-gray-900 data-[state=active]:bg-transparent rounded-none">
            Vehicle Condition
          </TabsTrigger>
          <TabsTrigger value="routing-rule" className="py-3 px-6 data-[state=active]:border-b-2 data-[state=active]:border-gray-900 data-[state=active]:bg-transparent rounded-none">
            Routing Rule
          </TabsTrigger>
          <TabsTrigger value="stipulation" className="py-3 px-6 data-[state=active]:border-b-2 data-[state=active]:border-gray-900 data-[state=active]:bg-transparent rounded-none">
            Stipulation
          </TabsTrigger>
          <TabsTrigger value="vehicle-options" className="py-3 px-6 data-[state=active]:border-b-2 data-[state=active]:border-gray-900 data-[state=active]:bg-transparent rounded-none">
            Vehicle Options
          </TabsTrigger>
          <TabsTrigger value="vehicle-style-coding" className="py-3 px-6 data-[state=active]:border-b-2 data-[state=active]:border-gray-900 data-[state=active]:bg-transparent rounded-none">
            Vehicle Style Coding
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="geo" className="p-6">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-lg font-medium">Geo Rules</h2>
          <Button
            onClick={() => toast.info("Add new geo record functionality to be implemented")}
          >
            Add New Record
          </Button>
        </div>
        <GeoTable 
          onEdit={handleEditClick}
          onCopy={handleCopyClick}
          onRemove={handleRemoveClick}
        />
      </TabsContent>

      <TabsContent value="lease-config" className="p-6">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-lg font-medium">Lease Config Rules</h2>
          <Button
            onClick={() => toast.info("Add new lease config record functionality to be implemented")}
          >
            Add New Record
          </Button>
        </div>
        <LeaseConfigTable 
          onEdit={handleEditClick}
          onCopy={handleCopyClick}
          onRemove={handleRemoveClick}
        />
      </TabsContent>

      <TabsContent value="gateway" className="p-6">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-lg font-medium">Gateway Rules</h2>
          <Button
            onClick={() => toast.info("Add new gateway record functionality to be implemented")}
          >
            Add New Record
          </Button>
        </div>
        <GatewayTable 
          onEdit={handleEditClick}
          onCopy={handleCopyClick}
          onRemove={handleRemoveClick}
        />
      </TabsContent>

      <TabsContent value="financial-products" className="p-6">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-lg font-medium">Financial Products</h2>
          <Button
            onClick={() => toast.info("Add new financial product functionality to be implemented")}
          >
            Add New Record
          </Button>
        </div>
        <FinancialProductsTable 
          onEdit={handleEditClick}
          onCopy={handleCopyClick}
          onRemove={handleRemoveClick}
        />
      </TabsContent>

      <TabsContent value="dealer" className="p-6">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-lg font-medium">Dealer Rules</h2>
          <Button
            onClick={() => toast.info("Add new dealer record functionality to be implemented")}
          >
            Add New Record
          </Button>
        </div>
        <DealerTable 
          onEdit={handleEditClick}
          onCopy={handleCopyClick}
          onRemove={handleRemoveClick}
        />
      </TabsContent>

      <TabsContent value="lender" className="p-6">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-lg font-medium">Lender Rules</h2>
          <Button
            onClick={() => toast.info("Add new lender record functionality to be implemented")}
          >
            Add New Record
          </Button>
        </div>
        <LenderTable 
          onEdit={handleEditClick}
          onCopy={handleCopyClick}
          onRemove={handleRemoveClick}
        />
      </TabsContent>

      <TabsContent value="vehicle-condition" className="p-6">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-lg font-medium">Vehicle Condition Rules</h2>
          <Button
            onClick={() => toast.info("Add new vehicle condition record functionality to be implemented")}
          >
            Add New Record
          </Button>
        </div>
        <VehicleConditionTable 
          onEdit={handleEditClick}
          onCopy={handleCopyClick}
          onRemove={handleRemoveClick}
        />
      </TabsContent>

      <TabsContent value="routing-rule" className="p-6">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-lg font-medium">Routing Rules</h2>
          <Button
            onClick={() => toast.info("Add new routing rule record functionality to be implemented")}
          >
            Add New Record
          </Button>
        </div>
        <RoutingRuleTable 
          onEdit={handleEditClick}
          onCopy={handleCopyClick}
          onRemove={handleRemoveClick}
        />
      </TabsContent>

      <TabsContent value="stipulation">
        <RulesSection title="Stipulation Rules" />
      </TabsContent>

      <TabsContent value="vehicle-options">
        <RulesSection title="Vehicle Options Rules" />
      </TabsContent>

      <TabsContent value="vehicle-style-coding">
        <RulesSection title="Vehicle Style Coding Rules" />
      </TabsContent>
    </Tabs>
  );
};

export default LFSSetupTabs;
