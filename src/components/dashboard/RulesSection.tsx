
import { useState } from "react";
import { Button } from "@/components/ui/button";
import RulesTable from "../RulesTable";
import SectionHeader from "./SectionHeader";
import { toast } from "sonner";

interface RulesSectionProps {
  title: string;
}

const RulesSection = ({ title }: RulesSectionProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const handleAddClick = () => {
    // Here you would typically open a modal for adding a new record
    console.log("Add new rule clicked");
    toast.info("Add new rule functionality to be implemented");
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
      
      {!isCollapsed && <RulesTable />}
    </div>
  );
};

export default RulesSection;
