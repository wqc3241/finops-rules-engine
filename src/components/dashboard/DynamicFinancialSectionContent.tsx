
import DynamicTable from "@/components/dynamic-table/DynamicTable";
import { DynamicTableSchema, TableData } from "@/types/dynamicTable";

interface DynamicFinancialSectionContentProps {
  schema: DynamicTableSchema;
  data: TableData[];
  onDataChange: (data: TableData[]) => void;
  onSchemaChange: (updatedSchema: DynamicTableSchema) => void;
  onSelectionChange?: (items: string[]) => void;
  selectedItems: string[];
  onEditRow?: (rowId: string, rowData: TableData) => void;
}

const DynamicFinancialSectionContent = ({
  schema,
  data,
  onDataChange,
  onSchemaChange,
  onSelectionChange,
  selectedItems,
  onEditRow
}: DynamicFinancialSectionContentProps) => {
  console.log('Rendering component with data:', data, 'schema:', schema);

  return (
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
          onEditRow={onEditRow}
        />
      </div>
    </div>
  );
};

export default DynamicFinancialSectionContent;
