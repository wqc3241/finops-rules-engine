
import { useState } from "react";
import BulletinPricingTable from "../BulletinPricingTable";
import SectionHeader from "./SectionHeader";
import { Button } from "@/components/ui/button";
import { Upload, Download } from "lucide-react";
import { toast } from "sonner";

interface BulletinPricingSectionProps {
  title: string;
  showAddModal: boolean;
  setShowAddModal: (show: boolean) => void;
  onSelectionChange?: (items: string[]) => void;
  selectedItems?: string[];
}

const BulletinPricingSection = ({ 
  title, 
  showAddModal, 
  setShowAddModal,
  onSelectionChange,
  selectedItems
}: BulletinPricingSectionProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const handleAddNew = () => {
    setShowAddModal(true);
  };

  const handleUploadPricing = () => {
    console.log("Upload pricing clicked");
    toast.info("Upload pricing functionality");
    // Functionality for uploading pricing
  };

  const handleDownloadPricing = () => {
    console.log("Download pricing clicked");
    toast.info("Download pricing functionality");
    // Functionality for downloading pricing
  };

  const handleEdit = (id: string) => {
    toast.info(`Edit bulletin pricing with ID: ${id}`);
  };

  const handleCopy = (id: string) => {
    toast.info(`Copy bulletin pricing with ID: ${id}`);
  };

  const handleRemove = (id: string) => {
    toast.info(`Remove bulletin pricing with ID: ${id}`);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <SectionHeader 
        title={title} 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
        onAddNew={handleAddNew} 
      />
      {!isCollapsed && (
        <div className="mt-4">
          <div className="flex justify-end space-x-2 mb-4">
            <Button variant="outline" size="sm" onClick={handleUploadPricing}>
              <Upload className="h-3 w-3 mr-1" />
              Upload Pricing
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownloadPricing}>
              <Download className="h-3 w-3 mr-1" />
              Download Pricing
            </Button>
          </div>
          <BulletinPricingTable 
            onEdit={handleEdit} 
            onCopy={handleCopy} 
            onRemove={handleRemove} 
            onSelectionChange={onSelectionChange}
            selectedItems={selectedItems}
          />
        </div>
      )}
    </div>
  );
};

export default BulletinPricingSection;
