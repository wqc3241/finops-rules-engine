
// Export all types to maintain backward compatibility with existing imports
export * from './base';
// Export applicant types
export * from './applicant';
// Export vehicle types
export * from './vehicle';
// Export order types
export * from './order';
// Export history types (excluding Note to avoid conflict)
export type { HistoryItem } from './history';
// Export deal types
export * from './deal';
// Export financial types
export * from './financial';
// Export report types
export * from './report';
// Export application details types
export * from './details';
