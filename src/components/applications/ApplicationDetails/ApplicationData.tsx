
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
  return (
    <div className="space-y-6">
      {/* Applicant Information */}
      <div>
        <h3 className="text-md font-semibold mb-4">Primary Applicant</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DataField label="Name" value={`${applicantInfo.firstName} ${applicantInfo.middleName || ''} ${applicantInfo.lastName}`.trim()} />
          <DataField label="Email" value={applicantInfo.emailAddress} />
          <DataField label="Phone" value={applicantInfo.contactNumber} />
          <DataField label="Date of Birth" value={applicantInfo.dob} />
          <DataField label="Address" value={`${applicantInfo.address}, ${applicantInfo.city}, ${applicantInfo.state} ${applicantInfo.zipCode}`} />
          <DataField label="Employment Type" value={applicantInfo.employmentType} />
          <DataField label="Employer" value={applicantInfo.employerName} />
          <DataField label="Job Title" value={applicantInfo.jobTitle} />
          <DataField label="Income Amount" value={applicantInfo.incomeAmount} />
          <DataField label="Housing Payment" value={applicantInfo.housingPaymentAmount} />
        </div>
      </div>

      {/* Co-Applicant Information */}
      {coApplicantInfo && (
        <div>
          <h3 className="text-md font-semibold mb-4">Co-Applicant</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DataField label="Name" value={`${coApplicantInfo.firstName} ${coApplicantInfo.middleName || ''} ${coApplicantInfo.lastName}`.trim()} />
            <DataField label="Email" value={coApplicantInfo.emailAddress} />
            <DataField label="Phone" value={coApplicantInfo.contactNumber} />
            <DataField label="Date of Birth" value={coApplicantInfo.dob} />
            <DataField label="Address" value={`${coApplicantInfo.address}, ${coApplicantInfo.city}, ${coApplicantInfo.state} ${coApplicantInfo.zipCode}`} />
            <DataField label="Employment Type" value={coApplicantInfo.employmentType} />
            <DataField label="Employer" value={coApplicantInfo.employerName} />
            <DataField label="Job Title" value={coApplicantInfo.jobTitle} />
            <DataField label="Income Amount" value={coApplicantInfo.incomeAmount} />
            <DataField label="Housing Payment" value={coApplicantInfo.housingPaymentAmount} />
          </div>
        </div>
      )}

      {/* Vehicle Information */}
      <div>
        <h3 className="text-md font-semibold mb-4">Vehicle Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DataField label="VIN" value={vehicleData.vin} />
          <DataField label="Year" value={vehicleData.year} />
          <DataField label="Model" value={vehicleData.model} />
          <DataField label="Trim" value={vehicleData.trim} />
          <DataField label="MSRP" value={vehicleData.msrp} />
          <DataField label="GCC Cash Price" value={vehicleData.gccCashPrice} />
          <DataField label="Applicable Discounts" value={vehicleData.applicableDiscounts} />
          <DataField label="Total Discount Amount" value={vehicleData.totalDiscountAmount} />
        </div>
      </div>

      {/* Application References */}
      <div>
        <h3 className="text-md font-semibold mb-4">Application References</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DataField label="DT Portal State" value={appDtReferences.dtPortalState} />
          <DataField label="DT ID" value={appDtReferences.dtId} />
          <DataField label="Application Date" value={appDtReferences.applicationDate} />
        </div>
      </div>
    </div>
  );
};

const DataField: React.FC<{
  label: string;
  value: string;
}> = ({
  label,
  value
}) => (
  <div className="flex">
    <span className="text-sm text-gray-600 min-w-[200px]">{label}</span>
    <span className="text-sm font-medium">{value}</span>
  </div>
);

export default ApplicationData;
