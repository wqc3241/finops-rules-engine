
import React, { useState } from 'react';
import ApplicationCard from './ApplicationCard';
import { Application } from '../../types/application';
import { applications as initialApplications } from '../../data/mockApplications';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ApplicationList: React.FC = () => {
  const [sortOption, setSortOption] = useState('date');
  const [showFilters, setShowFilters] = useState(false);
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  
  // Make this available globally so it can be used by other components
  if (typeof window !== 'undefined') {
    (window as any).updateApplicationNotes = (appId: string, newNote: any) => {
      setApplications(prevApps => {
        return prevApps.map(app => {
          if (app.id === appId) {
            // Add the new note to the notesArray
            const updatedNotesArray = [newNote, ...(app.notesArray || [])];
            // Update the notes field with the latest note content
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

  return (
    <div>
      <div className="flex justify-end mb-6 gap-4">
        <div className="relative">
          <Button 
            variant="outline" 
            className="flex items-center justify-between min-w-[200px] border border-gray-300"
            onClick={() => setSortOption(sortOption === 'date' ? 'name' : 'date')}
          >
            <span>Sort ({sortOption})</span>
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <Button 
          variant="outline" 
          className="flex items-center justify-between border border-gray-300"
          onClick={() => setShowFilters(!showFilters)}
        >
          <span>Show Filters</span>
          <SlidersHorizontal className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {applications.map((application) => (
        <ApplicationCard key={application.id} application={application} />
      ))}
    </div>
  );
};

export default ApplicationList;
