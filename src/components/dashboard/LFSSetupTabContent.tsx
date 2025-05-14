
import { Button } from "@/components/ui/button";  
import { toast } from "sonner";
import { ReactNode, useState } from "react";
import { Plus, Filter, ArrowUp, ArrowDown } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LFSSetupTabContentProps {
  title: string;
  children: ReactNode;
  onAddRecord?: () => void;
}

const LFSSetupTabContent = ({ title, children, onAddRecord }: LFSSetupTabContentProps) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newRecord, setNewRecord] = useState({ name: "", description: "" });
  
  const handleAddClick = () => {
    if (onAddRecord) {
      onAddRecord();
    } else {
      setShowAddDialog(true);
    }
  };

  const handleFilterClick = () => {
    toast.info(`Filter applied to ${title}`);
  };

  const handleSortAscClick = () => {
    toast.success(`Sorted ${title} in ascending order`);
  };

  const handleSortDescClick = () => {
    toast.success(`Sorted ${title} in descending order`);
  };
  
  const handleSubmitNewRecord = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`New ${title.toLowerCase()} record added: ${newRecord.name}`);
    setNewRecord({ name: "", description: "" });
    setShowAddDialog(false);
  };

  return (
    <div className="p-3">
      <div className="mb-2 flex justify-between items-center">
        <h2 className="text-base font-medium">{title}</h2>
        <div className="flex space-x-1">
          <Button onClick={handleFilterClick} variant="outline" size="sm">
            <Filter className="h-3 w-3 mr-1" />
            Filter
          </Button>
          <Button onClick={handleSortAscClick} variant="outline" size="sm">
            <ArrowUp className="h-3 w-3 mr-1" />
            Sort Asc
          </Button>
          <Button onClick={handleSortDescClick} variant="outline" size="sm">
            <ArrowDown className="h-3 w-3 mr-1" />
            Sort Desc
          </Button>
          <Button onClick={handleAddClick} size="sm">
            <Plus className="h-3 w-3 mr-1" />
            Add New Record
          </Button>
        </div>
      </div>
      {children}
      
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New {title} Record</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitNewRecord}>
            <div className="grid gap-2 py-2">
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="name" className="text-right text-xs">Name</Label>
                <Input
                  id="name"
                  size={1}
                  value={newRecord.name}
                  onChange={(e) => setNewRecord({...newRecord, name: e.target.value})}
                  className="col-span-3 h-8"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="description" className="text-right text-xs">Description</Label>
                <Input
                  id="description"
                  size={1}
                  value={newRecord.description}
                  onChange={(e) => setNewRecord({...newRecord, description: e.target.value})}
                  className="col-span-3 h-8"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" size="sm">Add Record</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LFSSetupTabContent;
