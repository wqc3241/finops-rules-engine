import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RulesTable from "./RulesTable";
import PricingRulesTable from "./PricingRulesTable";
import PricingConfigRulesTable from "./PricingConfigRulesTable";
import FinancialProductsTable from "./FinancialProductsTable";
import FinancialProgramConfigTable from "./FinancialProgramConfigTable";
import AddPricingRuleModal from "./AddPricingRuleModal";
import { toast } from "sonner";

const Dashboard = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddPricingModal, setShowAddPricingModal] = useState(false);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <Tabs defaultValue="bulletin-pricing">
          <div className="px-6 border-b border-gray-200">
            <TabsList className="border-b-0">
              <TabsTrigger value="credit-profile">Credit Profile</TabsTrigger>
              <TabsTrigger value="pricing-config">Pricing Config</TabsTrigger>
              <TabsTrigger value="product">Financial Product</TabsTrigger>
              <TabsTrigger value="program">Financial Program Config</TabsTrigger>
              <TabsTrigger value="bulletin-pricing">Bulletin Pricing</TabsTrigger>
              <TabsTrigger value="advertised-offer">Advertised Offer</TabsTrigger>
              <TabsTrigger value="inventory-type">Pricing Type</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="credit-profile" className="p-0">
            <RulesSection title="Credit Profile Rules" />
          </TabsContent>
          
          <TabsContent value="pricing-config">
            <PricingConfigRulesSection 
              title="Pricing Config Rules" 
            />
          </TabsContent>
          
          <TabsContent value="product">
            <FinancialProductsSection title="Financial Product Rules" />
          </TabsContent>
          
          <TabsContent value="program">
            <FinancialProgramConfigSection title="Financial Program Config Rules" />
          </TabsContent>
          
          <TabsContent value="bulletin-pricing">
            <PricingRulesSection 
              title="Bulletin Pricing Rules" 
              showAddModal={showAddPricingModal}
              setShowAddModal={setShowAddPricingModal}
            />
          </TabsContent>
          
          <TabsContent value="advertised-offer">
            <RulesSection title="Advertised Offer Rules" />
          </TabsContent>
          
          <TabsContent value="inventory-type">
            <RulesSection title="Pricing Type Rules" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const RulesSection = ({ title }: { title: string }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <h2 className="text-lg font-medium text-gray-800">{title.replace(" Rules", "")}</h2>
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="ml-2 text-gray-400 hover:text-gray-600"
          >
            {isCollapsed ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
        <Button>Add New Route</Button>
      </div>
      
      {!isCollapsed && <RulesTable />}
    </div>
  );
};

const FinancialProductsSection = ({ title }: { title: string }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <h2 className="text-lg font-medium text-gray-800">{title.replace(" Rules", "")}</h2>
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="ml-2 text-gray-400 hover:text-gray-600"
          >
            {isCollapsed ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
        <Button>Add New Product</Button>
      </div>
      
      {!isCollapsed && <FinancialProductsTable />}
    </div>
  );
};

const PricingConfigRulesSection = ({ 
  title
}: { 
  title: string; 
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <h2 className="text-lg font-medium text-gray-800">{title.replace(" Rules", "")}</h2>
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="ml-2 text-gray-400 hover:text-gray-600"
          >
            {isCollapsed ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
        <Button onClick={() => setShowAddModal(true)}>Add New Config Rule</Button>
      </div>
      
      {!isCollapsed && <PricingConfigRulesTable />}
    </div>
  );
};

const PricingRulesSection = ({ 
  title, 
  showAddModal, 
  setShowAddModal 
}: { 
  title: string; 
  showAddModal: boolean; 
  setShowAddModal: (open: boolean) => void;
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const handleSavePricingRule = (data: any) => {
    console.log("New pricing rule:", data);
    // Here you would normally save the data to your state or backend
    // In a real implementation, this would update the PricingRulesTable
    toast.success(`New pricing rule "${data.programName}" created`);
  };
  
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <h2 className="text-lg font-medium text-gray-800">{title.replace(" Rules", "")}</h2>
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="ml-2 text-gray-400 hover:text-gray-600"
          >
            {isCollapsed ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
        <Button onClick={() => setShowAddModal(true)}>Add New Pricing Rule</Button>
      </div>
      
      {!isCollapsed && <PricingRulesTable />}
      
      {/* Modal for adding new pricing rules */}
      <AddPricingRuleModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleSavePricingRule}
      />
    </div>
  );
};

const FinancialProgramConfigSection = ({ title }: { title: string }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <h2 className="text-lg font-medium text-gray-800">{title.replace(" Rules", "")}</h2>
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="ml-2 text-gray-400 hover:text-gray-600"
          >
            {isCollapsed ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
        <Button>Add New Program Config</Button>
      </div>
      
      {!isCollapsed && <FinancialProgramConfigTable />}
    </div>
  );
};

export default Dashboard;
