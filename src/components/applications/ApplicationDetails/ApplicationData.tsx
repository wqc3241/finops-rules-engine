
import React from 'react';
import { ApplicantInfo, VehicleData, AppDTReferences } from '@/types/application';
import ApplicantSection from './ApplicantSection';
import VehicleDataSection from './VehicleDataSection';
import AppDTReferencesSection from './AppDTReferencesSection';

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
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
      <ApplicantSection applicantInfo={applicantInfo} title="Applicant" />
      
      {coApplicantInfo && (
        <ApplicantSection applicantInfo={coApplicantInfo} title="Co-Applicant" />
      )}

      <VehicleDataSection vehicleData={vehicleData} />

      <AppDTReferencesSection appDtReferences={appDtReferences} />
    </div>
  );
};

export default ApplicationData;
