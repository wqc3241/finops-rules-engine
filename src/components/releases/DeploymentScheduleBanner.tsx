import { Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DeploymentSchedule } from '@/types/deployment';
import { getTimezoneDisplay } from '@/utils/deploymentUtils';

interface DeploymentScheduleBannerProps {
  schedule: DeploymentSchedule | null;
}

const DeploymentScheduleBanner = ({ schedule }: DeploymentScheduleBannerProps) => {
  if (!schedule) return null;

  const timezoneDisplay = getTimezoneDisplay(schedule.timezone);

  return (
    <Alert className="bg-blue-50 border-blue-200">
      <Info className="h-4 w-4 text-blue-600" />
      <AlertDescription className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-blue-900">
            🕐 Automatic deployment scheduled daily at {schedule.schedule_time} {timezoneDisplay}
          </span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-3 w-3 text-blue-600" />
              </TooltipTrigger>
              <TooltipContent className="max-w-sm">
                <p className="text-xs">
                  All approved changes are automatically deployed every day at the scheduled time. 
                  You can also deploy changes immediately using the "Deploy Now" button.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        {schedule.is_enabled ? (
          <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
            Enabled
          </span>
        ) : (
          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
            Disabled
          </span>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default DeploymentScheduleBanner;
