
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown } from 'lucide-react';
import { Note } from '@/types/application';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useParams } from 'react-router-dom';

interface NotesViewProps {
  notes: Note[];
}

const NotesView: React.FC<NotesViewProps> = ({ notes: initialNotes }) => {
  const [newNote, setNewNote] = useState('');
  const [mentionDropdownOpen, setMentionDropdownOpen] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [localNotes, setLocalNotes] = useState<Note[]>([]);
  const { toast } = useToast();
  const { id: applicationId } = useParams<{ id: string }>();
  
  // Update local notes when props change
  useEffect(() => {
    if (initialNotes && Array.isArray(initialNotes)) {
      setLocalNotes(initialNotes);
    }
  }, [initialNotes]);
  
  // Example list of users that could be tagged
  const users = [
    { name: "Michael McCann", username: "michael" },
    { name: "Jennifer Liu", username: "jennifer" },
    { name: "Tom Williams", username: "tom" },
    { name: "Sarah Johnson", username: "sarah" },
  ];

  const handleAddNote = useCallback(() => {
    if (!newNote.trim() || !applicationId) return;
    
    // Create a new note object
    const currentDate = new Date();
    const newNoteObj: Note = {
      content: newNote,
      time: currentDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      date: currentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      user: "Michael McCann" // Assuming current user
    };
    
    // First update local state immediately (optimistic update)
    setLocalNotes(prevNotes => [newNoteObj, ...prevNotes]);
    
    // Then update the global application state
    if (typeof window !== 'undefined' && (window as any).updateApplicationNotes && applicationId) {
      (window as any).updateApplicationNotes(applicationId, newNoteObj);
    }
    
    toast({
      title: "Note Added",
      description: "Your note has been added to the application"
    });
    
    setNewNote('');
  }, [newNote, applicationId, toast]);

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setNewNote(value);

    // Check if the user typed "@" to open the mention dropdown
    const lastAtSymbolIndex = value.lastIndexOf('@');
    if (lastAtSymbolIndex !== -1 && lastAtSymbolIndex === value.length - 1) {
      setMentionDropdownOpen(true);
      setCursorPosition(lastAtSymbolIndex);
    } else if (mentionDropdownOpen) {
      setMentionDropdownOpen(false);
    }
  };

  const handleUserMention = (username: string) => {
    const beforeMention = newNote.substring(0, cursorPosition);
    const afterMention = newNote.substring(cursorPosition + 1); // +1 to remove the "@"
    setNewNote(`${beforeMention}@${username} ${afterMention}`);
    setMentionDropdownOpen(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
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
          <div className="space-y-4">
            <div className="relative">
              <Textarea
                placeholder="Add a note... Use @ to mention a user"
                value={newNote}
                onChange={handleNoteChange}
                className="min-h-[100px] resize-none"
              />
              
              {mentionDropdownOpen && (
                <div className="absolute left-0 mt-1 w-full max-h-60 overflow-auto bg-white rounded-md shadow-lg border border-gray-200 z-10">
                  {users.map((user) => (
                    <div 
                      key={user.username}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleUserMention(user.username)}
                    >
                      {user.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex justify-end">
              <Button onClick={handleAddNote}>Add Note</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes list */}
      {localNotes.length > 0 ? (
        localNotes.map((note, index) => (
          <Card key={index} className="bg-gray-50">
            <CardContent className="p-6">
              <div className="flex space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-blue-500 text-white">
                    {getInitials(note.user)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-grow">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium">{note.user}</h4>
                    <span className="text-sm text-gray-500">{note.time} - {note.date}</span>
                  </div>
                  <div className="mt-2 text-gray-700">
                    {/* Format the content to highlight mentions */}
                    {note.content.split(' ').map((word, i) => 
                      word.startsWith('@') ? 
                        <span key={i} className="text-blue-600 font-medium">{word} </span> : 
                        <span key={i}>{word} </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card className="bg-gray-50">
          <CardContent className="p-6 text-center text-gray-500">
            No notes available for this application
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NotesView;
