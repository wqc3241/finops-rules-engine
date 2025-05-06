
import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ApplicationDetails } from '@/types/application';

interface ApplicationHeaderProps {
  details: ApplicationDetails;
}

const ApplicationHeader: React.FC<ApplicationHeaderProps> = ({ details }) => {
  return (
    <div className="border-b border-gray-200 pb-4 mb-4">
      <div className="flex items-center mb-1">
        <Link to="/applications" className="flex items-center text-gray-600 hover:text-gray-800">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div className="ml-2">
          <div className="flex items-center">
            <h2 className="text-lg font-medium">Order Number: {details.orderNumber}</h2>
            <span className={`ml-4 px-3 py-1 text-sm font-medium rounded-full ${
              details.status === 'Approved' ? 'bg-green-100 text-green-800' : 
              details.status === 'On Track' ? 'bg-blue-100 text-blue-800' : 
              'bg-gray-100 text-gray-800'
            }`}>
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
