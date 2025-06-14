
import { useState } from "react";
import { useDynamicTableSchemas } from "@/hooks/useDynamicTableSchemas";
import { useDynamicFinancialData } from "@/hooks/useDynamicFinancialData";
import DynamicTable from "@/components/dynamic-table/DynamicTable";

interface BulletinPricingTableProps {
  onEdit: (id: string) => void;
  onCopy: (id: string) => void;
  onRemove: (id: string) => void;
  onSelectionChange?: (items: string[]) => void;
  selectedItems?: string[];
}

const BulletinPricingTable = ({
  onEdit,
  onCopy,
  onRemove,
  onSelectionChange,
  selectedItems = []
}: BulletinPricingTableProps) => {
  const { getSchema, updateSchema } = useDynamicTableSchemas();
  const schema = getSchema('bulletin-pricing');
  
  const { data, setData } = useDynamicFinancialData({
    schemaId: 'bulletin-pricing',
    selectedItems,
    onSelectionChange
  });

  if (!schema) {
    return <div>Schema not found</div>;
  }

  const handleDataChange = (newData: any[]) => {
    setData(newData);
  };

  const handleSchemaChange = (newSchema: any) => {
    updateSchema('bulletin-pricing', newSchema);
  };

  return (
    <DynamicTable
      schema={schema}
      data={data}
      onDataChange={handleDataChange}
      onSchemaChange={handleSchemaChange}
      onSelectionChange={onSelectionChange}
      selectedItems={selectedItems}
      allowColumnManagement={true}
    />
  );
};

export default BulletinPricingTable;
