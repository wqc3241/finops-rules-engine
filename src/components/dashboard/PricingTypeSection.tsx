
import { Button } from "@/components/ui/button";
import PricingTypeTable from "../PricingTypeTable";
import SectionHeader from "./SectionHeader";
import AddPricingTypeModal from "../AddPricingTypeModal";
import { useState } from "react";
import { toast } from "sonner";

interface PricingTypeSectionProps {
  title: string;
  showAddModal?: boolean;
  setShowAddModal?: (open: boolean) => void;
}

const PricingTypeSection = ({ 
  title, 
  showAddModal: externalShowAddModal, 
  setShowAddModal: externalSetShowAddModal 
}: PricingTypeSectionProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [internalShowAddModal, setInternalShowAddModal] = useState(false);
  
  // Use either the external state (if provided) or the internal state
  const showAddModal = externalShowAddModal !== undefined ? externalShowAddModal : internalShowAddModal;
  const setShowAddModal = externalSetShowAddModal || setInternalShowAddModal;
  
  return (
    <div className="p-6">
      <SectionHeader 
        title={title} 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed}
      >
        <Button onClick={() => setShowAddModal(true)}>Add New Record</Button>
      </SectionHeader>
      
      {!isCollapsed && <PricingTypeTable />}
      
      <AddPricingTypeModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onAddPricingType={(typeCode, typeName) => {
          // The actual add functionality is handled inside the PricingTypeTable component
          // This is just a pass-through
          const tableElement = document.querySelector('table');
          if (tableElement) {
            const event = new CustomEvent('addPricingType', { 
              detail: { typeCode, typeName } 
            });
            tableElement.dispatchEvent(event);
          }
          toast.success(`New pricing type "${typeName}" created`);
        }}
      />
    </div>
  );
};

export default PricingTypeSection;
