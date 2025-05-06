
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RulesSection from "./RulesSection";
import PricingConfigRulesSection from "./PricingConfigRulesSection";
import FinancialProductsSection from "./FinancialProductsSection";
import FinancialProgramConfigSection from "./FinancialProgramConfigSection";
import PricingRulesSection from "./PricingRulesSection";
import AdvertisedOfferSection from "./AdvertisedOfferSection";
import PricingTypeSection from "./PricingTypeSection";

interface TabsSectionProps {
  showAddPricingModal: boolean;
  setShowAddPricingModal: (open: boolean) => void;
  showAddPricingTypeModal: boolean;
  setShowAddPricingTypeModal: (open: boolean) => void;
}

const TabsSection = ({ 
  showAddPricingModal, 
  setShowAddPricingModal,
  showAddPricingTypeModal,
  setShowAddPricingTypeModal
}: TabsSectionProps) => {
  return (
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
        <PricingConfigRulesSection title="Pricing Config Rules" />
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
        <AdvertisedOfferSection title="Advertised Offer Rules" />
      </TabsContent>
      
      <TabsContent value="inventory-type">
        <PricingTypeSection 
          title="Pricing Type Rules"
          showAddModal={showAddPricingTypeModal}
          setShowAddModal={setShowAddPricingTypeModal}
        />
      </TabsContent>
    </Tabs>
  );
};

export default TabsSection;
