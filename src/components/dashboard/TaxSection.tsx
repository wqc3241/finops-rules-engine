
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Copy, Trash2, Plus } from "lucide-react";
import SectionHeader from "./SectionHeader";
import { useState } from "react";

interface TaxSectionProps {
  title: string;
}

const TaxSection = ({ title }: TaxSectionProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const taxData = [
    {
      taxName: "VAT",
      provider: "",
      taxType: "",
      category: "",
      subCategory: "",
      payType: "",
      selfRegistration: "",
      description: "",
      amount: "",
      rate: "15%",
      locale: "",
      capitalization: "",
      remittance: "",
      leaseTaxableBasedAmount: ""
    }
  ];

  return (
    <div className="p-4">
      <SectionHeader 
        title={title} 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed}
      >
        <Button variant="outline" size="sm" onClick={() => console.log("Add new tax clicked")}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Tax
        </Button>
      </SectionHeader>
      
      {!isCollapsed && (
        <div className="rounded-md border mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tax Name</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Tax Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Sub Category</TableHead>
                <TableHead>Pay Type</TableHead>
                <TableHead>Self Registration</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead>Locale</TableHead>
                <TableHead>Capitalization</TableHead>
                <TableHead>Remittance</TableHead>
                <TableHead>Lease Taxable Based Amount</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {taxData.map((tax, index) => (
                <TableRow key={index}>
                  <TableCell>{tax.taxName}</TableCell>
                  <TableCell>{tax.provider}</TableCell>
                  <TableCell>{tax.taxType}</TableCell>
                  <TableCell>{tax.category}</TableCell>
                  <TableCell>{tax.subCategory}</TableCell>
                  <TableCell>{tax.payType}</TableCell>
                  <TableCell>{tax.selfRegistration}</TableCell>
                  <TableCell>{tax.description}</TableCell>
                  <TableCell>{tax.amount}</TableCell>
                  <TableCell>{tax.rate}</TableCell>
                  <TableCell>{tax.locale}</TableCell>
                  <TableCell>{tax.capitalization}</TableCell>
                  <TableCell>{tax.remittance}</TableCell>
                  <TableCell>{tax.leaseTaxableBasedAmount}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => console.log("Edit tax", index)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => console.log("Copy tax", index)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => console.log("Delete tax", index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default TaxSection;
