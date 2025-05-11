
import { useState, useMemo, useEffect, useCallback } from 'react';
import { Application } from '../types/application';
import { sortByProperty } from '@/utils/sortFilterUtils';
import { toast } from "sonner";

// Storage key for applications data
const APPLICATIONS_STORAGE_KEY = 'lucidApplicationsData';
const APPLICATIONS_UPDATE_KEY = 'lucidApplicationsLastUpdate';
// Storage keys for filter preferences
const SORT_OPTION_KEY = 'applicationSortOption';
const SORT_DIRECTION_KEY = 'applicationSortDirection';
const STATUS_FILTERS_KEY = 'applicationStatusFilters';
const TYPE_FILTERS_KEY = 'applicationTypeFilters';

export const useApplicationFiltering = (initialApplications: Application[]) => {
  // Get saved sort preferences from localStorage or use defaults
  const getSavedSortOption = () => {
    const saved = localStorage.getItem(SORT_OPTION_KEY);
    return saved || 'date';
  };
  
  const getSavedSortDirection = () => {
    const saved = localStorage.getItem(SORT_DIRECTION_KEY);
    return (saved as 'asc' | 'desc') || 'desc'; // Default to newest first
  };

  const getSavedStatusFilters = (): string[] => {
    const saved = localStorage.getItem(STATUS_FILTERS_KEY);
    return saved ? JSON.parse(saved) : [];
  };

  const getSavedTypeFilters = (): string[] => {
    const saved = localStorage.getItem(TYPE_FILTERS_KEY);
    return saved ? JSON.parse(saved) : [];
  };

  // Load applications from localStorage or use initial data
  const getInitialApplications = useCallback((): Application[] => {
    const savedApplications = localStorage.getItem(APPLICATIONS_STORAGE_KEY);
    if (savedApplications) {
      try {
        return JSON.parse(savedApplications);
      } catch (error) {
        console.error("Error parsing saved applications:", error);
        return initialApplications;
      }
    }
    return initialApplications;
  }, [initialApplications]);

  const [sortOption, setSortOption] = useState(getSavedSortOption);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(getSavedSortDirection);
  const [applications, setApplications] = useState<Application[]>(getInitialApplications());
  const [statusFilters, setStatusFilters] = useState<string[]>(getSavedStatusFilters());
  const [typeFilters, setTypeFilters] = useState<string[]>(getSavedTypeFilters());
  
  // Save applications to localStorage whenever they change
  useEffect(() => {
    if (applications.length > 0) {
      localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(applications));
    }
  }, [applications]);
  
  // Save sort preferences when they change
  useEffect(() => {
    localStorage.setItem(SORT_OPTION_KEY, sortOption);
  }, [sortOption]);
  
  useEffect(() => {
    localStorage.setItem(SORT_DIRECTION_KEY, sortDirection);
  }, [sortDirection]);
  
  // Save filter preferences when they change
  useEffect(() => {
    localStorage.setItem(STATUS_FILTERS_KEY, JSON.stringify(statusFilters));
  }, [statusFilters]);
  
  useEffect(() => {
    localStorage.setItem(TYPE_FILTERS_KEY, JSON.stringify(typeFilters));
  }, [typeFilters]);
  
  // Initialize application data if localStorage is empty
  useEffect(() => {
    if (applications.length === 0 && initialApplications.length > 0) {
      setApplications(initialApplications);
    }
  }, [applications.length, initialApplications]);
  
  // Listen for external changes to localStorage
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === APPLICATIONS_STORAGE_KEY) {
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
  
  // Extract unique status and type values for filter options
  const uniqueStatuses = useMemo(() => {
    const statuses = Array.from(new Set(applications.map(app => app.status)));
    return statuses.sort();
  }, [applications]);
  
  const uniqueTypes = useMemo(() => {
    const types = Array.from(new Set(applications.map(app => app.type)));
    return types.sort();
  }, [applications]);
  
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
    
    // Apply sorting
    return sortByProperty(filtered, sortOption as keyof Application, sortDirection);
  }, [applications, statusFilters, typeFilters, sortOption, sortDirection]);
  
  // Toggle status filter
  const toggleStatusFilter = (status: string) => {
    setStatusFilters(prev => {
      const newFilters = prev.includes(status) 
        ? prev.filter(s => s !== status)
        : [...prev, status];
      
      // Show toast only when adding a filter
      if (!prev.includes(status)) {
        toast.success(`Filtered by status: ${status}`);
      }
      
      return newFilters;
    });
  };
  
  // Toggle type filter
  const toggleTypeFilter = (type: string) => {
    setTypeFilters(prev => {
      const newFilters = prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type];
      
      // Show toast only when adding a filter
      if (!prev.includes(type)) {
        toast.success(`Filtered by type: ${type}`);
      }
      
      return newFilters;
    });
  };
  
  // Clear all filters
  const clearFilters = () => {
    setStatusFilters([]);
    setTypeFilters([]);
    toast.success('All filters cleared');
  };
  
  // Toggle sort direction
  const toggleSortDirection = () => {
    setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
  };

  // Set up global note update function to ensure notes stay current
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).updateApplicationNotes = (appId: string, newNote: any) => {
        setApplications(prevApps => {
          const updatedApps = prevApps.map(app => {
            if (app.id === appId) {
              // Create notesArray if it doesn't exist or add to existing one
              const notesArray = app.notesArray ? [newNote, ...app.notesArray] : [newNote];
              
              // Update the app with new notes
              const updatedApp = {
                ...app,
                notes: newNote.content, // Keep legacy notes field updated for backward compatibility
                notesArray: notesArray
              };
              return updatedApp;
            }
            return app;
          });
          
          // Save updated applications to localStorage immediately
          localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(updatedApps));
          // Set timestamp for the update
          localStorage.setItem(APPLICATIONS_UPDATE_KEY, new Date().toISOString());
          
          return updatedApps;
        });
        
        // Show success toast notification
        toast.success("Note added successfully");
      };
    }
    
    return () => {
      // Clean up the global function when component unmounts
      if (typeof window !== 'undefined') {
        (window as any).updateApplicationNotes = undefined;
      }
    };
  }, []);
  
  return {
    applications,
    setApplications,
    sortOption,
    setSortOption,
    sortDirection,
    setSortDirection,
    statusFilters,
    typeFilters,
    uniqueStatuses,
    uniqueTypes,
    filteredApplications,
    toggleStatusFilter,
    toggleTypeFilter,
    clearFilters,
    toggleSortDirection,
  };
};
