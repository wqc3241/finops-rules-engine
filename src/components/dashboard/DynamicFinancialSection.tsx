
import { useState } from "react";
import SectionHeader from "./SectionHeader";
import DynamicFinancialSectionContent from "./DynamicFinancialSectionContent";
import { useDynamicTableSchemas } from "@/hooks/useDynamicTableSchemas";
import { useDynamicFinancialData } from "@/hooks/useDynamicFinancialData";

interface DynamicFinancialSectionProps {
  schemaId: string;
  title: string;
  onSelectionChange?: (items: string[]) => void;
  selectedItems?: string[];
  onSetBatchDeleteCallback?: (callback: () => void) => void;
}

const DynamicFinancialSection = ({ 
  schemaId,
  title,
  onSelectionChange,
  selectedItems = [],
  onSetBatchDeleteCallback
}: DynamicFinancialSectionProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { getSchema, updateSchema } = useDynamicTableSchemas();
  const { data, setData, handleAddNew } = useDynamicFinancialData({
    schemaId,
    selectedItems,
    onSelectionChange,
    onSetBatchDeleteCallback
  });

  const schema = getSchema(schemaId);

  const handleAddNewRecord = () => {
    handleAddNew(schema);
  };

  if (!schema) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-sm">
        <div className="text-center text-gray-500">
          Schema not found for {schemaId}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <SectionHeader 
        title={title} 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
        onAddNew={handleAddNewRecord}
      />
      {!isCollapsed && (
        <DynamicFinancialSectionContent
          schema={schema}
          data={data}
          onDataChange={setData}
          onSchemaChange={(updatedSchema) => updateSchema(schemaId, updatedSchema)}
          onSelectionChange={onSelectionChange}
          selectedItems={selectedItems}
        />
      )}
    </div>
  );
};

export default DynamicFinancialSection;
