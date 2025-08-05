import { useState } from "react";
import SectionHeader from "./SectionHeader";
import DynamicFinancialSectionContent from "./DynamicFinancialSectionContent";
import FinancialProgramWizard, { WizardData } from "./FinancialProgramWizard";
import { useDynamicTableSchemas } from "@/hooks/useDynamicTableSchemas";
import { useDynamicFinancialData } from "@/hooks/useDynamicFinancialData";
import { useUndoRedo } from "@/hooks/useUndoRedo";
import { useSupabaseFeeRules } from "@/hooks/useSupabaseFeeRules";
import { useSupabaseTaxRules } from "@/hooks/useSupabaseTaxRules";
import { useSupabaseDataOperations } from "@/hooks/useSupabaseDataOperations";
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
  const { updateRecord, deleteRecord, deleteRecords } = useSupabaseDataOperations();
  
  // Use Supabase hooks for fee and tax rules
  const feeRulesHook = useSupabaseFeeRules();
  const taxRulesHook = useSupabaseTaxRules();
  
  // Fallback to local data for non-Supabase schemas
  const localDataHook = useDynamicFinancialData({
    schemaId,
    selectedItems,
    onSelectionChange,
    onSetBatchDeleteCallback
  });

  const schema = getSchema(schemaId);
  
  // Determine which data source to use
  const isSupabaseSchema = schemaId === 'fee-rules' || schemaId === 'tax-rules';
  const supabaseData = schemaId === 'fee-rules' ? feeRulesHook.feeRules : 
                      schemaId === 'tax-rules' ? taxRulesHook.taxRules : [];
  const supabaseLoading = schemaId === 'fee-rules' ? feeRulesHook.loading : 
                         schemaId === 'tax-rules' ? taxRulesHook.loading : false;
  
  // Use appropriate data and methods
  const data = isSupabaseSchema ? supabaseData : localDataHook.data;
  const setData = isSupabaseSchema ? () => {} : localDataHook.setData; // No direct setData for Supabase
  
  const { saveState, undo, redo, canUndo, canRedo } = useUndoRedo(data, schema || { id: '', name: '', columns: [] });

  const handleDataChange = async (newData: any) => {
    if (isSupabaseSchema) {
      // For Supabase schemas, handle individual record updates
      // This will be called when a cell is edited
      const updatedRecords = newData.filter((newRecord: any) => {
        const oldRecord = data.find((d: any) => d.id === newRecord.id);
        return oldRecord && JSON.stringify(oldRecord) !== JSON.stringify(newRecord);
      });

      for (const record of updatedRecords) {
        try {
          const tableName = schemaId === 'fee-rules' ? 'fee_rules' : 'tax_rules';
          await updateRecord(tableName, record.id, record);
          
          // Refresh data after update
          if (schemaId === 'fee-rules') {
            feeRulesHook.refetch();
          } else if (schemaId === 'tax-rules') {
            taxRulesHook.refetch();
          }
        } catch (error) {
          console.error('Error updating record:', error);
        }
      }
      return;
    }
    
    // For non-Supabase schemas, use the old logic
    if (schema) {
      saveState(data, schema, 'data_change');
    }
    setData(newData);
  };

  const handleSchemaChange = async (newSchema: any) => {
    if (isSupabaseSchema) {
      // For Supabase schemas, schema changes would require database migrations
      toast.error('Schema changes for database tables require migrations. Please contact an administrator.');
      return;
    }
    
    // For non-Supabase schemas, use the old logic
    if (schema) {
      saveState(data, schema, 'schema_change');
    }
    updateSchema(schemaId, newSchema);
  };

  const handleUndo = () => {
    if (isSupabaseSchema) {
      toast.info('Undo/Redo not available for database tables. Changes are saved immediately.');
      return;
    }
    
    const previousState = undo();
    if (previousState) {
      console.log('Undoing to state:', previousState);
      setData(previousState.data);
      updateSchema(schemaId, previousState.schema);
      toast.success("Action undone");
    }
  };

  const handleRedo = () => {
    if (isSupabaseSchema) {
      toast.info('Undo/Redo not available for database tables. Changes are saved immediately.');
      return;
    }
    
    const nextState = redo();
    if (nextState) {
      console.log('Redoing to state:', nextState);
      setData(nextState.data);
      updateSchema(schemaId, nextState.schema);
      toast.success("Action redone");
    }
  };

  const handleAddNewRecord = async () => {
    if (schemaId === 'financial-program-config') {
      setShowWizard(true);
    } else if (isSupabaseSchema) {
      // For Supabase schemas, add a default record
      try {
        if (schemaId === 'fee-rules') {
          await feeRulesHook.addFeeRule({
            fee_name: 'New Fee',
            fee_type: 'Fixed',
            amount: 0,
            is_active: true
          });
        } else if (schemaId === 'tax-rules') {
          await taxRulesHook.addTaxRule({
            tax_name: 'New Tax',
            tax_type: 'Percentage',
            rate: 0,
            geo_code: '',
            is_active: true
          });
        }
      } catch (error) {
        console.error('Error adding new record:', error);
      }
    } else {
      // For non-Supabase schemas, use the old logic
      if (schema) {
        saveState(data, schema, 'add_record');
      }
      localDataHook.handleAddNew(schema);
    }
  };

  // Set up batch delete callback for Supabase tables
  if (onSetBatchDeleteCallback && isSupabaseSchema) {
    onSetBatchDeleteCallback(async () => {
      if (selectedItems.length > 0) {
        try {
          if (schemaId === 'fee-rules') {
            await feeRulesHook.deleteFeeRules(selectedItems);
          } else if (schemaId === 'tax-rules') {
            await taxRulesHook.deleteTaxRules(selectedItems);
          }
          onSelectionChange?.([]);
        } catch (error) {
          console.error('Error deleting records:', error);
        }
      }
    });
  }

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
    if (schema && !isSupabaseSchema) {
      saveState(data, schema, 'wizard_add');
    }

    // Add the new record to the data
    const newData = [...data, newRecord];
    if (!isSupabaseSchema) {
      setData(newData);
    }
    
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

  // Show loading state for Supabase data
  if (isSupabaseSchema && supabaseLoading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-sm">
        <div className="text-center text-gray-500">
          Loading {title}...
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
        canUndo={canUndo && !isSupabaseSchema}
        canRedo={canRedo && !isSupabaseSchema}
      />
      {!isCollapsed && (
        <DynamicFinancialSectionContent
          schema={schema}
          data={data}
          onDataChange={handleDataChange}
          onSchemaChange={handleSchemaChange}
          onSelectionChange={onSelectionChange}
          selectedItems={selectedItems}
          isSupabaseSchema={isSupabaseSchema}
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