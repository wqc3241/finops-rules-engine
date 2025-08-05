
import { useState } from "react";
import SectionHeader from "./SectionHeader";
import DynamicFinancialSectionContent from "./DynamicFinancialSectionContent";
import FinancialProgramWizard, { WizardData } from "./FinancialProgramWizard";
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
  const [showWizard, setShowWizard] = useState(false);
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
      saveState(data, schema, 'data_change');
    }
    setData(newData);
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
      setData(previousState.data);
      updateSchema(schemaId, previousState.schema);
      toast.success("Action undone");
    }
  };

  const handleRedo = () => {
    const nextState = redo();
    if (nextState) {
      console.log('Redoing to state:', nextState);
      setData(nextState.data);
      updateSchema(schemaId, nextState.schema);
      toast.success("Action redone");
    }
  };

  const handleAddNewRecord = () => {
    // Use wizard for financial-program-config, regular add for others
    if (schemaId === 'financial-program-config') {
      setShowWizard(true);
    } else {
      if (schema) {
        saveState(data, schema, 'add_record');
      }
      handleAddNew(schema);
    }
  };

  const handleWizardComplete = (wizardData: WizardData) => {
    // Convert wizard data to financial program config record
    const newRecord = {
      id: `FPC${Date.now()}`,
      programCode: wizardData.programCode || "",
      cloneFrom: null,
      priority: wizardData.creditProfile?.priority || 1,
      financialProductId: wizardData.financialProduct || "",
      productType: null,
      vehicleStyleId: wizardData.vehicleStyleId,
      financingVehicleCondition: wizardData.vehicleCondition,
      programStartDate: new Date(wizardData.programStartDate).toLocaleDateString(),
      programEndDate: new Date(wizardData.programEndDate).toLocaleDateString(),
      isActive: true,
      orderTypes: "INV, CON",
      version: 1
    };

    // Save state for undo/redo
    if (schema) {
      saveState(data, schema, 'wizard_add');
    }

    // Add the new record to the data
    const newData = [...data, newRecord];
    setData(newData);
    
    console.log('Financial program created:', newRecord);
    console.log('Full wizard data:', wizardData);
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

      {/* Financial Program Wizard */}
      {schemaId === 'financial-program-config' && (
        <FinancialProgramWizard
          open={showWizard}
          onOpenChange={setShowWizard}
          onComplete={handleWizardComplete}
        />
      )}
    </div>
  );
};

export default DynamicFinancialSection;
