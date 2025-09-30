
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
import { Edit, Trash2, Copy, Save, X } from "lucide-react";
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
import { Input } from "@/components/ui/input";

const PricingTypeTable = () => {
  const { pricingTypes, setPricingTypes } = usePricingTypes();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Inline editing state
  const [editingCell, setEditingCell] = useState<{
    rowId: string;
    field: keyof PricingType;
  } | null>(null);
  const [editValue, setEditValue] = useState<string>("");

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

  // Inline editing logic
  const handleCellClick = (
    rowId: string, 
    field: keyof PricingType, 
    value: string
  ) => {
    setEditingCell({ rowId, field });
    setEditValue(value);
  };
  const handleCellSave = () => {
    if (!editingCell) return;
    const { rowId, field } = editingCell;
    setPricingTypes(prev =>
      prev.map((item) =>
        item.id === rowId ? { ...item, [field]: editValue } : item
      )
    );
    setEditingCell(null);
    setEditValue("");
    toast.success("Cell updated successfully");
  };
  const handleCellCancel = () => {
    setEditingCell(null);
    setEditValue("");
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
              <TableHead>Lender Specific</TableHead>
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
                {/* Inline editable Type Code */}
                <TableCell
                  onClick={() =>
                    !editingCell &&
                    handleCellClick(item.id, "typeCode", item.typeCode)
                  }
                  className={`${
                    editingCell &&
                    editingCell.rowId === item.id &&
                    editingCell.field === "typeCode"
                      ? "bg-blue-50"
                      : "cursor-pointer"
                  }`}
                  style={{ minWidth: 100 }}
                >
                  {editingCell &&
                  editingCell.rowId === item.id &&
                  editingCell.field === "typeCode" ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                        className="w-32"
                        autoFocus
                        maxLength={24}
                      />
                      <Button size="sm" onClick={handleCellSave}>
                        <Save className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCellCancel}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <span>{item.typeCode}</span>
                  )}
                </TableCell>
                {/* Inline editable Type Name */}
                <TableCell
                  onClick={() =>
                    !editingCell &&
                    handleCellClick(item.id, "typeName", item.typeName)
                  }
                  className={`${
                    editingCell &&
                    editingCell.rowId === item.id &&
                    editingCell.field === "typeName"
                      ? "bg-blue-50"
                      : "cursor-pointer"
                  }`}
                  style={{ minWidth: 120 }}
                >
                  {editingCell &&
                  editingCell.rowId === item.id &&
                  editingCell.field === "typeName" ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                        className="w-32"
                        autoFocus
                        maxLength={48}
                      />
                      <Button size="sm" onClick={handleCellSave}>
                        <Save className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCellCancel}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <span>{item.typeName}</span>
                  )}
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={item.isLenderSpecific}
                    onCheckedChange={(checked) => {
                      setPricingTypes(prev =>
                        prev.map((p) =>
                          p.id === item.id ? { ...p, isLenderSpecific: checked as boolean } : p
                        )
                      );
                    }}
                  />
                </TableCell>
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

