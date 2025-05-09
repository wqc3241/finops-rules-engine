import { useState, useMemo, useEffect } from 'react';
import { Application } from '../types/application';
import { sortByProperty } from '@/utils/sortFilterUtils';
import { toast } from "sonner";

// Storage key for applications data
const APPLICATIONS_STORAGE_KEY = 'lucidApplicationsData';

export const useApplicationFiltering = (initialApplications: Application[]) => {
  // Get saved sort preferences from localStorage or use defaults
  const getSavedSortOption = () => {
    const saved = localStorage.getItem('applicationSortOption');
    return saved || 'date';
  };
  
  const getSavedSortDirection = () => {
    const saved = localStorage.getItem('applicationSortDirection');
    return (saved as 'asc' | 'desc') || 'desc'; // Default to newest first
  };

  // Load applications from localStorage or use initial data
  const getInitialApplications = (): Application[] => {
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
  };

  const [sortOption, setSortOption] = useState(getSavedSortOption);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(getSavedSortDirection);
  const [applications, setApplications] = useState<Application[]>(getInitialApplications());
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [typeFilters, setTypeFilters] = useState<string[]>([]);
  
  // Save applications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(applications));
  }, [applications]);
  
  // Save sort preferences when they change
  useEffect(() => {
    localStorage.setItem('applicationSortOption', sortOption);
  }, [sortOption]);
  
  useEffect(() => {
    localStorage.setItem('applicationSortDirection', sortDirection);
  }, [sortDirection]);
  
  // Initialize application data if localStorage is empty
  useEffect(() => {
    if (applications.length === 0 && initialApplications.length > 0) {
      setApplications(initialApplications);
    }
  }, [applications.length, initialApplications]);
  
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
    
    // Apply sorting (removed toast from sortByProperty call)
    return sortByProperty(filtered, sortOption as keyof Application, sortDirection);
  }, [applications, statusFilters, typeFilters, sortOption, sortDirection]);
  
  // Toggle status filter
  const toggleStatusFilter = (status: string) => {
    setStatusFilters(prev => {
      if (prev.includes(status)) {
        return prev.filter(s => s !== status);
      } else {
        toast.success(`Filtered by status: ${status}`);
        return [...prev, status];
      }
    });
  };
  
  // Toggle type filter
  const toggleTypeFilter = (type: string) => {
    setTypeFilters(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type);
      } else {
        toast.success(`Filtered by type: ${type}`);
        return [...prev, type];
      }
    });
  };
  
  // Clear all filters
  const clearFilters = () => {
    setStatusFilters([]);
    setTypeFilters([]);
    toast.success('All filters cleared');
  };
  
  // Toggle sort direction - don't show toast here, do it in the UI component
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
              // Add the new note to the notesArray (ensuring it exists)
              const updatedNotesArray = [newNote, ...(app.notesArray || [])];
              // Update the notes field with the latest note content for backwards compatibility
              const updatedApp = {
                ...app,
                notes: newNote.content,
                notesArray: updatedNotesArray
              };
              return updatedApp;
            }
            return app;
          });
          
          // Save updated applications to localStorage
          localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(updatedApps));
          
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
