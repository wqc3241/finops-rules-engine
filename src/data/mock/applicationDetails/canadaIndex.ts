import { canadaApprovedApplications } from './canadaApproved';
import { canadaPendingApplications } from './canadaPending';
import { canadaSubmittedApplications } from './canadaSubmitted';
import { canadaConditionallyApprovedApplications } from './canadaConditionallyApproved';
import { canadaFundedApplications } from './canadaFunded';
import { canadaBookedApplications } from './canadaBooked';

export const canadaApplicationDetails = {
  ...canadaApprovedApplications,
  ...canadaPendingApplications,
  ...canadaSubmittedApplications,
  ...canadaConditionallyApprovedApplications,
  ...canadaFundedApplications,
  ...canadaBookedApplications
};
