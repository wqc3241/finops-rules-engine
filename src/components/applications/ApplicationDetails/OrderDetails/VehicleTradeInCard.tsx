import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { DataField } from './DataField';
import { useRandomTradeIn } from '@/hooks/useRandomTradeIn';

interface VehicleTradeInProps {
  applicationId: string;
}

const VehicleTradeInCard: React.FC<VehicleTradeInProps> = ({ applicationId }) => {
  // For demonstration: fetch any random trade-in regardless of application_id
  const { data: tradeIn, isLoading } = useRandomTradeIn();

  // Format currency values
  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  // Format number with commas
  const formatNumber = (value: number) => 
    new Intl.NumberFormat('en-US').format(value);

  if (isLoading) {
    return (
      <Card className="h-fit">
        <CardContent className="p-6">
          <Skeleton className="h-6 w-40 mb-4" />
          <div className="space-y-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-5 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!tradeIn) {
    return null;
  }

  return (
    <Card className="h-fit">
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">Vehicle Trade In</h3>
        <div className="space-y-2">
          <DataField label="Year" value={tradeIn.year.toString()} />
          <DataField label="Make" value={tradeIn.make} />
          <DataField label="Model" value={tradeIn.model} />
          <DataField label="Trim" value={tradeIn.trim || ''} />
          <DataField label="VIN" value={tradeIn.vin} />
          <DataField label="Odometer" value={formatNumber(tradeIn.valuation_odometer)} />
          <DataField label="Lien Holder" value={tradeIn.lien_holder || 'None'} />
          <DataField label="Final Offer" value={formatCurrency(tradeIn.final_offer)} />
          <DataField label="Payoff Amount" value={formatCurrency(tradeIn.payoff_amount)} />
          <DataField label="Net Trade In" value={formatCurrency(tradeIn.net_trade_in)} />
          {tradeIn.equity_payout_amount > 0 && (
            <DataField label="Equity Payout" value={formatCurrency(tradeIn.equity_payout_amount)} />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleTradeInCard;
