
import { useState, useEffect } from "react";
import TabComponent, { TabItem } from "./TabComponent";
import DynamicFinancialSection from "./DynamicFinancialSection";
import BulletinPricingSection from "./BulletinPricingSection";
import ApprovalNotificationBanner from "@/components/approval-workflow/ApprovalNotificationBanner";
import SubmitForReviewModal from "@/components/approval-workflow/SubmitForReviewModal";
import ChangeRequestSummary from "@/components/approval-workflow/ChangeRequestSummary";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useSupabaseAuth";
import { useSupabaseApprovalWorkflow } from "@/hooks/useSupabaseApprovalWorkflow";
import { useChangeTracking } from "@/hooks/useChangeTracking";
import { toast } from "sonner";
import { DynamicTableSchemasProvider } from "@/hooks/useDynamicTableSchemas";

interface FinancialPricingTabsProps {
  showAddPricingModal: boolean;
  setShowAddPricingModal: (show: boolean) => void;
  showAddPricingTypeModal: boolean;
  setShowAddPricingTypeModal: (show: boolean) => void;
  onSelectionChange?: (items: string[], schemaId?: string) => void;
  selectedItems?: string[];
  onSetBatchDeleteCallback?: (callback: () => void) => void;
  onSetBatchDuplicateCallback?: (callback: () => void) => void;
  onSetBatchDownloadBulletinPricingCallback?: (callback: () => void) => void;
  reviewRequestId?: string | null;
}

const FinancialPricingTabs = ({
  showAddPricingModal,
  setShowAddPricingModal,
  showAddPricingTypeModal,
  setShowAddPricingTypeModal,
  onSelectionChange,
  selectedItems = [],
  onSetBatchDeleteCallback,
  onSetBatchDuplicateCallback,
  onSetBatchDownloadBulletinPricingCallback,
  reviewRequestId
}: FinancialPricingTabsProps) => {
  return (
    <DynamicTableSchemasProvider>
      <FinancialPricingTabsContent
        showAddPricingModal={showAddPricingModal}
        setShowAddPricingModal={setShowAddPricingModal}
        showAddPricingTypeModal={showAddPricingTypeModal}
        setShowAddPricingTypeModal={setShowAddPricingTypeModal}
        onSelectionChange={onSelectionChange}
        selectedItems={selectedItems}
        onSetBatchDeleteCallback={onSetBatchDeleteCallback}
        onSetBatchDuplicateCallback={onSetBatchDuplicateCallback}
        onSetBatchDownloadBulletinPricingCallback={onSetBatchDownloadBulletinPricingCallback}
        reviewRequestId={reviewRequestId}
      />
    </DynamicTableSchemasProvider>
  );
};

const FinancialPricingTabsContent = ({
  showAddPricingModal,
  setShowAddPricingModal,
  showAddPricingTypeModal,
  setShowAddPricingTypeModal,
  onSelectionChange,
  selectedItems = [],
  onSetBatchDeleteCallback,
  onSetBatchDuplicateCallback,
  onSetBatchDownloadBulletinPricingCallback,
  reviewRequestId
}: FinancialPricingTabsProps) => {
  const [activeTab, setActiveTab] = useState("rules");
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [showAddBulletinPricingModal, setShowAddBulletinPricingModal] = useState(false);
  
  const { isFSOps } = useAuth();
  const { submitForReview, getPendingRequestsForAdmin } = useSupabaseApprovalWorkflow();
  const { getChangedTables } = useChangeTracking();
  
  // Check if there are any changes
  const hasChanges = getChangedTables().length > 0;

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Reset selections when changing tabs to prevent issues
    if (onSelectionChange) {
      onSelectionChange([], value);
    }
  };

  const handleOpenReview = () => {
    setSelectedRequestId(null); // No specific request ID, reviewing all
    setShowReviewModal(true);
  };

  // Auto-open review modal if reviewRequestId is provided
  useEffect(() => {
    if (reviewRequestId) {
      setSelectedRequestId(reviewRequestId);
      setShowReviewModal(true);
    }
  }, [reviewRequestId]);


  const tabItems: TabItem[] = [
    {
      value: "rules",
      label: "Credit Profile",
      content: (
        <DynamicFinancialSection 
          schemaId="credit-profile"
          title="Credit Profile"
          onSelectionChange={(items) => onSelectionChange?.(items, "credit-profile")}
          selectedItems={selectedItems}
          onSetBatchDeleteCallback={onSetBatchDeleteCallback}
        />
      )
    },
    {
      value: "pricing-config-rules",
      label: "Pricing Config",
      content: (
        <DynamicFinancialSection 
          schemaId="pricing-config"
          title="Pricing Config"
          onSelectionChange={(items) => onSelectionChange?.(items, "pricing-config")}
          selectedItems={selectedItems}
          onSetBatchDeleteCallback={onSetBatchDeleteCallback}
        />
      )
    },
    {
      value: "financial-program-config",
      label: "Financial Program Config",
      content: (
        <DynamicFinancialSection 
          schemaId="financial-program-config"
          title="Financial Program Config"
          onSelectionChange={(items) => onSelectionChange?.(items, "financial-program-config")}
          selectedItems={selectedItems}
          onSetBatchDeleteCallback={onSetBatchDeleteCallback}
          onSetBatchDuplicateCallback={onSetBatchDuplicateCallback}
          onSetBatchDownloadBulletinPricingCallback={onSetBatchDownloadBulletinPricingCallback}
        />
      )
    },
    {
      value: "bulletin-pricing",
      label: "Bulletin Pricing",
      content: (
        <DynamicTableSchemasProvider>
          <BulletinPricingSection 
            title="Bulletin Pricing"
            showAddModal={showAddBulletinPricingModal}
            setShowAddModal={setShowAddBulletinPricingModal}
            onSelectionChange={(items) => onSelectionChange?.(items, "bulletin-pricing")}
            selectedItems={selectedItems}
            onSetBatchDeleteCallback={onSetBatchDeleteCallback}
          />
        </DynamicTableSchemasProvider>
      )
    },
    {
      value: "advertised-offers",
      label: "Advertised Offers",
      content: (
        <DynamicFinancialSection 
          schemaId="advertised-offers"
          title="Advertised Offers"
          onSelectionChange={(items) => onSelectionChange?.(items, "advertised-offers")}
          selectedItems={selectedItems}
          onSetBatchDeleteCallback={onSetBatchDeleteCallback}
        />
      )
    }
  ];

  return (
    <div className="bg-gray-50 p-4">
      <ApprovalNotificationBanner onOpenReview={handleOpenReview} />
      
      {isFSOps && hasChanges && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-blue-900">You have unsaved changes</h4>
              <p className="text-sm text-blue-700">
                {getChangedTables().length} table{getChangedTables().length !== 1 ? 's' : ''} modified. 
                Submit for admin approval to apply changes.
              </p>
            </div>
            <Button 
              onClick={() => setShowSubmitModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Submit for Review
            </Button>
          </div>
        </div>
      )}

      <TabComponent 
        defaultValue="rules" 
        items={tabItems} 
        onValueChange={handleTabChange}
      />

      <SubmitForReviewModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onSubmit={() => {
          toast.success("Changes submitted for review");
        }}
      />

      <ChangeRequestSummary
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        requestId={selectedRequestId}
      />
    </div>
  );
};

export default FinancialPricingTabs;
