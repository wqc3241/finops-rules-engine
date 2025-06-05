import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ApplicationDetails } from '@/types/application';

interface ApplicationHeaderProps {
  details: ApplicationDetails;
}

const ApplicationHeader: React.FC<ApplicationHeaderProps> = ({ details }) => {
  // Enhanced status color mapping with more statuses (text colors for badges)
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-orange-100 text-orange-800';
      case 'Submitted':
        return 'bg-blue-100 text-blue-800';
      case 'Rejected':
      case 'Declined':
        return 'bg-red-100 text-red-800';
      case 'Conditionally Approved':
        return 'bg-purple-100 text-purple-800';
      case 'Pending Signature':
        return 'bg-yellow-100 text-yellow-800';
      case 'Booked':
        return 'bg-indigo-100 text-indigo-800';
      case 'Funded':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const statusColor = getStatusColor(details.status);

  return (
    <div className="sticky top-0 z-20 bg-gray-50 border-b border-gray-200 pb-4 mb-4">
      <div className="flex items-center mb-1">
        <Link to="/applications" className="flex items-center text-gray-600 hover:text-gray-800">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div className="ml-2">
          <div className="flex items-center">
            <h2 className="text-lg font-medium">Order Number: {details.orderNumber}</h2>
            <span className={`ml-4 px-3 py-1 text-sm font-medium rounded-full ${statusColor}`}>
              {details.status}
            </span>
          </div>
          <p className="text-sm text-gray-600">
            {details.model} ordered by {details.orderedBy}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApplicationHeader;
