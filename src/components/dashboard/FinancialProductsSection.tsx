
import { useState } from "react";
import { Button } from "@/components/ui/button";
import FinancialProductsTable from "../FinancialProductsTable";
import SectionHeader from "./SectionHeader";

interface FinancialProductsSectionProps {
  title: string;
}

const FinancialProductsSection = ({ title }: FinancialProductsSectionProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  return (
    <div className="p-6">
      <SectionHeader 
        title={title.replace(" Rules", "")} 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed}
      >
        <Button>Add New Product</Button>
      </SectionHeader>
      
      {!isCollapsed && <FinancialProductsTable />}
    </div>
  );
};

export default FinancialProductsSection;
