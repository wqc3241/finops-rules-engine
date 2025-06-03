
import LFSSetupTabs from "./LFSSetupTabs";
import FinancialPricingTabs from "./FinancialPricingTabs";
import DashboardTabs from "./DashboardTabs";
import FeeTaxTabs from "./FeeTaxTabs";
import { useState } from "react";
import { BatchOperations } from "./BatchOperations";
import { toast } from "sonner";

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
  const [batchDeleteCallback, setBatchDeleteCallback] = useState<(() => void) | null>(null);
  
  const handleSelectionChange = (items: string[]) => {
    setSelectedItems(items);
    setShowBatchOperations(items.length > 0);
  };

  const handleClearSelection = () => {
    setSelectedItems([]);
    setShowBatchOperations(false);
  };

  const handleBatchDelete = () => {
    if (batchDeleteCallback) {
      batchDeleteCallback();
      toast.success(`${selectedItems.length} items deleted successfully`);
    }
    setSelectedItems([]);
    setShowBatchOperations(false);
  };

  const handleSetBatchDeleteCallback = (callback: () => void) => {
    setBatchDeleteCallback(() => callback);
  };

  // Use the appropriate tabs component based on activeSection
  switch(activeSection) {
    case "LFS Setup": 
      return (
        <div className="relative">
          {showBatchOperations && (
            <BatchOperations 
              selectedItems={selectedItems}
              onClearSelection={handleClearSelection}
              onBatchDelete={handleBatchDelete}
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
              selectedItems={selectedItems}
              onClearSelection={handleClearSelection}
              onBatchDelete={handleBatchDelete}
            />
          )}
          <FinancialPricingTabs
            showAddPricingModal={showAddPricingModal}
            setShowAddPricingModal={setShowAddPricingModal}
            showAddPricingTypeModal={showAddPricingTypeModal}
            setShowAddPricingTypeModal={setShowAddPricingTypeModal}
            onSelectionChange={handleSelectionChange}
            selectedItems={selectedItems}
            onSetBatchDeleteCallback={handleSetBatchDeleteCallback}
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
