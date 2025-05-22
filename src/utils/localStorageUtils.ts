
import { Application } from '@/types/application';
import { 
  APPLICATIONS_STORAGE_KEY,
  SORT_OPTION_KEY,
  SORT_DIRECTION_KEY,
  STATUS_FILTERS_KEY,
  TYPE_FILTERS_KEY,
  STATE_FILTERS_KEY
} from '@/constants/storageKeys';

// Get saved applications from localStorage
export const getSavedApplications = (): Application[] => {
  const savedApplications = localStorage.getItem(APPLICATIONS_STORAGE_KEY);
  if (savedApplications) {
    try {
      return JSON.parse(savedApplications);
    } catch (error) {
      console.error("Error parsing saved applications:", error);
      return [];
    }
  }
  return [];
};

// Save applications to localStorage
export const saveApplicationsToStorage = (applications: Application[]): void => {
  if (applications.length > 0) {
    localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(applications));
  }
};

// Get saved sort option from localStorage
export const getSavedSortOption = (): string => {
  const saved = localStorage.getItem(SORT_OPTION_KEY);
  return saved || 'date';
};

// Get saved sort direction from localStorage
export const getSavedSortDirection = (): 'asc' | 'desc' => {
  const saved = localStorage.getItem(SORT_DIRECTION_KEY);
  return (saved as 'asc' | 'desc') || 'desc'; // Default to newest first
};

// Get saved status filters from localStorage
export const getSavedStatusFilters = (): string[] => {
  const saved = localStorage.getItem(STATUS_FILTERS_KEY);
  return saved ? JSON.parse(saved) : [];
};

// Get saved type filters from localStorage
export const getSavedTypeFilters = (): string[] => {
  const saved = localStorage.getItem(TYPE_FILTERS_KEY);
  return saved ? JSON.parse(saved) : [];
};

// Get saved state filters from localStorage
export const getSavedStateFilters = (): string[] => {
  const saved = localStorage.getItem(STATE_FILTERS_KEY);
  return saved ? JSON.parse(saved) : [];
};

// Save filter/sort preferences to localStorage
export const saveSortOptionToStorage = (sortOption: string): void => {
  localStorage.setItem(SORT_OPTION_KEY, sortOption);
};

export const saveSortDirectionToStorage = (sortDirection: 'asc' | 'desc'): void => {
  localStorage.setItem(SORT_DIRECTION_KEY, sortDirection);
};

export const saveStatusFiltersToStorage = (statusFilters: string[]): void => {
  localStorage.setItem(STATUS_FILTERS_KEY, JSON.stringify(statusFilters));
};

export const saveTypeFiltersToStorage = (typeFilters: string[]): void => {
  localStorage.setItem(TYPE_FILTERS_KEY, JSON.stringify(typeFilters));
};

export const saveStateFiltersToStorage = (stateFilters: string[]): void => {
  localStorage.setItem(STATE_FILTERS_KEY, JSON.stringify(stateFilters));
};
