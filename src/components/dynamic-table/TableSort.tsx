import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { TableSort as TableSortType } from '@/types/tableFilters';

interface TableSortProps {
  columnKey: string;
  sort?: TableSortType;
  onSortChange: (columnKey: string) => void;
  sortIndex?: number;
}

const TableSort = ({ columnKey, sort, onSortChange, sortIndex }: TableSortProps) => {
  const getSortIcon = () => {
    if (!sort) {
      return <ArrowUpDown className="h-3 w-3" />;
    }
    
    return sort.direction === 'asc' 
      ? <ArrowUp className="h-3 w-3" />
      : <ArrowDown className="h-3 w-3" />;
  };

  const getSortText = () => {
    if (!sort) return null;
    
    return sort.direction === 'asc' ? 'ASC' : 'DESC';
  };

  return (
    <div className="flex items-center gap-1">
      {sort && (
        <div className="flex items-center gap-1">
          <Badge variant="outline" className="text-xs px-1 py-0">
            {getSortText()}
          </Badge>
          {sortIndex !== undefined && sortIndex > 0 && (
            <Badge variant="secondary" className="text-xs px-1 py-0 w-4 h-4 flex items-center justify-center">
              {sortIndex + 1}
            </Badge>
          )}
        </div>
      )}
      <Button
        variant="ghost"
        size="sm"
        className={`h-6 w-6 p-0 ${sort ? 'text-blue-600' : ''}`}
        onClick={() => onSortChange(columnKey)}
        title={`Sort by ${columnKey}`}
      >
        {getSortIcon()}
      </Button>
    </div>
  );
};

export default TableSort;