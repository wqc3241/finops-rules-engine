
import { useState } from "react";
import SectionHeader from "./SectionHeader";
import DynamicFinancialSectionContent from "./DynamicFinancialSectionContent";
import { useDynamicTableSchemas } from "@/hooks/useDynamicTableSchemas";
import { useDynamicFinancialData } from "@/hooks/useDynamicFinancialData";
import { useUndoRedo } from "@/hooks/useUndoRedo";
import { toast } from "sonner";

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
  const { saveState, undo, redo, canUndo, canRedo } = useUndoRedo(data, schema || { id: '', name: '', columns: [] });

  const handleDataChange = (newData: any) => {
    if (schema) {
      saveState(newData, schema, 'data_change');
    }
    setData(newData);
  };

  const handleSchemaChange = (newSchema: any) => {
    if (schema) {
      saveState(data, newSchema, 'schema_change');
    }
    updateSchema(schemaId, newSchema);
  };

  const handleUndo = () => {
    const previousState = undo();
    if (previousState) {
      setData(previousState.data);
      updateSchema(schemaId, previousState.schema);
      toast.success("Action undone");
    }
  };

  const handleRedo = () => {
    const nextState = redo();
    if (nextState) {
      setData(nextState.data);
      updateSchema(schemaId, nextState.schema);
      toast.success("Action redone");
    }
  };

  const handleAddNewRecord = () => {
    if (schema) {
      saveState(data, schema, 'add_record');
    }
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
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={canUndo}
        canRedo={canRedo}
      />
      {!isCollapsed && (
        <DynamicFinancialSectionContent
          schema={schema}
          data={data}
          onDataChange={handleDataChange}
          onSchemaChange={handleSchemaChange}
          onSelectionChange={onSelectionChange}
          selectedItems={selectedItems}
        />
      )}
    </div>
  );
};

export default DynamicFinancialSection;
