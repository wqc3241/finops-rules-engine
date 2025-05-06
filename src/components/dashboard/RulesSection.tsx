
import { useState } from "react";
import { Button } from "@/components/ui/button";
import RulesTable from "../RulesTable";
import SectionHeader from "./SectionHeader";

interface RulesSectionProps {
  title: string;
}

const RulesSection = ({ title }: RulesSectionProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  return (
    <div className="p-6">
      <SectionHeader 
        title={title.replace(" Rules", "")} 
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      >
        <Button>Add New Route</Button>
      </SectionHeader>
      
      {!isCollapsed && <RulesTable />}
    </div>
  );
};

export default RulesSection;
