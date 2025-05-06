
import Button from "./Button"; 
import { toast } from "sonner";
import { ReactNode } from "react";

interface LFSSetupTabContentProps {
  title: string;
  children: ReactNode;
}

const LFSSetupTabContent = ({ title, children }: LFSSetupTabContentProps) => {
  return (
    <div className="p-6">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-lg font-medium">{title}</h2>
        <Button
          onClick={() => toast.info(`Add new ${title.toLowerCase()} functionality to be implemented`)}
        >
          Add New Record
        </Button>
      </div>
      {children}
    </div>
  );
};

export default LFSSetupTabContent;
