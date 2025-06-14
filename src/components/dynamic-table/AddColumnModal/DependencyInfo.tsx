
import { useDynamicTableSchemas } from "@/hooks/useDynamicTableSchemas";

interface DependencyInfoProps {
  selectedTable: string;
  selectedColumn: string;
}

const DependencyInfo = ({ selectedTable, selectedColumn }: DependencyInfoProps) => {
  const { schemas } = useDynamicTableSchemas();

  if (!selectedTable || !selectedColumn) return null;

  const table = schemas[selectedTable];
  const column = table?.columns.find(col => col.id === selectedColumn);

  if (!table || !column) return null;

  return (
    <div className="p-3 bg-blue-50 rounded-md">
      <p className="text-sm text-blue-800">
        <strong>Dependency:</strong> This column will reference "{column.name}" from the "{table.name}" table.
      </p>
    </div>
  );
};

export default DependencyInfo;
