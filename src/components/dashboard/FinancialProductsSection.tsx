
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import FinancialProductsTable from "./FinancialProductsTable";
import SectionHeader from "./SectionHeader";
import TableVersionHistory from "@/components/version-management/TableVersionHistory";
import { useTableVersions } from "@/hooks/useTableVersions";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FinancialProductsSectionProps {
  title: string;
  showAddModal?: boolean;
  setShowAddModal?: (show: boolean) => void;
  onSelectionChange?: (items: string[]) => void;
  selectedItems?: string[];
}

const FinancialProductsSection = ({
  title,
  showAddModal: externalShowAddModal,
  setShowAddModal: externalSetShowAddModal,
  onSelectionChange,
  selectedItems = []
}: FinancialProductsSectionProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [internalShowAddModal, setInternalShowAddModal] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    productType: "",
    description: ""
  });

  // Version management for financial products
  const {
    versions,
    isLoading: versionsLoading,
    saveVersion,
    loadVersions,
    restoreVersion,
    canRestore,
    persistVersions
  } = useTableVersions('financial-products');

  useEffect(() => {
    loadVersions();
  }, [loadVersions]);

  useEffect(() => {
    if (versions.length > 0) {
      persistVersions(versions);
    }
  }, [versions, persistVersions]);

  // Use either external state (if provided) or internal state
  const showAddModal = externalShowAddModal !== undefined ? externalShowAddModal : internalShowAddModal;
  const setShowAddModal = externalSetShowAddModal || setInternalShowAddModal;

  const handleAddClick = () => {
    setShowAddModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`New financial product added: ${newProduct.name}`);
    
    // Save version when adding new product
    const mockData = [{ id: Date.now(), ...newProduct }];
    const mockSchema = { id: 'financial-products', name: 'Financial Products', columns: [] };
    saveVersion(mockData, mockSchema, `Added new product: ${newProduct.name}`);
    
    setNewProduct({ name: "", productType: "", description: "" });
    setShowAddModal(false);
  };

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
  
  const handleEditClick = (id: string) => {
    toast.info(`Editing financial product: ${id}`);
  };
  
  const handleCopyClick = (id: string) => {
    toast.info(`Copying financial product: ${id}`);
  };
  
  const handleRemoveClick = (id: string) => {
    toast.info(`Removing financial product: ${id}`);
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
        <Button onClick={handleAddClick}>Add New Record</Button>
      </SectionHeader>

      {!isCollapsed && (
        <FinancialProductsTable 
          onEdit={handleEditClick}
          onCopy={handleCopyClick}
          onRemove={handleRemoveClick}
          onSelectionChange={onSelectionChange}
          selectedItems={selectedItems}
        />
      )}

      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Financial Product</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input
                  id="name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="productType" className="text-right">Product Type</Label>
                <Input
                  id="productType"
                  value={newProduct.productType}
                  onChange={(e) => setNewProduct({...newProduct, productType: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Input
                  id="description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Add Product</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

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

export default FinancialProductsSection;
