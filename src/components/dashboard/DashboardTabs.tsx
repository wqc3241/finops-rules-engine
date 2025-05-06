
import TabComponent, { TabItem } from "./TabComponent";
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
      value: "rules",
      label: "Rules",
      content: <RulesSection title="Rules" />
    }
  ];

  return <TabComponent defaultValue="pricing-rules" items={tabItems} />;
};

export default DashboardTabs;
