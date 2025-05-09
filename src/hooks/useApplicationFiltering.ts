
import { useState, useMemo, useEffect } from 'react';
import { Application } from '../types/application';
import { sortByProperty } from '@/utils/sortFilterUtils';
import { toast } from "sonner";

export const useApplicationFiltering = (initialApplications: Application[]) => {
  const [sortOption, setSortOption] = useState('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc'); // Default to newest first
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [typeFilters, setTypeFilters] = useState<string[]>([]);
  
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
  
  // Toggle sort direction
  const toggleSortDirection = () => {
    setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    toast.success(`Sorted ${sortDirection === 'asc' ? 'newest to oldest' : 'oldest to newest'}`);
  };

  // Set up global note update function to ensure notes stay current
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).updateApplicationNotes = (appId: string, newNote: any) => {
        setApplications(prevApps => {
          return prevApps.map(app => {
            if (app.id === appId) {
              // Add the new note to the notesArray (ensuring it exists)
              const updatedNotesArray = [newNote, ...(app.notesArray || [])];
              // Update the notes field with the latest note content for backwards compatibility
              return {
                ...app,
                notes: newNote.content,
                notesArray: updatedNotesArray
              };
            }
            return app;
          });
        });
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
