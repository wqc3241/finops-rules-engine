import React, { useState, ReactElement, cloneElement } from 'react';
import SectionHeader from '@/components/dashboard/SectionHeader';
import TableVersionHistory, { TableVersion } from './TableVersionHistory';
import { useTableVersions } from '@/hooks/useTableVersions';
import { toast } from 'sonner';

interface TableWithVersionsProps {
  tableName: string;
  data: any[];
  onDataChange: (data: any[]) => void;
  children: ReactElement;
  title?: string;
  onAddNew?: () => void;
  showAddNew?: boolean;
}

const TableWithVersions: React.FC<TableWithVersionsProps> = ({
  tableName,
  data,
  onDataChange,
  children,
  title,
  onAddNew,
  showAddNew = true
}) => {
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  
  // Version management
  const { versions, saveVersion, restoreVersion } = useTableVersions({
    tableName,
    initialData: data
  });

  const handleDataChangeWithVersion = (newData: any[], description?: string) => {
    // Save version before making changes
    saveVersion(data, description || 'Table data updated');
    onDataChange(newData);
  };

  const handleRestoreVersion = (version: TableVersion) => {
    const restoredData = restoreVersion(version);
    onDataChange(restoredData);
    setShowVersionHistory(false);
    toast.success(`Restored to Version ${version.version}`);
  };

  const handleAddNewWithVersion = () => {
    saveVersion(data, 'Added new row');
    if (onAddNew) {
      onAddNew();
    }
  };

  // Clone the children element and pass updated props
  const enhancedChildren = cloneElement(children, {
    onDataChange: handleDataChangeWithVersion,
    data: data,
    // Preserve any existing props
    ...children.props
  });

  return (
    <div className="space-y-4">
      {title && (
        <SectionHeader
          title={title}
          onAddNew={showAddNew ? handleAddNewWithVersion : undefined}
          onViewVersions={() => setShowVersionHistory(true)}
        />
      )}
      
      {enhancedChildren}

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

export default TableWithVersions;