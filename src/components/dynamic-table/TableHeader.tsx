
import { TableHead } from "@/components/ui/table";
import { Trash2, Plus } from "lucide-react";
import { ColumnDefinition } from "@/types/dynamicTable";
import { TableFilter, TableSort } from "@/types/tableFilters";
import { getHeaderClassName } from "./utils/tableUtils";
import TableFilters from "./TableFilters";
import TableSortComponent from "./TableSort";

interface TableHeaderProps {
  columns: ColumnDefinition[];
  allowColumnManagement: boolean;
  hoveredDeleteButton: string | null;
  setHoveredDeleteButton: (id: string | null) => void;
  hoveredDivider: number | null;
  setHoveredDivider: (index: number | null) => void;
  onRemoveColumn: (columnId: string) => void;
  onDividerClick: (index: number) => void;
  // New filter/sort props
  filters: TableFilter[];
  sorts: TableSort[];
  onFilterChange: (columnKey: string, filter: TableFilter | null) => void;
  onSortChange: (columnKey: string) => void;
}

const TableHeaderComponent = ({
  columns,
  allowColumnManagement,
  hoveredDeleteButton,
  setHoveredDeleteButton,
  hoveredDivider,
  setHoveredDivider,
  onRemoveColumn,
  onDividerClick,
  filters,
  sorts,
  onFilterChange,
  onSortChange
}: TableHeaderProps) => {
  return (
    <>
      <TableHead className="w-10">
        {/* Empty cell for checkbox column */}
      </TableHead>
      {columns.map((column, index) => (
        <TableHead key={column.id} className={`${getHeaderClassName(column)} relative overflow-visible`}>
          <div className="flex items-center justify-between min-h-[2rem]">
            <span className="font-medium">{column.name}</span>
            
            <div className="flex items-center gap-1">
              {/* Sort Control */}
              <TableSortComponent
                columnKey={column.key}
                sort={sorts.find(s => s.columnKey === column.key)}
                onSortChange={onSortChange}
                sortIndex={sorts.findIndex(s => s.columnKey === column.key)}
              />
              
              {/* Filter Control */}
              {(column.filterable !== false) && (
                <TableFilters
                  column={column}
                  filter={filters.find(f => f.columnKey === column.key)}
                  onFilterChange={(filter) => onFilterChange(column.key, filter)}
                />
              )}
            </div>
          </div>
          
          {/* Delete button at top edge with better positioning */}
          {allowColumnManagement && column.key !== 'id' && (
            <div
              className="absolute -top-2 left-0 right-0 h-6 cursor-pointer group z-30"
              onMouseEnter={() => setHoveredDeleteButton(column.id)}
              onMouseLeave={() => setHoveredDeleteButton(null)}
            >
              {hoveredDeleteButton === column.id && (
                <div 
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors shadow-lg z-40"
                  onClick={() => onRemoveColumn(column.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </div>
              )}
            </div>
          )}
          
          {/* Column divider with hover effect */}
          {allowColumnManagement && index < columns.length - 1 && (
            <div
              className="absolute top-0 right-0 w-2 h-full cursor-pointer group z-10"
              onMouseEnter={() => setHoveredDivider(index)}
              onMouseLeave={() => setHoveredDivider(null)}
              onClick={() => onDividerClick(index)}
            >
              <div className="w-px h-full bg-gray-200 group-hover:bg-blue-300 transition-colors" />
              {hoveredDivider === index && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-blue-600 transition-colors">
                  <Plus className="w-3 h-3" />
                </div>
              )}
            </div>
          )}
        </TableHead>
      ))}
      <TableHead className="text-right w-48 min-w-48">Actions</TableHead>
    </>
  );
};

export default TableHeaderComponent;
