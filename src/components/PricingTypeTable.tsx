
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, Trash2, Copy } from "lucide-react";
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usePricingTypes, PricingType } from "@/hooks/usePricingTypes";

const PricingTypeTable = () => {
  const { pricingTypes, setPricingTypes } = usePricingTypes();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const data = pricingTypes;

  const handleSelectItem = (id: string) => {
    setSelectedItems((prev) => 
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === paginatedData.length) {
      setSelectedItems([]);
    } else {
      const allIds = paginatedData.map((item) => item.id);
      setSelectedItems(allIds);
    }
  };

  const handleEdit = (id: string) => {
    console.log(`Editing item with ID: ${id}`);
    toast.info(`Editing pricing type with ID: ${id}`);
    // Implement edit functionality
  };

  const handleCopy = (id: string) => {
    const itemToCopy = data.find(item => item.id === id);
    if (itemToCopy) {
      const newId = (data.length + 1).toString();
      const newItem = {
        ...itemToCopy,
        id: newId,
        typeCode: `${itemToCopy.typeCode}_COPY`,
      };
      setPricingTypes([...data, newItem]);
      toast.success(`Copied pricing type: ${itemToCopy.typeName}`);
    }
  };

  const handleDelete = (id: string) => {
    console.log(`Deleting item with ID: ${id}`);
    setPricingTypes(data.filter(item => item.id !== id));
    setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    toast.success(`Pricing type deleted successfully`);
  };

  // Paginate data
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-4">
      <div className="overflow-hidden border rounded-md">
        <Table className="min-w-full">
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="w-[50px] px-2">
                <Checkbox
                  checked={selectedItems.length === paginatedData.length && paginatedData.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Type Code</TableHead>
              <TableHead>Type Name</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item) => (
              <TableRow key={item.id} className="hover:bg-gray-50">
                <TableCell className="px-2">
                  <Checkbox
                    checked={selectedItems.includes(item.id)}
                    onCheckedChange={() => handleSelectItem(item.id)}
                  />
                </TableCell>
                <TableCell>{item.typeCode}</TableCell>
                <TableCell>{item.typeName}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleEdit(item.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleCopy(item.id)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} 
              />
            </PaginationItem>
            
            {Array.from({ length: totalPages }).map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink 
                  isActive={currentPage === index + 1} 
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"} 
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export { PricingTypeTable, type PricingType };
export default PricingTypeTable;

