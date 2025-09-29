import { format } from 'date-fns';

export const generateVersionNumber = (): string => {
  return format(new Date(), 'yyyyMMdd-HHmm');
};

export const formatVersionNumber = (version: string): string => {
  // Format: YYYYMMDD-HHMM to "YYYY-MM-DD HH:MM"
  if (!version || version.length !== 13) return version;
  
  const date = version.substring(0, 8);
  const time = version.substring(9);
  
  return `${date.substring(0, 4)}-${date.substring(4, 6)}-${date.substring(6, 8)} ${time.substring(0, 2)}:${time.substring(2)}`;
};

export const calculateSnapshotMetadata = (changes: any[]): {
  totalTables: number;
  totalChanges: number;
  tables: Record<string, number>;
} => {
  const tables: Record<string, number> = {};
  
  changes.forEach(change => {
    const tableName = change.table_name || 'unknown';
    tables[tableName] = (tables[tableName] || 0) + 1;
  });
  
  return {
    totalTables: Object.keys(tables).length,
    totalChanges: changes.length,
    tables
  };
};

export const getTimezoneDisplay = (timezone: string): string => {
  const timezoneMap: Record<string, string> = {
    'America/Los_Angeles': 'PST/PDT',
    'America/New_York': 'EST/EDT',
    'America/Chicago': 'CST/CDT',
    'America/Denver': 'MST/MDT',
    'UTC': 'UTC'
  };
  
  return timezoneMap[timezone] || timezone;
};

export const canRevertToVersion = (targetVersion: any, currentVersion: any): boolean => {
  if (!targetVersion || !currentVersion) return false;
  if (targetVersion.id === currentVersion.id) return false;
  if (targetVersion.status === 'reverted') return false;
  
  return true;
};

export const groupChangesByTable = (changes: any[]): Record<string, any[]> => {
  const grouped: Record<string, any[]> = {};
  
  changes.forEach(change => {
    const tableName = change.table_name || 'unknown';
    if (!grouped[tableName]) {
      grouped[tableName] = [];
    }
    grouped[tableName].push(change);
  });
  
  return grouped;
};

export const formatDeploymentType = (type: string): string => {
  return type === 'auto' ? 'Automatic' : 'Manual';
};

export const getDeploymentStatusColor = (status: string): string => {
  switch (status) {
    case 'active':
      return 'bg-green-500';
    case 'deployed':
      return 'bg-blue-500';
    case 'pending':
      return 'bg-yellow-500';
    case 'reverted':
      return 'bg-gray-500';
    default:
      return 'bg-gray-400';
  }
};
