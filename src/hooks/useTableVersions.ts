import { useState, useCallback } from 'react';
import { TableData } from '@/types/dynamicTable';
import { TableVersion } from '@/components/version-management/TableVersionHistory';

interface UseTableVersionsProps {
  tableName: string;
  initialData: TableData[];
}

export const useTableVersions = ({ tableName, initialData }: UseTableVersionsProps) => {
  // Use a fallback user name when auth is not available
  const getUserName = () => {
    try {
      // Try to get auth context if available
      const authModule = require('@/hooks/useAuth');
      const { useAuth } = authModule;
      const auth = useAuth();
      return auth?.user?.name || 'System User';
    } catch {
      // Fallback when AuthProvider is not available
      return 'System User';
    }
  };

  const [versions, setVersions] = useState<TableVersion[]>([
    {
      id: 'v1',
      timestamp: new Date(),
      data: initialData,
      description: 'Initial version',
      createdBy: 'System User',
      version: 1
    }
  ]);

  const saveVersion = useCallback((data: TableData[], description: string = '') => {
    const newVersion: TableVersion = {
      id: `v${Date.now()}`,
      timestamp: new Date(),
      data: JSON.parse(JSON.stringify(data)), // Deep clone
      description: description || `Auto-saved version`,
      createdBy: getUserName(),
      version: versions.length + 1
    };

    setVersions(prev => [newVersion, ...prev]);
  }, [versions.length]);

  const restoreVersion = useCallback((version: TableVersion) => {
    // Move the restored version to the top as current
    const restoredVersion: TableVersion = {
      ...version,
      id: `v${Date.now()}`,
      timestamp: new Date(),
      description: `Restored from Version ${version.version}`,
      createdBy: getUserName(),
      version: versions.length + 1
    };

    setVersions(prev => [restoredVersion, ...prev]);
    return version.data;
  }, [versions.length]);

  return {
    versions,
    saveVersion,
    restoreVersion
  };
};