
import { TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import FinancialProgramConfigActions from "./FinancialProgramConfigActions";
import { useFinancialProducts } from "@/hooks/useFinancialProducts";
import { useVehicleStyles } from "@/hooks/useVehicleStyles";
import { useVehicleConditions } from "@/hooks/useVehicleConditions";

interface FinancialProgramConfig {
  id: string;
  programCode: string;
  cloneFrom: string | null;
  priority: number;
  financialProductId: string;
  productType: string | null;
  vehicleStyleId: string;
  financingVehicleCondition: string;
  programStartDate: string;
  programEndDate: string;
  isActive: boolean;
  orderTypes: string;
  version: number;
  created?: string;
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
      <TableCell>{program.programCode}</TableCell>
      <TableCell>{program.cloneFrom || "-"}</TableCell>
      <TableCell>{program.priority}</TableCell>
      <TableCell>
        <Select
          value={program.financialProductId}
          onValueChange={(value) => {
            onUpdate(program.id, 'financialProductId', value);
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
          value={program.vehicleStyleId}
          onValueChange={(value) => {
            onUpdate(program.id, 'vehicleStyleId', value);
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
          value={program.financingVehicleCondition}
          onValueChange={(value) => {
            onUpdate(program.id, 'financingVehicleCondition', value);
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
      <TableCell>{program.programStartDate}</TableCell>
      <TableCell>{program.programEndDate}</TableCell>
      <TableCell>
        <Badge className={program.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
          {program.isActive ? "Active" : "Inactive"}
        </Badge>
      </TableCell>
      <TableCell>{program.orderTypes}</TableCell>
      <TableCell>{program.version}</TableCell>
      <TableCell>
        <FinancialProgramConfigActions
          programId={program.id}
          onEdit={onEdit}
          onCopy={onCopy}
          onDelete={onDelete}
        />
      </TableCell>
    </TableRow>
  );
};

export default FinancialProgramConfigRow;
