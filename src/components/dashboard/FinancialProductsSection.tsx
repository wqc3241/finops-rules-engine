
import { useState } from "react";
import { Button } from "@/components/ui/button";
import FinancialProductsTable from "../FinancialProductsTable";
import SectionHeader from "./SectionHeader";
import { toast } from "sonner";
import { Copy, Edit, Trash2 } from "lucide-react";

interface FinancialProductsSectionProps {
  title: string;
}

const FinancialProductsSection = ({ title }: FinancialProductsSectionProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const handleAddClick = () => {
    // Here you would typically open a modal for adding a new record
    console.log("Add new financial product clicked");
    toast.info("Add new financial product functionality to be implemented");
  };
  
  const handleEditClick = (id: string) => {
    console.log(`Edit financial product ${id} clicked`);
    toast.info(`Edit financial product ${id} functionality to be implemented`);
  };
  
  const handleCopyClick = (id: string) => {
    console.log(`Copy financial product ${id} clicked`);
    toast.info(`Financial product ${id} has been copied`);
  };
  
  const handleRemoveClick = (id: string) => {
    console.log(`Remove financial product ${id} clicked`);
    toast.info(`Financial product ${id} has been removed`);
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
        <FinancialProductsTable 
          onEdit={handleEditClick}
          onCopy={handleCopyClick}
          onRemove={handleRemoveClick}
        />
      )}
    </div>
  );
};

export default FinancialProductsSection;
