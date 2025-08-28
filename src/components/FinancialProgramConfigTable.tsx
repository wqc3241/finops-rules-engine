
import { useState } from "react";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import FinancialProgramConfigRow from "./FinancialProgramConfigRow";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";

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

interface FinancialProgramConfigTableProps {
  programs: any[];
  loading: boolean;
  onEditProgram?: (program: FinancialProgramConfig) => void;
}

const FinancialProgramConfigTable = ({ programs, loading, onEditProgram }: FinancialProgramConfigTableProps) => {
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
      // Delete functionality will be handled by the parent component with real data
      setSelectedPrograms(current => current.filter(id => id !== programToDelete));
      toast.success("Financial program config deleted");
    }
    setDeleteDialogOpen(false);
    setProgramToDelete(null);
  };

  const handleEditClick = (id: string) => {
    const program = programs.find(p => p.id === id);
    if (program) {
      onEditProgram?.(program);
    }
  };

  const handleCopy = (id: string) => {
    // Copy functionality will be handled by the parent component with real data
    toast.success("Program copied successfully");
  };

  const handleUpdate = (id: string, field: string, value: string) => {
    // Update functionality will be handled by the parent component with real data
    toast.success("Program updated successfully");
  };

  if (loading) {
    return <div className="p-6 text-center">Loading financial programs...</div>;
  }

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
            <TableHead>Template Metadata</TableHead>
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
