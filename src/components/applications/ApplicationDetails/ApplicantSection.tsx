
import React from 'react';
import { ApplicantInfo } from '@/types/application';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import DataField from './DataField';

interface ApplicantSectionProps {
  applicantInfo: ApplicantInfo;
  title: string;
  onViewCreditReport?: () => void;
}

const ApplicantSection: React.FC<ApplicantSectionProps> = ({ applicantInfo, title, onViewCreditReport }) => {
  // Handle missing applicant info
  if (!applicantInfo) {
    return (
      <section>
        <h4 className="text-base font-medium mb-2">{title}</h4>
        <p className="text-sm text-muted-foreground">No applicant data available</p>
      </section>
    );
  }

  // Detect if this is a Canadian address by checking postal code format
  // Canadian postal codes contain letters (e.g., H2X 2T3), US zip codes are numeric (e.g., 94107)
  const isCanadianAddress = /[A-Z]/i.test(applicantInfo.zipCode || '');
  
  return (
    <section>
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-base font-medium">{title}</h4>
        {onViewCreditReport && (
          <Button
            variant="outline"
            size="sm"
            onClick={onViewCreditReport}
            className="flex items-center space-x-2"
          >
            <FileText className="h-4 w-4" />
            <span>View Credit Report</span>
          </Button>
        )}
      </div>
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
        <DataField label={isCanadianAddress ? "Province" : "State"} value={applicantInfo.state} />
        <DataField label={isCanadianAddress ? "Postal Code" : "Zip Code"} value={applicantInfo.zipCode} />
        
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
