import { Button } from "@/components/ui/button";
import { Edit, Copy, Trash2 } from "lucide-react";

interface TableRowActionsProps {
  rowId: string;
  onEdit: () => void;
  onCopy: (rowId: string) => void;
  onDelete: (rowId: string) => void;
}

const TableRowActions = ({
  rowId,
  onEdit,
  onCopy,
  onDelete,
}: TableRowActionsProps) => {
  return (
    <div className="flex justify-end space-x-1 min-w-fit">
      <Button
        variant="ghost"
        size="icon"
        onClick={onEdit}
        className="h-8 w-8 shrink-0"
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onCopy(rowId)}
        className="h-8 w-8 shrink-0"
      >
        <Copy className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(rowId)}
        className="text-destructive h-8 w-8 shrink-0"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default TableRowActions;
