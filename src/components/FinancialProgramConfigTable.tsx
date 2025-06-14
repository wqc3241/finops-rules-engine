
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Pencil, Trash2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
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

const FinancialProgramConfigTable = () => {
  const [programs, setPrograms] = useState<FinancialProgramConfig[]>(initialFinancialProgramConfigs);
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [programToDelete, setProgramToDelete] = useState<string | null>(null);

  // For inline editing
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<string>("");

  // Get available options from data sources
  const financialProducts = useFinancialProducts();
  const vehicleStyles = useVehicleStyles();
  const vehicleConditions = useVehicleConditions();

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

  const handleEditClick = (id: string, field?: string, value?: string) => {
    setEditingId(id);
    setEditingField(field ?? null);
    setEditingValue(value ?? "");
    toast.info(`Editing program ${id}${field ? ` → ${field}` : ""} - inline edit`);
  };

  // Copy functionality
  const handleCopy = (id: string) => {
    const original = programs.find(p => p.id === id);
    if (!original) return;

    // Extract prefix (letters) and numeric part from ID
    const idMatch = original.id.match(/^([A-Za-z]+)(\d+)$/);
    let newId = "";
    if (idMatch) {
      const [, prefix, numericPart] = idMatch;
      const incremented = String(Number(numericPart) + 1).padStart(numericPart.length, "0");
      // Prevent ID collision
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
      cloneFrom: original.programCode, // Set cloneFrom to original's programCode
    };

    setPrograms(prev => [...prev, newProgram]);
    toast.success(`Duplicated: ${original.id} → ${newId}`);
  };

  const saveEdit = () => {
    if (!editingId || !editingField) return;
    setPrograms(prev =>
      prev.map(program =>
        program.id === editingId ? { ...program, [editingField]: editingValue } : program
      )
    );
    setEditingId(null);
    setEditingField(null);
    setEditingValue("");
    toast.success("Value updated!");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingField(null);
    setEditingValue("");
  };

  // Helper: for Select dropdowns, reset editing state and value
  const startDropdownEdit = (id: string, field: string, currentValue: string) => {
    setEditingId(id);
    setEditingField(field);
    setEditingValue(currentValue);
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
            <TableRow key={program.id} className="hover:bg-gray-50">
              <TableCell>
                <Checkbox 
                  checked={selectedPrograms.includes(program.id)}
                  onCheckedChange={() => toggleSelectProgram(program.id)}
                  aria-label={`Select program ${program.id}`}
                />
              </TableCell>
              <TableCell>{program.id}</TableCell>
              <TableCell>{program.programCode}</TableCell>
              <TableCell>{program.cloneFrom || "-"}</TableCell>
              <TableCell>{program.priority}</TableCell>
              {/* Financial Product ID Dropdown */}
              <TableCell>
                {editingId === program.id && editingField === "financialProductId" ? (
                  <Select
                    defaultValue={program.financialProductId}
                    onValueChange={(value) => {
                      setEditingValue(value);
                      setPrograms(prev =>
                        prev.map(p =>
                          p.id === program.id ? { ...p, financialProductId: value } : p
                        )
                      );
                      cancelEdit();
                      toast.success("Updated Financial Product ID");
                    }}
                    value={editingValue || program.financialProductId}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {financialProducts.map(fp =>
                        <SelectItem key={fp.id} value={fp.id}>{fp.id} - {fp.productType}</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                ) : (
                  <span
                    className="cursor-pointer"
                    onClick={() => startDropdownEdit(program.id, "financialProductId", program.financialProductId)}
                  >
                    {program.financialProductId}
                  </span>
                )}
              </TableCell>
              {/* Vehicle Style ID Dropdown */}
              <TableCell>
                {editingId === program.id && editingField === "vehicleStyleId" ? (
                  <Select
                    defaultValue={program.vehicleStyleId}
                    onValueChange={(value) => {
                      setEditingValue(value);
                      setPrograms(prev =>
                        prev.map(p =>
                          p.id === program.id ? { ...p, vehicleStyleId: value } : p
                        )
                      );
                      cancelEdit();
                      toast.success("Updated Vehicle Style ID");
                    }}
                    value={editingValue || program.vehicleStyleId}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicleStyles.map(vs =>
                        <SelectItem key={vs.id} value={vs.id}>{vs.id} - {vs.trim}</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                ) : (
                  <span
                    className="cursor-pointer"
                    onClick={() => startDropdownEdit(program.id, "vehicleStyleId", program.vehicleStyleId)}
                  >
                    {program.vehicleStyleId}
                  </span>
                )}
              </TableCell>
              {/* Financing Vehicle Condition Dropdown */}
              <TableCell>
                {editingId === program.id && editingField === "financingVehicleCondition" ? (
                  <Select
                    defaultValue={program.financingVehicleCondition}
                    onValueChange={(value) => {
                      setEditingValue(value);
                      setPrograms(prev =>
                        prev.map(p =>
                          p.id === program.id ? { ...p, financingVehicleCondition: value } : p
                        )
                      );
                      cancelEdit();
                      toast.success("Updated Vehicle Condition");
                    }}
                    value={editingValue || program.financingVehicleCondition}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from(
                        new Set(vehicleConditions.map(vc => vc.type))
                      ).map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <span
                    className="cursor-pointer"
                    onClick={() => startDropdownEdit(program.id, "financingVehicleCondition", program.financingVehicleCondition)}
                  >
                    {program.financingVehicleCondition}
                  </span>
                )}
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
              <TableCell className="text-right space-x-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleEditClick(program.id)}
                  className="h-8 w-8"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleCopy(program.id)}
                  className="h-8 w-8"
                  title="Duplicate"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleDeleteClick(program.id)}
                  className="h-8 w-8 text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Financial Program Config</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this financial program configuration? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FinancialProgramConfigTable;

// NOTE: This file is now quite long (near or over 300 lines). Please consider refactoring into smaller focused components for future maintainability.
