
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown } from 'lucide-react';
import { Note } from '@/types/application';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface NotesViewProps {
  notes: Note[];
}

const NotesView: React.FC<NotesViewProps> = ({ notes }) => {
  const [newNote, setNewNote] = useState('');

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    console.log("Add note:", newNote);
    setNewNote('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end gap-4">
        <div className="relative inline-block text-left">
          <div className="inline-flex items-center justify-center gap-1 rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300">
            <span>Sort By Date</span>
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
        
        <div className="relative inline-block text-left">
          <div className="inline-flex items-center justify-center gap-1 rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300">
            <span>Newest To Latest</span>
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Add new note */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Input
              placeholder="Add a note..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="flex-grow"
            />
            <Button onClick={handleAddNote}>Add Note</Button>
          </div>
        </CardContent>
      </Card>

      {/* Notes list */}
      {notes.map((note, index) => (
        <Card key={index} className="bg-gray-50">
          <CardContent className="p-6">
            <div className="flex justify-between">
              <div className="flex-grow">
                <p className="mb-4">{note.content}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">{note.time}</p>
                <p className="text-sm text-gray-500">{note.date}</p>
                <p className="text-gray-800 mt-1">{note.user}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default NotesView;
