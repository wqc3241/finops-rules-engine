
import { Application, Note } from '@/types/application';
import { APPLICATIONS_STORAGE_KEY, APPLICATIONS_UPDATE_KEY } from '@/constants/storageKeys';
import { toast } from "sonner";

// Set up global function to update application notes
export const setupGlobalNoteUpdateFunction = (
  setApplications: React.Dispatch<React.SetStateAction<Application[]>>
) => {
  if (typeof window !== 'undefined') {
    (window as any).updateApplicationNotes = (appId: string, newNote: any) => {
      setApplications(prevApps => {
        const updatedApps = prevApps.map(app => {
          if (app.id === appId) {
            // Create notesArray if it doesn't exist or add to existing one
            const notesArray = app.notesArray ? [newNote, ...app.notesArray] : [newNote];
            
            // Update the app with new notes
            return {
              ...app,
              notes: newNote.content, // Keep legacy notes field updated for backward compatibility
              notesArray: notesArray
            };
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
  
  // Return cleanup function
  return () => {
    if (typeof window !== 'undefined') {
      (window as any).updateApplicationNotes = undefined;
    }
  };
};

// Initialize applications with notes array
export const initializeApplicationsWithNotes = (initialApps: Application[]): Application[] => {
  return initialApps.map(app => {
    if (!app.notesArray) {
      // Convert legacy notes string to note object if it exists
      const notesArray = app.notes 
        ? [{
            content: app.notes,
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
            user: "System"
          }] 
        : [];
        
      return {
        ...app,
        notesArray
      };
    }
    return app;
  });
};
