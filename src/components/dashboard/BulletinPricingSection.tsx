
import { useState, useEffect } from "react";
import DynamicFinancialSectionContent from "./DynamicFinancialSectionContent";
import SectionHeader from "./SectionHeader";
import BulletinPricingUploadModal from "../BulletinPricingUploadModal";
import TableVersionHistory from "@/components/version-management/TableVersionHistory";
import { useDynamicTableSchemas } from "@/hooks/useDynamicTableSchemas";
import { useDynamicFinancialData } from "@/hooks/useDynamicFinancialData";
import { useUndoRedo } from "@/hooks/useUndoRedo";
import { useTableVersions } from "@/hooks/useTableVersions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import { exportBulletinPricing } from "@/utils/bulletinPricingExport";

interface BulletinPricingSectionProps {
  title: string;
  showAddModal: boolean;
  setShowAddModal: (show: boolean) => void;
  onSelectionChange?: (items: string[]) => void;
  selectedItems?: string[];
  onSetBatchDeleteCallback?: (callback: () => void) => void;
}

const BulletinPricingSection = ({ 
  title, 
  showAddModal, 
  setShowAddModal,
  onSelectionChange,
  selectedItems = [],
  onSetBatchDeleteCallback
}: BulletinPricingSectionProps) => {
  const schemaId = 'bulletin-pricing';
  
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  
  const { getSchema, getSyncSchema, updateSchema, loading: schemaLoading } = useDynamicTableSchemas();
  const { 
    data, 
    setData, 
    handleAddNew, 
    loading, 
    isLocked,
    totalCount 
  } = useDynamicFinancialData({
    schemaId,
    selectedItems,
    onSelectionChange,
    onSetBatchDeleteCallback,
    currentPage,
    pageSize
  });

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

  const { saveState, undo, redo, canUndo, canRedo } = useUndoRedo(data, schema || { id: '', name: '', columns: [] });
  
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

  const handleAddNewModal = () => {
    setShowAddModal(true);
  };

  const handleAddNewRecord = () => {
    if (schema) {
      saveState(data, schema, 'add_record');
      // Save version when adding new record
      const newData = [...data];
      saveVersion(newData, schema, 'Added new record');
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

  const handlePageChange = (page: number, newPageSize: number) => {
    setCurrentPage(page);
    setPageSize(newPageSize);
  };

  const handleDownload = async () => {
    try {
      toast.info("Exporting bulletin pricing...");
      const result = await exportBulletinPricing();
      toast.success(`Export complete! Generated ${result.fileCount} file(s).`);
    } catch (error) {
      console.error('Export failed:', error);
      toast.error("Export failed. Please try again.");
    }
  };

  const handleUpload = () => {
    setShowUploadModal(true);
  };

  const handleUploadComplete = () => {
    toast.success("Upload completed successfully!");
    // Refresh the table data if needed
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
        onAddNew={isLocked ? undefined : handleAddNewModal}
        onUndo={isLocked ? undefined : handleUndo}
        onRedo={isLocked ? undefined : handleRedo}
        canUndo={canUndo && !isLocked}
        canRedo={canRedo && !isLocked}
        onUpload={!isLocked ? handleUpload : undefined}
        onDownload={handleDownload}
        uploadLabel="Upload Bulletin Pricing"
        downloadLabel="Download Bulletin Pricing"
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
              totalCount={totalCount}
              pageSize={pageSize}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
      
      <BulletinPricingUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUploadComplete={handleUploadComplete}
      />

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

export default BulletinPricingSection;
