
import { useState } from "react";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import FinancialProgramConfigRow from "./FinancialProgramConfigRow";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";

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

const initialFinancialProgramConfigs: FinancialProgramConfig[] = [
  {
    id: "FPC01",
    programCode: "AIPUNL07241",
    cloneFrom: "AIPUNL06241",
    priority: 1,
    financialProductId: "USLN",
    productType: null,
    vehicleStyleId: "L25A1",
    financingVehicleCondition: "New",
    programStartDate: "2/1/2025",
    programEndDate: "2/28/2025",
    isActive: true,
    orderTypes: "INV, CON",
    version: 1,
  },
  {
    id: "FPC02",
    programCode: "AIPUNR07241",
    cloneFrom: null,
    priority: 2,
    financialProductId: "USLE",
    productType: null,
    vehicleStyleId: "L25A2",
    financingVehicleCondition: "New",
    programStartDate: "4/1/2025",
    programEndDate: "4/30/2025",
    isActive: true,
    orderTypes: "INV, CON",
    version: 1,
  },
  {
    id: "FPKSA01",
    programCode: "SNBAIPUNL04251",
    cloneFrom: null,
    priority: 1,
    financialProductId: "KSABM",
    productType: null,
    vehicleStyleId: "KSA25A1",
    financingVehicleCondition: "New",
    programStartDate: "4/1/2025",
    programEndDate: "5/30/2025",
    isActive: true,
    orderTypes: "INV, CON",
    version: 1,
  },
  {
    id: "FPKSA02",
    programCode: "AIBAIPUNL04251",
    cloneFrom: null,
    priority: 1,
    financialProductId: "KSABA5050",
    productType: "50/50",
    vehicleStyleId: "KSA25A1",
    financingVehicleCondition: "New",
    programStartDate: "4/1/2025",
    programEndDate: "5/30/2025",
    isActive: true,
    orderTypes: "INV, CON",
    version: 1,
  },
  {
    id: "FPKSA03",
    programCode: "JBAIPUNL04251",
    cloneFrom: null,
    priority: 1,
    financialProductId: "KSABA5050",
    productType: "40/60",
    vehicleStyleId: "KSA25A1",
    financingVehicleCondition: "New",
    programStartDate: "4/1/2025",
    programEndDate: "5/30/2025",
    isActive: true,
    orderTypes: "INV, CON",
    version: 1,
  }
];

interface FinancialProgramConfigTableProps {
  onEditProgram?: (id: string) => void;
}

const FinancialProgramConfigTable = ({ onEditProgram }: FinancialProgramConfigTableProps) => {
  const [programs, setPrograms] = useState<FinancialProgramConfig[]>(initialFinancialProgramConfigs);
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [programToDelete, setProgramToDelete] = useState<string | null>(null);

  const toggleSelectAll = () => {
    if (selectedPrograms.length === programs.length) {
      setSelectedPrograms([]);
    } else {
      setSelectedPrograms(programs.map(program => program.id));
    }
  };

  const toggleSelectProgram = (id: string) => {
    setSelectedPrograms(current =>
      current.includes(id) ? current.filter(programId => programId !== id) : [...current, id]
    );
  };

  const handleDeleteClick = (id: string) => {
    setProgramToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (programToDelete) {
      setPrograms(current => current.filter(program => program.id !== programToDelete));
      setSelectedPrograms(current => current.filter(id => id !== programToDelete));
      toast.success("Financial program config deleted");
    }
    setDeleteDialogOpen(false);
    setProgramToDelete(null);
  };

  const handleEditClick = (id: string) => {
    // This will be handled by the parent component
    onEditProgram?.(id);
  };

  const handleCopy = (id: string) => {
    const original = programs.find(p => p.id === id);
    if (!original) return;

    const idMatch = original.id.match(/^([A-Za-z]+)(\d+)$/);
    let newId = "";
    if (idMatch) {
      const [, prefix, numericPart] = idMatch;
      const incremented = String(Number(numericPart) + 1).padStart(numericPart.length, "0");
      let candidateId = prefix + incremented;
      let tries = 1;
      while (programs.some(p => p.id === candidateId)) {
        tries++;
        candidateId = prefix + String(Number(numericPart) + tries).padStart(numericPart.length, "0");
      }
      newId = candidateId;
    } else {
      newId = original.id + "_COPY" + Date.now();
    }

    const newProgram: FinancialProgramConfig = {
      ...original,
      id: newId,
      version: original.version + 1,
      cloneFrom: original.programCode,
    };

    setPrograms(prev => [...prev, newProgram]);
    toast.success(`Duplicated: ${original.id} → ${newId}`);
  };

  const handleUpdate = (id: string, field: string, value: string) => {
    setPrograms(prev =>
      prev.map(program =>
        program.id === id ? { ...program, [field]: value } : program
      )
    );
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="sticky-header">
          <TableRow>
            <TableHead className="w-10">
              <Checkbox 
                checked={selectedPrograms.length === programs.length && programs.length > 0} 
                onCheckedChange={toggleSelectAll}
                aria-label="Select all"
              />
            </TableHead>
            <TableHead>Program ID</TableHead>
            <TableHead>Program Code</TableHead>
            <TableHead>Clone from</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Financial Product ID</TableHead>
            <TableHead>Vehicle Style ID</TableHead>
            <TableHead>Vehicle Condition</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Order Types</TableHead>
            <TableHead>Version</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {programs.map((program) => (
            <FinancialProgramConfigRow
              key={program.id}
              program={program}
              isSelected={selectedPrograms.includes(program.id)}
              onSelect={toggleSelectProgram}
              onUpdate={handleUpdate}
              onEdit={handleEditClick}
              onCopy={handleCopy}
              onDelete={handleDeleteClick}
            />
          ))}
        </TableBody>
      </Table>
      
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default FinancialProgramConfigTable;
