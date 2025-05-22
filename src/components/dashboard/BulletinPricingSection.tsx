
import { useState } from "react";
import BulletinPricingTable from "../BulletinPricingTable";
import SectionHeader from "./SectionHeader";
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

  return (
    <div>
      <SectionHeader title={title} onAddNew={handleAddNew} />
      <div className="mt-4">
        <BulletinPricingTable 
          onEdit={handleEdit} 
          onCopy={handleCopy} 
          onRemove={handleRemove} 
          onSelectionChange={onSelectionChange}
          selectedItems={selectedItems}
        />
      </div>
    </div>
  );
};

export default BulletinPricingSection;
