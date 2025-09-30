
import { useState, useEffect } from "react";
import SectionHeader from "./SectionHeader";
import DynamicFinancialSectionContent from "./DynamicFinancialSectionContent";
import FinancialProgramWizard, { WizardData } from "./FinancialProgramWizard";
import TableVersionHistory from "@/components/version-management/TableVersionHistory";
import { useDynamicTableSchemas } from "@/hooks/useDynamicTableSchemas";
import { useDynamicFinancialData } from "@/hooks/useDynamicFinancialData";
import { useUndoRedo } from "@/hooks/useUndoRedo";
import { useTableVersions } from "@/hooks/useTableVersions";
import { useChangeTracking } from "@/hooks/useChangeTracking";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock } from "lucide-react";
import { FinancialProgramRecord } from "@/types/financialProgram";
import { supabase } from "@/integrations/supabase/client";
import * as XLSX from 'xlsx';
import { toast } from "sonner";
import { exportBulletinPricing } from "@/utils/bulletinPricingExport";
import BulletinPricingUploadModal from "../BulletinPricingUploadModal";
import FeeRulesUploadModal from "./FeeRulesUploadModal";
import TaxRulesUploadModal from "./TaxRulesUploadModal";
import DiscountRulesUploadModal from "./DiscountRulesUploadModal";
import { exportSelectedProgramsBulletinPricing } from "@/utils/selectedProgramsBulletinExport";
import { transformProgramDataForWizard } from "@/utils/financialProgramUtils";
import AddCreditProfileModal from "./AddCreditProfileModal";

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
  const [showFeeRulesUploadModal, setShowFeeRulesUploadModal] = useState(false);
  const [showTaxRulesUploadModal, setShowTaxRulesUploadModal] = useState(false);
  const [showDiscountRulesUploadModal, setShowDiscountRulesUploadModal] = useState(false);
  const [showCreditProfileModal, setShowCreditProfileModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  
  const { getSchema, getSyncSchema, updateSchema, loading: schemaLoading } = useDynamicTableSchemas();
  const { startTracking, updateTracking } = useChangeTracking();
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

  // Temporarily disable approval workflow to fix runtime error
  const isTableLocked = (schemaId: string) => false;

  // Load schema dynamically
  const [schema, setSchema] = useState(getSyncSchema(schemaId));
  
  // Initialize change tracking when data is loaded
  useEffect(() => {
    console.log('🔍 DynamicFinancialSection data from hook:', data);
    console.log('🔍 DynamicFinancialSection data length:', data?.length);
    console.log('🔍 DynamicFinancialSection loading:', loading);
    console.log('🔍 DynamicFinancialSection schemaId:', schemaId);
    if (data?.length > 0) {
      console.log('🔍 First item sample:', data[0]);
    }
    
    // Start change tracking when data is first loaded with correct primary key
    if (!loading && data && data.length >= 0 && schema) {
      console.log('🎯 Starting change tracking for schemaId:', schemaId);
      const primaryKey = schemaId === 'credit-profile' ? 'profile_id' : 'id';
      startTracking(schemaId, data, primaryKey);
    }
  }, [data, loading, schemaId, startTracking, schema]);
  
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
    console.log('🔄 useEffect for batch download callback running');
    console.log('🔄 SchemaId:', schemaId);
    console.log('🔄 Has callback:', !!onSetBatchDownloadBulletinPricingCallback);
    
    if (schemaId === 'financial-program-config' && onSetBatchDownloadBulletinPricingCallback) {
      onSetBatchDownloadBulletinPricingCallback(handleSelectedBulletinPricingDownload);
    }
  }, [schemaId, onSetBatchDownloadBulletinPricingCallback]);
  const { saveState, undo, redo, canUndo, canRedo } = useUndoRedo(data, schema || { id: '', name: '', columns: [] });
  
  // Update change tracking whenever data changes
  useEffect(() => {
    if (data && data.length >= 0 && !loading) {
      console.log('📊 Data changed, updating change tracking for:', schemaId);
      updateTracking(schemaId, data);
    }
  }, [data, schemaId, updateTracking, loading]);

  const handleDataChange = (newData: any) => {
    if (schema) {
      saveState(data, schema, 'data_change');
      // Auto-save version on significant changes
      saveVersion(newData, schema, 'Data modification');
    }
    setData(newData);
    // Change tracking will be updated by the useEffect above
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
    console.log('🚨 HANDLEADDNEWRECORD CALLED');
    console.log('🚨 Stack trace:', new Error().stack);
    console.log('🚨 Schema ID:', schemaId);
    console.log('🚨 Schema exists:', !!schema);
    
    // Use wizard for financial-program-config
    if (schemaId === 'financial-program-config') {
      setShowWizard(true);
    } 
    // Use modal for credit-profile
    else if (schemaId === 'credit-profile') {
      setShowCreditProfileModal(true);
    } 
    // Use generic add for other schemas
    else {
      if (schema) {
        saveState(data, schema, 'add_record');
        // Save version when adding new record
        const newData = [...data];
        saveVersion(newData, schema, 'Added new record');
      }
      console.log('🚨 About to call handleAddNew with schema:', schema);
      handleAddNew(schema);
    }
  };

  const handleAddRecordFromModal = (newRecord: any) => {
    console.log('📝 handleAddRecordFromModal called for schemaId:', schemaId);
    console.log('📝 New record:', newRecord);
    
    // Generate a temporary ID based on the primary key for the table
    const tempId = `temp_${Date.now()}`;
    
    // For credit profiles, use profile_id as the key
    const recordWithId = schemaId === 'credit-profile' 
      ? { ...newRecord, profile_id: newRecord.profile_id || tempId }
      : { ...newRecord, id: tempId };
    
    // Add to local state
    const newData = [...data, recordWithId];
    setData(newData);
    
    // Update change tracking with correct primary key
    console.log('📝 Updating change tracking for schemaId:', schemaId);
    const primaryKey = schemaId === 'credit-profile' ? 'profile_id' : 'id';
    
    // Force change tracking to recognize this as a new record
    updateTracking(schemaId, newData);
    
    // Save state for undo/redo
    if (schema) {
      saveState(data, schema, 'add_record_modal');
      saveVersion(newData, schema, 'Added new record via modal');
    }
    
    console.log('📝 Change tracking updated. New data length:', newData.length);
    toast.success('Record added. Submit for review to save changes.');
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
    } else if (schemaId === 'fee-rules') {
      setShowFeeRulesUploadModal(true);
    } else if (schemaId === 'tax-rules') {
      setShowTaxRulesUploadModal(true);
    } else if (schemaId === 'discount-rules') {
      setShowDiscountRulesUploadModal(true);
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
          .order('updatedAt', { ascending: false });

        if (error) {
          console.error('Error fetching fee rules:', error);
          toast.error('Failed to fetch fee rules data');
          return;
        }

        // Prepare data for Excel export with all available columns
        const exportData = feeRules?.map(rule => ({
          'Fee ID': rule._id,
          'Fee Name': rule.name,
          'Fee Type': rule.type,
          'Amount': rule.feeAmount,
          'Fee Active': rule.feeActive ? 'Yes' : 'No',
          'Fee Country': rule.feeCountry,
          'Fee Currency': rule.feeCurrency,
          'Fee State': rule.feeState,
          'Fee Taxable': rule.feeTaxable ? 'Yes' : 'No',
          'Category': rule.category,
          'Subcategory': rule.subcategory,
          'Description': rule.description,
          'Pay Type': rule.payType,
          'Provider': rule.provider,
          'Fee Range Type': rule.feeRangeType,
          'Fee Ranges': rule.feeRanges,
          'Fee Tax Rate': rule.feeTaxRate,
          'Capitalize Type': rule.capitalizeType,
          'Pricing Version': rule.pricingVersion,
          'Start Date': rule.startDate,
          'End Date': rule.endDate,
          'Self Reg': rule.selfReg ? 'Yes' : 'No',
          'Is Deleted': rule.isDeleted ? 'Yes' : 'No',
          'Is New Experience': rule.isNewExperience,
          'Vehicle Year - Applies To All': rule.vehicleYear_appliesToAll ? 'Yes' : 'No',
          'Vehicle Year Values': rule.vehicleYear_values ? JSON.stringify(rule.vehicleYear_values) : '',
          'Title Status - Applies To All': rule.titleStatus_appliesToAll ? 'Yes' : 'No',
          'Title Status Values': rule.titleStatus_values ? JSON.stringify(rule.titleStatus_values) : '',
          'Vehicle Model - Applies To All': rule.vehicleModel_appliesToAll ? 'Yes' : 'No',
          'Vehicle Model Values': rule.vehicleModel_values ? JSON.stringify(rule.vehicleModel_values) : '',
          'Purchase Type - Applies To All': rule.purchaseType_appliesToAll ? 'Yes' : 'No',
          'Purchase Type Values': rule.purchaseType_values ? JSON.stringify(rule.purchaseType_values) : '',
          'FR CA Translation': rule.frCaTranslation,
          'Migration': rule.migration,
          'Version': rule.__v,
          'Created By': rule.createdBy,
          'Updated By': rule.updatedBy,
          'Created At': rule.createdAt,
          'Updated At': rule.updatedAt ? new Date(rule.updatedAt).toLocaleDateString() : ''
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
      } else if (schemaId === 'tax-rules') {
        // Handle tax rules download
        const { data: taxRules, error } = await supabase
          .from('tax_rules')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching tax rules:', error);
          toast.error('Failed to fetch tax rules data');
          return;
        }

        // Prepare data for Excel export
        const exportData = taxRules?.map(rule => ({
          'Tax Name': rule.tax_name,
          'Tax Type': rule.tax_type,
          'Tax Rate': rule.rate,
          'Tax Active': rule.is_active ? 'Yes' : 'No',
          'Geo Code': rule.geo_code,
          'Created At': new Date(rule.created_at).toLocaleDateString()
        })) || [];

        // Create Excel workbook
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Tax Rules');

        // Auto-adjust column widths
        const maxWidth = exportData.reduce((w, r) => Math.max(w, Object.keys(r).length), 10);
        worksheet['!cols'] = Object.keys(exportData[0] || {}).map(() => ({ wch: maxWidth }));

        // Generate filename with current date
        const fileName = `tax_rules_${new Date().toISOString().split('T')[0]}.xlsx`;
        
        // Download the file
        XLSX.writeFile(workbook, fileName);
        toast.success(`Downloaded ${exportData.length} tax rules to ${fileName}`);
      } else if (schemaId === 'discount-rules') {
        // Handle discount rules download
        const { data: discountRules, error } = await supabase
          .from('discount_rules')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching discount rules:', error);
          toast.error('Failed to fetch discount rules data');
          return;
        }

        // Prepare data for Excel export
        const exportData = discountRules?.map(rule => ({
          'Discount Name': rule.name,
          'Discount Type': rule.type,
          'Discount Amount': rule.discountAmount,
          'Discount Active': rule.feeActive ? 'Yes' : 'No',
          'Discount State': rule.discount_geo,
          'Taxable': rule.discount_taxable ? 'Yes' : 'No',
          'Category': rule.category,
          'Subcategory': rule.subcategory,
          'Description': rule.description,
          'Start Date': rule.startDate,
          'End Date': rule.endDate,
          'Applicable Vehicle Years': rule.applicable_vehicle_year?.join(', ') || '',
          'Applicable Vehicle Models': rule.applicable_vehicle_model?.join(', ') || '',
          'Applicable Purchase Types': rule.applicable_purchase_type?.join(', ') || '',
          'Applicable Title Status': rule.applicable_title_status?.join(', ') || '',
          'Pay Type': rule.payType,
          'Created At': new Date(rule.created_at).toLocaleDateString()
        })) || [];

        // Create Excel workbook
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Discount Rules');

        // Auto-adjust column widths
        const maxWidth = exportData.reduce((w, r) => Math.max(w, Object.keys(r).length), 10);
        worksheet['!cols'] = Object.keys(exportData[0] || {}).map(() => ({ wch: maxWidth }));

        // Generate filename with current date
        const fileName = `discount_rules_${new Date().toISOString().split('T')[0]}.xlsx`;
        
        // Download the file
        XLSX.writeFile(workbook, fileName);
        toast.success(`Downloaded ${exportData.length} discount rules to ${fileName}`);
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
  const shouldShowUploadDownload = schemaId === 'fee-rules' || schemaId === 'tax-rules' || schemaId === 'discount-rules' || schemaId === 'bulletin-pricing' || schemaId === 'financial-program-config';

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

      {/* Fee Rules Upload Modal */}
      {schemaId === 'fee-rules' && (
        <FeeRulesUploadModal
          isOpen={showFeeRulesUploadModal}
          onClose={() => setShowFeeRulesUploadModal(false)}
          onUploadComplete={handleUploadComplete}
        />
      )}

      {/* Tax Rules Upload Modal */}
      {schemaId === 'tax-rules' && (
        <TaxRulesUploadModal
          isOpen={showTaxRulesUploadModal}
          onClose={() => setShowTaxRulesUploadModal(false)}
          onUploadComplete={handleUploadComplete}
        />
      )}

      {/* Discount Rules Upload Modal */}
      {schemaId === 'discount-rules' && (
        <DiscountRulesUploadModal
          isOpen={showDiscountRulesUploadModal}
          onClose={() => setShowDiscountRulesUploadModal(false)}
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
      
      {/* Credit Profile Modal */}
      <AddCreditProfileModal
        isOpen={showCreditProfileModal}
        onClose={() => setShowCreditProfileModal(false)}
        onAddRecord={handleAddRecordFromModal}
      />
    </div>
  );
};

export default DynamicFinancialSection;
