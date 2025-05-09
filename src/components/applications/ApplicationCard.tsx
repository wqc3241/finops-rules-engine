
import React from 'react';
import { Application } from '../../types/application';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";

interface ApplicationCardProps {
  application: Application;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ application }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/applications/${application.id}`);
  };

  // Enhanced status color mapping to match application details page
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-500';
      case 'Pending':
        return 'bg-orange-500';
      case 'Submitted':
        return 'bg-blue-500';
      case 'Rejected':
      case 'Declined':
        return 'bg-red-500';
      case 'Conditionally Approved':
        return 'bg-purple-500';
      case 'Pending Signature':
        return 'bg-yellow-500';
      case 'Booked':
        return 'bg-indigo-500';
      case 'Funded':
        return 'bg-emerald-500';
      default:
        return 'bg-gray-500';
    }
  };

  const statusColor = getStatusColor(application.status);

  // Fixed function to get the latest note content - ensure proper sorting
  const getLatestNoteContent = () => {
    // Check if the notesArray exists and has content
    if (application.notesArray && application.notesArray.length > 0) {
      // Sort by date and time to ensure the most recent is first
      // Make a copy of the array to avoid mutating the original
      const sortedNotes = [...application.notesArray].sort((a, b) => {
        // Convert date strings to Date objects for comparison
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        
        // If dates are the same, compare times
        if (dateA.toDateString() === dateB.toDateString()) {
          // Parse time strings to comparable values
          const timeA = a.time ? a.time.replace(/[^0-9:]/g, '') : '';
          const timeB = b.time ? b.time.replace(/[^0-9:]/g, '') : '';
          
          // Check if PM/AM is in the time string for 12-hour format
          const isPmA = a.time && a.time.toLowerCase().includes('pm');
          const isPmB = b.time && b.time.toLowerCase().includes('pm');
          
          // Convert times to minutes for comparison
          const getMinutes = (time: string, isPm: boolean) => {
            if (!time) return 0;
            const [hours, minutes] = time.split(':').map(Number);
            // Handle 12-hour format
            let adjustedHours = hours;
            if (isPm && hours < 12) adjustedHours += 12;
            if (!isPm && hours === 12) adjustedHours = 0;
            return adjustedHours * 60 + minutes;
          };
          
          const minutesA = getMinutes(timeA, isPmA);
          const minutesB = getMinutes(timeB, isPmB);
          
          return minutesB - minutesA; // Latest time first
        }
        
        // Otherwise sort by date
        return dateB.getTime() - dateA.getTime(); // Latest date first
      });
      
      // Return content of the first (latest) note after sorting
      return sortedNotes[0].content;
    }
    
    // Fallback to the notes string field if notesArray is empty or undefined
    return application.notes || 'No notes available';
  };

  const latestNoteContent = getLatestNoteContent();

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
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="text-gray-600 text-sm line-clamp-2">{latestNoteContent}</p>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{latestNoteContent}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 mb-1">Submitted</p>
                  <p className="text-gray-600 text-sm">{formattedDate}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={`absolute right-0 top-0 h-full w-1 ${statusColor}`}></div>
      </div>
    </div>
  );
};

export default ApplicationCard;
