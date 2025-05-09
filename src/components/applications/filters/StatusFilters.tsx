
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from "sonner";

interface StatusFiltersProps {
  uniqueStatuses: string[];
  statusFilters: string[];
  toggleStatusFilter: (status: string) => void;
}

const StatusFilters: React.FC<StatusFiltersProps> = ({ 
  uniqueStatuses, 
  statusFilters, 
  toggleStatusFilter 
}) => {
  return (
    <div>
      <h4 className="text-sm font-medium mb-2">Status</h4>
      <div className="space-y-2">
        {uniqueStatuses.map(status => (
          <div key={status} className="flex items-center space-x-2">
            <Checkbox 
              id={`status-${status}`}
              checked={statusFilters.includes(status)}
              onCheckedChange={() => toggleStatusFilter(status)}
            />
            <label 
              htmlFor={`status-${status}`}
              className="text-sm cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {status}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusFilters;
