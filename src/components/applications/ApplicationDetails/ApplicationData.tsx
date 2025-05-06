
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
  appDtReferences,
}) => {
  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Application Data</h3>
          <div className="flex items-center">
            <Button variant="outline">Edit</Button>
            <ChevronUp className="ml-4 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <section>
            <h4 className="text-md font-medium mb-4">Applicant</h4>
            <div className="grid grid-cols-1 gap-y-3">
              <DataField label="Relationship" value={applicantInfo.relationship} />
              <DataField label="First Name" value={applicantInfo.firstName} />
              <DataField label="Middle Name" value={applicantInfo.middleName} />
              <DataField label="Last Name" value={applicantInfo.lastName} />
              <DataField label="Email Address" value={applicantInfo.emailAddress} />
              <DataField label="Contact Number" value={applicantInfo.contactNumber} />
              <DataField label="DOB" value={applicantInfo.dob} />
              <DataField label="Residence Type" value={applicantInfo.residenceType} />
              <DataField label="Housing Payment Amount (Monthly)" value={applicantInfo.housingPaymentAmount} />
              <DataField label="Address: House # & Street" value={applicantInfo.address} />
              <DataField label="City" value={applicantInfo.city} />
              <DataField label="State" value={applicantInfo.state} />
              <DataField label="Zip Code" value={applicantInfo.zipCode} />
              <DataField label="Employment Type" value={applicantInfo.employmentType} />
              <DataField label="Employer Name" value={applicantInfo.employerName} />
              <DataField label="Job Title" value={applicantInfo.jobTitle} />
              <DataField label="Income Amount (Monthly)" value={applicantInfo.incomeAmount} />
              <DataField label="Other Source of Income" value={applicantInfo.otherSourceOfIncome} />
              <DataField label="Other Income Amount (Monthly)" value={applicantInfo.otherIncomeAmount} />
            </div>
          </section>

          {coApplicantInfo && (
            <section>
              <h4 className="text-md font-medium mb-4">Co-Applicant</h4>
              <div className="grid grid-cols-1 gap-y-3">
                <DataField label="Relationship" value={coApplicantInfo.relationship} />
                <DataField label="First Name" value={coApplicantInfo.firstName} />
                <DataField label="Middle Name" value={coApplicantInfo.middleName} />
                <DataField label="Last Name" value={coApplicantInfo.lastName} />
                <DataField label="Email Address" value={coApplicantInfo.emailAddress} />
                <DataField label="Contact Number" value={coApplicantInfo.contactNumber} />
                <DataField label="DOB" value={coApplicantInfo.dob} />
                <DataField label="Residence Type" value={coApplicantInfo.residenceType} />
                <DataField label="Housing Payment Amount (Monthly)" value={coApplicantInfo.housingPaymentAmount} />
                <DataField label="Address: House # & Street" value={coApplicantInfo.address} />
                <DataField label="City" value={coApplicantInfo.city} />
                <DataField label="State" value={coApplicantInfo.state} />
                <DataField label="Zip Code" value={coApplicantInfo.zipCode} />
                <DataField label="Employment Type" value={coApplicantInfo.employmentType} />
                <DataField label="Employer Name" value={coApplicantInfo.employerName} />
                <DataField label="Job Title" value={coApplicantInfo.jobTitle} />
                <DataField label="Income Amount (Monthly)" value={coApplicantInfo.incomeAmount} />
                <DataField label="Other Source of Income" value={coApplicantInfo.otherSourceOfIncome} />
                <DataField label="Other Income Amount (Monthly)" value={coApplicantInfo.otherIncomeAmount} />
              </div>
            </section>
          )}

          <section className="mt-6">
            <h4 className="text-md font-medium mb-4">Vehicle Data</h4>
            <div className="grid grid-cols-1 gap-y-3">
              <DataField label="VIN" value={vehicleData.vin} />
              <DataField label="Trim" value={vehicleData.trim} />
              <DataField label="Year" value={vehicleData.year} />
              <DataField label="Model" value={vehicleData.model} />
              <DataField label="MSRP" value={vehicleData.msrp} />
              <DataField label="GCC/Cash Price" value={vehicleData.gccCashPrice} />
              <DataField label="Applicable Discounts" value={vehicleData.applicableDiscounts} />
              <DataField label="Total Discount Amount" value={vehicleData.totalDiscountAmount} />
            </div>
          </section>

          <section className="mt-6">
            <h4 className="text-md font-medium mb-4">App & DT References</h4>
            <div className="grid grid-cols-1 gap-y-3">
              <DataField label="DT Portal State" value={appDtReferences.dtPortalState} />
              <DataField label="DT ID" value={appDtReferences.dtId} />
              <DataField label="Application Date" value={appDtReferences.applicationDate} />
            </div>
          </section>
        </div>
      </CardContent>
    </Card>
  );
};

const DataField: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex">
    <span className="text-sm text-gray-600 min-w-[200px]">{label}</span>
    <span className="text-sm font-medium">{value}</span>
  </div>
);

export default ApplicationData;
