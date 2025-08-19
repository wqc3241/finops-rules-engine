import { useState, useCallback } from 'react';
import { TableData } from '@/types/dynamicTable';
import { TableVersion } from '@/components/version-management/TableVersionHistory';
import { useAuth } from '@/hooks/useAuth';

interface UseTableVersionsProps {
  tableName: string;
  initialData: TableData[];
}

export const useTableVersions = ({ tableName, initialData }: UseTableVersionsProps) => {
  const { user } = useAuth();
  
  const [versions, setVersions] = useState<TableVersion[]>([
    {
      id: 'v1',
      timestamp: new Date(),
      data: initialData,
      description: 'Initial version',
      createdBy: user?.name || 'Unknown',
      version: 1
    }
  ]);

  const saveVersion = useCallback((data: TableData[], description: string = '') => {
    const newVersion: TableVersion = {
      id: `v${Date.now()}`,
      timestamp: new Date(),
      data: JSON.parse(JSON.stringify(data)), // Deep clone
      description: description || `Auto-saved version`,
      createdBy: user?.name || 'Unknown',
      version: versions.length + 1
    };

    setVersions(prev => [newVersion, ...prev]);
  }, [versions.length, user?.name]);

  const restoreVersion = useCallback((version: TableVersion) => {
    // Move the restored version to the top as current
    const restoredVersion: TableVersion = {
      ...version,
      id: `v${Date.now()}`,
      timestamp: new Date(),
      description: `Restored from Version ${version.version}`,
      createdBy: user?.name || 'Unknown',
      version: versions.length + 1
    };

    setVersions(prev => [restoredVersion, ...prev]);
    return version.data;
  }, [versions.length, user?.name]);

  return {
    versions,
    saveVersion,
    restoreVersion
  };
};