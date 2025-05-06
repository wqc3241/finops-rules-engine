
import React from 'react';
import { DealStructureStipulation } from '@/types/application';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface StipulationsTableProps {
  stipulations: DealStructureStipulation[];
}

const StipulationsTable: React.FC<StipulationsTableProps> = ({ stipulations }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 text-gray-700">
          <tr>
            <th className="py-3 px-4 text-left text-sm font-medium">Customer Role</th>
            <th className="py-3 px-4 text-left text-sm font-medium">Requested Document</th>
            <th className="py-3 px-4 text-left text-sm font-medium">Status</th>
            <th className="py-3 px-4 text-left text-sm font-medium">Date</th>
            <th className="py-3 px-4 text-left text-sm font-medium">Upload</th>
            <th className="py-3 px-4 text-left text-sm font-medium">Download</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {stipulations.map((stipulation, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="py-3 px-4 text-sm">{stipulation.customerRole}</td>
              <td className="py-3 px-4 text-sm">{stipulation.requestedDocument}</td>
              <td className="py-3 px-4 text-sm">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  stipulation.status === 'Submitted' ? 'bg-green-100 text-green-800' : 
                  stipulation.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-gray-100 text-gray-800'
                }`}>
                  {stipulation.status}
                </span>
              </td>
              <td className="py-3 px-4 text-sm">{stipulation.date}</td>
              <td className="py-3 px-4 text-sm">
                <Button variant="ghost" size="icon">
                  <ArrowUp className="h-4 w-4" />
                </Button>
              </td>
              <td className="py-3 px-4 text-sm">
                <Button variant="ghost" size="icon">
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Button = ({ 
  children, 
  variant = "default",
  size = "default"
}: { 
  children: React.ReactNode;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "icon";
}) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50";
  
  const variantClasses = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground"
  };
  
  const sizeClasses = {
    default: "h-10 py-2 px-4",
    icon: "h-9 w-9"
  };
  
  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}>
      {children}
    </button>
  );
};

export default StipulationsTable;
