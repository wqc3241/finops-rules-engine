
import { Application } from '@/types/application';
import { toast } from "sonner";

// Extract unique statuses from applications
export const extractUniqueStatuses = (applications: Application[]): string[] => {
  const statuses = Array.from(new Set(applications.map(app => app.status)));
  return statuses.sort();
};

// Extract unique types from applications
export const extractUniqueTypes = (applications: Application[]): string[] => {
  const types = Array.from(new Set(applications.map(app => app.type)));
  return types.sort();
};

// Extract unique states from applications
export const extractUniqueStates = (applications: Application[]): string[] => {
  const states = Array.from(new Set(applications.map(app => app.state).filter(Boolean)));
  return states.sort();
};

// Toggle status filter
export const createToggleStatusFilter = (
  setStatusFilters: React.Dispatch<React.SetStateAction<string[]>>
) => {
  return (status: string) => {
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
};

// Toggle type filter
export const createToggleTypeFilter = (
  setTypeFilters: React.Dispatch<React.SetStateAction<string[]>>
) => {
  return (type: string) => {
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
};

// Toggle state filter
export const createToggleStateFilter = (
  setStateFilters: React.Dispatch<React.SetStateAction<string[]>>
) => {
  return (state: string) => {
    setStateFilters(prev => {
      const newFilters = prev.includes(state)
        ? prev.filter(s => s !== state)
        : [...prev, state];
      
      // Show toast only when adding a filter
      if (!prev.includes(state)) {
        toast.success(`Filtered by state: ${state}`);
      }
      
      return newFilters;
    });
  };
};

// Clear all filters
export const createClearFilters = (
  setStatusFilters: React.Dispatch<React.SetStateAction<string[]>>,
  setTypeFilters: React.Dispatch<React.SetStateAction<string[]>>,
  setStateFilters: React.Dispatch<React.SetStateAction<string[]>>
) => {
  return () => {
    setStatusFilters([]);
    setTypeFilters([]);
    setStateFilters([]);
    toast.success('All filters cleared');
  };
};
