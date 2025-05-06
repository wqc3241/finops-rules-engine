
import { useState } from "react";
import { Button } from "@/components/ui/button";
import FinancialProgramConfigTable from "../FinancialProgramConfigTable";
import SectionHeader from "./SectionHeader";

interface FinancialProgramConfigSectionProps {
  title: string;
}

const FinancialProgramConfigSection = ({ title }: FinancialProgramConfigSectionProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  return (
    <div className="p-6">
      <SectionHeader 
        title={title.replace(" Rules", "")} 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed}
      >
        <Button>Add New Program Config</Button>
      </SectionHeader>
      
      {!isCollapsed && <FinancialProgramConfigTable />}
    </div>
  );
};

export default FinancialProgramConfigSection;
