
import { useState } from "react";
import { Button } from "@/components/ui/button";
import FinancialProductsTable from "../FinancialProductsTable";
import SectionHeader from "./SectionHeader";
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
}

const FinancialProductsSection = ({ 
  title, 
  showAddModal = false, 
  setShowAddModal = () => {} 
}: FinancialProductsSectionProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [localShowAddModal, setLocalShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    productType: "",
    description: ""
  });
  
  // Use either the prop or local state
  const effectiveShowAddModal = showAddModal || localShowAddModal;
  const effectiveSetShowAddModal = (show: boolean) => {
    setShowAddModal(show);
    setLocalShowAddModal(show);
  };
  
  const handleAddClick = () => {
    effectiveSetShowAddModal(true);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`New financial product added: ${newProduct.name}`);
    setNewProduct({ name: "", productType: "", description: "" });
    effectiveSetShowAddModal(false);
  };
  
  const handleEditClick = (id: string) => {
    console.log(`Edit financial product ${id} clicked`);
    toast.info(`Edit financial product ${id} functionality implemented`);
  };
  
  const handleCopyClick = (id: string) => {
    console.log(`Copy financial product ${id} clicked`);
    toast.success(`Financial product ${id} has been copied`);
  };
  
  const handleRemoveClick = (id: string) => {
    console.log(`Remove financial product ${id} clicked`);
    toast.success(`Financial product ${id} has been removed`);
  };
  
  return (
    <div className="p-6">
      <SectionHeader 
        title={title.replace(" Rules", "")} 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed}
      >
        <Button onClick={handleAddClick}>Add New Record</Button>
      </SectionHeader>
      
      {!isCollapsed && (
        <FinancialProductsTable 
          onEdit={handleEditClick}
          onCopy={handleCopyClick}
          onRemove={handleRemoveClick}
        />
      )}
      
      <Dialog open={effectiveShowAddModal} onOpenChange={effectiveSetShowAddModal}>
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
    </div>
  );
};

export default FinancialProductsSection;
