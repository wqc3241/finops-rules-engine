import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { AdvertisedOfferWizardData, FinancialProgramOption } from '@/types/advertisedOffer';
import { Loader2, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProgramSelectionStepProps {
  data: AdvertisedOfferWizardData;
  onUpdate: (updates: Partial<AdvertisedOfferWizardData>) => void;
}

const ProgramSelectionStep = ({ data, onUpdate }: ProgramSelectionStepProps) => {
  const [programs, setPrograms] = useState<FinancialProgramOption[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<FinancialProgramOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    programCode: '',
    vehicleStyle: '',
    condition: '',
    financialProduct: ''
  });

  useEffect(() => {
    if (data.offer_start_date && data.offer_end_date) {
      fetchPrograms();
    }
  }, [data.offer_start_date, data.offer_end_date]);

  useEffect(() => {
    applyFilters();
  }, [filters, programs]);

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const { data: programsData, error } = await supabase
        .from('financial_program_configs')
        .select('*')
        .eq('is_active', 'TRUE')
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
      setFilteredPrograms(formatted);
    } catch (error) {
      console.error('Error fetching programs:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...programs];

    if (filters.programCode) {
      filtered = filtered.filter(p => 
        p.program_code.toLowerCase().includes(filters.programCode.toLowerCase())
      );
    }
    if (filters.vehicleStyle) {
      filtered = filtered.filter(p => 
        p.vehicle_style_id.toLowerCase().includes(filters.vehicleStyle.toLowerCase())
      );
    }
    if (filters.condition) {
      filtered = filtered.filter(p => 
        p.financing_vehicle_condition.toLowerCase().includes(filters.condition.toLowerCase())
      );
    }
    if (filters.financialProduct) {
      filtered = filtered.filter(p => 
        p.financial_product_id.toLowerCase().includes(filters.financialProduct.toLowerCase())
      );
    }

    setFilteredPrograms(filtered);
  };

  const handleSelectProgram = (programCode: string, checked: boolean) => {
    const newSelected = checked
      ? [...data.selected_programs, programCode]
      : data.selected_programs.filter(p => p !== programCode);
    
    onUpdate({ selected_programs: newSelected });
  };

  const handleSelectAll = () => {
    if (data.selected_programs.length === filteredPrograms.length) {
      onUpdate({ selected_programs: [] });
    } else {
      onUpdate({ selected_programs: filteredPrograms.map(p => p.program_code) });
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
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Search className="w-5 h-5 text-muted-foreground" />
          <Label className="text-base font-medium">Filter Programs</Label>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Program Code..."
            value={filters.programCode}
            onChange={(e) => setFilters(prev => ({ ...prev, programCode: e.target.value }))}
          />
          <Input
            placeholder="Vehicle Style..."
            value={filters.vehicleStyle}
            onChange={(e) => setFilters(prev => ({ ...prev, vehicleStyle: e.target.value }))}
          />
          <Input
            placeholder="Condition..."
            value={filters.condition}
            onChange={(e) => setFilters(prev => ({ ...prev, condition: e.target.value }))}
          />
          <Input
            placeholder="Financial Product..."
            value={filters.financialProduct}
            onChange={(e) => setFilters(prev => ({ ...prev, financialProduct: e.target.value }))}
          />
        </div>
      </Card>

      <Card>
        <div className="p-4 border-b flex justify-between items-center">
          <div>
            <p className="font-medium">Available Programs</p>
            <p className="text-sm text-muted-foreground">
              {filteredPrograms.length} programs found | {data.selected_programs.length} selected
            </p>
          </div>
          <Checkbox
            checked={data.selected_programs.length === filteredPrograms.length && filteredPrograms.length > 0}
            onCheckedChange={handleSelectAll}
          />
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Program Code</TableHead>
                <TableHead>Vehicle Style</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Financial Product</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Order Types</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPrograms.map((program) => (
                <TableRow key={program.program_code}>
                  <TableCell>
                    <Checkbox
                      checked={data.selected_programs.includes(program.program_code)}
                      onCheckedChange={(checked) => handleSelectProgram(program.program_code, checked as boolean)}
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
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default ProgramSelectionStep;
