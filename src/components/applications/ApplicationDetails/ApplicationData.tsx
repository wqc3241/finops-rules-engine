import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ApplicantInfo, VehicleData, AppDTReferences } from '@/types/application';
interface ApplicationDataProps {
  applicantInfo: ApplicantInfo;
  coApplicantInfo?: ApplicantInfo;
  vehicleData: VehicleData;
  appDtReferences: AppDTReferences;
}
const ApplicationData: React.FC<ApplicationDataProps> = ({
  applicantInfo,
  coApplicantInfo,
  vehicleData,
  appDtReferences
}) => {
  return;
};
const DataField: React.FC<{
  label: string;
  value: string;
}> = ({
  label,
  value
}) => <div className="flex">
    <span className="text-sm text-gray-600 min-w-[200px]">{label}</span>
    <span className="text-sm font-medium">{value}</span>
  </div>;
export default ApplicationData;