import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export interface DashboardFilter {
  id: string;
  field: string;
  type: 'select' | 'daterange' | 'text';
  value: any;
  label: string;
  options?: { label: string; value: any }[];
}

export const useDashboardFilters = (initialFilters: DashboardFilter[] = []) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<DashboardFilter[]>(initialFilters);

  // Load filters from URL on mount
  useEffect(() => {
    const filterParams: DashboardFilter[] = [];
    searchParams.forEach((value, key) => {
      if (key.startsWith('filter_')) {
        const field = key.replace('filter_', '');
        const existingFilter = initialFilters.find(f => f.field === field);
        if (existingFilter) {
          filterParams.push({
            ...existingFilter,
            value: JSON.parse(value),
          });
        }
      }
    });
    
    if (filterParams.length > 0) {
      setFilters(filterParams);
    }
  }, []);

  const updateFilter = (filterId: string, value: any) => {
    setFilters(prev => 
      prev.map(f => f.id === filterId ? { ...f, value } : f)
    );

    // Update URL params
    const filter = filters.find(f => f.id === filterId);
    if (filter) {
      const params = new URLSearchParams(searchParams);
      params.set(`filter_${filter.field}`, JSON.stringify(value));
      setSearchParams(params);
    }
  };

  const clearFilters = () => {
    setFilters(initialFilters.map(f => ({ ...f, value: null })));
    
    // Clear URL params
    const params = new URLSearchParams();
    searchParams.forEach((value, key) => {
      if (!key.startsWith('filter_')) {
        params.set(key, value);
      }
    });
    setSearchParams(params);
  };

  return {
    filters,
    updateFilter,
    clearFilters,
  };
};
