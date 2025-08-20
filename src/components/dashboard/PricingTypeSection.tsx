
import { Button } from "@/components/ui/button";
import PricingTypeTable from "../PricingTypeTable";
import SectionHeader from "./SectionHeader";
import AddPricingTypeModal from "../AddPricingTypeModal";
import TableVersionHistory from "@/components/version-management/TableVersionHistory";
import { useTableVersions } from "@/hooks/useTableVersions";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface PricingTypeSectionProps {
  title: string;
  showAddModal?: boolean;
  setShowAddModal?: (open: boolean) => void;
  onSelectionChange?: (items: string[]) => void;
  selectedItems?: string[];
}

const PricingTypeSection = ({ 
  title, 
  showAddModal: externalShowAddModal, 
  setShowAddModal: externalSetShowAddModal,
  onSelectionChange,
  selectedItems = []
}: PricingTypeSectionProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [internalShowAddModal, setInternalShowAddModal] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  
  // Version management for pricing types
  const {
    versions,
    isLoading: versionsLoading,
    saveVersion,
    loadVersions,
    restoreVersion,
    canRestore,
    persistVersions
  } = useTableVersions('pricing-types');

  useEffect(() => {
    loadVersions();
  }, [loadVersions]);

  useEffect(() => {
    if (versions.length > 0) {
      persistVersions(versions);
    }
  }, [versions, persistVersions]);
  
  // Use either the external state (if provided) or the internal state
  const showAddModal = externalShowAddModal !== undefined ? externalShowAddModal : internalShowAddModal;
  const setShowAddModal = externalSetShowAddModal || setInternalShowAddModal;

  const handleVersionHistory = () => {
    setShowVersionHistory(true);
  };

  const handleRestoreVersion = async (versionId: string) => {
    const restoredData = await restoreVersion(versionId);
    if (restoredData) {
      toast.success('Table restored to selected version');
      setShowVersionHistory(false);
    }
  };
  
  return (
    <div className="p-6">
      <SectionHeader 
        title={title} 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed}
        onVersionHistory={handleVersionHistory}
        showVersionHistory={true}
      >
        <Button onClick={() => setShowAddModal(true)}>Add New Record</Button>
      </SectionHeader>
      
      {!isCollapsed && <PricingTypeTable />}
      
      <AddPricingTypeModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onAddPricingType={(typeCode, typeName) => {
          // The actual add functionality is handled inside the PricingTypeTable component
          // This is just a pass-through
          const tableElement = document.querySelector('table');
          if (tableElement) {
            const event = new CustomEvent('addPricingType', { 
              detail: { typeCode, typeName } 
            });
            tableElement.dispatchEvent(event);
          }
          
          // Save version when adding new pricing type
          const mockData = [{ id: Date.now(), typeCode, typeName }];
          const mockSchema = { id: 'pricing-types', name: 'Pricing Types', columns: [] };
          saveVersion(mockData, mockSchema, `Added new pricing type: ${typeName}`);
          
          toast.success(`New pricing type "${typeName}" created`);
        }}
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

export default PricingTypeSection;
