import React, { useState, useEffect } from 'react';
import { useTableVersions } from '@/hooks/useTableVersions';
import TableVersionHistory from './TableVersionHistory';
import { DynamicTableSchema, TableData } from '@/types/dynamicTable';

interface WithVersionManagementProps {
  tableId: string;
  data: TableData[];
  schema: DynamicTableSchema;
  onDataChange: (data: TableData[]) => void;
  onSchemaChange: (schema: DynamicTableSchema) => void;
  children: (props: {
    onVersionHistory: () => void;
    saveCurrentVersion: (description?: string) => void;
  }) => React.ReactNode;
}

const withVersionManagement = (WrappedComponent: React.ComponentType<any>) => {
  return function WithVersionManagementComponent(props: any) {
    const { tableId, data, schema, onDataChange, onSchemaChange, ...otherProps } = props;
    const [showVersionHistory, setShowVersionHistory] = useState(false);
    const {
      versions,
      isLoading,
      saveVersion,
      loadVersions,
      restoreVersion,
      canRestore,
      persistVersions
    } = useTableVersions(tableId);

    useEffect(() => {
      loadVersions();
    }, [loadVersions]);

    useEffect(() => {
      if (versions.length > 0) {
        persistVersions(versions);
      }
    }, [versions, persistVersions]);

    const handleVersionHistory = () => {
      setShowVersionHistory(true);
    };

    const handleRestore = async (versionId: string) => {
      const restoredData = await restoreVersion(versionId);
      if (restoredData) {
        onDataChange(restoredData.data);
        onSchemaChange(restoredData.schema);
        // Save current state as new version after restore
        await saveVersion(restoredData.data, restoredData.schema, `Restored from version ${versionId}`);
      }
    };

    const saveCurrentVersion = async (description?: string) => {
      await saveVersion(data, schema, description);
    };

    return (
      <>
        <WrappedComponent
          {...otherProps}
          tableId={tableId}
          data={data}
          schema={schema}
          onDataChange={onDataChange}
          onSchemaChange={onSchemaChange}
          onVersionHistory={handleVersionHistory}
          saveCurrentVersion={saveCurrentVersion}
        />
        
        <TableVersionHistory
          open={showVersionHistory}
          onOpenChange={setShowVersionHistory}
          versions={versions}
          onRestore={handleRestore}
          canRestore={canRestore}
          isLoading={isLoading}
        />
      </>
    );
  };
};

export default withVersionManagement;