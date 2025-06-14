
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import ForeignKeySelect from "./ForeignKeySelect";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ColumnDefinition, TableData } from "@/types/dynamicTable";

interface Props {
  row: TableData;
  column: ColumnDefinition;
  isEditing: boolean;
  editValue: any;
  setEditValue: (value: any) => void;
  handleSaveEdit: () => void;
  handleCancelEdit: () => void;
  programConfigOptions: {
    financialProducts: { id: string; label: string }[];
    vehicleStyles: { id: string; label: string }[];
    vehicleConditions: { id: string; label: string }[];
  };
  editingCell: { rowId: string; columnKey: string } | null;
}

const TableCellRenderer = ({
  row,
  column,
  isEditing,
  editValue,
  setEditValue,
  handleSaveEdit,
  handleCancelEdit,
  programConfigOptions,
  editingCell,
}: Props) => {
  const value = row[column.key];

  // Foreign key dropdown
  if (column.isForeignKey && isEditing && column.sourceTable) {
    return (
      <div className="flex items-center space-x-2">
        <ForeignKeySelect
          sourceTable={column.sourceTable}
          value={editValue}
          onChange={(val) => setEditValue(val)}
          displayColumn={column.displayColumn}
        />
        <div className="space-x-2">
          <Button size="sm" onClick={handleSaveEdit}>Save</Button>
          <Button size="sm" variant="outline" onClick={handleCancelEdit}>Cancel</Button>
        </div>
      </div>
    );
  }
  if (column.isForeignKey && column.sourceTable && !isEditing) {
    // Demo: Fetch fake data for foreign key columns
    const DEMO_ROW_DATA: Record<string, any[]> = {
      "financial-products": [
        { id: "FP1", productType: "Auto" },
        { id: "FP2", productType: "Home" }
      ],
      "lender": [
        { id: "L1", lenderName: "Prime Bank" },
        { id: "L2", lenderName: "Auto Credit" }
      ],
    };
    const options = DEMO_ROW_DATA[column.sourceTable] || [];
    const record = options.find((r) => r.id === value);
    return (
      <span>
        {record
          ? ((column.displayColumn && record[column.displayColumn]) || record.id)
          : value || ""}
      </span>
    );
  }

  // Special dropdowns (program config)
  if (isEditing && column.editable) {
    if (column.key === "financialProductId") {
      return (
        <div className="flex items-center space-x-2">
          <Select
            value={editValue}
            onValueChange={setEditValue}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select product" />
            </SelectTrigger>
            <SelectContent className="z-50 bg-white">
              {programConfigOptions.financialProducts.map(opt =>
                <SelectItem key={opt.id} value={opt.id}>{opt.label}</SelectItem>
              )}
            </SelectContent>
          </Select>
          <div className="space-x-2">
            <Button size="sm" onClick={handleSaveEdit}>Save</Button>
            <Button size="sm" variant="outline" onClick={handleCancelEdit}>Cancel</Button>
          </div>
        </div>
      );
    }
    if (column.key === "vehicleStyleId") {
      return (
        <div className="flex items-center space-x-2">
          <Select
            value={editValue}
            onValueChange={setEditValue}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select style" />
            </SelectTrigger>
            <SelectContent className="z-50 bg-white">
              {programConfigOptions.vehicleStyles.map(opt =>
                <SelectItem key={opt.id} value={opt.id}>{opt.label}</SelectItem>
              )}
            </SelectContent>
          </Select>
          <div className="space-x-2">
            <Button size="sm" onClick={handleSaveEdit}>Save</Button>
            <Button size="sm" variant="outline" onClick={handleCancelEdit}>Cancel</Button>
          </div>
        </div>
      );
    }
    if (column.key === "financingVehicleCondition") {
      return (
        <div className="flex items-center space-x-2">
          <Select
            value={editValue}
            onValueChange={setEditValue}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent className="z-50 bg-white">
              {programConfigOptions.vehicleConditions.map(opt =>
                <SelectItem key={opt.id} value={opt.id}>{opt.label}</SelectItem>
              )}
            </SelectContent>
          </Select>
          <div className="space-x-2">
            <Button size="sm" onClick={handleSaveEdit}>Save</Button>
            <Button size="sm" variant="outline" onClick={handleCancelEdit}>Cancel</Button>
          </div>
        </div>
      );
    }
    if (column.type === 'boolean') {
      return (
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={editValue}
            onCheckedChange={setEditValue}
          />
          <div className="space-x-2">
            <Button size="sm" onClick={handleSaveEdit}>Save</Button>
            <Button size="sm" variant="outline" onClick={handleCancelEdit}>Cancel</Button>
          </div>
        </div>
      );
    }
    return (
      <div className="flex items-center space-x-2">
        <Input
          value={editValue}
          onChange={(e) => setEditValue(column.type === 'number' ? Number(e.target.value) : e.target.value)}
          type={column.type === 'number' ? 'number' : 'text'}
          className="w-32"
        />
        <div className="space-x-2">
          <Button size="sm" onClick={handleSaveEdit}>Save</Button>
          <Button size="sm" variant="outline" onClick={handleCancelEdit}>Cancel</Button>
        </div>
      </div>
    );
  }

  if (column.type === 'boolean') {
    return (
      <Badge className={value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
        {value ? 'Yes' : 'No'}
      </Badge>
    );
  }

  if (column.type === 'number' && typeof value === 'number') {
    return value.toLocaleString();
  }

  return value || '';
};

export default TableCellRenderer;
