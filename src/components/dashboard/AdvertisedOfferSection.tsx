
import { useState } from "react";
import { Button } from "@/components/ui/button";
import AdvertisedOfferTable from "../AdvertisedOfferTable";
import SectionHeader from "./SectionHeader";

interface AdvertisedOfferSectionProps {
  title: string;
}

const AdvertisedOfferSection = ({ title }: AdvertisedOfferSectionProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  return (
    <div className="p-6">
      <SectionHeader 
        title={title.replace(" Rules", "")} 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed}
      >
        <Button>Add New Advertised Offer</Button>
      </SectionHeader>
      
      {!isCollapsed && <AdvertisedOfferTable />}
    </div>
  );
};

export default AdvertisedOfferSection;
