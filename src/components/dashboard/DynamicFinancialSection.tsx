
import { useState, useEffect } from "react";
import SectionHeader from "./SectionHeader";
import DynamicFinancialSectionContent from "./DynamicFinancialSectionContent";
import FinancialProgramWizard, { WizardData } from "./FinancialProgramWizard";
import TableVersionHistory from "@/components/version-management/TableVersionHistory";
import { useDynamicTableSchemas } from "@/hooks/useDynamicTableSchemas";
import { useDynamicFinancialData } from "@/hooks/useDynamicFinancialData";
import { useUndoRedo } from "@/hooks/useUndoRedo";
import { useTableVersions } from "@/hooks/useTableVersions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock } from "lucide-react";
import { FinancialProgramRecord } from "@/types/financialProgram";
import { supabase } from "@/integrations/supabase/client";
import * as XLSX from 'xlsx';
import { toast } from "sonner";
import { exportBulletinPricing } from "@/utils/bulletinPricingExport";
import BulletinPricingUploadModal from "../BulletinPricingUploadModal";
import { exportSelectedProgramsBulletinPricing } from "@/utils/selectedProgramsBulletinExport";
import { transformProgramDataForWizard } from "@/utils/financialProgramUtils";

interface DynamicFinancialSectionProps {
  schemaId: string;
  title: string;
  onSelectionChange?: (items: string[], schemaId: string) => void;
  selectedItems?: string[];
  onSetBatchDeleteCallback?: (callback: () => void) => void;
  onSetBatchDuplicateCallback?: (callback: () => void) => void;
  onSetBatchDownloadBulletinPricingCallback?: (callback: () => void) => void;
}

