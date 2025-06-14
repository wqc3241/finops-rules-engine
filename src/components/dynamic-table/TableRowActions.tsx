
import { Button } from "@/components/ui/button";
import { Edit, Copy, Trash2 } from "lucide-react";

interface TableRowActionsProps {
  onEdit: () => void;
  onCopy: () => void;
  onDelete: () => void;
}

const TableRowActions = ({
  onEdit, onCopy, onDelete
}: TableRowActionsProps) => (
  <div className="flex justify-end space-x-2">
    <Button
      variant="ghost"
      size="icon"
      onClick={onEdit}
    >
      <Edit className="h-4 w-4" />
    </Button>
    <Button
      variant="ghost"
      size="icon"
      onClick={onCopy}
    >
      <Copy className="h-4 w-4" />
    </Button>
    <Button
      variant="ghost"
      size="icon"
      onClick={onDelete}
      className="text-destructive"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  </div>
);

export default TableRowActions;
