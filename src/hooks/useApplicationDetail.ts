import { useState, useEffect, useCallback } from 'react';
import { applicationDetails, getMockApplicationDetailsById } from '@/data/mockApplications';
import { ApplicationDetails, Note } from '@/types/application';
import { notes as defaultNotes } from '@/data/mock/history';

// Define storage keys for consistency
const APPLICATIONS_STORAGE_KEY = 'lucidApplicationsData';
const APPLICATIONS_UPDATE_KEY = 'lucidApplicationsLastUpdate';

export function useApplicationDetail(id: string | undefined) {
  const [currentNotes, setCurrentNotes] = useState<Note[]>(defaultNotes);
  const [currentApplicationDetails, setCurrentApplicationDetails] = useState<ApplicationDetails>(applicationDetails.details);
  const [currentApplicationFullDetails, setCurrentApplicationFullDetails] = useState(applicationDetails);
  const [lastRefreshTime, setLastRefreshTime] = useState(Date.now());

  // Load applications from localStorage
  const getStoredApplications = useCallback(() => {
    try {
      const storedApps = localStorage.getItem(APPLICATIONS_STORAGE_KEY);
      if (storedApps) {
        return JSON.parse(storedApps);
      }
    } catch (error) {
      console.error("Error loading stored applications:", error);
    }
    return []; // Fallback to empty array
  }, []);

  // Function to refresh notes from localStorage - enhanced to be more reliable
  const refreshNotesFromStorage = useCallback(() => {
    if (id) {
      const storedApplications = getStoredApplications();
      const updatedApp = storedApplications.find((app: any) => app.id === id);
      
      if (updatedApp) {
        // Check if notesArray exists and is an array
        if (updatedApp.notesArray && Array.isArray(updatedApp.notesArray)) {
          console.log('Refreshing notes from storage:', updatedApp.notesArray.length);
          setCurrentNotes(updatedApp.notesArray);
          
          // Also update the full application details with the latest notes
          setCurrentApplicationFullDetails(prevDetails => ({
            ...prevDetails,
            notes: updatedApp.notesArray
          }));
        } else if (updatedApp.notes) {
          // Legacy support - if there's no notesArray but there is a notes string
          // Create a single note object for backward compatibility
          const legacyNote: Note = {
            content: updatedApp.notes,
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
            user: "System"
          };
          setCurrentNotes([legacyNote]);
          
          // Also update the full application details
          setCurrentApplicationFullDetails(prevDetails => ({
            ...prevDetails,
            notes: [legacyNote]
          }));
        } else {
          // No notes found, set empty array
          setCurrentNotes([]);
          setCurrentApplicationFullDetails(prevDetails => ({
            ...prevDetails,
            notes: []
          }));
        }
      }
    }
  }, [id, getStoredApplications]);
  
  // Listen for storage events to refresh notes
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === APPLICATIONS_STORAGE_KEY || event.key === APPLICATIONS_UPDATE_KEY) {
        refreshNotesFromStorage();
        setLastRefreshTime(Date.now());
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [refreshNotesFromStorage]);

  // Find current application and use its data
  useEffect(() => {
    if (id) {
      // Try to get application from localStorage first
      const storedApplications = getStoredApplications();
      const currentApp = storedApplications.find((app: any) => app.id === id);

      if (currentApp) {
        // If we found the application, create application details object with the correct status
        setCurrentApplicationDetails({
          ...applicationDetails.details,
          status: currentApp.status,
          orderNumber: currentApp.orderNumber,
          orderedBy: currentApp.name,
          // Keep other properties from applicationDetails.details
          model: applicationDetails.details.model,
          edition: applicationDetails.details.edition
        });
        
        // Set notes if available - directly from localStorage
        if (currentApp.notesArray && Array.isArray(currentApp.notesArray) && currentApp.notesArray.length > 0) {
          setCurrentNotes(currentApp.notesArray);
        } else if (currentApp.notes) {
          // Legacy support - if there's a notes field but no notesArray
          const legacyNote: Note = {
            content: currentApp.notes,
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
            user: "System"
          };
          setCurrentNotes([legacyNote]);
        } else {
          setCurrentNotes([]); // Reset notes if none found
        }
        
        // Try to get extended mock data for this application
        try {
          const mockDetails = getMockApplicationDetailsById(id);
          if (mockDetails) {
            // Use the notes from localStorage if available, otherwise use mock notes
            const notesToUse = currentApp.notesArray && Array.isArray(currentApp.notesArray) && currentApp.notesArray.length > 0
              ? currentApp.notesArray
              : currentApp.notes
                ? [{ 
                    content: currentApp.notes, 
                    time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
                    user: "System" 
                  }]
                : mockDetails.notes || [];
            
            setCurrentApplicationFullDetails({
              ...mockDetails,
              // Ensure we use the correct notes from localStorage
              notes: notesToUse
            });
            
            // Use the more detailed application details if available
            setCurrentApplicationDetails({
              ...mockDetails.details,
              // Make sure we're using accurate information from the card
              status: currentApp.status,
              orderNumber: currentApp.orderNumber,
              orderedBy: currentApp.name
            });
            
            // Make sure currentNotes are updated too
            setCurrentNotes(notesToUse);
          }
        } catch (error) {
          console.log('No extended mock data found for this application ID, using default data');
        }
      }
    }
  }, [id, lastRefreshTime, getStoredApplications]);

  // Setup the global notes update function with improved reliability
  useEffect(() => {
    const originalUpdateFn = (window as any).updateApplicationNotes;
    
    // Define our new update function that will also update local state
    const updateNotesFunction = (appId: string, newNote: Note) => {
      console.log('Global update notes function called:', { appId, newNote });
      
      // Call original function if it exists (to update global state)
      if (originalUpdateFn) {
        originalUpdateFn(appId, newNote);
      }
      
      // Update local state immediately if this is the current application
      if (appId === id) {
        setCurrentNotes(prev => [newNote, ...prev]);
        setCurrentApplicationFullDetails(prev => ({
          ...prev,
          notes: [newNote, ...(prev.notes || [])]
        }));
        
        // Force a refresh to ensure all components re-render with updated data
        setLastRefreshTime(Date.now());
      }
      
      // Update localStorage directly to ensure consistent state
      try {
        const storedApps = localStorage.getItem(APPLICATIONS_STORAGE_KEY);
        if (storedApps) {
          const apps = JSON.parse(storedApps);
          const updatedApps = apps.map((app: any) => {
            if (app.id === appId) {
              // Create notesArray if it doesn't exist
              const notesArray = app.notesArray ? [newNote, ...app.notesArray] : [newNote];
              return {
                ...app,
                notes: newNote.content, // Update legacy notes field
                notesArray // Update notes array
              };
            }
            return app;
          });
          
          // Save back to localStorage
          localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(updatedApps));
          localStorage.setItem(APPLICATIONS_UPDATE_KEY, new Date().toISOString());
        }
      } catch (error) {
        console.error('Error updating localStorage:', error);
      }
    };
    
    // Set the global function
    if (typeof window !== 'undefined') {
      (window as any).updateApplicationNotes = updateNotesFunction;
    }
    
    // Clean up - restore original function when unmounting
    return () => {
      if (typeof window !== 'undefined') {
        (window as any).updateApplicationNotes = originalUpdateFn;
      }
    };
  }, [id]);

  return {
    currentNotes,
    currentApplicationDetails,
    currentApplicationFullDetails,
    refreshNotesFromStorage
  };
}
