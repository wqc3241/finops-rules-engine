
import TabComponent, { TabItem } from "./TabComponent";
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
  const tabItems: TabItem[] = [
    {
      value: "pricing-rules",
      label: "Pricing Rules",
      content: (
        <PricingRulesSection 
          title="Pricing Rules"
          showAddModal={showAddPricingModal} 
          setShowAddModal={setShowAddPricingModal} 
        />
      )
    },
    {
      value: "pricing-types",
      label: "Pricing Types",
      content: (
        <PricingTypeSection 
          title="Pricing Types"
          showAddModal={showAddPricingTypeModal} 
          setShowAddModal={setShowAddPricingTypeModal} 
        />
      )
    },
    {
      value: "rules",
      label: "Rules",
      content: <RulesSection title="Rules" />
    },
    {
      value: "pricing-config-rules",
      label: "Config Rules",
      content: <PricingConfigRulesSection title="Config Rules" />
    },
    {
      value: "financial-products",
      label: "Financial Products",
      content: <FinancialProductsSection title="Financial Products" />
    },
    {
      value: "financial-program-config",
      label: "Financial Program Config",
      content: <FinancialProgramConfigSection title="Financial Program Config" />
    },
    {
      value: "advertised-offers",
      label: "Advertised Offers",
      content: <AdvertisedOfferSection title="Advertised Offers" />
    }
  ];

  return <TabComponent defaultValue="pricing-rules" items={tabItems} />;
};

export default FinancialPricingTabs;
