import React, { ComponentType, useState } from 'react';
import { Button } from '@/components/ui/button';
import { History } from 'lucide-react';
import TableVersionHistory from './TableVersionHistory';
import { useTableVersions } from '@/hooks/useTableVersions';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface WithVersionManagementProps {
  tableName?: string;
  data?: any[];
  onDataChange?: (data: any[]) => void;
}

// Higher Order Component to add version management to any table component
export function withVersionManagement<T extends WithVersionManagementProps>(
  WrappedComponent: ComponentType<T>,
  defaultTableName: string = 'Table'
) {
  return (props: T) => {
    const [showVersionHistory, setShowVersionHistory] = useState(false);
    const { isFSAdmin } = useAuth();
    
    const tableName = props.tableName || defaultTableName;
    const data = props.data || [];
    
    // Version management
    const { versions, saveVersion, restoreVersion } = useTableVersions({
      tableName,
      initialData: data
    });

    const handleDataChangeWithVersion = (newData: any[], description?: string) => {
      // Save version before making changes
      saveVersion(data, description || 'Table data updated');
      if (props.onDataChange) {
        props.onDataChange(newData);
      }
    };

    const handleRestoreVersion = (version: any) => {
      const restoredData = restoreVersion(version);
      if (props.onDataChange) {
        props.onDataChange(restoredData);
      }
      setShowVersionHistory(false);
      toast.success(`Restored to Version ${version.version}`);
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <WrappedComponent
              {...props}
              onDataChange={handleDataChangeWithVersion}
            />
          </div>
          
          <div className="ml-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowVersionHistory(true)}
              className="flex items-center gap-1"
            >
              <History className="h-3 w-3" />
              Versions
            </Button>
          </div>
        </div>

        <TableVersionHistory
          isOpen={showVersionHistory}
          onClose={() => setShowVersionHistory(false)}
          versions={versions}
          onRestoreVersion={handleRestoreVersion}
          tableName={tableName}
        />
      </div>
    );
  };
}

// Usage example:
// const CountryTableWithVersions = withVersionManagement(CountryTable, 'Countries');
export default withVersionManagement;