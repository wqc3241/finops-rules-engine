
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
