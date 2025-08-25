import { useState, useMemo } from 'react';
import { TableData } from '@/types/dynamicTable';
import { TableFilter } from '@/types/tableFilters';

export const useTableFilters = (data: TableData[]) => {
  const [filters, setFilters] = useState<TableFilter[]>([]);

  const addFilter = (filter: TableFilter) => {
    setFilters(prev => {
      const existing = prev.findIndex(f => f.columnKey === filter.columnKey);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = filter;
        return updated;
      }
      return [...prev, filter];
    });
  };

  const removeFilter = (columnKey: string) => {
    setFilters(prev => prev.filter(f => f.columnKey !== columnKey));
  };

  const clearAllFilters = () => {
    setFilters([]);
  };

  const getFilter = (columnKey: string) => {
    return filters.find(f => f.columnKey === columnKey);
  };

  const applyFilter = (item: TableData, filter: TableFilter): boolean => {
    const value = item[filter.columnKey];
    const filterValue = filter.value;
    const filterValue2 = filter.value2;

    if (value === null || value === undefined) {
      return false;
    }

    switch (filter.type) {
      case 'text':
        const textValue = String(value).toLowerCase();
        const filterText = String(filterValue).toLowerCase();
        
        switch (filter.operator) {
          case 'contains':
            return textValue.includes(filterText);
          case 'equals':
            return textValue === filterText;
          case 'startsWith':
            return textValue.startsWith(filterText);
          case 'endsWith':
            return textValue.endsWith(filterText);
          default:
            return true;
        }

      case 'number':
        const numValue = Number(value);
        const filterNum = Number(filterValue);
        const filterNum2 = filterValue2 ? Number(filterValue2) : null;

        if (isNaN(numValue) || isNaN(filterNum)) return false;

        switch (filter.operator) {
          case 'equals':
            return numValue === filterNum;
          case 'gt':
            return numValue > filterNum;
          case 'lt':
            return numValue < filterNum;
          case 'gte':
            return numValue >= filterNum;
          case 'lte':
            return numValue <= filterNum;
          case 'between':
            return filterNum2 !== null && numValue >= filterNum && numValue <= filterNum2;
          default:
            return true;
        }

      case 'boolean':
        const boolValue = Boolean(value);
        const filterBool = Boolean(filterValue);

        switch (filter.operator) {
          case 'is':
            return boolValue === filterBool;
          case 'isNot':
            return boolValue !== filterBool;
          default:
            return true;
        }

      case 'date':
        const dateValue = new Date(String(value));
        const filterDate = filterValue instanceof Date ? filterValue : new Date(String(filterValue));
        const filterDate2 = filterValue2 instanceof Date ? filterValue2 : (filterValue2 ? new Date(String(filterValue2)) : null);

        if (isNaN(dateValue.getTime()) || isNaN(filterDate.getTime())) return false;

        // Compare dates without time
        const dateOnly = new Date(dateValue.getFullYear(), dateValue.getMonth(), dateValue.getDate());
        const filterDateOnly = new Date(filterDate.getFullYear(), filterDate.getMonth(), filterDate.getDate());
        const filterDate2Only = filterDate2 ? new Date(filterDate2.getFullYear(), filterDate2.getMonth(), filterDate2.getDate()) : null;

        switch (filter.operator) {
          case 'equals':
            return dateOnly.getTime() === filterDateOnly.getTime();
          case 'gt':
            return dateOnly.getTime() > filterDateOnly.getTime();
          case 'lt':
            return dateOnly.getTime() < filterDateOnly.getTime();
          case 'gte':
            return dateOnly.getTime() >= filterDateOnly.getTime();
          case 'lte':
            return dateOnly.getTime() <= filterDateOnly.getTime();
          case 'between':
            return filterDate2Only !== null && 
                   dateOnly.getTime() >= filterDateOnly.getTime() && 
                   dateOnly.getTime() <= filterDate2Only.getTime();
          default:
            return true;
        }

      default:
        return true;
    }
  };

  const filteredData = useMemo(() => {
    if (filters.length === 0) return data;

    return data.filter(item => {
      return filters.every(filter => applyFilter(item, filter));
    });
  }, [data, filters]);

  return {
    filters,
    filteredData,
    addFilter,
    removeFilter,
    clearAllFilters,
    getFilter,
    hasFilters: filters.length > 0,
  };
};