
import { useState } from "react";
import { Button } from "@/components/ui/button";
import AdvertisedOfferTable from "../AdvertisedOfferTable";
import SectionHeader from "./SectionHeader";
import { toast } from "sonner";

interface AdvertisedOfferSectionProps {
  title: string;
}

const AdvertisedOfferSection = ({ title }: AdvertisedOfferSectionProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  
  const handleAddClick = () => {
    setShowAddModal(true);
    // Here you would typically open a modal for adding a new record
    console.log("Add new advertised offer clicked");
    toast.info("Add new advertised offer functionality to be implemented");
  };
  
  return (
    <div className="p-6">
      <SectionHeader 
        title={title.replace(" Rules", "")} 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed}
      >
        <Button onClick={handleAddClick}>Add New Record</Button>
      </SectionHeader>
      
      {!isCollapsed && <AdvertisedOfferTable />}
    </div>
  );
};

export default AdvertisedOfferSection;
