
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
  const [editingOffer, setEditingOffer] = useState<any>(null);

  const handleEdit = (offer: any) => {
    setEditingOffer(offer);
    setWizardOpen(true);
  };

  const handleWizardClose = (open: boolean) => {
    setWizardOpen(open);
    if (!open) {
      setEditingOffer(null);
    }
  };
  
  return (
    <div className="p-6">
      <SectionHeader 
        title={title.replace(" Rules", "")} 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed}
      >
        <Button onClick={() => setWizardOpen(true)}>Create Advertised Offers</Button>
      </SectionHeader>
      
      {!isCollapsed && <AdvertisedOfferTable onEdit={handleEdit} />}
      
      <AdvertisedOffersWizard 
        open={wizardOpen}
        onOpenChange={handleWizardClose}
        editOffer={editingOffer}
        isEditMode={!!editingOffer}
      />
    </div>
  );
};

export default AdvertisedOfferSection;
