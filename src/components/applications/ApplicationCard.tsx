
import React from 'react';
import { Application } from '../../types/application';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

interface ApplicationCardProps {
  application: Application;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ application }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/applications/${application.id}`);
  };

  const statusColor = application.status === 'Approved' ? 'bg-green-500' : 
                      application.status === 'Pending' ? 'bg-orange-500' : 
                      application.status === 'Submitted' ? 'bg-blue-500' :
                      application.status === 'Rejected' ? 'bg-red-500' : 'bg-blue-500';

  // Get the latest note content from the notesArray (if available)
  const latestNoteContent = application.notesArray && application.notesArray.length > 0 
    ? application.notesArray[0].content 
    : application.notes;

  // Format the timestamp if it exists
  const formattedDate = application.date 
    ? format(new Date(application.date), 'MMM d, yyyy h:mm a')
    : 'No date';

  return (
    <div 
      className="bg-white rounded-lg shadow-sm mb-4 cursor-pointer overflow-hidden hover:shadow-md transition-shadow"
      onClick={handleClick}
    >
      <div className="relative">
        <div className="p-4 border-l-4 border-transparent hover:border-gray-300">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  {application.orderNumber}
                </h3>
                <ChevronRight className="text-gray-400" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Name</p>
                  <p className="text-gray-800">{application.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Type</p>
                  <p className="text-gray-800">{application.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Status</p>
                  <p className="flex items-center">
                    <span className={`w-2 h-2 rounded-full ${statusColor} mr-2`}></span>
                    <span className="text-gray-800">{application.status}</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-1 ml-8">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Notes</p>
                  <p className="text-gray-600 text-sm line-clamp-2">{latestNoteContent}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 mb-1">Submitted</p>
                  <p className="text-gray-600 text-sm">{formattedDate}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute right-0 top-0 h-full w-1 bg-green-500"></div>
      </div>
    </div>
  );
};

export default ApplicationCard;