const DynamicFinancialSection = ({ 
  schemaId,
  title,
  onSelectionChange,
  selectedItems = [],
  onSetBatchDeleteCallback,
  onSetBatchDuplicateCallback,
  onSetBatchDownloadBulletinPricingCallback
}: DynamicFinancialSectionProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  
  const { getSchema, getSyncSchema, updateSchema, loading: schemaLoading } = useDynamicTableSchemas();
const { 
  data, 
  setData, 
  handleAddNew, 
  loading, 
  isLocked,
  totalCount,
  updateCell 
} = useDynamicFinancialData({
  schemaId,
  selectedItems,
  onSelectionChange,
  onSetBatchDeleteCallback,
  onSetBatchDuplicateCallback,
  currentPage,
  pageSize
});

// Debug logging for data loading (moved to useEffect to prevent render loops)
useEffect(() => {
  console.log('🔍 DynamicFinancialSection data from hook:', data);
  console.log('🔍 DynamicFinancialSection data length:', data?.length);
  console.log('🔍 DynamicFinancialSection loading:', loading);
  console.log('🔍 DynamicFinancialSection schemaId:', schemaId);
  if (data?.length > 0) {
    console.log('🔍 First item sample:', data[0]);
  }
}, [data, loading, schemaId]);

  // Temporarily disable approval workflow to fix runtime error
  const isTableLocked = (schemaId: string) => false;

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

  // Set up batch download callback for financial-program-config
  useEffect(() => {
    if (schemaId === 'financial-program-config' && onSetBatchDownloadBulletinPricingCallback) {
      onSetBatchDownloadBulletinPricingCallback(handleSelectedBulletinPricingDownload);
    }
  }, [schemaId, onSetBatchDownloadBulletinPricingCallback, selectedItems, data]);
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

  const handleWizardComplete = (programData: FinancialProgramRecord[]) => {
    // programData is now an array of created database records
    if (isEditMode && editData) {
      // Edit mode - update existing record (not implemented for multi-select)
      toast.error("Edit mode not supported for multi-select programs yet");
      return;
    } else {
      // Create new records - convert database records to display format
      const newRecords = programData.map((dbRecord, index) => ({
        id: `FPC${Date.now()}_${index}`,
        programCode: dbRecord.program_code || "",
        cloneFrom: null,
        priority: 1,
        financialProductId: dbRecord.financial_product_id || "",
        productType: null,
        vehicleStyleId: dbRecord.vehicle_style_id,
        financingVehicleCondition: dbRecord.financing_vehicle_condition,
        programStartDate: new Date(dbRecord.program_start_date).toLocaleDateString(),
        programEndDate: new Date(dbRecord.program_end_date).toLocaleDateString(),
        isActive: dbRecord.is_active === 'Active',
        orderTypes: "INV, CON",
        version: dbRecord.version || 1
      }));

      // Save state for undo/redo
      if (schema) {
        saveState(data, schema, 'wizard_create');
      }

      // Add the new records to the data
      const newData = [...data, ...newRecords];
      setData(newData);
      
      // Save version for wizard completion
      if (schema) {
        saveVersion(newData, schema, `${newRecords.length} financial program${newRecords.length > 1 ? 's' : ''} created via wizard`);
      }
      
      toast.success(`${newRecords.length} financial program${newRecords.length > 1 ? 's' : ''} created successfully`);
      console.log('Financial programs created:', newRecords);
    }
    
    // Reset wizard state
    setEditData(null);
    setIsEditMode(false);
  };

  const handleEditRow = (rowId: string, rowData: any) => {
    console.log('🔧 DynamicFinancialSection handleEditRow called');
    console.log('🔧 rowId:', rowId);
    console.log('🔧 rowData:', rowData);
    console.log('🔧 rowData template_metadata:', rowData?.template_metadata);
    
    if (schemaId === 'financial-program-config') {
      console.log('🔧 Transforming rowData to wizard format');
      const transformedData = transformProgramDataForWizard(rowData);
      console.log('🔧 Transformed data for wizard:', transformedData);
      
      setEditData(transformedData);
      setIsEditMode(true);
      setShowWizard(true);
    }
  };

  const handleUpload = () => {
    if (schemaId === 'financial-program-config') {
      setShowUploadModal(true);
    } else {
      console.log(`Upload ${title} clicked`);
      toast.success(`Upload ${title} functionality will be implemented`);
    }
  };
  
  const handleUploadComplete = () => {
    toast.success("Upload completed successfully!");
    // Refresh the table data if needed
  };

  const handleDownload = async () => {
    try {
      console.log(`Download ${title} clicked`);
      
      if (schemaId === 'financial-program-config') {
        if (selectedItems.length === 0) {
          toast.error("Please select at least one financial program to download");
          return;
        }

        // Get the program codes from the selected items
        const selectedPrograms = selectedItems.map(id => {
          const item = data.find((d: any) => d.id === id);
          return item?.programCode || item?.program_code;
        }).filter(Boolean);

        if (selectedPrograms.length === 0) {
          toast.error("No valid financial programs selected");
          return;
        }

        try {
          toast.info("Exporting bulletin pricing...");
          const result = await exportBulletinPricing(selectedPrograms);
          toast.success(`Export complete! Generated ${result.fileCount} file(s).`);
        } catch (error: any) {
          console.error('Selected bulletin pricing export failed (primary):', error);
          const msg = typeof error?.message === 'string' ? error.message : '';
          if (msg.includes('No bulletin pricing data')) {
            // Fallback: create data + template workbook for the selection
            toast.info("No pricing data found for selection. Generating templates...");
            await exportSelectedProgramsBulletinPricing(selectedPrograms);
            toast.success("Template export complete.");
          } else {
            toast.error("Export failed. Please try again.");
          }
        }
        return;
      }
      
      if (schemaId === 'fee-rules') {
        // ... keep existing fee-rules code
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

  // Handle download for selected bulletin pricing
  const handleSelectedBulletinPricingDownload = async () => {
    // Get program codes from selected items (assuming selectedItems contains row IDs)
    const selectedProgramCodes = selectedItems
      .map(itemId => {
        const row = data.find((d: any) => d.id === itemId);
        return row?.programCode || row?.program_code;
      })
      .filter(Boolean) as string[];

    if (selectedProgramCodes.length === 0) {
      toast.error("No valid program codes found in selection");
      return;
    }

    try {
      toast.info("Exporting bulletin pricing...");
      const result = await exportBulletinPricing(selectedProgramCodes);
      toast.success(`Export complete! Generated ${result.fileCount} file(s).`);
    } catch (error: any) {
      console.error('Selected bulletin pricing export failed (primary):', error);
      const msg = typeof error?.message === 'string' ? error.message : '';
      if (msg.includes('No bulletin pricing data')) {
        // Fallback: create data + template workbook for the selection
        toast.info("No pricing data found for selection. Generating templates...");
        await exportSelectedProgramsBulletinPricing(selectedProgramCodes);
        toast.success("Template export complete.");
      } else {
        toast.error("Export failed. Please try again.");
      }
    }
  };

  // Determine if this section should have upload/download buttons
  const shouldShowUploadDownload = schemaId === 'fee-rules' || schemaId === 'tax-rules' || schemaId === 'bulletin-pricing' || schemaId === 'financial-program-config';

  const handlePageChange = (page: number, newPageSize: number) => {
    setCurrentPage(page);
    setPageSize(newPageSize);
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
        uploadLabel={schemaId === 'financial-program-config' ? 'Upload Bulletin Pricing' : `Upload ${title}`}
        downloadLabel={schemaId === 'financial-program-config' ? 'Download Bulletin Pricing' : `Download ${title}`}
        downloadDisabled={schemaId === 'financial-program-config' && selectedItems.length === 0}
        selectedItems={selectedItems}
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
              onSelectionChange={onSelectionChange ? (items: string[]) => onSelectionChange(items, schemaId) : undefined}
              selectedItems={selectedItems}
              onEditRow={isLocked ? undefined : handleEditRow}
              onSaveCell={isLocked ? undefined : updateCell}
              totalCount={totalCount}
              pageSize={pageSize}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}

      {/* Bulletin Pricing Upload Modal for Financial Program Config */}
      {schemaId === 'financial-program-config' && (
        <BulletinPricingUploadModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          onUploadComplete={handleUploadComplete}
        />
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
