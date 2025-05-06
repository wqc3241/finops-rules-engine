
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
import { Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

type PricingType = {
  id: string;
  typeCode: string;
  typeName: string;
};

const initialData: PricingType[] = [
  { id: "1", typeCode: "STDAPR", typeName: "Standard APR" },
  { id: "2", typeCode: "SUBAPR", typeName: "Subvented APR" },
  { id: "3", typeCode: "MINDWPAY", typeName: "Min Down Payment" },
  { id: "4", typeCode: "STDRV", typeName: "Standard RV%" },
  { id: "5", typeCode: "ENHRV", typeName: "Enhanced RV%" },
  { id: "6", typeCode: "STDMF", typeName: "Standard MF" },
  { id: "7", typeCode: "SUBMF", typeName: "Subvented MF" },
  { id: "8", typeCode: "MILFEE", typeName: "Per Mile fee over Alloted" },
  { id: "9", typeCode: "MAXMUAPR", typeName: "Max Markup APR" },
  { id: "10", typeCode: "MAXBDAPR", typeName: "Max Buydown APR" },
  { id: "11", typeCode: "STDBP", typeName: "Standard Balloon %" },
  { id: "12", typeCode: "STDDP", typeName: "Standard Downpayment %" },
  { id: "13", typeCode: "ADF", typeName: "AdminFee" },
  { id: "14", typeCode: "INR", typeName: "Insurance rate" },
  { id: "15", typeCode: "PAPR", typeName: "Payroll APR" },
  { id: "16", typeCode: "NPAPR", typeName: "Non-Payroll APR" },
];

const PricingTypeTable = () => {
  const [data] = useState<PricingType[]>(initialData);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleSelectItem = (id: string) => {
    setSelectedItems((prev) => 
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === data.length) {
      setSelectedItems([]);
    } else {
      const allIds = data.map((item) => item.id);
      setSelectedItems(allIds);
    }
  };

  const handleEdit = (id: string) => {
    console.log(`Editing item with ID: ${id}`);
    toast.info(`Editing pricing type with ID: ${id}`);
    // Implement edit functionality
  };

  const handleDelete = (id: string) => {
    console.log(`Deleting item with ID: ${id}`);
    toast.success(`Pricing type deleted successfully`);
    // Implement delete functionality
  };

  const getRowStyle = (typeName: string) => {
    // Highlight rows with "Min Down Payment" and "Per Mile fee over Alloted"
    if (
      typeName === "Min Down Payment" || 
      typeName === "Per Mile fee over Alloted"
    ) {
      return "bg-yellow-100";
    }
    return "";
  };

  return (
    <div className="overflow-hidden border rounded-md">
      <Table className="min-w-full">
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead className="w-[50px] px-2">
              <Checkbox
                checked={selectedItems.length === data.length && data.length > 0}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>Type Code</TableHead>
            <TableHead>Type Name</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow
              key={item.id}
              className={`hover:bg-gray-50 ${getRowStyle(item.typeName)}`}
            >
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
  );
};

export default PricingTypeTable;
