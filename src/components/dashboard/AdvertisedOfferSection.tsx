
import { useState } from "react";
import { Button } from "@/components/ui/button";
import AdvertisedOfferTable from "../AdvertisedOfferTable";
import SectionHeader from "./SectionHeader";
import AdvertisedOffersWizard from "./AdvertisedOffersWizard";

interface AdvertisedOfferSectionProps {
  title: string;
  showAddModal?: boolean;
  setShowAddModal?: (show: boolean) => void;
  onSelectionChange?: (items: string[]) => void;
  selectedItems?: string[];
}

const AdvertisedOfferSection = ({ 
  title, 
  showAddModal = false, 
  setShowAddModal = () => {},
  onSelectionChange,
  selectedItems = []
}: AdvertisedOfferSectionProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);
  
  return (
    <div className="p-6">
      <SectionHeader 
        title={title.replace(" Rules", "")} 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed}
      >
        <Button onClick={() => setWizardOpen(true)}>Create Advertised Offers</Button>
      </SectionHeader>
      
      {!isCollapsed && <AdvertisedOfferTable />}
      
      <AdvertisedOffersWizard 
        open={wizardOpen}
        onOpenChange={setWizardOpen}
      />
    </div>
  );
};

export default AdvertisedOfferSection;
