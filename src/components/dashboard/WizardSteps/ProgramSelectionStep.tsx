import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableHeader as TableHeaderUI, TableRow, TableBody, TableCell } from '@/components/ui/table';
import { AdvertisedOfferWizardData, FinancialProgramOption } from '@/types/advertisedOffer';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useTableFilters } from '@/hooks/useTableFilters';
import { useTableSort } from '@/hooks/useTableSort';
import { ColumnDefinition, TableData } from '@/types/dynamicTable';
import TableHeaderComponent from '@/components/dynamic-table/TableHeader';

interface ProgramSelectionStepProps {
  data: AdvertisedOfferWizardData;
  onUpdate: (updates: Partial<AdvertisedOfferWizardData>) => void;
}

const ProgramSelectionStep = ({ data, onUpdate }: ProgramSelectionStepProps) => {
  const [programs, setPrograms] = useState<FinancialProgramOption[]>([]);
  const [loading, setLoading] = useState(false);

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
  const { filters, filteredData, addFilter, removeFilter, getFilter } = useTableFilters(tableData);
  const { sorts, sortedData, toggleSort, getSort } = useTableSort(filteredData);

  useEffect(() => {
    if (data.offer_start_date && data.offer_end_date) {
      fetchPrograms();
    }
  }, [data.offer_start_date, data.offer_end_date]);

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const { data: programsData, error } = await supabase
        .from('financial_program_configs')
        .select('*')
        .in('is_active', ['TRUE', 'Y', 'Active', 'true', '1'])
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
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
    </div>
  );
};

export default ProgramSelectionStep;
