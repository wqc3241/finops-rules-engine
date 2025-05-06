
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdvertisedOfferSection from "./AdvertisedOfferSection";
import PricingRulesSection from "./PricingRulesSection";
import PricingTypeSection from "./PricingTypeSection";
import RulesSection from "./RulesSection";
import PricingConfigRulesSection from "./PricingConfigRulesSection";
import FinancialProductsSection from "./FinancialProductsSection";
import FinancialProgramConfigSection from "./FinancialProgramConfigSection";

interface FinancialPricingTabsProps {
  showAddPricingModal: boolean;
  setShowAddPricingModal: (show: boolean) => void;
  showAddPricingTypeModal: boolean;
  setShowAddPricingTypeModal: (show: boolean) => void;
}

const FinancialPricingTabs = ({
  showAddPricingModal,
  setShowAddPricingModal,
  showAddPricingTypeModal,
  setShowAddPricingTypeModal
}: FinancialPricingTabsProps) => {
  return (
    <Tabs defaultValue="pricing-rules" className="w-full">
      <div className="border-b border-gray-200">
        <TabsList className="bg-transparent h-auto p-0 w-full flex overflow-x-auto">
          <TabsTrigger value="pricing-rules" className="py-3 px-6 data-[state=active]:border-b-2 data-[state=active]:border-gray-900 data-[state=active]:bg-transparent rounded-none">
            Pricing Rules
          </TabsTrigger>
          <TabsTrigger value="pricing-types" className="py-3 px-6 data-[state=active]:border-b-2 data-[state=active]:border-gray-900 data-[state=active]:bg-transparent rounded-none">
            Pricing Types
          </TabsTrigger>
          <TabsTrigger value="rules" className="py-3 px-6 data-[state=active]:border-b-2 data-[state=active]:border-gray-900 data-[state=active]:bg-transparent rounded-none">
            Rules
          </TabsTrigger>
          <TabsTrigger value="pricing-config-rules" className="py-3 px-6 data-[state=active]:border-b-2 data-[state=active]:border-gray-900 data-[state=active]:bg-transparent rounded-none">
            Config Rules
          </TabsTrigger>
          <TabsTrigger value="financial-products" className="py-3 px-6 data-[state=active]:border-b-2 data-[state=active]:border-gray-900 data-[state=active]:bg-transparent rounded-none">
            Financial Products
          </TabsTrigger>
          <TabsTrigger value="financial-program-config" className="py-3 px-6 data-[state=active]:border-b-2 data-[state=active]:border-gray-900 data-[state=active]:bg-transparent rounded-none">
            Financial Program Config
          </TabsTrigger>
          <TabsTrigger value="advertised-offers" className="py-3 px-6 data-[state=active]:border-b-2 data-[state=active]:border-gray-900 data-[state=active]:bg-transparent rounded-none">
            Advertised Offers
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
      <TabsContent value="pricing-types">
        <PricingTypeSection 
          title="Pricing Types"
          showAddModal={showAddPricingTypeModal} 
          setShowAddModal={setShowAddPricingTypeModal} 
        />
      </TabsContent>
      <TabsContent value="rules">
        <RulesSection title="Rules" />
      </TabsContent>
      <TabsContent value="pricing-config-rules">
        <PricingConfigRulesSection title="Config Rules" />
      </TabsContent>
      <TabsContent value="financial-products">
        <FinancialProductsSection title="Financial Products" />
      </TabsContent>
      <TabsContent value="financial-program-config">
        <FinancialProgramConfigSection title="Financial Program Config" />
      </TabsContent>
      <TabsContent value="advertised-offers">
        <AdvertisedOfferSection title="Advertised Offers" />
      </TabsContent>
    </Tabs>
  );
};

export default FinancialPricingTabs;
