import React from 'react';
import { Check, X, Clock } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface StatusDropdownProps {
  status?: string;
  onStatusChange: (newStatus: string) => void;
}

const StatusDropdown: React.FC<StatusDropdownProps> = ({ status, onStatusChange }) => {
  const statuses = [
    'Approved',
    'Declined',
    'Pending',
    'Available',
    'Not Selected',
    'Not Submitted',
    'Application Under Review',
    'Conditionally Approved',
    'Application Declined',
    'Offer Presented To Customer'
  ];

  const statusConfig: Record<string, { bgColor: string; textColor: string; icon: React.ReactNode }> = {
    Approved: { bgColor: 'bg-green-100', textColor: 'text-green-800', icon: <Check className="h-3 w-3 mr-1" /> },
    Declined: { bgColor: 'bg-red-100', textColor: 'text-red-800', icon: <X className="h-3 w-3 mr-1" /> },
    Pending: { bgColor: 'bg-yellow-100', textColor: 'text-yellow-800', icon: <Clock className="h-3 w-3 mr-1" /> },
    Available: { bgColor: 'bg-blue-100', textColor: 'text-blue-800', icon: null },
    "Not Selected": { bgColor: 'bg-gray-100', textColor: 'text-gray-600', icon: null },
    "Not Submitted": { bgColor: 'bg-gray-100', textColor: 'text-gray-600', icon: null },
    "Application Under Review": { bgColor: 'bg-yellow-100', textColor: 'text-yellow-800', icon: <Clock className="h-3 w-3 mr-1" /> },
    "Conditionally Approved": { bgColor: 'bg-green-100', textColor: 'text-green-800', icon: <Check className="h-3 w-3 mr-1" /> },
    "Application Declined": { bgColor: 'bg-red-100', textColor: 'text-red-800', icon: <X className="h-3 w-3 mr-1" /> },
    "Offer Presented To Customer": { bgColor: 'bg-blue-100', textColor: 'text-blue-800', icon: null }
  };

  const config = status ? statusConfig[status] : statusConfig['Pending'];

  return (
    <div className="ml-4" onClick={(e) => e.stopPropagation()} data-prevent-toggle>
      <Select value={status || ''} onValueChange={onStatusChange}>
        <SelectTrigger 
          className={`w-auto px-3 py-1 text-sm font-medium ${config.bgColor} ${config.textColor} rounded-full border-0 flex items-center gap-1 h-auto`}
        >
          {config.icon}
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent className="bg-background z-50">
          {statuses.map((statusOption) => {
            const optionConfig = statusConfig[statusOption];
            return (
              <SelectItem 
                key={statusOption} 
                value={statusOption}
                className={`${optionConfig.textColor} flex items-center`}
              >
                <span className="flex items-center">
                  {optionConfig.icon}
                  {statusOption}
                </span>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};

export default StatusDropdown;
