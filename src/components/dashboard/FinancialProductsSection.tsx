
import { useState } from "react";
import { Button } from "@/components/ui/button";
import FinancialProductsTable from "../FinancialProductsTable";
import SectionHeader from "./SectionHeader";
import { toast } from "sonner";

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
  
  return (
    <div className="p-6">
      <SectionHeader 
        title={title.replace(" Rules", "")} 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed}
      >
        <Button onClick={handleAddClick}>Add New Record</Button>
      </SectionHeader>
      
      {!isCollapsed && <FinancialProductsTable />}
    </div>
  );
};

export default FinancialProductsSection;
