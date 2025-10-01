import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { AdvertisedOfferWizardData } from '@/types/advertisedOffer';
import { Loader2, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface FinancialCalculationStepProps {
  data: AdvertisedOfferWizardData;
  onUpdate: (updates: Partial<AdvertisedOfferWizardData>) => void;
}

const FinancialCalculationStep = ({ data, onUpdate }: FinancialCalculationStepProps) => {
  const [loading, setLoading] = useState(false);
  const [calculations, setCalculations] = useState<Record<string, any>>({});

  useEffect(() => {
    calculateFinancials();
  }, [data.program_configs]);

  const calculateFinancials = async () => {
    setLoading(true);
    const newCalculations: Record<string, any> = {};
    const newOfferDetails = { ...data.offer_details };

    for (const programCode of data.selected_programs) {
      const config = data.program_configs[programCode];
      if (!config) continue;

      // Fetch bulletin pricing for this program
      const { data: pricingData } = await supabase
        .from('bulletin_pricing')
        .select('*')
        .eq('financial_program_code', programCode)
        .limit(1);

      if (pricingData && pricingData.length > 0) {
        const pricing = pricingData[0];
        const apr = pricing.pricing_value || 5.99;
        
        // Simple monthly payment calculation
        // P = L[c(1 + c)^n]/[(1 + c)^n - 1]
        const principal = 10000 - (config.down_payment || 0);
        const monthlyRate = apr / 100 / 12;
        const numPayments = config.term;
        
        let monthlyPayment = 0;
        if (monthlyRate === 0) {
          monthlyPayment = principal / numPayments;
        } else {
          monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                          (Math.pow(1 + monthlyRate, numPayments) - 1);
        }

        const totalPayments = monthlyPayment * numPayments;
        const totalCost = totalPayments - principal;
        const loanAmountPer10k = (monthlyPayment * numPayments).toFixed(2);

        newCalculations[programCode] = {
          monthly_payment: monthlyPayment,
          apr: apr,
          total_cost_of_credit: totalCost.toFixed(2),
          loan_amount_per_10k: loanAmountPer10k,
          lender: pricing.lender_list
        };

        newOfferDetails[programCode] = {
          ...(newOfferDetails[programCode] || {}),
          monthly_payment: monthlyPayment,
          apr: apr,
          total_cost_of_credit: totalCost.toFixed(2),
          loan_amount_per_10k: loanAmountPer10k,
          lender: pricing.lender_list,
          offer_name: `${programCode} - ${config.order_type} - ${config.term}mo`
        };
      }
    }

    setCalculations(newCalculations);
    onUpdate({ offer_details: newOfferDetails });
    setLoading(false);
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
      <div className="flex items-center gap-2 text-muted-foreground mb-4">
        <DollarSign className="w-5 h-5" />
        <p>Financial calculations based on bulletin pricing and configurations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.selected_programs.map((programCode) => {
          const config = data.program_configs[programCode];
          const calc = calculations[programCode];

          if (!calc) return null;

          return (
            <Card key={programCode} className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{programCode}</h3>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline">{config.order_type}</Badge>
                    <Badge variant="outline">{config.term} months</Badge>
                  </div>
                </div>

                <div className="space-y-3 border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Monthly Payment</span>
                    <span className="font-semibold">${calc.monthly_payment.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">APR</span>
                    <span className="font-semibold">{calc.apr}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Cost</span>
                    <span className="font-semibold">${calc.total_cost_of_credit}</span>
                  </div>
                  {config.down_payment && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Down Payment</span>
                      <span className="font-semibold">${config.down_payment}</span>
                    </div>
                  )}
                  {calc.lender && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Lender</span>
                      <span className="font-semibold">{calc.lender}</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default FinancialCalculationStep;
