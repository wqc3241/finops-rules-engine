
import React from 'react';
import ApplicationCard from './ApplicationCard';
import { Application } from '@/types/application';
import { Badge } from '@/components/ui/badge';

interface KanbanViewProps {
  applications: Application[];
}

const KanbanView: React.FC<KanbanViewProps> = ({ applications }) => {
  // Get unique statuses from applications and define column order
  const statusOrder = ['Submitted', 'Pending', 'Conditionally Approved', 'Approved', 'Pending Signature', 'Booked', 'Funded', 'Declined'];
  
  // Group applications by status
  const applicationsByStatus = applications.reduce((acc, app) => {
    if (!acc[app.status]) {
      acc[app.status] = [];
    }
    acc[app.status].push(app);
    return acc;
  }, {} as Record<string, Application[]>);

  // Get all statuses that have applications, ordered by statusOrder
  const statusesWithApps = statusOrder.filter(status => applicationsByStatus[status]?.length > 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Pending':
      case 'Submitted':
        return 'bg-yellow-100 text-yellow-800';
      case 'Conditionally Approved':
        return 'bg-blue-100 text-blue-800';
      case 'Pending Signature':
        return 'bg-purple-100 text-purple-800';
      case 'Booked':
      case 'Funded':
        return 'bg-emerald-100 text-emerald-800';
      case 'Declined':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {statusesWithApps.map((status) => (
        <div key={status} className="flex-shrink-0 w-80">
          <div className="bg-gray-50 rounded-lg p-2">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-sm">{status}</h3>
              <Badge className={`${getStatusColor(status)} border-0 text-xs px-1.5 py-0.5`}>
                {applicationsByStatus[status].length}
              </Badge>
            </div>
            <div className="space-y-2">
              {applicationsByStatus[status].map((application) => (
                <ApplicationCard key={application.id} application={application} />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanbanView;
