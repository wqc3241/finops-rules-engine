
import { useState } from "react";
import { toast } from "sonner";
import DashboardTabs from "./DashboardTabs";
import LFSSetupTabs from "./LFSSetupTabs";
import FinancialPricingTabs from "./FinancialPricingTabs";
import FinancingDataTableTabs from "./FinancingDataTableTabs";
import SalesPricingRulesTabs from "./SalesPricingRulesTabs";
import { BatchOperations } from "./BatchOperations";
import { ChangeTrackingProvider } from "@/hooks/useChangeTracking";


interface TabsSectionProps {
  activeSection: string;
  showAddPricingModal: boolean;
  setShowAddPricingModal: (show: boolean) => void;
  showAddPricingTypeModal: boolean;
  setShowAddPricingTypeModal: (show: boolean) => void;
  reviewRequestId?: string | null;
}

const TabsSection = ({ 
  activeSection, 
  showAddPricingModal, 
  setShowAddPricingModal, 
  showAddPricingTypeModal, 
  setShowAddPricingTypeModal,
  reviewRequestId
}: TabsSectionProps) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showBatchOperations, setShowBatchOperations] = useState(false);
  const [batchDeleteCallback, setBatchDeleteCallback] = useState<(() => void) | null>(null);
  const [batchDuplicateCallback, setBatchDuplicateCallback] = useState<(() => void) | null>(null);
  const [batchDownloadBulletinPricingCallback, setBatchDownloadBulletinPricingCallback] = useState<(() => void) | null>(null);
  const [currentSchemaId, setCurrentSchemaId] = useState<string>("");
  
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

  const handleBatchDuplicate = () => {
    if (batchDuplicateCallback) {
      batchDuplicateCallback();
      toast.success(`${selectedItems.length} items duplicated successfully`);
    }
    setSelectedItems([]);
    setShowBatchOperations(false);
  };

  const handleSetBatchDeleteCallback = (callback: () => void) => {
    setBatchDeleteCallback(() => callback);
  };

  const handleSetBatchDuplicateCallback = (callback: () => void) => {
    setBatchDuplicateCallback(() => callback);
  };

  const handleSetBatchDownloadBulletinPricingCallback = (callback: () => void) => {
    setBatchDownloadBulletinPricingCallback(() => callback);
  };

  const handleBatchDownloadBulletinPricing = async () => {
    if (batchDownloadBulletinPricingCallback) {
      batchDownloadBulletinPricingCallback();
    }
  };

  // Use the appropriate tabs component based on activeSection
  switch(activeSection) {
    case "Financing Config": 
      return (
        <div className="relative">
          {showBatchOperations && (
            <BatchOperations
              selectedItems={selectedItems}
              onClearSelection={handleClearSelection}
              onBatchDelete={handleBatchDelete}
              onBatchDuplicate={batchDuplicateCallback ? handleBatchDuplicate : undefined}
            />
          )}
          <LFSSetupTabs 
            onSelectionChange={(items, schemaId) => {
              handleSelectionChange(items);
              setCurrentSchemaId(schemaId || "");
            }}
            selectedItems={selectedItems}
            onSetBatchDeleteCallback={handleSetBatchDeleteCallback}
            onSetBatchDuplicateCallback={handleSetBatchDuplicateCallback}
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
              onBatchDuplicate={batchDuplicateCallback ? handleBatchDuplicate : undefined}
            />
          )}
          <ChangeTrackingProvider>
            <FinancialPricingTabs
              showAddPricingModal={showAddPricingModal}
              setShowAddPricingModal={setShowAddPricingModal}
              showAddPricingTypeModal={showAddPricingTypeModal}
              setShowAddPricingTypeModal={setShowAddPricingTypeModal}
              onSelectionChange={(items, schemaId) => {
                handleSelectionChange(items);
                setCurrentSchemaId(schemaId || "");
              }}
              selectedItems={selectedItems}
               onSetBatchDeleteCallback={handleSetBatchDeleteCallback}
               onSetBatchDuplicateCallback={handleSetBatchDuplicateCallback}
               onSetBatchDownloadBulletinPricingCallback={handleSetBatchDownloadBulletinPricingCallback}
               reviewRequestId={reviewRequestId}
            />
          </ChangeTrackingProvider>
        </div>
      );

    case "Financing Data Table":
      return (
        <div className="relative">
          {showBatchOperations && (
            <BatchOperations 
              selectedItems={selectedItems}
              onClearSelection={handleClearSelection}
              onBatchDelete={handleBatchDelete}
            />
          )}
          <FinancingDataTableTabs
            onSelectionChange={handleSelectionChange}
            selectedItems={selectedItems}
            onSetBatchDeleteCallback={handleSetBatchDeleteCallback}
          />
        </div>
      );
    
    case "Sales Pricing Rules":
      return (
        <div className="relative">
          {showBatchOperations && (
            <BatchOperations 
              selectedItems={selectedItems}
              onClearSelection={handleClearSelection}
              onBatchDelete={handleBatchDelete}
            />
          )}
          <SalesPricingRulesTabs 
            onSelectionChange={handleSelectionChange}
            selectedItems={selectedItems}
            onSetBatchDeleteCallback={handleSetBatchDeleteCallback}
          />
        </div>
      );
      
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
