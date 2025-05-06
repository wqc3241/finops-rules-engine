
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PricingRulesSection from "./PricingRulesSection";
import RulesSection from "./RulesSection";

interface DashboardTabsProps {
  showAddPricingModal: boolean;
  setShowAddPricingModal: (show: boolean) => void;
}

const DashboardTabs = ({
  showAddPricingModal,
  setShowAddPricingModal
}: DashboardTabsProps) => {
  return (
    <Tabs defaultValue="pricing-rules" className="w-full">
      <div className="border-b border-gray-200">
        <TabsList className="bg-transparent h-auto p-0 w-full flex overflow-x-auto">
          <TabsTrigger value="pricing-rules" className="py-3 px-6 data-[state=active]:border-b-2 data-[state=active]:border-gray-900 data-[state=active]:bg-transparent rounded-none">
            Pricing Rules
          </TabsTrigger>
          <TabsTrigger value="rules" className="py-3 px-6 data-[state=active]:border-b-2 data-[state=active]:border-gray-900 data-[state=active]:bg-transparent rounded-none">
            Rules
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="pricing-rules">
        <PricingRulesSection 
          title="Pricing Rules"
          showAddModal={showAddPricingModal} 
          setShowAddModal={setShowAddPricingModal} 
        />
      </TabsContent>
      <TabsContent value="rules">
        <RulesSection title="Rules" />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
