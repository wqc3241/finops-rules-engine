import { useState, useMemo } from 'react';
import { TableData } from '@/types/dynamicTable';
import { TableSort } from '@/types/tableFilters';

export const useTableSort = (data: TableData[]) => {
  const [sorts, setSorts] = useState<TableSort[]>([]);

  const addSort = (columnKey: string, direction: 'asc' | 'desc') => {
    setSorts(prev => {
      const existing = prev.findIndex(s => s.columnKey === columnKey);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { columnKey, direction };
        return updated;
      }
      return [...prev, { columnKey, direction }];
    });
  };

  const removeSort = (columnKey: string) => {
    setSorts(prev => prev.filter(s => s.columnKey !== columnKey));
  };

  const clearAllSorts = () => {
    setSorts([]);
  };

  const getSort = (columnKey: string) => {
    return sorts.find(s => s.columnKey === columnKey);
  };

  const toggleSort = (columnKey: string) => {
    const existingSort = getSort(columnKey);
    
    if (!existingSort) {
      addSort(columnKey, 'asc');
    } else if (existingSort.direction === 'asc') {
      addSort(columnKey, 'desc');
    } else {
      removeSort(columnKey);
    }
  };

  const compareValues = (a: any, b: any, direction: 'asc' | 'desc') => {
    // Handle null/undefined values
    if (a === null || a === undefined) {
      if (b === null || b === undefined) return 0;
      return direction === 'asc' ? -1 : 1;
    }
    if (b === null || b === undefined) {
      return direction === 'asc' ? 1 : -1;
    }

    // Convert to appropriate types for comparison
    let aValue = a;
    let bValue = b;

    // Try to parse as numbers if they look numeric
    const aNum = Number(a);
    const bNum = Number(b);
    if (!isNaN(aNum) && !isNaN(bNum)) {
      aValue = aNum;
      bValue = bNum;
    } else {
      // Try to parse as dates
      const aDate = new Date(a);
      const bDate = new Date(b);
      if (!isNaN(aDate.getTime()) && !isNaN(bDate.getTime())) {
        aValue = aDate;
        bValue = bDate;
      } else {
        // Convert to strings for text comparison
        aValue = String(a).toLowerCase();
        bValue = String(b).toLowerCase();
      }
    }

    let result = 0;
    if (aValue < bValue) {
      result = -1;
    } else if (aValue > bValue) {
      result = 1;
    }

    return direction === 'desc' ? -result : result;
  };

  const sortedData = useMemo(() => {
    if (sorts.length === 0) return data;

    return [...data].sort((a, b) => {
      for (const sort of sorts) {
        const comparison = compareValues(a[sort.columnKey], b[sort.columnKey], sort.direction);
        if (comparison !== 0) {
          return comparison;
        }
      }
      return 0;
    });
  }, [data, sorts]);

  return {
    sorts,
    sortedData,
    addSort,
    removeSort,
    clearAllSorts,
    getSort,
    toggleSort,
    hasSorts: sorts.length > 0,
  };
};