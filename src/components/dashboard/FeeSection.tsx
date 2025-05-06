
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Copy, Trash2, Plus } from "lucide-react";
import SectionHeader from "./SectionHeader";

interface FeeSectionProps {
  title: string;
}

const FeeSection = ({ title }: FeeSectionProps) => {
  const feeData = [
    {
      feeName: "Other Fees",
      provider: "",
      feeType: "",
      category: "",
      subCategory: "",
      taxable: "",
      payType: "",
      selfRegistration: "",
      description: "",
      vehicle: "",
      amount: "1500",
      rate: "",
      localePreference: "",
      capitalizationPreference: ""
    }
  ];

  return (
    <div className="p-4">
      <SectionHeader title={title}>
        <Button variant="outline" size="sm" onClick={() => console.log("Add new fee clicked")}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Fee
        </Button>
      </SectionHeader>
      <div className="rounded-md border mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fee Name</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Fee type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Sub-Category</TableHead>
              <TableHead>Taxable</TableHead>
              <TableHead>Pay Type</TableHead>
              <TableHead>Self Registration</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Rate</TableHead>
              <TableHead>Locale Preference</TableHead>
              <TableHead>Capitalization Preference</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {feeData.map((fee, index) => (
              <TableRow key={index}>
                <TableCell>{fee.feeName}</TableCell>
                <TableCell>{fee.provider}</TableCell>
                <TableCell>{fee.feeType}</TableCell>
                <TableCell>{fee.category}</TableCell>
                <TableCell>{fee.subCategory}</TableCell>
                <TableCell>{fee.taxable}</TableCell>
                <TableCell>{fee.payType}</TableCell>
                <TableCell>{fee.selfRegistration}</TableCell>
                <TableCell>{fee.description}</TableCell>
                <TableCell>{fee.vehicle}</TableCell>
                <TableCell>{fee.amount}</TableCell>
                <TableCell>{fee.rate}</TableCell>
                <TableCell>{fee.localePreference}</TableCell>
                <TableCell>{fee.capitalizationPreference}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => console.log("Edit fee", index)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => console.log("Copy fee", index)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => console.log("Delete fee", index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default FeeSection;
