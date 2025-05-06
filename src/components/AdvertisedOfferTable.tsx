
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

type AdvertisedOffer = {
  id: string;
  bulletinPricing: string;
  disclosure: string;
  loanAmountPer10k: string;
  totalCostOfCredit: string;
};

const initialData: AdvertisedOffer[] = [
  { id: "1", bulletinPricing: "BT001", disclosure: "Disclosure Text", loanAmountPer10k: "", totalCostOfCredit: "" },
  { id: "2", bulletinPricing: "BTKSA02", disclosure: "Disclosure Text", loanAmountPer10k: "", totalCostOfCredit: "" },
];

const AdvertisedOfferTable = () => {
  const [data] = useState<AdvertisedOffer[]>(initialData);
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
    // Implement edit functionality
  };

  const handleDelete = (id: string) => {
    console.log(`Deleting item with ID: ${id}`);
    // Implement delete functionality
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
            <TableHead>Bulletin Pricing</TableHead>
            <TableHead>Disclosure</TableHead>
            <TableHead>Loan Amount per $10000</TableHead>
            <TableHead>Loan Total Cost of Credit</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id} className="hover:bg-gray-50">
              <TableCell className="px-2">
                <Checkbox
                  checked={selectedItems.includes(item.id)}
                  onCheckedChange={() => handleSelectItem(item.id)}
                />
              </TableCell>
              <TableCell>{item.bulletinPricing}</TableCell>
              <TableCell>{item.disclosure}</TableCell>
              <TableCell>{item.loanAmountPer10k}</TableCell>
              <TableCell>{item.totalCostOfCredit}</TableCell>
              <TableCell className="space-x-2">
                <Button size="icon" variant="ghost" onClick={() => handleEdit(item.id)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => handleDelete(item.id)}>
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

export default AdvertisedOfferTable;
