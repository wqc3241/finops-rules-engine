
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Copy, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BulletinPrice {
  id: string;
  financialProgramCode: string;
  programId: string;
  pricingConfig: string;
  geoCode: string;
  lenderName: string;
  advertised: string;
  pricingType: string;
  bulletinId: string;
  pricingValue: number;
  uploadDate: string;
}

interface BulletinPricingTableProps {
  onEdit: (id: string) => void;
  onCopy: (id: string) => void;
  onRemove: (id: string) => void;
  onSelectionChange?: (items: string[]) => void;
  selectedItems?: string[];
}

const sampleBulletinPrices: BulletinPrice[] = [
  {
    id: "1",
    financialProgramCode: "KSAAIBM05251",
    programId: "FPKSA01",
    pricingConfig: "PR003",
    geoCode: "ME-KSA",
    lenderName: "KSAAJB",
    advertised: "No",
    pricingType: "INR",
    bulletinId: "BTKSA01",
    pricingValue: 0.0300,
    uploadDate: "2023-05-15"
  },
  {
    id: "2",
    financialProgramCode: "KSAAIBM05251",
    programId: "FPKSA01",
    pricingConfig: "PR003",
    geoCode: "ME-KSA",
    lenderName: "KSAAJB",
    advertised: "No",
    pricingType: "SPR",
    bulletinId: "BTKSA01",
    pricingValue: 0.0295,
    uploadDate: "2023-05-15"
  },
  {
    id: "3",
    financialProgramCode: "KSAAIBM05251",
    programId: "FPKSA01",
    pricingConfig: "PR003",
    geoCode: "ME-KSA",
    lenderName: "KSAAJB",
    advertised: "No",
    pricingType: "DEPCR",
    bulletinId: "BTKSA01",
    pricingValue: 0.1500,
    uploadDate: "2023-05-15"
  },
  {
    id: "4",
    financialProgramCode: "KSAAIBM05251",
    programId: "FPKSA01",
    pricingConfig: "PR007",
    geoCode: "ME-KSA",
    lenderName: "KSAAJB",
    advertised: "No",
    pricingType: "INR",
    bulletinId: "BTKSA01",
    pricingValue: 0.0300,
    uploadDate: "2023-05-15"
  },
  {
    id: "5",
    financialProgramCode: "KSAAIBA50500251",
    programId: "FPKSA02",
    pricingConfig: "PR004",
    geoCode: "ME-KSA",
    lenderName: "KSAAJB",
    advertised: "No",
    pricingType: "ADF",
    bulletinId: "BTKSA01",
    pricingValue: 3000.0000,
    uploadDate: "2023-05-15"
  }
];

const BulletinPricingTable = ({ 
  onEdit, 
  onCopy, 
  onRemove, 
  onSelectionChange,
  selectedItems = []
}: BulletinPricingTableProps) => {
  const [bulletinPrices] = useState<BulletinPrice[]>(sampleBulletinPrices);
  const [selected, setSelected] = useState<string[]>(selectedItems);

  const toggleSelectAll = () => {
    if (selected.length === bulletinPrices.length) {
      setSelected([]);
      onSelectionChange?.([]);
    } else {
      const allIds = bulletinPrices.map(item => item.id);
      setSelected(allIds);
      onSelectionChange?.(allIds);
    }
  };

  const toggleSelect = (id: string) => {
    const updatedSelected = selected.includes(id)
      ? selected.filter(itemId => itemId !== id)
      : [...selected, id];
    
    setSelected(updatedSelected);
    onSelectionChange?.(updatedSelected);
  };

  return (
    <div className="table-container overflow-x-auto">
      <Table>
        <TableHeader className="sticky-header">
          <TableRow>
            <TableHead className="w-10">
              <Checkbox 
                checked={selected.length === bulletinPrices.length && bulletinPrices.length > 0} 
                onCheckedChange={toggleSelectAll}
                aria-label="Select all"
              />
            </TableHead>
            <TableHead>Financial Program Code</TableHead>
            <TableHead>Program Id</TableHead>
            <TableHead>Pricing Config</TableHead>
            <TableHead>Geo Code</TableHead>
            <TableHead>Lender Name</TableHead>
            <TableHead>Advertised</TableHead>
            <TableHead>Pricing Type</TableHead>
            <TableHead>Bulletin ID</TableHead>
            <TableHead>Pricing Value</TableHead>
            <TableHead>Upload Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bulletinPrices.map((item) => (
            <TableRow key={item.id} className="hover:bg-gray-50">
              <TableCell>
                <Checkbox 
                  checked={selected.includes(item.id)}
                  onCheckedChange={() => toggleSelect(item.id)}
                  aria-label={`Select item ${item.id}`}
                />
              </TableCell>
              <TableCell>{item.financialProgramCode}</TableCell>
              <TableCell>{item.programId}</TableCell>
              <TableCell>{item.pricingConfig}</TableCell>
              <TableCell>{item.geoCode}</TableCell>
              <TableCell>{item.lenderName}</TableCell>
              <TableCell>{item.advertised}</TableCell>
              <TableCell>{item.pricingType}</TableCell>
              <TableCell>{item.bulletinId}</TableCell>
              <TableCell>{item.pricingValue.toFixed(4)}</TableCell>
              <TableCell>{item.uploadDate}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onEdit(item.id)}
                  className="h-8 w-8"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onCopy(item.id)}
                  className="h-8 w-8"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onRemove(item.id)}
                  className="h-8 w-8 text-destructive"
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

export default BulletinPricingTable;
