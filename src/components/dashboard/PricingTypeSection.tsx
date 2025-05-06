
import { useState } from "react";
import { Button } from "@/components/ui/button";
import PricingTypeTable from "../PricingTypeTable";
import SectionHeader from "./SectionHeader";
import AddPricingTypeModal from "../AddPricingTypeModal";

interface PricingTypeSectionProps {
  title: string;
}

const PricingTypeSection = ({ title }: PricingTypeSectionProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  
  return (
    <div className="p-6">
      <SectionHeader 
        title={title} 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed}
      >
        <Button onClick={() => setShowAddModal(true)}>Add New Pricing Type</Button>
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
        }}
      />
    </div>
  );
};

export default PricingTypeSection;
