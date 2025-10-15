import React from 'react';
import GridLayout, { Layout, WidthProvider } from 'react-grid-layout';
import DashboardCard from './DashboardCard';
import { DashboardComponent } from '@/hooks/useDashboardComponents';

const ResponsiveGridLayout = WidthProvider(GridLayout);

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
    <ResponsiveGridLayout
      className="layout"
      layout={layout}
      cols={12}
      rowHeight={60}
      onLayoutChange={handleLayoutChange}
      isDraggable={editMode}
      isResizable={editMode}
      compactType={editMode ? null : "vertical"}
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
    </ResponsiveGridLayout>
  );
};

export default DashboardGrid;
