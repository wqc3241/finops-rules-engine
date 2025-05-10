
import React from 'react';
import { Check, X, Clock } from 'lucide-react';

interface StatusBadgeProps {
  status?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  if (!status) return null;

  const statusConfig: Record<string, { bgColor: string; textColor: string; icon: React.ReactNode }> = {
    Approved: { bgColor: 'bg-green-100', textColor: 'text-green-800', icon: <Check className="h-3 w-3 mr-1" /> },
    Declined: { bgColor: 'bg-red-100', textColor: 'text-red-800', icon: <X className="h-3 w-3 mr-1" /> },
    Pending: { bgColor: 'bg-gray-100', textColor: 'text-gray-600', icon: <Clock className="h-3 w-3 mr-1" /> }
  };

  const config = statusConfig[status] || { bgColor: 'bg-gray-100', textColor: 'text-gray-600', icon: <Clock className="h-3 w-3 mr-1" /> };

  return (
    <span className={`ml-4 px-3 py-1 text-sm font-medium ${config.bgColor} ${config.textColor} rounded-full flex items-center`}>
      {config.icon}
      {status}
    </span>
  );
};

export default StatusBadge;
