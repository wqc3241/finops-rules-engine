import React from 'react';
import GridLayout, { Layout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-grid-layout/css/resizable.css';
import DashboardCard from './DashboardCard';
import { DashboardComponent } from '@/hooks/useDashboardComponents';

interface DashboardGridProps {
  components: DashboardComponent[];
  layout: Layout[];
  editMode: boolean;
  onLayoutChange: (layout: Layout[]) => void;
  onDeleteComponent?: (componentId: string) => void;
  onEditComponent?: (component: DashboardComponent) => void;
}

const DashboardGrid: React.FC<DashboardGridProps> = ({
  components,
  layout,
  editMode,
  onLayoutChange,
  onDeleteComponent,
  onEditComponent,
}) => {
  const handleLayoutChange = (newLayout: Layout[]) => {
    if (editMode) {
      onLayoutChange(newLayout);
    }
  };

  return (
    <GridLayout
      className="layout"
      layout={layout}
      cols={12}
      rowHeight={60}
      width={1200}
      onLayoutChange={handleLayoutChange}
      isDraggable={editMode}
      isResizable={editMode}
      compactType="vertical"
      preventCollision={false}
    >
      {components.map((component) => (
        <div key={component.id}>
          <DashboardCard
            component={component}
            editMode={editMode}
            onDelete={() => onDeleteComponent?.(component.id)}
            onEdit={() => onEditComponent?.(component)}
          />
        </div>
      ))}
    </GridLayout>
  );
};

export default DashboardGrid;
