
import { useState } from "react";
import { Button } from "@/components/ui/button";
import RulesTable from "../RulesTable";
import SectionHeader from "./SectionHeader";
import { toast } from "sonner";
import { Copy, Edit, Trash2 } from "lucide-react";

interface RulesSectionProps {
  title: string;
  showAddModal?: boolean;
  setShowAddModal?: (show: boolean) => void;
  onSelectionChange?: (items: string[]) => void;
  selectedItems?: string[];
}

// Adding onEdit, onCopy, onRemove props to RulesTable component in this file
interface RulesTableProps {
  onEdit: (id: string) => void;
  onCopy: (id: string) => void;
  onRemove: (id: string) => void;
}

const RulesSection = ({ 
  title, 
  showAddModal,
  setShowAddModal,
  onSelectionChange,
  selectedItems = [] 
}: RulesSectionProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const handleAddClick = () => {
    // Here you would typically open a modal for adding a new record
    if (setShowAddModal) {
      setShowAddModal(true);
    } else {
      console.log("Add new credit profile clicked");
      toast.info("Add new credit profile functionality to be implemented");
    }
  };
  
  const handleEditClick = (id: string) => {
    console.log(`Edit credit profile ${id} clicked`);
    toast.info(`Edit credit profile ${id} functionality to be implemented`);
  };
  
  const handleCopyClick = (id: string) => {
    console.log(`Copy credit profile ${id} clicked`);
    toast.info(`Credit profile ${id} has been copied`);
  };
  
  const handleRemoveClick = (id: string) => {
    console.log(`Remove credit profile ${id} clicked`);
    toast.info(`Credit profile ${id} has been removed`);
  };
  
  return (
    <div className="p-6">
      <SectionHeader 
        title={title} 
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      >
        <Button onClick={handleAddClick}>Add New Record</Button>
      </SectionHeader>
      
      {!isCollapsed && (
        <RulesTable 
          onEdit={handleEditClick}
          onCopy={handleCopyClick}
          onRemove={handleRemoveClick}
        />
      )}
    </div>
  );
};

export default RulesSection;
