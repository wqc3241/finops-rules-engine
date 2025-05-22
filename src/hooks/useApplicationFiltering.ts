import { useState, useMemo, useEffect, useCallback } from 'react';
import { Application } from '@/types/application';
import { sortByProperty } from '@/utils/sortFilterUtils';
import { toast } from "sonner";
import { 
  getSavedSortOption, 
  getSavedSortDirection, 
  getSavedStatusFilters, 
  getSavedTypeFilters,
  getSavedStateFilters,
  saveSortOptionToStorage,
  saveSortDirectionToStorage,
  saveStatusFiltersToStorage,
  saveTypeFiltersToStorage,
  saveStateFiltersToStorage,
  getSavedApplications,
  saveApplicationsToStorage
} from '@/utils/localStorageUtils';
import { 
  setupGlobalNoteUpdateFunction,
  initializeApplicationsWithNotes
} from '@/utils/applicationNoteUtils';
import {
  extractUniqueStatuses,
  extractUniqueTypes,
  extractUniqueStates,
  createToggleStatusFilter,
  createToggleTypeFilter,
  createToggleStateFilter,
  createClearFilters
} from '@/utils/filterUtils';
import { getMockApplicationDetailsById } from '@/data/mockApplications';

export const useApplicationFiltering = (initialApplications: Application[]) => {
  // Get initial applications from localStorage or use initial data
  const getInitialApplications = useCallback((): Application[] => {
    const savedApplications = getSavedApplications();
    return savedApplications.length > 0 ? savedApplications : initialApplications;
  }, [initialApplications]);

  const [sortOption, setSortOption] = useState(getSavedSortOption);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(getSavedSortDirection);
  const [applications, setApplications] = useState<Application[]>(getInitialApplications());
  const [statusFilters, setStatusFilters] = useState<string[]>(getSavedStatusFilters());
  const [typeFilters, setTypeFilters] = useState<string[]>(getSavedTypeFilters());
  const [stateFilters, setStateFilters] = useState<string[]>(getSavedStateFilters());
  
  // Save applications to localStorage whenever they change
  useEffect(() => {
    saveApplicationsToStorage(applications);
  }, [applications]);
  
  // Save sort preferences when they change
  useEffect(() => {
    saveSortOptionToStorage(sortOption);
  }, [sortOption]);
  
  useEffect(() => {
    saveSortDirectionToStorage(sortDirection);
  }, [sortDirection]);
  
  // Save filter preferences when they change
  useEffect(() => {
    saveStatusFiltersToStorage(statusFilters);
  }, [statusFilters]);
  
  useEffect(() => {
    saveTypeFiltersToStorage(typeFilters);
  }, [typeFilters]);
  
  useEffect(() => {
    saveStateFiltersToStorage(stateFilters);
  }, [stateFilters]);
  
  // Initialize application data if localStorage is empty
  useEffect(() => {
    if (applications.length === 0 && initialApplications.length > 0) {
      // Process applications to add state from orderDetails
      const appsWithNotesAndState = initializeApplicationsWithNotes(initialApplications).map(app => {
        // Get application details to extract state from registration data
        try {
          const appDetails = getMockApplicationDetailsById(app.id);
          if (appDetails && appDetails.orderDetails && appDetails.orderDetails.registrationData) {
            // Find the registration state from the registration data array
            const registrationState = appDetails.orderDetails.registrationData.find(
              item => item.label === 'Registration State/Province'
            );
            
            if (registrationState && registrationState.value) {
              return {
                ...app,
                state: registrationState.value
              };
            }
          }
        } catch (error) {
          console.error("Error getting application details:", error);
        }
        
        return app;
      });
      
      setApplications(appsWithNotesAndState);
      saveApplicationsToStorage(appsWithNotesAndState);
    }
  }, [applications.length, initialApplications]);
  
  // Listen for external changes to localStorage
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'lucidApplicationsData') {
        try {
          const updatedApps = event.newValue ? JSON.parse(event.newValue) : [];
          if (updatedApps.length > 0) {
            setApplications(updatedApps);
          }
        } catch (error) {
          console.error("Error handling storage change:", error);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  // Set up global note update function
  useEffect(() => {
    return setupGlobalNoteUpdateFunction(setApplications);
  }, []);
  
  // Extract unique status, type, and state values for filter options
  const uniqueStatuses = useMemo(() => extractUniqueStatuses(applications), [applications]);
  const uniqueTypes = useMemo(() => extractUniqueTypes(applications), [applications]);
  const uniqueStates = useMemo(() => extractUniqueStates(applications), [applications]);
  
  // Calculate filtered applications
  const filteredApplications = useMemo(() => {
    let filtered = [...applications];
    
    // Apply status filter if any status is selected
    if (statusFilters.length > 0) {
      filtered = filtered.filter(app => statusFilters.includes(app.status));
    }
    
    // Apply type filter if any type is selected
    if (typeFilters.length > 0) {
      filtered = filtered.filter(app => typeFilters.includes(app.type));
    }
    
    // Apply state filter if any state is selected
    if (stateFilters.length > 0) {
      filtered = filtered.filter(app => app.state && stateFilters.includes(app.state));
    }
    
    // Apply sorting
    return sortByProperty(filtered, sortOption as keyof Application, sortDirection);
  }, [applications, statusFilters, typeFilters, stateFilters, sortOption, sortDirection]);
  
  // Create filter toggle functions
  const toggleStatusFilter = createToggleStatusFilter(setStatusFilters);
  const toggleTypeFilter = createToggleTypeFilter(setTypeFilters);
  const toggleStateFilter = createToggleStateFilter(setStateFilters);
  const clearFilters = createClearFilters(setStatusFilters, setTypeFilters, setStateFilters);
  
  // Toggle sort direction
  const toggleSortDirection = () => {
    setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
  };
  
  return {
    applications,
    setApplications,
    sortOption,
    setSortOption,
    sortDirection,
    setSortDirection,
    statusFilters,
    typeFilters,
    stateFilters,
    uniqueStatuses,
    uniqueTypes,
    uniqueStates,
    filteredApplications,
    toggleStatusFilter,
    toggleTypeFilter,
    toggleStateFilter,
    clearFilters,
    toggleSortDirection,
  };
};
