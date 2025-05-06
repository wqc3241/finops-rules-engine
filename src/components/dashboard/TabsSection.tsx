
import LFSSetupTabs from "./LFSSetupTabs";
import FinancialPricingTabs from "./FinancialPricingTabs";
import DashboardTabs from "./DashboardTabs";
import FeeTaxTabs from "./FeeTaxTabs";

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
  // Use the appropriate tabs component based on activeSection
  switch(activeSection) {
    case "LFS Setup": 
      return <LFSSetupTabs />;
    
    case "Financial Pricing":
      return (
        <FinancialPricingTabs
          showAddPricingModal={showAddPricingModal}
          setShowAddPricingModal={setShowAddPricingModal}
          showAddPricingTypeModal={showAddPricingTypeModal}
          setShowAddPricingTypeModal={setShowAddPricingTypeModal}
        />
      );
    
    case "Fee & Tax":
      return <FeeTaxTabs />;
      
    default:
      // Dashboard as default
      return (
        <DashboardTabs 
          showAddPricingModal={showAddPricingModal}
          setShowAddPricingModal={setShowAddPricingModal}
        />
      );
  }
};

export default TabsSection;
