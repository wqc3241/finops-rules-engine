import { useState, useEffect, useCallback, useMemo } from 'react';
import { Application } from '@/types/application';
import { ApplicationService } from '@/services/applicationService';
import { UserPreferencesService } from '@/services/userPreferencesService';
import { useCountry } from '@/hooks/useCountry';
import { supabase } from '@/integrations/supabase/client';
import { sortByProperty } from '@/utils/sortFilterUtils';
import { 
  extractUniqueStatuses,
  extractUniqueTypes,
  extractUniqueStates 
} from '@/utils/filterUtils';

export const useSupabaseApplications = () => {
  const { selectedCountry } = useCountry();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [typeFilters, setTypeFilters] = useState<string[]>([]);
  const [stateFilters, setStateFilters] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<'all' | 'today' | '3days' | '7days' | '14days' | '30days' | '60days'>('all');

  useEffect(() => {
    const loadPreferences = async () => {
      const prefs = await UserPreferencesService.fetchPreferences();
      if (prefs) {
        setSortOption(prefs.sort_option);
        setSortDirection(prefs.sort_direction);
        setStatusFilters(prefs.status_filters);
        setTypeFilters(prefs.type_filters);
        setStateFilters(prefs.state_filters);
      }
    };
    loadPreferences();
  }, []);

  const loadApplications = useCallback(async () => {
    setLoading(true);
    try {
      const data = await ApplicationService.fetchApplications(selectedCountry.code);
      setApplications(data);
    } catch (error) {
      console.error('Failed to load applications:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCountry.code]);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  useEffect(() => {
    const channel = supabase
      .channel('applications-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'applications',
          filter: `country=eq.${selectedCountry.code}`,
        },
        (payload) => {
          console.log('Realtime update:', payload);
          loadApplications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedCountry.code, loadApplications]);

  useEffect(() => {
    UserPreferencesService.savePreferences({
      sort_option: sortOption,
      sort_direction: sortDirection,
      status_filters: statusFilters,
      type_filters: typeFilters,
      state_filters: stateFilters,
    });
  }, [sortOption, sortDirection, statusFilters, typeFilters, stateFilters]);

  const filteredApplications = useMemo(() => {
    let filtered = [...applications];

    // Date range filtering
    if (dateRange !== 'all') {
      const now = new Date();
      const rangeMap = {
        'today': 0,
        '3days': 3,
        '7days': 7,
        '14days': 14,
        '30days': 30,
        '60days': 60,
      };
      const daysAgo = rangeMap[dateRange] || 0;
      const cutoffDate = new Date(now);
      cutoffDate.setDate(cutoffDate.getDate() - daysAgo);

      filtered = filtered.filter(app => {
        const appDate = new Date(app.date);
        return appDate >= cutoffDate;
      });
    }

    if (statusFilters.length > 0) {
      filtered = filtered.filter(app => statusFilters.includes(app.status));
    }

    if (typeFilters.length > 0) {
      filtered = filtered.filter(app => typeFilters.includes(app.type));
    }

    if (stateFilters.length > 0) {
      filtered = filtered.filter(app => app.state && stateFilters.includes(app.state));
    }

    return sortByProperty(filtered, sortOption as keyof Application, sortDirection);
  }, [applications, dateRange, statusFilters, typeFilters, stateFilters, sortOption, sortDirection]);

  const uniqueStatuses = useMemo(() => extractUniqueStatuses(applications), [applications]);
  const uniqueTypes = useMemo(() => extractUniqueTypes(applications), [applications]);
  const uniqueStates = useMemo(() => extractUniqueStates(applications), [applications]);

  const toggleStatusFilter = (status: string) => {
    setStatusFilters(prev => 
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  const toggleTypeFilter = (type: string) => {
    setTypeFilters(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleStateFilter = (state: string) => {
    setStateFilters(prev => 
      prev.includes(state) ? prev.filter(s => s !== state) : [...prev, state]
    );
  };

  const clearFilters = () => {
    setStatusFilters([]);
    setTypeFilters([]);
    setStateFilters([]);
  };

  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  return {
    applications,
    filteredApplications,
    loading,
    sortOption,
    setSortOption,
    sortDirection,
    setSortDirection,
    toggleSortDirection,
    statusFilters,
    typeFilters,
    stateFilters,
    dateRange,
    setDateRange,
    uniqueStatuses,
    uniqueTypes,
    uniqueStates,
    toggleStatusFilter,
    toggleTypeFilter,
    toggleStateFilter,
    clearFilters,
    refreshApplications: loadApplications,
  };
};
