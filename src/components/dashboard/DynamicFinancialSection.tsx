
import { useState } from "react";
import SectionHeader from "./SectionHeader";
import DynamicFinancialSectionContent from "./DynamicFinancialSectionContent";
import { useDynamicTableSchemas } from "@/hooks/useDynamicTableSchemas";
import { useDynamicDataStore } from "@/hooks/useDynamicDataStore";
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
  const { getData, setData } = useDynamicDataStore();

  const schema = getSchema(schemaId);
  const data = getData(schemaId);

  // State restoration callback for undo/redo
  const handleStateRestore = (restoredData: any, restoredSchema: any) => {
    setData(schemaId, restoredData);
    updateSchema(schemaId, restoredSchema);
  };

  const { saveState, undo, redo, canUndo, canRedo } = useUndoRedo(
    data, 
    schema || { id: '', name: '', columns: [] },
    handleStateRestore
  );

  const handleDataChange = (newData: any) => {
    if (schema) {
      saveState(data, schema, 'data_change');
    }
    setData(schemaId, newData);
  };

  const handleSchemaChange = (newSchema: any) => {
    if (schema) {
      saveState(data, schema, 'schema_change');
    }
    updateSchema(schemaId, newSchema);
  };

  const handleUndo = () => {
    const previousState = undo();
    if (previousState) {
      console.log('Undoing to state:', previousState);
      toast.success("Action undone");
    }
  };

  const handleRedo = () => {
    const nextState = redo();
    if (nextState) {
      console.log('Redoing to state:', nextState);
      toast.success("Action redone");
    }
  };

  const handleAddNewRecord = () => {
    if (schema) {
      saveState(data, schema, 'add_record');
      
      const newRow: any = {
        id: `new_${Date.now()}`,
      };

      // Initialize with default values based on column types
      schema.columns.forEach((column: any) => {
        if (column.key !== 'id') {
          switch (column.type) {
            case 'string':
              newRow[column.key] = '';
              break;
            case 'boolean':
              newRow[column.key] = false;
              break;
            case 'number':
              newRow[column.key] = 0;
              break;
          }
        }
      });

      setData(schemaId, [...data, newRow]);
      toast.success("New record added");
    }
  };

  // Set up batch delete callback
  if (onSetBatchDeleteCallback) {
    const batchDeleteFunction = () => {
      if (schema) {
        saveState(data, schema, 'batch_delete');
      }
      const updatedData = data.filter(row => !selectedItems.includes(row.id));
      setData(schemaId, updatedData);
      onSelectionChange?.([]);
    };
    onSetBatchDeleteCallback(batchDeleteFunction);
  }

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
