import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateComponent } from '@/hooks/useDashboardComponents';

interface AddComponentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dashboardId: string;
}

const AddComponentModal: React.FC<AddComponentModalProps> = ({
  open,
  onOpenChange,
  dashboardId,
}) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'chart' | 'table' | 'metric' | 'gauge'>('chart');
  const [chartType, setChartType] = useState<'bar' | 'line' | 'area' | 'pie'>('bar');
  const createComponent = useCreateComponent();

  const handleSubmit = () => {
    const position = {
      x: 0,
      y: Infinity, // Add to bottom
      w: 4,
      h: 2,
    };

    const visualization_config: any = {};
    if (type === 'chart') {
      visualization_config.chartType = chartType;
      visualization_config.xAxis = 'month';
      visualization_config.yAxis = 'count';
    }

    createComponent.mutate({
      dashboard_id: dashboardId,
      type,
      title,
      data_source: null,
      visualization_config,
      filter_bindings: [],
      position,
    }, {
      onSuccess: () => {
        onOpenChange(false);
        setTitle('');
        setType('chart');
        setChartType('bar');
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Component</DialogTitle>
          <DialogDescription>
            Add a new component to your dashboard
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter component title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Component Type</Label>
            <Select value={type} onValueChange={(value: any) => setType(value)}>
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="chart">Chart</SelectItem>
                <SelectItem value="table">Table</SelectItem>
                <SelectItem value="metric">Metric</SelectItem>
                <SelectItem value="gauge">Gauge</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {type === 'chart' && (
            <div className="space-y-2">
              <Label htmlFor="chartType">Chart Type</Label>
              <Select value={chartType} onValueChange={(value: any) => setChartType(value)}>
                <SelectTrigger id="chartType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">Bar Chart</SelectItem>
                  <SelectItem value="line">Line Chart</SelectItem>
                  <SelectItem value="area">Area Chart</SelectItem>
                  <SelectItem value="pie">Pie Chart</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!title}>
            Add Component
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddComponentModal;
