
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
  const { getSchema, getSyncSchema, updateSchema } = useDynamicTableSchemas();
  const schema = getSyncSchema('bulletin-pricing');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  
  const { data, setData, totalCount } = useDynamicFinancialData({
    schemaId: 'bulletin-pricing',
    selectedItems,
    onSelectionChange,
    currentPage,
    pageSize
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

  const handlePageChange = (page: number, newPageSize: number) => {
    setCurrentPage(page);
    setPageSize(newPageSize);
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
      totalCount={totalCount}
      pageSize={pageSize}
      currentPage={currentPage}
      onPageChange={handlePageChange}
    />
  );
};

export default BulletinPricingTable;
