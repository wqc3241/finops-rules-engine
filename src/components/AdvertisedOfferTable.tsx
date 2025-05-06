
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

type AdvertisedOffer = {
  id: string;
  bulletinPricing: string;
  disclosure: string;
  loanAmountPer10k: string;
  totalCostOfCredit: string;
};

const initialData: AdvertisedOffer[] = [
  { 
    id: "1", 
    bulletinPricing: "BT001", 
    disclosure: "Disclosure Text", 
    loanAmountPer10k: "$186.43/month", 
    totalCostOfCredit: "$1,345.80" 
  },
  { 
    id: "2", 
    bulletinPricing: "BTKSA02", 
    disclosure: "Disclosure Text", 
    loanAmountPer10k: "$194.15/month", 
    totalCostOfCredit: "$1,649.00" 
  },
];

const AdvertisedOfferTable = () => {
  const [data, setData] = useState<AdvertisedOffer[]>(initialData);
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
    toast.info(`Editing advertised offer with ID: ${id}`);
    // Implement edit functionality
  };

  const handleCopy = (id: string) => {
    const itemToCopy = data.find(item => item.id === id);
    if (itemToCopy) {
      const newId = String(data.length + 1);
      const newItem = {
        ...itemToCopy,
        id: newId,
        bulletinPricing: `${itemToCopy.bulletinPricing}_COPY`,
      };
      setData([...data, newItem]);
      toast.success(`Copied advertised offer for: ${itemToCopy.bulletinPricing}`);
    }
  };

  const handleDelete = (id: string) => {
    console.log(`Deleting item with ID: ${id}`);
    toast.success(`Advertised offer deleted successfully`);
    // Here you would delete the item and update state
    setData(data.filter(item => item.id !== id));
    setSelectedItems(selectedItems.filter(item => item !== id));
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
                <Button size="icon" variant="ghost" onClick={() => handleCopy(item.id)}>
                  <Copy className="h-4 w-4" />
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
