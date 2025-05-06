
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface FinancialProduct {
  id: string;
  productType: string;
  productSubtype: string | null;
  geoCode: string;
  category: string;
  isActive: boolean;
}

const initialFinancialProducts: FinancialProduct[] = [
  {
    id: "USLN",
    productType: "Loan",
    productSubtype: null,
    geoCode: "NA-US",
    category: "Personal",
    isActive: true
  },
  {
    id: "USLE",
    productType: "Lease",
    productSubtype: null,
    geoCode: "NA-US",
    category: "Personal",
    isActive: true
  },
  {
    id: "DEL",
    productType: "Loan",
    productSubtype: null,
    geoCode: "EU-DE",
    category: "Personal",
    isActive: true
  },
  {
    id: "DELC",
    productType: "Loan",
    productSubtype: null,
    geoCode: "EU-DE",
    category: "Commercial",
    isActive: true
  },
  {
    id: "",
    productType: "Lease",
    productSubtype: "Full service",
    geoCode: "EU-DE",
    category: "Personal",
    isActive: true
  },
  {
    id: "",
    productType: "Lease",
    productSubtype: "Operating",
    geoCode: "EU-DE",
    category: "Personal",
    isActive: true
  },
  {
    id: "KSABM",
    productType: "Balloon",
    productSubtype: "Monthly",
    geoCode: "ME-KSA",
    category: "Personal",
    isActive: true
  },
  {
    id: "KSABA",
    productType: "Balloon",
    productSubtype: "Annual",
    geoCode: "ME-KSA",
    category: "Personal",
    isActive: true
  }
];

const FinancialProductsTable = () => {
  const [products, setProducts] = useState<FinancialProduct[]>(initialFinancialProducts);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const toggleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      // Only select products with non-empty IDs
      setSelectedProducts(products.filter(product => product.id).map(product => product.id));
    }
  };

  const toggleSelectProduct = (id: string) => {
    if (!id) return; // Skip products with empty IDs
    
    setSelectedProducts(current =>
      current.includes(id) ? current.filter(productId => productId !== id) : [...current, id]
    );
  };

  const handleDeleteClick = (id: string) => {
    if (!id) return; // Skip products with empty IDs
    
    setProductToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      setProducts(current => current.filter(product => product.id !== productToDelete));
      setSelectedProducts(current => current.filter(id => id !== productToDelete));
      toast.success("Financial product deleted");
    }
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const handleEditClick = (id: string) => {
    if (!id) return; // Skip products with empty IDs
    
    // This would open an edit modal in a real implementation
    toast.info(`Editing product ${id} - functionality to be implemented`);
  };

  return (
    <div className="table-container">
      <Table>
        <TableHeader className="sticky-header">
          <TableRow>
            <TableHead className="w-10">
              <Checkbox 
                checked={selectedProducts.length === products.filter(p => p.id).length && products.filter(p => p.id).length > 0} 
                onCheckedChange={toggleSelectAll}
                aria-label="Select all"
              />
            </TableHead>
            <TableHead>Product ID</TableHead>
            <TableHead>Product Type</TableHead>
            <TableHead>Product Subtype</TableHead>
            <TableHead>Geo Code</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product, index) => (
            <TableRow key={`${product.id || index}`} className="hover:bg-gray-50">
              <TableCell>
                {product.id && (
                  <Checkbox 
                    checked={selectedProducts.includes(product.id)}
                    onCheckedChange={() => toggleSelectProduct(product.id)}
                    aria-label={`Select product ${product.id}`}
                  />
                )}
              </TableCell>
              <TableCell>{product.id}</TableCell>
              <TableCell>{product.productType}</TableCell>
              <TableCell>{product.productSubtype || ""}</TableCell>
              <TableCell>{product.geoCode}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>{product.isActive ? "Active" : "Inactive"}</TableCell>
              <TableCell className="text-right space-x-2">
                {product.id && (
                  <>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleEditClick(product.id)}
                      className="h-8 w-8"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDeleteClick(product.id)}
                      className="h-8 w-8 text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Financial Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this financial product? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FinancialProductsTable;
