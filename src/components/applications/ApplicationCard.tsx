
import React from 'react';
import { Application } from '../../types/application';
import { ChevronRight, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { formatOrderNumberWithSequence, isReapplication, getSequenceLabel } from '@/utils/reapplicationUtils';

interface ApplicationCardProps {
  application: Application;
  isKanbanView?: boolean;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ application, isKanbanView = false }) => {
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
      case 'Pending Reapply':
        return 'bg-orange-600';
      case 'Void':
        return 'bg-gray-400';
      default:
        return 'bg-gray-500';
    }
  };

  const statusColor = getStatusColor(application.status);

  // Get the latest note content from notesArray
  const getLatestNoteContent = () => {
    // First check if notesArray exists and has content
    if (application.notesArray && application.notesArray.length > 0) {
      // Create a copy of the array to avoid mutation
      const sortedNotes = [...application.notesArray].sort((a, b) => {
        // Convert date strings to Date objects for comparison
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        
        if (dateA.getTime() === dateB.getTime()) {
          // If dates are the same, compare times
          // Convert time strings to 24h format for comparison
          const parseTime = (timeStr: string) => {
            if (!timeStr) return 0;
            
            const time = timeStr.toLowerCase();
            let [hours, minutes] = time.split(':').map(part => {
              // Extract just the numbers
              return parseInt(part.replace(/[^0-9]/g, ''), 10);
            });
            
            // Adjust for PM
            if (time.includes('pm') && hours < 12) {
              hours += 12;
            }
            // Adjust for 12 AM
            if (time.includes('am') && hours === 12) {
              hours = 0;
            }
            
            return (hours * 60) + minutes;
          };
          
          const timeA = parseTime(a.time);
          const timeB = parseTime(b.time);
          
          return timeB - timeA; // Latest time first
        }
        
        return dateB.getTime() - dateA.getTime(); // Latest date first
      });
      
      return sortedNotes[0].content;
    }
    
    // Fallback to the legacy notes field if no notesArray
    return application.notes || 'No notes available';
  };

  const latestNoteContent = getLatestNoteContent();

  // Format the timestamp if it exists
  const formattedDate = application.date 
    ? format(new Date(application.date), 'MMM d, yyyy h:mm a')
    : 'No date';

  // Format date without time for Kanban view
  const formattedDateOnly = application.date 
    ? format(new Date(application.date), 'MMM d, yyyy')
    : 'No date';

  if (isKanbanView) {
    return (
      <div 
        className="bg-white rounded-lg shadow-sm mb-2 cursor-pointer overflow-hidden hover:shadow-md transition-shadow"
        onClick={handleClick}
      >
        <div className="relative">
          <div className="p-3 border-l-4 border-transparent hover:border-gray-300">
            <div className="flex justify-between items-center mb-2">
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1">
                  <h3 className="text-sm font-medium text-gray-900">{formatOrderNumberWithSequence(application)}</h3>
                  {isReapplication(application) && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <RotateCcw className="text-blue-500 w-3 h-3" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">{getSequenceLabel(application)}</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
                <p className="text-xs text-gray-500">App ID: {application.id}</p>
              </div>
              <ChevronRight className="text-gray-400 w-3 h-3" />
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Name</p>
                <p className="text-gray-800 text-xs font-medium">{application.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Type</p>
                <p className="text-gray-800 text-xs">{application.type}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Submitted</p>
                <p className="text-gray-600 text-xs">{formattedDateOnly}</p>
              </div>
            </div>
          </div>
          <div className={`absolute right-0 top-0 h-full w-1 ${statusColor}`}></div>
        </div>
      </div>
    );
  }

  // Original list view layout
  return (
    <div 
      className="bg-white rounded-lg shadow-sm mb-2 cursor-pointer overflow-hidden hover:shadow-md transition-shadow"
      onClick={handleClick}
    >
      <div className="relative">
        <div className="p-2 border-l-4 border-transparent hover:border-gray-300">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1">
                    <h3 className="text-sm font-medium text-gray-900">{formatOrderNumberWithSequence(application)}</h3>
                    {isReapplication(application) && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <RotateCcw className="text-blue-500 w-3 h-3" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">{getSequenceLabel(application)}</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">App ID: {application.id}</p>
                </div>
                <ChevronRight className="text-gray-400 w-3 h-3" />
              </div>
              <div className="grid grid-cols-4 gap-2">
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Name</p>
                  <p className="text-gray-800 text-xs font-medium truncate">{application.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Type</p>
                  <p className="text-gray-800 text-xs">{application.type}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">State</p>
                  <p className="text-gray-800 text-xs">{application.state || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Status</p>
                  <p className="flex items-center">
                    <span className={`w-1.5 h-1.5 rounded-full ${statusColor} mr-1`}></span>
                    <span className="text-gray-800 text-xs truncate">{application.status}</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-1 ml-4">
              <div className="flex justify-between">
                <div className="flex-1 mr-2">
                  <p className="text-xs text-gray-500 mb-0.5">Notes</p>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="text-gray-600 text-xs line-clamp-2 leading-tight">{latestNoteContent}</p>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs text-xs">{latestNoteContent}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-gray-500 mb-0.5">Submitted</p>
                  <p className="text-gray-600 text-xs">{formattedDate}</p>
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
