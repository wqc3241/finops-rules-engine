
import DynamicTable from "@/components/dynamic-table/DynamicTable";
import { DynamicTableSchema, TableData } from "@/types/dynamicTable";
import SectionHeader from "@/components/dashboard/SectionHeader";
import TableVersionHistory from "@/components/version-management/TableVersionHistory";
import { useTableVersions } from "@/hooks/useTableVersions";
import { useState } from "react";
import { toast } from "sonner";

interface DynamicFinancialSectionContentProps {
  schema: DynamicTableSchema;
  data: TableData[];
  onDataChange: (data: TableData[]) => void;
  onSchemaChange: (updatedSchema: DynamicTableSchema) => void;
  onSelectionChange?: (items: string[]) => void;
  selectedItems: string[];
}

const DynamicFinancialSectionContent = ({
  schema,
  data,
  onDataChange,
  onSchemaChange,
  onSelectionChange,
  selectedItems
}: DynamicFinancialSectionContentProps) => {
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  
  // Version management
  const { versions, saveVersion, restoreVersion } = useTableVersions({
    tableName: schema.name,
    initialData: data
  });

  console.log('Rendering component with data:', data, 'schema:', schema);

  const handleAddNew = () => {
    // Save version before making changes
    saveVersion(data, 'Added new row via section header');
    // Create a new row based on schema
    const newRow: any = { id: `new_${Date.now()}` };
    schema.columns.forEach((col) => {
      if (col.key !== 'id') {
        switch (col.type) {
          case 'number': newRow[col.key] = 0; break;
          case 'boolean': newRow[col.key] = false; break;
          default: newRow[col.key] = ""; break;
        }
      }
    });
    onDataChange([...data, newRow]);
  };

  const handleRestoreVersion = (version: any) => {
    const restoredData = restoreVersion(version);
    onDataChange(restoredData);
    setShowVersionHistory(false);
    toast.success(`Restored to Version ${version.version}`);
  };

  return (
    <div className="space-y-4">
      <SectionHeader
        title={schema.name}
        onAddNew={handleAddNew}
        onViewVersions={() => setShowVersionHistory(true)}
      />
      
      <div className="mt-4 overflow-x-auto">
        <div className="min-w-max">
          <DynamicTable
            schema={schema}
            data={data}
            onDataChange={onDataChange}
            onSchemaChange={onSchemaChange}
            onSelectionChange={onSelectionChange}
            selectedItems={selectedItems}
            allowColumnManagement={true}
          />
        </div>
      </div>

      <TableVersionHistory
        isOpen={showVersionHistory}
        onClose={() => setShowVersionHistory(false)}
        versions={versions}
        onRestoreVersion={handleRestoreVersion}
        tableName={schema.name}
      />
    </div>
  );
};

export default DynamicFinancialSectionContent;
