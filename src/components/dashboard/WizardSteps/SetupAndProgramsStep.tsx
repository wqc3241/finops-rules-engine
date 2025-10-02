import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableHeader as TableHeaderUI, TableRow, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calendar, Loader2 } from 'lucide-react';
import { AdvertisedOfferWizardData, FinancialProgramOption } from '@/types/advertisedOffer';
import { useTableFilters } from '@/hooks/useTableFilters';
import { useTableSort } from '@/hooks/useTableSort';
import { ColumnDefinition, TableData } from '@/types/dynamicTable';
import TableHeaderComponent from '@/components/dynamic-table/TableHeader';

interface SetupAndProgramsStepProps {
  data: AdvertisedOfferWizardData;
  onUpdate: (updates: Partial<AdvertisedOfferWizardData>) => void;
}

const SetupAndProgramsStep = ({ data, onUpdate }: SetupAndProgramsStepProps) => {
  const [programs, setPrograms] = useState<FinancialProgramOption[]>([]);
  const [loading, setLoading] = useState(false);

  const handleDateChange = (field: 'offer_start_date' | 'offer_end_date', value: string) => {
    onUpdate({ [field]: value });
  };

  const isEndDateValid = () => {
    if (!data.offer_start_date || !data.offer_end_date) return true;
    return new Date(data.offer_end_date) >= new Date(data.offer_start_date);
  };

  const calculateDuration = () => {
    if (!data.offer_start_date || !data.offer_end_date || !isEndDateValid()) return null;
    const start = new Date(data.offer_start_date);
    const end = new Date(data.offer_end_date);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const duration = calculateDuration();

  // Transform programs to TableData format
  const tableData: TableData[] = useMemo(() => 
    programs.map(p => ({
      id: p.program_code,
      program_code: p.program_code,
      vehicle_style_id: p.vehicle_style_id,
      financing_vehicle_condition: p.financing_vehicle_condition,
      financial_product_id: p.financial_product_id,
      program_start_date: p.program_start_date,
      program_end_date: p.program_end_date,
      order_types: p.order_types || 'N/A'
    })),
    [programs]
  );

  // Generate unique values for filterable columns
  const getUniqueValues = (key: string): string[] => {
    const values = new Set<string>();
    tableData.forEach(row => {
      const value = row[key];
      if (value !== null && value !== undefined && value !== '') {
        values.add(String(value));
      }
    });
    return Array.from(values).sort();
  };

  // Define columns with filter options
  const columns: ColumnDefinition[] = useMemo(() => [
    { 
      id: 'program_code', 
      key: 'program_code', 
      name: 'Program Code', 
      type: 'string',
      inputType: 'Output' as const,
      isRequired: false,
      sortable: true,
      filterable: true,
      editable: false,
      filterOptions: getUniqueValues('program_code')
    },
    { 
      id: 'vehicle_style_id', 
      key: 'vehicle_style_id', 
      name: 'Vehicle Style', 
      type: 'string',
      inputType: 'Output' as const,
      isRequired: false,
      sortable: true,
      filterable: true,
      editable: false,
      filterOptions: getUniqueValues('vehicle_style_id')
    },
    { 
      id: 'financing_vehicle_condition', 
      key: 'financing_vehicle_condition', 
      name: 'Condition', 
      type: 'string',
      inputType: 'Output' as const,
      isRequired: false,
      sortable: true,
      filterable: true,
      editable: false,
      filterOptions: getUniqueValues('financing_vehicle_condition')
    },
    { 
      id: 'financial_product_id', 
      key: 'financial_product_id', 
      name: 'Financial Product', 
      type: 'string',
      inputType: 'Output' as const,
      isRequired: false,
      sortable: true,
      filterable: true,
      editable: false,
      filterOptions: getUniqueValues('financial_product_id')
    },
    { 
      id: 'program_start_date', 
      key: 'program_start_date', 
      name: 'Start Date', 
      type: 'string',
      inputType: 'Output' as const,
      isRequired: false,
      sortable: true,
      filterable: true,
      editable: false,
      filterOptions: getUniqueValues('program_start_date')
    },
    { 
      id: 'program_end_date', 
      key: 'program_end_date', 
      name: 'End Date', 
      type: 'string',
      inputType: 'Output' as const,
      isRequired: false,
      sortable: true,
      filterable: true,
      editable: false,
      filterOptions: getUniqueValues('program_end_date')
    },
    { 
      id: 'order_types', 
      key: 'order_types', 
      name: 'Order Types', 
      type: 'string',
      inputType: 'Output' as const,
      isRequired: false,
      sortable: true,
      filterable: true,
      editable: false,
      filterOptions: getUniqueValues('order_types')
    }
  ], [tableData]);

  // Use filter and sort hooks
  const { filters, filteredData, addFilter, removeFilter } = useTableFilters(tableData);
  const { sorts, sortedData, toggleSort } = useTableSort(filteredData);

  useEffect(() => {
    if (data.offer_start_date && data.offer_end_date && isEndDateValid()) {
      fetchPrograms();
    }
  }, [data.offer_start_date, data.offer_end_date]);

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const { data: programsData, error } = await supabase
        .from('financial_program_configs')
        .select('*')
        .eq('is_active', true as any)
        .gte('program_end_date', data.offer_start_date)
        .lte('program_start_date', data.offer_end_date)
        .order('program_code', { ascending: true });

      if (error) throw error;

      const formatted: FinancialProgramOption[] = (programsData || []).map((p: any) => ({
        program_code: p.program_code,
        vehicle_style_id: p.vehicle_style_id,
        financing_vehicle_condition: p.financing_vehicle_condition,
        financial_product_id: p.financial_product_id,
        program_start_date: p.program_start_date,
        program_end_date: p.program_end_date,
        order_types: p.order_types || '',
        lenders: p.template_metadata?.lenders || [],
        min_term: p.template_metadata?.min_term,
        max_term: p.template_metadata?.max_term,
        is_lease: p.financial_product_id?.toLowerCase().includes('lease')
      }));

      setPrograms(formatted);
    } catch (error) {
      console.error('Error fetching programs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProgram = (programCode: string, checked: boolean | 'indeterminate') => {
    const isChecked = checked === true;
    const newSelected = isChecked
      ? [...data.selected_programs, programCode]
      : data.selected_programs.filter(p => p !== programCode);
    
    onUpdate({ selected_programs: newSelected });
  };

  const handleSelectAll = () => {
    const currentPrograms = sortedData.map(p => String(p.program_code));
    if (data.selected_programs.length === currentPrograms.length && currentPrograms.length > 0) {
      onUpdate({ selected_programs: [] });
    } else {
      onUpdate({ selected_programs: currentPrograms });
    }
  };

  const handleFilterChange = (columnKey: string, filter: any) => {
    if (filter) {
      addFilter(filter);
    } else {
      removeFilter(columnKey);
    }
  };

  return (
    <div className="space-y-6">
      {/* Date Range Section */}
      <div>
        <div className="flex items-center gap-2 text-muted-foreground mb-4">
          <Calendar className="w-5 h-5" />
          <p>Define the time range for your advertised offers</p>
        </div>

        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="offer_start_date" className="text-base font-medium">
                Offer Start Date
              </Label>
              <Input
                id="offer_start_date"
                type="date"
                value={data.offer_start_date}
                onChange={(e) => handleDateChange('offer_start_date', e.target.value)}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="offer_end_date" className="text-base font-medium">
                Offer End Date
              </Label>
              <Input
                id="offer_end_date"
                type="date"
                value={data.offer_end_date}
                onChange={(e) => handleDateChange('offer_end_date', e.target.value)}
                min={data.offer_start_date}
                className="w-full"
              />
              {!isEndDateValid() && (
                <p className="text-sm text-destructive">
                  End date must be after start date
                </p>
              )}
            </div>
          </div>

          {duration !== null && isEndDateValid() && (
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium">Offer Duration</p>
              <p className="text-2xl font-bold text-primary">{duration} days</p>
            </div>
          )}
        </Card>
      </div>

      {/* Program Selection Section */}
      {data.offer_start_date && data.offer_end_date && isEndDateValid() && (
        <div>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <Card>
              <div className="p-4 border-b flex justify-between items-center">
                <div>
                  <p className="font-medium">Available Programs</p>
                  <p className="text-sm text-muted-foreground">
                    {sortedData.length} programs found | {data.selected_programs.length} selected
                  </p>
                </div>
                <Checkbox
                  checked={data.selected_programs.length === sortedData.length && sortedData.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeaderUI>
                    <TableRow>
                      <TableHeaderComponent
                        columns={columns}
                        allowColumnManagement={false}
                        hoveredDeleteButton={null}
                        setHoveredDeleteButton={() => {}}
                        hoveredDivider={null}
                        setHoveredDivider={() => {}}
                        onRemoveColumn={() => {}}
                        onDividerClick={() => {}}
                        filters={filters}
                        sorts={sorts}
                        onFilterChange={handleFilterChange}
                        onSortChange={toggleSort}
                      />
                    </TableRow>
                  </TableHeaderUI>
                  <TableBody>
                    {sortedData.map((row) => {
                      const program = programs.find(p => p.program_code === row.program_code);
                      if (!program) return null;
                      
                      return (
                        <TableRow key={program.program_code}>
                          <TableCell className="w-10">
                            <Checkbox
                              checked={data.selected_programs.includes(program.program_code)}
                              onCheckedChange={(checked) => handleSelectProgram(program.program_code, checked)}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{program.program_code}</TableCell>
                          <TableCell>{program.vehicle_style_id}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{program.financing_vehicle_condition}</Badge>
                          </TableCell>
                          <TableCell>{program.financial_product_id}</TableCell>
                          <TableCell>{new Date(program.program_start_date).toLocaleDateString()}</TableCell>
                          <TableCell>{new Date(program.program_end_date).toLocaleDateString()}</TableCell>
                          <TableCell>{program.order_types || 'N/A'}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default SetupAndProgramsStep;
