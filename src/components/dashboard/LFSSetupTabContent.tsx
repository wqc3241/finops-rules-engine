
import Button from "./Button"; 
import { toast } from "sonner";
import { ReactNode } from "react";
import { Plus, Filter, ArrowUp, ArrowDown } from "lucide-react";

interface LFSSetupTabContentProps {
  title: string;
  children: ReactNode;
  onAddRecord?: () => void;
}

const LFSSetupTabContent = ({ title, children, onAddRecord }: LFSSetupTabContentProps) => {
  const handleAddClick = () => {
    if (onAddRecord) {
      onAddRecord();
    } else {
      toast.info(`Add new ${title.toLowerCase()} functionality to be implemented`);
    }
  };

  const handleFilterClick = () => {
    toast.info(`Filter functionality for ${title} activated`);
  };

  const handleSortAscClick = () => {
    toast.info(`Sort ascending for ${title} activated`);
  };

  const handleSortDescClick = () => {
    toast.info(`Sort descending for ${title} activated`);
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
    </div>
  );
};

export default LFSSetupTabContent;
