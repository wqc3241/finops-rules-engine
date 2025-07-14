import { Application } from '@/types/application';

/**
 * Find all applications for a given order number
 */
export const findApplicationsByOrderNumber = (
  applications: Application[],
  orderNumber: string
): Application[] => {
  return applications.filter(app => app.orderNumber === orderNumber);
};

/**
 * Find the current active application for an order (highest sequence number that's not void)
 */
export const findActiveApplicationForOrder = (
  applications: Application[],
  orderNumber: string
): Application | null => {
  const orderApps = findApplicationsByOrderNumber(applications, orderNumber);
  
  // Filter out void applications and find the one with highest sequence
  const activeApps = orderApps.filter(app => app.status !== 'Void');
  
  if (activeApps.length === 0) return null;
  
  return activeApps.reduce((latest, current) => {
    const latestSeq = latest.reapplicationSequence || 1;
    const currentSeq = current.reapplicationSequence || 1;
    return currentSeq > latestSeq ? current : latest;
  });
};

/**
 * Check if an application can be reapplied
 */
export const canReapply = (application: Application): boolean => {
  return (
    application.reapplyEnabled === true &&
    !['Funded', 'Booked', 'Void', 'Pending Reapply'].includes(application.status)
  );
};

/**
 * Get reapplication chain for an application
 */
export const getReapplicationChain = (
  applications: Application[],
  application: Application
): Application[] => {
  const orderApps = findApplicationsByOrderNumber(applications, application.orderNumber);
  
  // Sort by reapplication sequence
  return orderApps.sort((a, b) => {
    const seqA = a.reapplicationSequence || 1;
    const seqB = b.reapplicationSequence || 1;
    return seqA - seqB;
  });
};

/**
 * Check if application is a reapplication (not the original)
 */
export const isReapplication = (application: Application): boolean => {
  return (application.reapplicationSequence || 1) > 1;
};

/**
 * Get display label for application sequence
 */
export const getSequenceLabel = (application: Application): string => {
  const sequence = application.reapplicationSequence || 1;
  if (sequence === 1) return 'Original';
  return `Reapplication ${sequence - 1}`;
};

/**
 * Format order number with sequence indicator
 */
export const formatOrderNumberWithSequence = (application: Application): string => {
  const sequence = application.reapplicationSequence || 1;
  if (sequence === 1) {
    return application.orderNumber;
  }
  return `${application.orderNumber} (R${sequence - 1})`;
};