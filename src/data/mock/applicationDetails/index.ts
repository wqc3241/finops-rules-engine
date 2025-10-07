
import { ApplicationFullDetails, FinancialSummary } from '../../../types/application';
import { baseApplicationDetails } from './baseApplicationDetails';
import { declinedApplications } from './declined';
import { conditionallyApprovedApplications } from './conditionallyApproved';
import { pendingSignatureApplications } from './pendingSignature';
import { bookedApplications } from './booked';
import { fundedApplications } from './funded';
import { approvedApplications } from './approved';
import { pendingApplications } from './pending';
import { submittedApplications } from './submitted';
import { canadaApplicationDetails } from './canadaIndex';
import { loanFinancialSummaryData } from '../loanFinancialSummary';
import { financialSummaryData } from '../financialSummary';
import { canadaLeaseFinancialSummary } from '../canadaLeaseFinancialSummary';
import { canadaLoanFinancialSummary } from '../canadaLoanFinancialSummary';

// Helper function to create lender-specific financial summaries
const createLenderSummaries = (application: ApplicationFullDetails): void => {
  // Skip if no deal structure
  if (!application.dealStructure || !application.financialSummary) return;
  
  // Initialize lender summaries - IMPORTANT: create a new object instead of modifying existing one
  // This ensures we only have lenders from this specific application
  application.financialSummary.lenderSummaries = {};
  
  // Get the application type to determine which data to use
  const applicationType = application.details?.type || 'Lease';
  
  // Determine if this is a Canadian application based on order number
  const isCanadianApp = application.details?.orderNumber?.startsWith('CA-ORD');
  
  // Process all offers based on the application type
  // For loan applications, all offers should use loan financial data
  // For lease applications, all offers should use lease financial data
  application.dealStructure.forEach(offer => {
    if (applicationType === 'Loan') {
      // For loan applications, use loan financial data for all offers
      const loanData = isCanadianApp ? canadaLoanFinancialSummary : loanFinancialSummaryData;
      application.financialSummary!.lenderSummaries![offer.lenderName] = {
        type: 'Loan',
        tabs: ['Requested', 'Approved', 'Customer'],
        activeTab: 'Approved',
        selectedForCustomer: false,
        requested: { ...loanData.requested },
        approved: { ...loanData.approved },
        customer: { ...loanData.customer }
      };
    } else {
      // For lease applications, use lease financial data for all offers
      const leaseData = isCanadianApp ? canadaLeaseFinancialSummary : financialSummaryData;
      application.financialSummary!.lenderSummaries![offer.lenderName] = {
        type: 'Lease',
        tabs: ['Requested', 'Approved', 'Customer'],
        activeTab: 'Approved',
        selectedForCustomer: false,
        requested: { ...leaseData.requested },
        approved: { ...leaseData.approved },
        customer: { ...leaseData.customer }
      };
    }
  });
};

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
    ...submittedApplications,
    ...canadaApplicationDetails
  };

  // Return specific application details if found, otherwise return base details
  const foundApplication = allApplications[id];
  
  if (foundApplication) {
    // Get the application type directly from the details
    // Ensure it's either "Lease" or "Loan" - cast it to the correct type
    const appType = (foundApplication.details?.type || 'Lease') as 'Lease' | 'Loan';
    
    // Ensure the financialSummary includes the type field
    if (foundApplication.financialSummary) {
      foundApplication.financialSummary.type = appType;
      
      // Determine if this is a Canadian application
      const isCanadianApp = foundApplication.details?.orderNumber?.startsWith('CA-ORD');
      
      // If it's a loan application, add loan data
      if (appType === 'Loan' && !foundApplication.financialSummary.loan) {
        const loanData = isCanadianApp ? canadaLoanFinancialSummary : loanFinancialSummaryData;
        foundApplication.financialSummary.loan = {
          tabs: ['Requested', 'Approved', 'Customer'],
          activeTab: 'Approved',
          ...loanData
        };
      }
      
      // If it's a lease application, make sure lfs data is set and loan data is removed
      if (appType === 'Lease') {
        if (!foundApplication.financialSummary.lfs) {
          const leaseData = isCanadianApp ? canadaLeaseFinancialSummary : financialSummaryData;
          foundApplication.financialSummary.lfs = {
            tabs: ['Requested', 'Approved', 'Customer'],
            activeTab: 'Approved',
            ...leaseData
          };
        }
        // This prevents any confusion when displaying financial summaries
        if (foundApplication.financialSummary.loan) {
          delete foundApplication.financialSummary.loan;
        }
      }
      
      // Create lender-specific financial summaries with correct data types
      createLenderSummaries(foundApplication);
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
