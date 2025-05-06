
import { useState } from "react";
import { Button } from "@/components/ui/button";
import PricingTypeTable from "../PricingTypeTable";
import SectionHeader from "./SectionHeader";
import { toast } from "sonner";

interface PricingTypeSectionProps {
  title: string;
}

const PricingTypeSection = ({ title }: PricingTypeSectionProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  return (
    <div className="p-6">
      <SectionHeader 
        title={title} 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed}
      >
        <Button onClick={() => toast.info("Add new pricing type clicked")}>Add New Pricing Type</Button>
      </SectionHeader>
      
      {!isCollapsed && <PricingTypeTable />}
    </div>
  );
};

export default PricingTypeSection;
