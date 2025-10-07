
import { Application } from '../../../types/application';
import { leaseApplications } from './leaseApplications';
import { loanApplications } from './loanApplications';
import { canadaApplications } from './canadaApplications';

export const applications: Application[] = [
  ...leaseApplications,
  ...loanApplications,
  ...canadaApplications
];

// Debug: Log all applications with reapply scenarios
console.log('Total applications:', applications.length);
console.log('Applications with reapplyEnabled:', applications.filter(app => app.reapplyEnabled).map(app => ({ id: app.id, name: app.name, status: app.status, reapplyEnabled: app.reapplyEnabled })));
console.log('Applications with "Pending Reapply" status:', applications.filter(app => app.status === 'Pending Reapply'));
console.log('Reapplication sequences:', applications.filter(app => app.reapplicationSequence).map(app => ({ id: app.id, name: app.name, sequence: app.reapplicationSequence })));
