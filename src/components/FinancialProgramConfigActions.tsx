
import { Pencil, Trash2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FinancialProgramConfigActionsProps {
  programId: string;
  onEdit: (id: string) => void;
  onCopy: (id: string) => void;
  onDelete: (id: string) => void;
}

const FinancialProgramConfigActions = ({ 
  programId, 
  onEdit, 
  onCopy, 
  onDelete 
}: FinancialProgramConfigActionsProps) => {
  return (
    <div className="text-right space-x-2">
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => onEdit(programId)}
        className="h-8 w-8"
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => onCopy(programId)}
        className="h-8 w-8"
        title="Duplicate"
      >
        <Copy className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => onDelete(programId)}
        className="h-8 w-8 text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default FinancialProgramConfigActions;
