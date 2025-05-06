
import LFSSetupTabs from "./LFSSetupTabs";
import FinancialPricingTabs from "./FinancialPricingTabs";
import DashboardTabs from "./DashboardTabs";

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
    return <LFSSetupTabs />;
  }

  // Financial Pricing tabs
  if (activeSection === "Financial Pricing") {
    return (
      <FinancialPricingTabs
        showAddPricingModal={showAddPricingModal}
        setShowAddPricingModal={setShowAddPricingModal}
        showAddPricingTypeModal={showAddPricingTypeModal}
        setShowAddPricingTypeModal={setShowAddPricingTypeModal}
      />
    );
  }

  // Dashboard as default
  return (
    <DashboardTabs 
      showAddPricingModal={showAddPricingModal}
      setShowAddPricingModal={setShowAddPricingModal}
    />
  );
};

export default TabsSection;
