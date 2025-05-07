
import LFSSetupTabs from "./LFSSetupTabs";
import FinancialPricingTabs from "./FinancialPricingTabs";
import DashboardTabs from "./DashboardTabs";
import FeeTaxTabs from "./FeeTaxTabs";
import { useState } from "react";
import BatchOperations from "./BatchOperations";

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
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showBatchOperations, setShowBatchOperations] = useState(false);
  
  const handleSelectionChange = (items: string[]) => {
    setSelectedItems(items);
    setShowBatchOperations(items.length > 0);
  };

  // Use the appropriate tabs component based on activeSection
  switch(activeSection) {
    case "LFS Setup": 
      return (
        <div className="relative">
          {showBatchOperations && (
            <BatchOperations 
              count={selectedItems.length}
              onClear={() => {
                setSelectedItems([]);
                setShowBatchOperations(false);
              }}
            />
          )}
          <LFSSetupTabs 
            onSelectionChange={handleSelectionChange} 
            selectedItems={selectedItems}
          />
        </div>
      );
    
    case "Financial Pricing":
      return (
        <div className="relative">
          {showBatchOperations && (
            <BatchOperations 
              count={selectedItems.length}
              onClear={() => {
                setSelectedItems([]);
                setShowBatchOperations(false);
              }}
            />
          )}
          <FinancialPricingTabs
            showAddPricingModal={showAddPricingModal}
            setShowAddPricingModal={setShowAddPricingModal}
            showAddPricingTypeModal={showAddPricingTypeModal}
            setShowAddPricingTypeModal={setShowAddPricingTypeModal}
            onSelectionChange={handleSelectionChange}
            selectedItems={selectedItems}
          />
        </div>
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
