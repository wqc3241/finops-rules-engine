
import React, { useState, useMemo, useEffect } from 'react';
import ApplicationCard from './ApplicationCard';
import { Application } from '../../types/application';
import { applications as initialApplications } from '../../data/mockApplications';
import { ChevronDown, SlidersHorizontal, X, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { filterByProperty, sortByProperty } from '@/utils/sortFilterUtils';
import { toast } from "sonner";

const ApplicationList: React.FC = () => {
  const [sortOption, setSortOption] = useState('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc'); // Default to newest first
  const [showFilters, setShowFilters] = useState(false);
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
  
  // Handle sort option change
  const handleSortOptionChange = () => {
    const nextOption = sortOption === 'date' ? 'name' : 'date';
    setSortOption(nextOption);
    toast.success(`Sort by ${nextOption}`);
  };
  
  // Count active filters
  const activeFiltersCount = statusFilters.length + typeFilters.length;
  
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

  return (
    <div>
      <div className="flex justify-end mb-6 gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="flex items-center justify-between min-w-[200px] border border-gray-300"
            >
              <span>Sort ({sortOption === 'date' ? 'Date' : 'Name'})</span>
              <div className="flex items-center">
                {sortOption === 'date' && (
                  <ArrowUpDown 
                    className="mr-2 h-4 w-4 cursor-pointer" 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSortDirection();
                    }}
                  />
                )}
                <ChevronDown className="h-4 w-4" />
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-2" align="end">
            <div className="space-y-1">
              <Button 
                variant={sortOption === 'date' ? 'secondary' : 'ghost'} 
                className="w-full justify-start"
                onClick={() => {
                  setSortOption('date');
                  toast.success('Sorted by date');
                }}
              >
                By Date
              </Button>
              <Button 
                variant={sortOption === 'name' ? 'secondary' : 'ghost'} 
                className="w-full justify-start"
                onClick={() => {
                  setSortOption('name');
                  toast.success('Sorted by name');
                }}
              >
                By Name
              </Button>
              
              {sortOption === 'date' && (
                <>
                  <hr className="my-2" />
                  <Button 
                    variant={sortDirection === 'desc' ? 'secondary' : 'ghost'} 
                    className="w-full justify-start"
                    onClick={() => {
                      setSortDirection('desc');
                      toast.success('Sorted newest to oldest');
                    }}
                  >
                    Newest first
                  </Button>
                  <Button 
                    variant={sortDirection === 'asc' ? 'secondary' : 'ghost'} 
                    className="w-full justify-start"
                    onClick={() => {
                      setSortDirection('asc');
                      toast.success('Sorted oldest to newest');
                    }}
                  >
                    Oldest first
                  </Button>
                </>
              )}
            </div>
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="flex items-center justify-between border border-gray-300 relative"
            >
              <span>Filters</span>
              <SlidersHorizontal className="ml-2 h-4 w-4" />
              {activeFiltersCount > 0 && (
                <Badge 
                  variant="secondary" 
                  className="ml-2 h-5 w-5 p-0 flex items-center justify-center rounded-full"
                >
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4" align="end">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Filter Applications</h3>
              {activeFiltersCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearFilters}
                  className="h-8 flex items-center text-xs"
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear filters
                </Button>
              )}
            </div>
            
            <div className="space-y-4">
              {/* Status filters */}
              <div>
                <h4 className="text-sm font-medium mb-2">Status</h4>
                <div className="space-y-2">
                  {uniqueStatuses.map(status => (
                    <div key={status} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`status-${status}`}
                        checked={statusFilters.includes(status)}
                        onCheckedChange={() => toggleStatusFilter(status)}
                      />
                      <label 
                        htmlFor={`status-${status}`}
                        className="text-sm cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {status}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Type filters */}
              <div>
                <h4 className="text-sm font-medium mb-2">Application Type</h4>
                <div className="space-y-2">
                  {uniqueTypes.map(type => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`type-${type}`}
                        checked={typeFilters.includes(type)}
                        onCheckedChange={() => toggleTypeFilter(type)}
                      />
                      <label 
                        htmlFor={`type-${type}`}
                        className="text-sm cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {filteredApplications.length > 0 ? (
        <>
          {filteredApplications.map((application) => (
            <ApplicationCard key={application.id} application={application} />
          ))}
        </>
      ) : (
        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
          <p className="text-gray-500">No applications match the selected filters.</p>
          <Button 
            variant="link" 
            onClick={clearFilters} 
            className="text-primary mt-2"
          >
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default ApplicationList;
