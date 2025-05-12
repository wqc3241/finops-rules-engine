
import { ApplicationFullDetails } from '../../../types/application';
import { baseApplicationDetails } from './baseApplicationDetails';
import { declinedApplications } from './declined';
import { conditionallyApprovedApplications } from './conditionallyApproved';
import { pendingSignatureApplications } from './pendingSignature';
import { bookedApplications } from './booked';
import { fundedApplications } from './funded';
import { approvedApplications } from './approved';
import { pendingApplications } from './pending';
import { submittedApplications } from './submitted';
import { loanFinancialSummaryData } from '../loanFinancialSummary';

// Define known loan application IDs
const loanApplicationIds = ['5', '7', '10', '11', '13', '15', '17'];

// Function to get application details by ID
export const getMockApplicationDetailsById = (id: string): ApplicationFullDetails => {
  // Combine all application details
  const allApplications = {
    ...declinedApplications,
    ...conditionallyApprovedApplications,
    ...pendingSignatureApplications,
    ...bookedApplications,
    ...fundedApplications,
    ...approvedApplications,
    ...pendingApplications,
    ...submittedApplications
  };

  // Return specific application details if found, otherwise return base details
  const foundApplication = allApplications[id];
  
  if (foundApplication) {
    // Get the application type directly from the details
    const appType = foundApplication.details?.type || 'Lease';
    
    // Ensure the financialSummary includes the type field
    if (foundApplication.financialSummary) {
      foundApplication.financialSummary.type = appType;
      
      // If it's a loan application, add loan data
      if (appType === 'Loan' && !foundApplication.financialSummary.loan) {
        foundApplication.financialSummary.loan = {
          tabs: ['Requested', 'Approved', 'Customer'],
          activeTab: 'Approved',
          ...loanFinancialSummaryData
        };
      }
    }
    
    return {
      ...foundApplication,
      // Ensure notes is an array for consistency
      notes: Array.isArray(foundApplication.notes) ? foundApplication.notes : []
    };
  }
  
  return {
    ...baseApplicationDetails,
    notes: [] // Ensure base details has empty notes array
  };
};
