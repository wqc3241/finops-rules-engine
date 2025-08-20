import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export interface TableVersion {
  id: string;
  version: number;
  data: any[];
  schema: any;
  createdAt: string;
  createdBy: string;
  description?: string;
}

// Safe auth hook that uses the actual Supabase auth system
const useSafeAuth = () => {
  try {
    const { useAuth } = require('./useSupabaseAuth');
    const auth = useAuth();
    return {
      user: auth.user ? { name: auth.profile?.first_name || auth.user.email || 'System User' } : { name: 'System User' },
      isFSAdmin: auth.isFSAdmin || (() => false)
    };
  } catch {
    return {
      user: { name: 'System User' },
      isFSAdmin: () => false
    };
  }
};

export const useTableVersions = (tableId: string) => {
  const { user, isFSAdmin } = useSafeAuth();
  const [versions, setVersions] = useState<TableVersion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const saveVersion = useCallback(async (data: any[], schema: any, description?: string) => {
    const newVersion: TableVersion = {
      id: `${tableId}_v${Date.now()}`,
      version: versions.length + 1,
      data: JSON.parse(JSON.stringify(data)),
      schema: JSON.parse(JSON.stringify(schema)),
      createdAt: new Date().toISOString(),
      createdBy: user?.name || 'System',
      description
    };

    setVersions(prev => [newVersion, ...prev]);
    toast.success('Table version saved successfully');
  }, [tableId, versions.length, user?.name]);

  const loadVersions = useCallback(async () => {
    setIsLoading(true);
    // In a real app, this would fetch from an API/database
    // For now, we'll use local storage to persist versions
    try {
      const storedVersions = localStorage.getItem(`table_versions_${tableId}`);
      if (storedVersions) {
        setVersions(JSON.parse(storedVersions));
      }
    } catch (error) {
      console.error('Failed to load versions:', error);
    } finally {
      setIsLoading(false);
    }
  }, [tableId]);

  const restoreVersion = useCallback(async (versionId: string): Promise<{ data: any[], schema: any } | null> => {
    const canRestore = typeof isFSAdmin === 'function' ? isFSAdmin() : false;
    if (!canRestore) {
      toast.error('Only FS_Admin users can restore versions');
      return null;
    }

    const version = versions.find(v => v.id === versionId);
    if (!version) {
      toast.error('Version not found');
      return null;
    }

    toast.success(`Restored to version ${version.version}`);
    return {
      data: JSON.parse(JSON.stringify(version.data)),
      schema: JSON.parse(JSON.stringify(version.schema))
    };
  }, [versions, isFSAdmin]);

  // Persist versions to localStorage whenever versions change
  const persistVersions = useCallback((versionsToSave: TableVersion[]) => {
    try {
      localStorage.setItem(`table_versions_${tableId}`, JSON.stringify(versionsToSave));
    } catch (error) {
      console.error('Failed to persist versions:', error);
    }
  }, [tableId]);

  return {
    versions,
    isLoading,
    saveVersion,
    loadVersions,
    restoreVersion,
    canRestore: typeof isFSAdmin === 'function' ? isFSAdmin() : false,
    persistVersions
  };
};