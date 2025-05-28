
import React from 'react';
import { Button } from '@/components/ui/button';
import { List, Kanban } from 'lucide-react';

export type ViewType = 'list' | 'kanban';

interface ViewSelectorProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const ViewSelector: React.FC<ViewSelectorProps> = ({ currentView, onViewChange }) => {
  return (
    <div className="flex gap-2">
      <Button
        variant={currentView === 'list' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onViewChange('list')}
        className="flex items-center gap-2"
      >
        <List className="h-4 w-4" />
        List
      </Button>
      <Button
        variant={currentView === 'kanban' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onViewChange('kanban')}
        className="flex items-center gap-2"
      >
        <Kanban className="h-4 w-4" />
        Kanban
      </Button>
    </div>
  );
};

export default ViewSelector;
