
import React from 'react';
import { ApplicantInfo } from '@/types/application';
import DataField from './DataField';

interface ApplicantSectionProps {
  applicantInfo: ApplicantInfo;
  title: string;
}

const ApplicantSection: React.FC<ApplicantSectionProps> = ({ applicantInfo, title }) => {
  return (
    <section>
      <h4 className="text-base font-medium mb-2">{title}</h4>
      <div className="grid grid-cols-1 gap-y-1">
        <DataField label="Relationship" value={applicantInfo.relationship} />
        <DataField label="First Name" value={applicantInfo.firstName} />
        <DataField label="Middle Name" value={applicantInfo.middleName} />
        <DataField label="Last Name" value={applicantInfo.lastName} />
        <DataField label="Email Address" value={applicantInfo.emailAddress} />
        <DataField label="Contact Number" value={applicantInfo.contactNumber} />
        <DataField label="DOB" value={applicantInfo.dob} />
        
        <h5 className="text-sm font-medium mt-2 mb-1">Housing Details</h5>
        <DataField label="Residence Type" value={applicantInfo.residenceType} />
        <DataField label="Housing Payment Amount (Monthly)" value={applicantInfo.housingPaymentAmount} />
        <DataField label="Address: House # & Street" value={applicantInfo.address} />
        <DataField label="City" value={applicantInfo.city} />
        <DataField label="State" value={applicantInfo.state} />
        <DataField label="Zip Code" value={applicantInfo.zipCode} />
        
        <h5 className="text-sm font-medium mt-2 mb-1">Employment Details</h5>
        <DataField label="Employment Type" value={applicantInfo.employmentType} />
        <DataField label="Employer Name" value={applicantInfo.employerName} />
        <DataField label="Job Title" value={applicantInfo.jobTitle} />
        <DataField label="Annual Income" value={applicantInfo.incomeAmount} />
        <DataField label="Other Source of Income" value={applicantInfo.otherSourceOfIncome} />
        <DataField label="Other Income Amount (Annual)" value={applicantInfo.otherIncomeAmount} />
      </div>
    </section>
  );
};

export default ApplicantSection;
