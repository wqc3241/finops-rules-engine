
import { useState } from "react";
import { Button } from "@/components/ui/button";
import FinancialProgramConfigTable from "../FinancialProgramConfigTable";
import SectionHeader from "./SectionHeader";
import { toast } from "sonner";

interface FinancialProgramConfigSectionProps {
  title: string;
}

const FinancialProgramConfigSection = ({ title }: FinancialProgramConfigSectionProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const handleAddClick = () => {
    // Here you would typically open a modal for adding a new record
    console.log("Add new program config clicked");
    toast.info("Add new program config functionality to be implemented");
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
      
      {!isCollapsed && <FinancialProgramConfigTable />}
    </div>
  );
};

export default FinancialProgramConfigSection;
