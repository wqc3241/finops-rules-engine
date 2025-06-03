
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit3, Plus } from "lucide-react";
import { ColumnDefinition } from "@/types/dynamicTable";
import { toast } from "sonner";
import AddColumnModal from "./AddColumnModal";

interface ColumnManagementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  columns: ColumnDefinition[];
  onAddColumn: (column: ColumnDefinition) => void;
  onRemoveColumn: (columnId: string) => void;
  onUpdateColumn: (columnId: string, updates: Partial<ColumnDefinition>) => void;
}

const ColumnManagementModal = ({ 
  open, 
  onOpenChange, 
  columns, 
  onAddColumn, 
  onRemoveColumn,
  onUpdateColumn 
}: ColumnManagementModalProps) => {
  const [showAddColumn, setShowAddColumn] = useState(false);

  const handleRemoveColumn = (columnId: string) => {
    const column = columns.find(col => col.id === columnId);
    if (column?.key === 'id') {
      toast.error("Cannot delete ID column");
      return;
    }
    onRemoveColumn(columnId);
    toast.success("Column removed successfully");
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'string': return 'bg-blue-100 text-blue-800';
      case 'boolean': return 'bg-green-100 text-green-800';
      case 'number': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInputTypeColor = (inputType: string) => {
    return inputType === 'Input' 
      ? 'bg-blue-100 text-blue-800' 
      : 'bg-gray-100 text-gray-800';
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Column Management
              <Button onClick={() => setShowAddColumn(true)} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Column
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Key</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Input/Output</TableHead>
                  <TableHead>Required</TableHead>
                  <TableHead>Sortable</TableHead>
                  <TableHead>Editable</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {columns.map((column) => (
                  <TableRow key={column.id}>
                    <TableCell className="font-medium">{column.name}</TableCell>
                    <TableCell className="font-mono text-sm">{column.key}</TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(column.type)}>
                        {column.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getInputTypeColor(column.inputType)}>
                        {column.inputType}
                      </Badge>
                    </TableCell>
                    <TableCell>{column.isRequired ? "Yes" : "No"}</TableCell>
                    <TableCell>{column.sortable ? "Yes" : "No"}</TableCell>
                    <TableCell>{column.editable ? "Yes" : "No"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toast.info("Edit functionality coming soon")}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveColumn(column.id)}
                          disabled={column.key === 'id'}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <DialogFooter>
            <Button onClick={() => onOpenChange(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AddColumnModal
        open={showAddColumn}
        onOpenChange={setShowAddColumn}
        onAddColumn={onAddColumn}
        existingColumns={columns}
      />
    </>
  );
};

export default ColumnManagementModal;
