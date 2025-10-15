import React, { useState, useEffect } from 'react';
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
import { Separator } from '@/components/ui/separator';
import { useCreateComponent } from '@/hooks/useDashboardComponents';
import { useSupabaseTables } from '@/hooks/useSupabaseTables';
import { DataSourceConfig, Filter, TableColumn } from '@/types/dashboard';
import FilterBuilder from './FilterBuilder';
import { Checkbox } from '@/components/ui/checkbox';

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
  
  // Data source state
  const [selectedTable, setSelectedTable] = useState('');
  const [availableColumns, setAvailableColumns] = useState<TableColumn[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [filters, setFilters] = useState<Filter[]>([]);
  const [groupBy, setGroupBy] = useState('');
  const [xAxis, setXAxis] = useState('');
  const [yAxis, setYAxis] = useState('');
  
  const { tables, tablesLoading, fetchColumnsForTable } = useSupabaseTables();
  const createComponent = useCreateComponent();

  // Fetch columns when table is selected
  useEffect(() => {
    if (selectedTable) {
      fetchColumnsForTable(selectedTable).then(cols => {
        setAvailableColumns(cols);
        setSelectedColumns([]);
        setFilters([]);
        setGroupBy('');
        setXAxis('');
        setYAxis('');
      });
    }
  }, [selectedTable]); // Only re-run when table selection changes

  const handleSubmit = () => {
    const position = {
      x: 0,
      y: Infinity,
      w: type === 'table' ? 6 : 4,
      h: type === 'table' ? 3 : 2,
    };

    // Build data source config
    const dataSource: DataSourceConfig = {
      type: 'supabase_table',
      tableName: selectedTable,
      columns: selectedColumns.length > 0 ? selectedColumns : undefined,
      filters: filters.length > 0 ? filters : undefined,
      groupBy: groupBy || undefined,
      limit: 100,
    };

    // Build visualization config
    const visualization_config: any = {};
    if (type === 'chart') {
      visualization_config.chartType = chartType;
      visualization_config.xAxis = xAxis || selectedColumns[0];
      visualization_config.yAxis = yAxis || selectedColumns[1];
    } else if (type === 'table') {
      visualization_config.columns = selectedColumns;
    }

    createComponent.mutate({
      dashboard_id: dashboardId,
      type,
      title,
      data_source: dataSource as any,
      visualization_config,
      filter_bindings: [],
      position,
    }, {
      onSuccess: () => {
        onOpenChange(false);
        resetForm();
      },
    });
  };

  const resetForm = () => {
    setTitle('');
    setType('chart');
    setChartType('bar');
    setSelectedTable('');
    setAvailableColumns([]);
    setSelectedColumns([]);
    setFilters([]);
    setGroupBy('');
    setXAxis('');
    setYAxis('');
  };

  const canSubmit = title && type && selectedTable && selectedColumns.length > 0 && 
    (type !== 'chart' || (xAxis && yAxis));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Component</DialogTitle>
          <DialogDescription>
            Configure your component's settings, data source, and visualization
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold mb-3">Basic Information</h3>
            </div>
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

          <Separator />

          {/* Section 2: Data Source */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold mb-3">Data Source</h3>
            </div>
            <div className="space-y-2">
              <Label htmlFor="table">Select Table</Label>
              <Select value={selectedTable} onValueChange={setSelectedTable} disabled={tablesLoading}>
                <SelectTrigger id="table">
                  <SelectValue placeholder={tablesLoading ? "Loading tables..." : "Select a table"} />
                </SelectTrigger>
                <SelectContent>
                  {tables.map(table => (
                    <SelectItem key={table.table_name} value={table.table_name}>
                      {table.table_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedTable && availableColumns.length > 0 && (
              <>
                <div className="space-y-2">
                  <Label>Select Columns</Label>
                  <div className="border rounded-md p-3 max-h-48 overflow-y-auto space-y-2">
                    {availableColumns.map(col => (
                      <div key={col.name} className="flex items-center space-x-2">
                        <Checkbox
                          checked={selectedColumns.includes(col.name)}
                          onCheckedChange={(checked) => {
                            console.log('🔵 Checkbox onCheckedChange triggered:', {
                              column: col.name,
                              newCheckedState: checked,
                              timestamp: new Date().toISOString()
                            });
                            
                            if (checked) {
                              console.log('✅ Adding column:', col.name);
                              setSelectedColumns(prev => {
                                console.log('Previous state:', prev);
                                if (prev.includes(col.name)) {
                                  console.log('⚠️ Column already exists, skipping');
                                  return prev;
                                }
                                return [...prev, col.name];
                              });
                            } else {
                              console.log('❌ Removing column:', col.name);
                              setSelectedColumns(prev => {
                                console.log('Previous state:', prev);
                                return prev.filter(c => c !== col.name);
                              });
                            }
                          }}
                        />
                        <label 
                          className="text-sm cursor-pointer"
                          onClick={(e) => {
                            console.log('🟡 Label clicked:', col.name, 'Event:', e.type);
                          }}
                        >
                          {col.name} <span className="text-muted-foreground">({col.type})</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <FilterBuilder
                  columns={availableColumns}
                  filters={filters}
                  onChange={setFilters}
                />
              </>
            )}

            {!selectedTable && (
              <p className="text-sm text-muted-foreground">Select a table to continue</p>
            )}
          </div>

          <Separator />

          {/* Section 3: Visualization Configuration */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold mb-3">Visualization Configuration</h3>
            </div>

            {!selectedColumns.length ? (
              <p className="text-sm text-muted-foreground">Select columns from your data source to configure visualization</p>
            ) : (
              <>
                {type === 'chart' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="xAxis">X-Axis Column</Label>
                      <Select value={xAxis} onValueChange={setXAxis}>
                        <SelectTrigger id="xAxis">
                          <SelectValue placeholder="Select X-axis column" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedColumns.map(col => (
                            <SelectItem key={col} value={col}>{col}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="yAxis">Y-Axis Column</Label>
                      <Select value={yAxis} onValueChange={setYAxis}>
                        <SelectTrigger id="yAxis">
                          <SelectValue placeholder="Select Y-axis column" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedColumns.map(col => (
                            <SelectItem key={col} value={col}>{col}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="groupBy">Group By (Optional)</Label>
                      <Select value={groupBy || undefined} onValueChange={(val) => setGroupBy(val)}>
                        <SelectTrigger id="groupBy">
                          <SelectValue placeholder="None (select to group)" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedColumns.map(col => (
                            <SelectItem key={col} value={col}>{col}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {type === 'table' && (
                  <div className="space-y-2">
                    <Label>Selected Columns for Display</Label>
                    <div className="border rounded-md p-3 text-sm bg-muted/50">
                      {selectedColumns.length > 0 ? (
                        selectedColumns.join(', ')
                      ) : (
                        <span className="text-muted-foreground">All columns will be displayed</span>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => { onOpenChange(false); resetForm(); }}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!canSubmit}>
            Add Component
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddComponentModal;
