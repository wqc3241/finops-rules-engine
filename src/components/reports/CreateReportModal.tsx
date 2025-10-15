
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSupabaseTables } from '@/hooks/useSupabaseTables';
import { useTableRelations } from '@/hooks/useTableRelations';
import { useReportExecution } from '@/hooks/useReportExecution';
import { ReportConfig, ReportFilter } from '@/types/report';
import { TableColumn } from '@/types/dashboard';
import ColumnSelector from './ColumnSelector';
import AdvancedFilterBuilder from './AdvancedFilterBuilder';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { toast } from 'sonner';

interface CreateReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateReport: (report: { title: string; description: string; config: ReportConfig; data: any }) => void;
}

const CreateReportModal: React.FC<CreateReportModalProps> = ({
  open,
  onOpenChange,
  onCreateReport
}) => {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sourceTable, setSourceTable] = useState('');
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [filters, setFilters] = useState<ReportFilter[]>([]);
  const [orderColumn, setOrderColumn] = useState('');
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('asc');
  const [limit, setLimit] = useState(100);
  const [tableColumns, setTableColumns] = useState<TableColumn[]>([]);
  const [foreignColumns, setForeignColumns] = useState<Record<string, TableColumn[]>>({});
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  const { tables, fetchColumnsForTable } = useSupabaseTables();
  const { data: foreignKeys = [] } = useTableRelations(sourceTable);
  const { executeReport } = useReportExecution();

  // Fetch columns when table changes
  useEffect(() => {
    if (sourceTable) {
      fetchColumnsForTable(sourceTable).then(cols => {
        setTableColumns(cols);
        setSelectedColumns([]);
        setFilters([]);
        setOrderColumn('');
      });
    }
  }, [sourceTable, fetchColumnsForTable]);

  // Fetch foreign key table columns
  useEffect(() => {
    if (foreignKeys.length > 0) {
      foreignKeys.forEach(fk => {
        if (!foreignColumns[fk.foreignTable]) {
          fetchColumnsForTable(fk.foreignTable).then(cols => {
            setForeignColumns(prev => ({ ...prev, [fk.foreignTable]: cols }));
          });
        }
      });
    }
  }, [foreignKeys, fetchColumnsForTable]);

  const handleNext = () => {
    if (step === 1 && !title.trim()) {
      toast.error('Please enter a report title');
      return;
    }
    if (step === 2 && !sourceTable) {
      toast.error('Please select a data source');
      return;
    }
    if (step === 3 && selectedColumns.length === 0) {
      toast.error('Please select at least one column');
      return;
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handlePreview = async () => {
    setIsLoadingPreview(true);
    try {
      const config: ReportConfig = {
        sourceTable,
        selectedColumns,
        filters,
        orderBy: orderColumn ? { column: orderColumn, direction: orderDirection } : undefined,
        limit: 10
      };
      const data = await executeReport(config, foreignKeys);
      setPreviewData(data || []);
      toast.success('Preview loaded successfully');
    } catch (error: any) {
      toast.error(`Preview failed: ${error.message}`);
      setPreviewData([]);
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const handleCreate = async () => {
    try {
      const config: ReportConfig = {
        sourceTable,
        selectedColumns,
        filters,
        orderBy: orderColumn ? { column: orderColumn, direction: orderDirection } : undefined,
        limit
      };
      
      const data = await executeReport(config, foreignKeys);
      
      onCreateReport({
        title: title.trim(),
        description: description.trim(),
        config,
        data
      });

      // Reset form
      setStep(1);
      setTitle('');
      setDescription('');
      setSourceTable('');
      setSelectedColumns([]);
      setFilters([]);
      setOrderColumn('');
      setOrderDirection('asc');
      setLimit(100);
      setPreviewData([]);
      
      onOpenChange(false);
      toast.success('Report created successfully');
    } catch (error: any) {
      toast.error(`Failed to create report: ${error.message}`);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="report-title">Report Title *</Label>
              <Input
                id="report-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter report title"
              />
            </div>
            <div>
              <Label htmlFor="report-description">Description (Optional)</Label>
              <Textarea
                id="report-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter report description"
                rows={3}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="source-table">Data Source *</Label>
              <Select value={sourceTable} onValueChange={setSourceTable}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a table" />
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
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <Label>Select Columns *</Label>
            <ColumnSelector
              columns={tableColumns}
              foreignKeys={foreignKeys}
              selectedColumns={selectedColumns}
              onChange={setSelectedColumns}
              foreignColumns={foreignColumns}
            />
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <Label>Add Filters (Optional)</Label>
            <AdvancedFilterBuilder
              columns={tableColumns}
              foreignKeys={foreignKeys}
              filters={filters}
              onChange={setFilters}
              foreignColumns={foreignColumns}
            />
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="order-column">Order By (Optional)</Label>
              <Select value={orderColumn} onValueChange={setOrderColumn}>
                <SelectTrigger>
                  <SelectValue placeholder="Select column" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {tableColumns.map(col => (
                    <SelectItem key={col.name} value={col.name}>
                      {col.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="order-direction">Direction</Label>
              <Select value={orderDirection} onValueChange={(val: 'asc' | 'desc') => setOrderDirection(val)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="limit">Row Limit</Label>
              <Input
                id="limit"
                type="number"
                value={limit}
                onChange={(e) => setLimit(parseInt(e.target.value) || 100)}
                min={1}
                max={1000}
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Report Summary</h4>
              <div className="space-y-2 text-sm">
                <p><strong>Title:</strong> {title}</p>
                <p><strong>Table:</strong> {sourceTable}</p>
                <p><strong>Columns:</strong> {selectedColumns.length} selected</p>
                <p><strong>Filters:</strong> {filters.length} applied</p>
                <p><strong>Limit:</strong> {limit} rows</p>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">Preview (First 10 rows)</h4>
                <Button onClick={handlePreview} disabled={isLoadingPreview} size="sm">
                  {isLoadingPreview ? 'Loading...' : 'Refresh Preview'}
                </Button>
              </div>
              <div className="border rounded-lg max-h-[300px] overflow-auto">
                {previewData.length > 0 ? (
                  <table className="w-full text-xs">
                    <thead className="bg-muted">
                      <tr>
                        {Object.keys(previewData[0]).map(key => (
                          <th key={key} className="p-2 text-left font-semibold">{key}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.map((row, i) => (
                        <tr key={i} className="border-t">
                          {Object.values(row).map((val: any, j) => (
                            <td key={j} className="p-2">{JSON.stringify(val)}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="p-4 text-sm text-muted-foreground text-center">
                    Click "Refresh Preview" to see data
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Report - Step {step} of 6</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {renderStep()}
        </div>

        <div className="flex justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          {step < 6 ? (
            <Button onClick={handleNext}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleCreate}>
              <Check className="h-4 w-4 mr-2" />
              Create Report
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateReportModal;
