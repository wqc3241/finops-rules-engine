
import { useState } from "react";
import BulletinPricingTable from "../BulletinPricingTable";
import SectionHeader from "./SectionHeader";
import { toast } from "sonner";
import { exportBulletinPricing } from "@/utils/bulletinPricingExport";

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

  const handleEdit = (id: string) => {
    toast.info(`Edit bulletin pricing with ID: ${id}`);
  };

  const handleCopy = (id: string) => {
    toast.info(`Copy bulletin pricing with ID: ${id}`);
  };

  const handleRemove = (id: string) => {
    toast.info(`Remove bulletin pricing with ID: ${id}`);
  };

  const handleDownload = async () => {
    try {
      toast.info("Exporting bulletin pricing...");
      const result = await exportBulletinPricing();
      toast.success(`Export complete! Generated ${result.fileCount} file(s).`);
    } catch (error) {
      console.error('Export failed:', error);
      toast.error("Export failed. Please try again.");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <SectionHeader 
        title={title} 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
        onAddNew={handleAddNew}
        onDownload={handleDownload}
        downloadLabel="Download Bulletin Pricing"
      />
      {!isCollapsed && (
        <div className="mt-4">
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
