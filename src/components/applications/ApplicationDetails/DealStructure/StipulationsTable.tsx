
import React from 'react';
import { DealStructureStipulation } from '@/types/application';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from "@/components/ui/button";

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

export default StipulationsTable;
