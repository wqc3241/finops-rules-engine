
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
import { loanFinancialSummaryData } from '../loanFinancialSummary';
import { financialSummaryData } from '../financialSummary';

// Helper function to create lender-specific financial summaries
const createLenderSummaries = (application: ApplicationFullDetails): void => {
  // Skip if no deal structure
  if (!application.dealStructure || !application.financialSummary) return;
  
  // Initialize lender summaries - IMPORTANT: create a new object instead of modifying existing one
  // This ensures we only have lenders from this specific application
  application.financialSummary.lenderSummaries = {};
  
  // Get the application type to determine which data to use
  const applicationType = application.details?.type || 'Lease';
  
  // Filter lease and loan offers from dealStructure
  const leaseOffers = application.dealStructure.filter(offer => offer.applicationType !== 'Loan');
  const loanOffers = application.dealStructure.filter(offer => offer.applicationType === 'Loan');
  
  // Process lease offers
  leaseOffers.forEach(offer => {
    // Create a new lender summary based on the lease financial data
    application.financialSummary!.lenderSummaries![offer.lenderName] = {
      type: 'Lease',
      tabs: ['Requested', 'Approved', 'Customer'],
      activeTab: 'Approved',
      selectedForCustomer: false,
      requested: { ...financialSummaryData.requested },
      approved: { ...financialSummaryData.approved },
      customer: { ...financialSummaryData.customer }
    };
  });
  
  // Process loan offers - use loan data for loan applications
  loanOffers.forEach(offer => {
    // For loan applications, use loan financial data
    if (applicationType === 'Loan') {
      application.financialSummary!.lenderSummaries![offer.lenderName] = {
        type: 'Loan',
        tabs: ['Requested', 'Approved', 'Customer'],
        activeTab: 'Approved',
        selectedForCustomer: false,
        requested: { ...loanFinancialSummaryData.requested },
        approved: { ...loanFinancialSummaryData.approved },
        customer: { ...loanFinancialSummaryData.customer }
      };
    } else {
      // For non-loan applications with loan offers, still use loan data
      application.financialSummary!.lenderSummaries![offer.lenderName] = {
        type: 'Loan',
        tabs: ['Requested', 'Approved', 'Customer'],
        activeTab: 'Approved',
        selectedForCustomer: false,
        requested: { ...loanFinancialSummaryData.requested },
        approved: { ...loanFinancialSummaryData.approved },
        customer: { ...loanFinancialSummaryData.customer }
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
    ...submittedApplications
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
      
      // If it's a loan application, add loan data
      if (appType === 'Loan' && !foundApplication.financialSummary.loan) {
        foundApplication.financialSummary.loan = {
          tabs: ['Requested', 'Approved', 'Customer'],
          activeTab: 'Approved',
          ...loanFinancialSummaryData
        };
      }
      
      // If it's a lease application, make sure the loan data is removed
      // This prevents any confusion when displaying financial summaries
      if (appType === 'Lease' && foundApplication.financialSummary.loan) {
        delete foundApplication.financialSummary.loan;
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
