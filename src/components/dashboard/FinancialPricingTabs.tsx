
import { useState } from "react";
import TabComponent, { TabItem } from "./TabComponent";
import AdvertisedOfferSection from "./AdvertisedOfferSection";
import PricingRulesSection from "./PricingRulesSection";
import PricingTypeSection from "./PricingTypeSection";
import RulesSection from "./RulesSection";
import PricingConfigRulesSection from "./PricingConfigRulesSection";
import FinancialProductsSection from "./FinancialProductsSection";
import FinancialProgramConfigSection from "./FinancialProgramConfigSection";
import BulletinPricingSection from "./BulletinPricingSection";
import { toast } from "sonner";

interface FinancialPricingTabsProps {
  showAddPricingModal: boolean;
  setShowAddPricingModal: (show: boolean) => void;
  showAddPricingTypeModal: boolean;
  setShowAddPricingTypeModal: (show: boolean) => void;
  onSelectionChange?: (items: string[]) => void;
  selectedItems?: string[];
}

const FinancialPricingTabs = ({
  showAddPricingModal,
  setShowAddPricingModal,
  showAddPricingTypeModal,
  setShowAddPricingTypeModal,
  onSelectionChange,
  selectedItems = []
}: FinancialPricingTabsProps) => {
  const [activeTab, setActiveTab] = useState("bulletin-pricing");
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showConfigRulesModal, setShowConfigRulesModal] = useState(false);
  const [showFinancialProductsModal, setShowFinancialProductsModal] = useState(false);
  const [showFinancialProgramConfigModal, setShowFinancialProgramConfigModal] = useState(false);
  const [showAdvertisedOffersModal, setShowAdvertisedOffersModal] = useState(false);
  const [showBulletinPricingModal, setShowBulletinPricingModal] = useState(false);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleAddNewRecord = () => {
    switch (activeTab) {
      case "rules":
        setShowRulesModal(true);
        break;
      case "pricing-config-rules":
        setShowConfigRulesModal(true);
        break;
      case "financial-products":
        setShowFinancialProductsModal(true);
        break;
      case "financial-program-config":
        setShowFinancialProgramConfigModal(true);
        break;
      case "advertised-offers":
        setShowAdvertisedOffersModal(true);
        break;
      case "pricing-rules":
        setShowAddPricingModal(true);
        break;
      case "pricing-types":
        setShowAddPricingTypeModal(true);
        break;
      case "bulletin-pricing":
        setShowBulletinPricingModal(true);
        break;
      default:
        toast.info("Add functionality not implemented for this tab yet");
    }
  };

  const tabItems: TabItem[] = [
    {
      value: "bulletin-pricing",
      label: "Bulletin Pricing",
      content: (
        <BulletinPricingSection 
          title="Bulletin Pricing"
          showAddModal={showBulletinPricingModal} 
          setShowAddModal={setShowBulletinPricingModal} 
          onSelectionChange={onSelectionChange}
          selectedItems={selectedItems}
        />
      )
    },
    {
      value: "pricing-rules",
      label: "Pricing Rules",
      content: (
        <PricingRulesSection 
          title="Pricing Rules"
          showAddModal={showAddPricingModal} 
          setShowAddModal={setShowAddPricingModal} 
          onSelectionChange={onSelectionChange}
          selectedItems={selectedItems}
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
          onSelectionChange={onSelectionChange}
          selectedItems={selectedItems}
        />
      )
    },
    {
      value: "rules",
      label: "Credit Profile",
      content: (
        <RulesSection 
          title="Credit Profile" 
          showAddModal={showRulesModal}
          setShowAddModal={setShowRulesModal}
          onSelectionChange={onSelectionChange}
          selectedItems={selectedItems}
        />
      )
    },
    {
      value: "pricing-config-rules",
      label: "Pricing Config",
      content: (
        <PricingConfigRulesSection 
          title="Pricing Config"
          showAddModal={showConfigRulesModal}
          setShowAddModal={setShowConfigRulesModal}
          onSelectionChange={onSelectionChange}
          selectedItems={selectedItems}
        />
      )
    },
    {
      value: "financial-products",
      label: "Financial Products",
      content: (
        <FinancialProductsSection 
          title="Financial Products"
          showAddModal={showFinancialProductsModal}
          setShowAddModal={setShowFinancialProductsModal}
          onSelectionChange={onSelectionChange}
          selectedItems={selectedItems}
        />
      )
    },
    {
      value: "financial-program-config",
      label: "Financial Program Config",
      content: (
        <FinancialProgramConfigSection 
          title="Financial Program Config"
          showAddModal={showFinancialProgramConfigModal}
          setShowAddModal={setShowFinancialProgramConfigModal}
          onSelectionChange={onSelectionChange}
          selectedItems={selectedItems}
        />
      )
    },
    {
      value: "advertised-offers",
      label: "Advertised Offers",
      content: (
        <AdvertisedOfferSection 
          title="Advertised Offers"
          showAddModal={showAdvertisedOffersModal}
          setShowAddModal={setShowAdvertisedOffersModal}
          onSelectionChange={onSelectionChange}
          selectedItems={selectedItems}
        />
      )
    }
  ];

  return (
    <div className="bg-gray-50 p-4">
      <TabComponent 
        defaultValue="bulletin-pricing" 
        items={tabItems} 
        onValueChange={handleTabChange}
      />
    </div>
  );
};

export default FinancialPricingTabs;
