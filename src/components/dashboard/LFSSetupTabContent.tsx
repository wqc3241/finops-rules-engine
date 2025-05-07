
import Button from "./Button"; 
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
    <div className="p-6">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-lg font-medium">{title}</h2>
        <div className="flex space-x-2">
          <Button onClick={handleFilterClick} variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button onClick={handleSortAscClick} variant="outline">
            <ArrowUp className="h-4 w-4 mr-2" />
            Sort Asc
          </Button>
          <Button onClick={handleSortDescClick} variant="outline">
            <ArrowDown className="h-4 w-4 mr-2" />
            Sort Desc
          </Button>
          <Button onClick={handleAddClick}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Record
          </Button>
        </div>
      </div>
      {children}
      
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New {title} Record</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitNewRecord}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input
                  id="name"
                  value={newRecord.name}
                  onChange={(e) => setNewRecord({...newRecord, name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Input
                  id="description"
                  value={newRecord.description}
                  onChange={(e) => setNewRecord({...newRecord, description: e.target.value})}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Add Record</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LFSSetupTabContent;
