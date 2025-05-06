
import { useState } from "react";
import { Button } from "@/components/ui/button";
import RulesTable from "../RulesTable";
import SectionHeader from "./SectionHeader";
import { toast } from "sonner";
import { Copy, Edit, Trash2 } from "lucide-react";

interface RulesSectionProps {
  title: string;
}

// Adding onEdit, onCopy, onRemove props to RulesTable component in this file
interface RulesTableProps {
  onEdit: (id: string) => void;
  onCopy: (id: string) => void;
  onRemove: (id: string) => void;
}

const RulesSection = ({ title }: RulesSectionProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const handleAddClick = () => {
    // Here you would typically open a modal for adding a new record
    console.log("Add new rule clicked");
    toast.info("Add new rule functionality to be implemented");
  };
  
  const handleEditClick = (id: string) => {
    console.log(`Edit rule ${id} clicked`);
    toast.info(`Edit rule ${id} functionality to be implemented`);
  };
  
  const handleCopyClick = (id: string) => {
    console.log(`Copy rule ${id} clicked`);
    toast.info(`Rule ${id} has been copied`);
  };
  
  const handleRemoveClick = (id: string) => {
    console.log(`Remove rule ${id} clicked`);
    toast.info(`Rule ${id} has been removed`);
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
