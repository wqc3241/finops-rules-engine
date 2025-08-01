import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ApplicationDetails, VehicleData } from '@/types/application';

interface ApplicationHeaderProps {
  details: ApplicationDetails;
  vehicleData?: VehicleData;
  deliveryDate?: string;
}

const ApplicationHeader: React.FC<ApplicationHeaderProps> = ({ details, vehicleData, deliveryDate }) => {
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
    <div className="sticky top-0 z-10 bg-gray-50 border-b border-gray-200 pb-4 mb-4">
      <div className="flex items-center mb-1">
        <Link to="/applications" className="flex items-center text-gray-600 hover:text-gray-800">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div className="ml-2 flex-1">
          <div className="flex items-center flex-wrap gap-4">
            <h2 className="text-lg font-medium">Order Number: {details.orderNumber}</h2>
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusColor}`}>
              {details.status}
            </span>
            <span className="text-sm text-gray-600">
              <span className="font-medium">Type:</span> {details.type || 'N/A'}
            </span>
            {vehicleData?.vin && (
              <span className="text-sm text-gray-600">
                <span className="font-medium">VIN:</span> <span className="font-mono">{vehicleData.vin}</span>
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {details.model} ordered by {details.orderedBy}
          </p>
        </div>
      </div>
      
      {/* Summary Information Section */}
      {deliveryDate && (
        <div className="mt-3 text-sm">
          <div className="flex flex-col">
            <span className="text-gray-500 font-medium">Delivery Date</span>
            <span className="text-gray-900">{deliveryDate}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationHeader;
