
import { Application } from '../../../types/application';
import { leaseApplications } from './leaseApplications';
import { loanApplications } from './loanApplications';

// Combine all applications from different files
export const applications: Application[] = [
  ...leaseApplications,
  ...loanApplications
];
