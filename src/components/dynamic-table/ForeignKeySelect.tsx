
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useDynamicTableSchemas } from "@/hooks/useDynamicTableSchemas";
import { TableData } from "@/types/dynamicTable";

// Temporary demo data - in a real app, this would come from a shared context or fetched
const DEMO_ROW_DATA: Record<string, TableData[]> = {
  "financial-products": [
    { id: "FP1", productType: "Auto", productSubtype: "Standard", geoCode: "CA", category: "Vehicle", isActive: true },
    { id: "FP2", productType: "Home", productSubtype: "Equity", geoCode: "TX", category: "Mortgage", isActive: true },
  ],
  "lender": [
    { id: "L1", lenderName: "Prime Bank" },
    { id: "L2", lenderName: "Auto Credit" },
  ],
  // ... add sample data as needed for referenced tables
};

interface ForeignKeySelectProps {
  sourceTable: string;
  value: string;
  onChange: (value: string) => void;
  displayColumn?: string;
}

const ForeignKeySelect = ({ sourceTable, value, onChange, displayColumn = "id" }: ForeignKeySelectProps) => {
  const [options, setOptions] = useState<TableData[]>([]);

  useEffect(() => {
    // Load demo data for referenced table
    setOptions(DEMO_ROW_DATA[sourceTable] || []);
  }, [sourceTable]);

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select a value" />
      </SelectTrigger>
      <SelectContent>
        {options.map(row => (
          <SelectItem key={row.id} value={row.id}>
            {displayColumn && row[displayColumn] ? row[displayColumn] : row.id}
            {displayColumn && displayColumn !== "id" && row[displayColumn] ? ` (${row.id})` : ""}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ForeignKeySelect;
