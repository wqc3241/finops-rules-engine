
import { useState, useEffect } from "react";
import SectionHeader from "./SectionHeader";
import DynamicFinancialSectionContent from "./DynamicFinancialSectionContent";
import FinancialProgramWizard, { WizardData } from "./FinancialProgramWizard";
import TableVersionHistory from "@/components/version-management/TableVersionHistory";
import { useDynamicTableSchemas } from "@/hooks/useDynamicTableSchemas";
import { useDynamicFinancialData } from "@/hooks/useDynamicFinancialData";
import { useUndoRedo } from "@/hooks/useUndoRedo";
import { useTableVersions } from "@/hooks/useTableVersions";
import { useSupabaseApprovalWorkflow } from "@/hooks/useSupabaseApprovalWorkflow";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import * as XLSX from 'xlsx';
import { toast } from "sonner";
import { exportBulletinPricing } from "@/utils/bulletinPricingExport";

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
  const [editData, setEditData] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const { getSchema, getSyncSchema, updateSchema, loading: schemaLoading } = useDynamicTableSchemas();
  const { data, setData, handleAddNew, loading, isLocked } = useDynamicFinancialData({
    schemaId,
    selectedItems,
    onSelectionChange,
    onSetBatchDeleteCallback
  });
  const { isTableLocked } = useSupabaseApprovalWorkflow();

  // Load schema dynamically
  const [schema, setSchema] = useState(getSyncSchema(schemaId));
  
  // Version management
  const {
    versions,
    isLoading: versionsLoading,
    saveVersion,
    loadVersions,
    restoreVersion,
    canRestore,
    persistVersions
  } = useTableVersions(schemaId);
  
  useEffect(() => {
    const loadSchema = async () => {
      const loadedSchema = await getSchema(schemaId);
      setSchema(loadedSchema);
    };
    
    if (!schema) {
      loadSchema();
    }
  }, [schemaId, getSchema, schema]);

  useEffect(() => {
    loadVersions();
  }, [loadVersions]);

  useEffect(() => {
    if (versions.length > 0) {
      persistVersions(versions);
    }
  }, [versions, persistVersions]);
  const { saveState, undo, redo, canUndo, canRedo } = useUndoRedo(data, schema || { id: '', name: '', columns: [] });

  const handleDataChange = (newData: any) => {
    if (schema) {
      saveState(data, schema, 'data_change');
      // Auto-save version on significant changes
      saveVersion(newData, schema, 'Data modification');
    }
    setData(newData);
  };

  const handleSchemaChange = (newSchema: any) => {
    if (schema) {
      saveState(data, schema, 'schema_change');
      // Auto-save version on schema changes
      saveVersion(data, newSchema, 'Schema modification');
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
        // Save version when adding new record
        const newData = [...data];
        saveVersion(newData, schema, 'Added new record');
      }
      handleAddNew(schema);
    }
  };

  const handleVersionHistory = () => {
    setShowVersionHistory(true);
  };

  const handleRestoreVersion = async (versionId: string) => {
    const restoredData = await restoreVersion(versionId);
    if (restoredData) {
      setData(restoredData.data);
      updateSchema(schemaId, restoredData.schema);
      setShowVersionHistory(false);
    }
  };

  const handleWizardComplete = (wizardData: WizardData) => {
    if (isEditMode && editData) {
      // Update existing record
      const updatedRecord = {
        ...editData,
        programCode: wizardData.programCode || editData.programCode,
        financialProductId: wizardData.financialProduct || editData.financialProductId,
        vehicleStyleId: wizardData.vehicleStyleId || editData.vehicleStyleId,
        financingVehicleCondition: wizardData.vehicleCondition || editData.financingVehicleCondition,
        programStartDate: wizardData.programStartDate ? new Date(wizardData.programStartDate).toLocaleDateString() : editData.programStartDate,
        programEndDate: wizardData.programEndDate ? new Date(wizardData.programEndDate).toLocaleDateString() : editData.programEndDate,
        version: (editData.version || 1) + 1
      };

      // Save state for undo/redo
      if (schema) {
        saveState(data, schema, 'wizard_edit');
      }

      // Update the existing record in the data
      const newData = data.map(item => 
        (item as any).id === editData.id ? updatedRecord : item
      );
      setData(newData);
      
      // Save version for wizard completion
      if (schema) {
        saveVersion(newData, schema, 'Financial program updated via wizard');
      }
      
      toast.success("Financial program updated successfully");
      console.log('Financial program updated:', updatedRecord);
    } else {
      // Create new record
      const newRecord = {
        id: `FPC${Date.now()}`,
        programCode: wizardData.programCode || "",
        cloneFrom: null,
        priority: wizardData.creditProfiles.length > 0 ? 1 : 1,
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
      
      // Save version for wizard completion
      if (schema) {
        saveVersion(newData, schema, 'Financial program created via wizard');
      }
      
      toast.success("Financial program created successfully");
      console.log('Financial program created:', newRecord);
    }
    
    // Reset wizard state
    setEditData(null);
    setIsEditMode(false);
    console.log('Full wizard data:', wizardData);
  };

  const handleEditRow = (rowId: string, rowData: any) => {
    if (schemaId === 'financial-program-config') {
      setEditData(rowData);
      setIsEditMode(true);
      setShowWizard(true);
    }
  };

  const handleUpload = () => {
    console.log(`Upload ${title} clicked`);
    toast.success(`Upload ${title} functionality will be implemented`);
  };

  const handleDownload = async () => {
    try {
      console.log(`Download ${title} clicked`);
      
      if (schemaId === 'fee-rules') {
        // Fetch current fee rules data from Supabase
        const { data: feeRules, error } = await supabase
          .from('fee_rules')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching fee rules:', error);
          toast.error('Failed to fetch fee rules data');
          return;
        }

        // Prepare data for Excel export
        const exportData = feeRules?.map(rule => ({
          'Fee Name': rule.name,
          'Fee Type': rule.type,
          'Amount': rule.feeAmount,
          'Fee Active': rule.feeActive ? 'Yes' : 'No',
          'Fee Country': rule.feeCountry,
          'Fee Currency': rule.feeCurrency,
          'Fee State': rule.feeState,
          'Fee Taxable': rule.feeTaxable ? 'Yes' : 'No',
          'Category': rule.category,
          'Created At': new Date(rule.createdAt).toLocaleDateString()
        })) || [];

        // Create Excel workbook
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Fee Rules');

        // Auto-adjust column widths
        const maxWidth = exportData.reduce((w, r) => Math.max(w, Object.keys(r).length), 10);
        worksheet['!cols'] = Object.keys(exportData[0] || {}).map(() => ({ wch: maxWidth }));

        // Generate filename with current date
        const fileName = `fee_rules_${new Date().toISOString().split('T')[0]}.xlsx`;
        
        // Download the file
        XLSX.writeFile(workbook, fileName);
        toast.success(`Downloaded ${exportData.length} fee rules to ${fileName}`);
      } else if (schemaId === 'bulletin-pricing') {
        toast.info("Exporting bulletin pricing...");
        const result = await exportBulletinPricing();
        toast.success(`Export complete! Generated ${result.fileCount} file(s).`);
      } else {
        toast.success(`Download ${title} functionality will be implemented`);
      }
    } catch (error) {
      console.error('Error downloading data:', error);
      toast.error('Failed to download data');
    }
  };

  // Determine if this section should have upload/download buttons
  const shouldShowUploadDownload = schemaId === 'fee-rules' || schemaId === 'tax-rules' || schemaId === 'bulletin-pricing';

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
      {isLocked && (
        <Alert className="mb-4 border-warning bg-warning/5">
          <Lock className="h-4 w-4 text-warning" />
          <AlertDescription>
            This table is currently locked while changes are under review. 
            You cannot make edits until an admin approves or rejects the pending changes.
          </AlertDescription>
        </Alert>
      )}

      <SectionHeader 
        title={title} 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
        onAddNew={isLocked ? undefined : handleAddNewRecord}
        onUndo={isLocked ? undefined : handleUndo}
        onRedo={isLocked ? undefined : handleRedo}
        canUndo={canUndo && !isLocked}
        canRedo={canRedo && !isLocked}
        onUpload={shouldShowUploadDownload && !isLocked ? handleUpload : undefined}
        onDownload={shouldShowUploadDownload ? handleDownload : undefined}
        uploadLabel={`Upload ${title}`}
        downloadLabel={`Download ${title}`}
        onVersionHistory={handleVersionHistory}
        showVersionHistory={true}
      />
      {!isCollapsed && (
        <>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <DynamicFinancialSectionContent
              schema={schema}
              data={data}
              onDataChange={isLocked ? () => {} : handleDataChange}
              onSchemaChange={isLocked ? () => {} : handleSchemaChange}
              onSelectionChange={onSelectionChange}
              selectedItems={selectedItems}
              onEditRow={isLocked ? undefined : handleEditRow}
            />
          )}
        </>
      )}

      {/* Financial Program Wizard */}
      {schemaId === 'financial-program-config' && (
        <FinancialProgramWizard
          open={showWizard}
          onOpenChange={(open) => {
            setShowWizard(open);
            if (!open) {
              setEditData(null);
              setIsEditMode(false);
            }
          }}
          onComplete={handleWizardComplete}
          editData={editData}
          isEditMode={isEditMode}
        />
      )}

      {/* Version History Modal */}
      <TableVersionHistory
        open={showVersionHistory}
        onOpenChange={setShowVersionHistory}
        versions={versions}
        onRestore={handleRestoreVersion}
        canRestore={canRestore}
        isLoading={versionsLoading}
      />
    </div>
  );
};

export default DynamicFinancialSection;
