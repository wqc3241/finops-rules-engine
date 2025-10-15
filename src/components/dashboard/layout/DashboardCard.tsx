import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, GripVertical } from 'lucide-react';
import { DashboardComponent } from '@/hooks/useDashboardComponents';
import ChartRenderer from '../components/ChartRenderer';
import TableRenderer from '../components/TableRenderer';
import MetricCard from '../components/MetricCard';
import GaugeRenderer from '../components/GaugeRenderer';

interface DashboardCardProps {
  component: DashboardComponent;
  editMode: boolean;
  onDelete?: () => void;
  onEdit?: () => void;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  component,
  editMode,
  onDelete,
  onEdit,
}) => {
  const renderComponent = () => {
    switch (component.type) {
      case 'chart':
        return <ChartRenderer config={component.visualization_config} dataSource={component.data_source} />;
      case 'table':
        return <TableRenderer config={component.visualization_config} dataSource={component.data_source} />;
      case 'metric':
        return <MetricCard config={component.visualization_config} dataSource={component.data_source} />;
      case 'gauge':
        return <GaugeRenderer config={component.visualization_config} dataSource={component.data_source} />;
      default:
        return <div>Unknown component type</div>;
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          {editMode && <GripVertical className="h-4 w-4 text-muted-foreground cursor-move react-grid-draghandle" />}
          <CardTitle className="text-sm font-medium">{component.title}</CardTitle>
        </div>
        {editMode && (
          <div className="flex gap-1 react-grid-no-drag">
            <Button variant="ghost" size="icon" onClick={onEdit}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-1 p-4">
        {renderComponent()}
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
