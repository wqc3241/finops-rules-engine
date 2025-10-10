
import React, { useState } from 'react';
import { ApplicantInfo, VehicleData, AppDTReferences } from '@/types/application';
import { CreditReport } from '@/types/application/creditReport';
import { mockCreditReports } from '@/data/mock/creditReports';
import ApplicantSection from './ApplicantSection';
import VehicleDataSection from './VehicleDataSection';
import AppDTReferencesSection from './AppDTReferencesSection';
import CreditReportModal from './CreditReport/CreditReportModal';

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
  const [creditReportModal, setCreditReportModal] = useState<{
    isOpen: boolean;
    reportType: 'primary' | 'coApplicant' | null;
  }>({
    isOpen: false,
    reportType: null
  });

  const handleViewCreditReport = (type: 'primary' | 'coApplicant') => {
    setCreditReportModal({
      isOpen: true,
      reportType: type
    });
  };

  const closeCreditReportModal = () => {
    setCreditReportModal({
      isOpen: false,
      reportType: null
    });
  };

  const getCurrentCreditReport = (): CreditReport | null => {
    if (!creditReportModal.reportType) return null;
    return creditReportModal.reportType === 'primary' 
      ? mockCreditReports.primary 
      : mockCreditReports.coApplicant;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-base">
      <ApplicantSection 
        applicantInfo={applicantInfo} 
        title="Applicant" 
        onViewCreditReport={() => handleViewCreditReport('primary')}
      />
      
      {coApplicantInfo && (
        <ApplicantSection 
          applicantInfo={coApplicantInfo} 
          title="Co-Applicant"
          onViewCreditReport={() => handleViewCreditReport('coApplicant')}
        />
      )}

      <VehicleDataSection vehicleData={vehicleData} />

      <AppDTReferencesSection appDtReferences={appDtReferences} />

      {creditReportModal.isOpen && getCurrentCreditReport() && (
        <CreditReportModal
          isOpen={creditReportModal.isOpen}
          onClose={closeCreditReportModal}
          creditReport={getCurrentCreditReport()!}
        />
      )}
    </div>
  );
};

export default ApplicationData;
