
import DynamicTable from "@/components/dynamic-table/DynamicTable";
import FinancialProgramConfigTable from "@/components/FinancialProgramConfigTable";
import { DynamicTableSchema, TableData } from "@/types/dynamicTable";

interface DynamicFinancialSectionContentProps {
  schema: DynamicTableSchema;
  data: TableData[];
  onDataChange: (data: TableData[]) => void;
  onSchemaChange: (updatedSchema: DynamicTableSchema) => void;
  onSelectionChange?: (items: string[]) => void;
  selectedItems: string[];
  onEditRow?: (rowId: string, rowData: TableData) => void;
  // Pagination props
  totalCount?: number;
  pageSize?: number;
  currentPage?: number;
  onPageChange?: (page: number, pageSize: number) => void;
}

const DynamicFinancialSectionContent = ({
  schema,
  data,
  onDataChange,
  onSchemaChange,
  onSelectionChange,
  selectedItems,
  onEditRow,
  totalCount,
  pageSize,
  currentPage,
  onPageChange
}: DynamicFinancialSectionContentProps) => {
/*   console.log('Rendering component with data:', data, 'schema:', schema); */

  // Use specific table for Financial Program Config to show download button
  if (schema.id === 'financial-program-config') {
    return (
      <div className="mt-4 overflow-x-auto">
        <div className="min-w-max">
          <FinancialProgramConfigTable
            onEditProgram={(id) => onEditRow?.(id, data.find(item => item.id === id))}
          />
        </div>
      </div>
    );
  }

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
          totalCount={totalCount}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default DynamicFinancialSectionContent;
