
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdvertisedOfferSection from "./AdvertisedOfferSection";
import PricingRulesSection from "./PricingRulesSection";
import PricingTypeSection from "./PricingTypeSection";
import RulesSection from "./RulesSection";
import PricingConfigRulesSection from "./PricingConfigRulesSection";
import FinancialProductsSection from "./FinancialProductsSection";
import FinancialProgramConfigSection from "./FinancialProgramConfigSection";

interface TabsSectionProps {
  activeSection: string;
  showAddPricingModal: boolean;
  setShowAddPricingModal: (show: boolean) => void;
  showAddPricingTypeModal: boolean;
  setShowAddPricingTypeModal: (show: boolean) => void;
}

const TabsSection = ({
  activeSection,
  showAddPricingModal,
  setShowAddPricingModal,
  showAddPricingTypeModal,
  setShowAddPricingTypeModal
}: TabsSectionProps) => {
  // LFS Setup tabs
  if (activeSection === "LFS Setup") {
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

        <TabsContent value="geo">
          <RulesSection />
        </TabsContent>
        <TabsContent value="lease-config">
          <RulesSection />
        </TabsContent>
        <TabsContent value="gateway">
          <RulesSection />
        </TabsContent>
        <TabsContent value="dealer">
          <RulesSection />
        </TabsContent>
        <TabsContent value="lender">
          <RulesSection />
        </TabsContent>
        <TabsContent value="vehicle-condition">
          <RulesSection />
        </TabsContent>
        <TabsContent value="routing-rule">
          <RulesSection />
        </TabsContent>
        <TabsContent value="stipulation">
          <RulesSection />
        </TabsContent>
        <TabsContent value="vehicle-options">
          <RulesSection />
        </TabsContent>
        <TabsContent value="vehicle-style-coding">
          <RulesSection />
        </TabsContent>
      </Tabs>
    );
  }

  // Financial Pricing tabs
  if (activeSection === "Financial Pricing") {
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
            showAddModal={showAddPricingModal} 
            setShowAddModal={setShowAddPricingModal} 
          />
        </TabsContent>
        <TabsContent value="pricing-types">
          <PricingTypeSection 
            showAddModal={showAddPricingTypeModal} 
            setShowAddModal={setShowAddPricingTypeModal} 
          />
        </TabsContent>
        <TabsContent value="rules">
          <RulesSection />
        </TabsContent>
        <TabsContent value="pricing-config-rules">
          <PricingConfigRulesSection />
        </TabsContent>
        <TabsContent value="financial-products">
          <FinancialProductsSection />
        </TabsContent>
        <TabsContent value="financial-program-config">
          <FinancialProgramConfigSection />
        </TabsContent>
        <TabsContent value="advertised-offers">
          <AdvertisedOfferSection />
        </TabsContent>
      </Tabs>
    );
  }

  // Dashboard as default
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
          showAddModal={showAddPricingModal} 
          setShowAddModal={setShowAddPricingModal} 
        />
      </TabsContent>
      <TabsContent value="rules">
        <RulesSection />
      </TabsContent>
    </Tabs>
  );
};

export default TabsSection;
