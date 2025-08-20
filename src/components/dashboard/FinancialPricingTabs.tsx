
import { useState } from "react";
import TabComponent, { TabItem } from "./TabComponent";
import DynamicFinancialSection from "./DynamicFinancialSection";
import ApprovalNotificationBanner from "@/components/approval-workflow/ApprovalNotificationBanner";
import SubmitForReviewModal from "@/components/approval-workflow/SubmitForReviewModal";
import ChangeRequestSummary from "@/components/approval-workflow/ChangeRequestSummary";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useSupabaseAuth";
import { useSupabaseApprovalWorkflow } from "@/hooks/useSupabaseApprovalWorkflow";
import { useChangeTracking } from "@/hooks/useChangeTracking";
import { toast } from "sonner";

interface FinancialPricingTabsProps {
  showAddPricingModal: boolean;
  setShowAddPricingModal: (show: boolean) => void;
  showAddPricingTypeModal: boolean;
  setShowAddPricingTypeModal: (show: boolean) => void;
  onSelectionChange?: (items: string[]) => void;
  selectedItems?: string[];
  onSetBatchDeleteCallback?: (callback: () => void) => void;
}

const FinancialPricingTabs = ({
  showAddPricingModal,
  setShowAddPricingModal,
  showAddPricingTypeModal,
  setShowAddPricingTypeModal,
  onSelectionChange,
  selectedItems = [],
  onSetBatchDeleteCallback
}: FinancialPricingTabsProps) => {
  const [activeTab, setActiveTab] = useState("rules");
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  
  const { isFSOps } = useAuth();
  const { submitForReview, getPendingRequestsForAdmin } = useSupabaseApprovalWorkflow();
  const { getChangedTables } = useChangeTracking();
  
  // Check if there are any changes
  const hasChanges = getChangedTables().length > 0;
  
  // Debug logging
  console.log('FinancialPricingTabs Debug:', {
    isFSOps,
    hasChanges,
    changedTablesCount: getChangedTables().length,
    changedTables: getChangedTables()
  });

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Reset selections when changing tabs to prevent issues
    if (onSelectionChange) {
      onSelectionChange([]);
    }
  };

  const handleOpenReview = () => {
    setSelectedRequestId(null); // No specific request ID, reviewing all
    setShowReviewModal(true);
  };


  const tabItems: TabItem[] = [
    {
      value: "rules",
      label: "Credit Profile",
      content: (
        <DynamicFinancialSection 
          schemaId="credit-profile"
          title="Credit Profile"
          onSelectionChange={onSelectionChange}
          selectedItems={selectedItems}
          onSetBatchDeleteCallback={onSetBatchDeleteCallback}
          hideTitle={true}
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
          onSelectionChange={onSelectionChange}
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
          onSelectionChange={onSelectionChange}
          selectedItems={selectedItems}
          onSetBatchDeleteCallback={onSetBatchDeleteCallback}
        />
      )
    },
    {
      value: "bulletin-pricing",
      label: "Bulletin Pricing",
      content: (
        <DynamicFinancialSection 
          schemaId="bulletin-pricing"
          title="Bulletin Pricing"
          onSelectionChange={onSelectionChange}
          selectedItems={selectedItems}
          onSetBatchDeleteCallback={onSetBatchDeleteCallback}
        />
      )
    },
    {
      value: "advertised-offers",
      label: "Advertised Offers",
      content: (
        <DynamicFinancialSection 
          schemaId="advertised-offers"
          title="Advertised Offers"
          onSelectionChange={onSelectionChange}
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
