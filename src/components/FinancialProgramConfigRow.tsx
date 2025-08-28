
import { TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import TableRowActions from "@/components/dynamic-table/TableRowActions";
import { useFinancialProducts } from "@/hooks/useFinancialProducts";
import { useVehicleStyles } from "@/hooks/useVehicleStyles";
import { useVehicleConditions } from "@/hooks/useVehicleConditions";

interface FinancialProgramConfig {
  id: string;
  program_code: string;
  clone_from: string | null;
  priority: number;
  financial_product_id: string;
  product_type: string | null;
  vehicle_style_id: string;
  financing_vehicle_condition: string;
  program_start_date: string;
  program_end_date: string;
  is_active: string;
  order_types: string;
  version: number;
  template_metadata: Record<string, any>;
  created_at?: string;
  updated?: string;
}

interface FinancialProgramConfigRowProps {
  program: FinancialProgramConfig;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onUpdate: (id: string, field: string, value: string) => void;
  onEdit: (id: string) => void;
  onCopy: (id: string) => void;
  onDelete: (id: string) => void;
}

const FinancialProgramConfigRow = ({
  program,
  isSelected,
  onSelect,
  onUpdate,
  onEdit,
  onCopy,
  onDelete
}: FinancialProgramConfigRowProps) => {
  const financialProducts = useFinancialProducts();
  const vehicleStyles = useVehicleStyles();
  const vehicleConditions = useVehicleConditions();

  return (
    <TableRow className="hover:bg-gray-50">
      <TableCell>
        <Checkbox 
          checked={isSelected}
          onCheckedChange={() => onSelect(program.id)}
          aria-label={`Select program ${program.id}`}
        />
      </TableCell>
      <TableCell>{program.id}</TableCell>
      <TableCell>{program.program_code}</TableCell>
      <TableCell>{program.clone_from || "-"}</TableCell>
      <TableCell>{program.priority}</TableCell>
      <TableCell>
        <Select
          value={program.financial_product_id}
          onValueChange={(value) => {
            onUpdate(program.id, 'financial_product_id', value);
            toast.success("Updated Financial Product ID");
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="z-50 bg-white">
            {financialProducts.map(fp =>
              <SelectItem key={fp.id} value={fp.id}>
                {fp.id} - {fp.productType}
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        <Select
          value={program.vehicle_style_id}
          onValueChange={(value) => {
            onUpdate(program.id, 'vehicle_style_id', value);
            toast.success("Updated Vehicle Style ID");
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="z-50 bg-white">
            {vehicleStyles.map(vs =>
              <SelectItem key={vs.id} value={vs.id}>
                {vs.id} - {vs.trim}
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        <Select
          value={program.financing_vehicle_condition}
          onValueChange={(value) => {
            onUpdate(program.id, 'financing_vehicle_condition', value);
            toast.success("Updated Vehicle Condition");
          }}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="z-50 bg-white">
            {Array.from(
              new Set(vehicleConditions.map(vc => vc.type))
            ).map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>{program.program_start_date}</TableCell>
      <TableCell>{program.program_end_date}</TableCell>
      <TableCell>
        <Badge className={program.is_active === 'Yes' ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
          {program.is_active === 'Yes' ? "Active" : "Inactive"}
        </Badge>
      </TableCell>
      <TableCell>{program.order_types}</TableCell>
      <TableCell>{program.version}</TableCell>
      <TableCell>
        {Object.keys(program.template_metadata || {}).length > 0 ? (
          <div className="text-xs space-y-1">
            {Object.entries(program.template_metadata || {}).map(([key, value]) => (
              <div key={key} className="bg-muted/50 px-2 py-1 rounded">
                <span className="font-medium">{key}:</span> {Array.isArray(value) ? value.join(", ") : String(value)}
              </div>
            ))}
          </div>
        ) : (
          <span className="text-muted-foreground text-xs">Empty</span>
        )}
      </TableCell>
      <TableCell>
        <TableRowActions
          rowId={program.id}
          programCode={program.program_code}
          onEdit={() => onEdit(program.id)}
          onCopy={onCopy}
          onDelete={onDelete}
        />
      </TableCell>
    </TableRow>
  );
};

export default FinancialProgramConfigRow;
