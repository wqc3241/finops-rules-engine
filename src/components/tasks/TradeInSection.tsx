import React from 'react';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useTradeInById } from '@/hooks/useTradeInById';
import { Card, CardContent } from '@/components/ui/card';

interface TradeInSectionProps {
  tradeInId: string | null | undefined;
}

const TradeInSection: React.FC<TradeInSectionProps> = ({ tradeInId }) => {
  const { data: tradeIn, isLoading } = useTradeInById(tradeInId);

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  const formatNumber = (value: number) => 
    new Intl.NumberFormat('en-US').format(value);

  if (!tradeInId) return null;

  if (isLoading) {
    return (
      <div className="pt-2 space-y-1">
        <Label className="text-sm font-semibold">Trade-In Vehicle</Label>
        <Card>
          <CardContent className="p-2">
            <div className="space-y-1">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!tradeIn) return null;

  return (
    <div className="pt-2 space-y-1">
      <Label className="text-sm font-semibold">Trade-In Vehicle</Label>
      <Card>
        <CardContent className="p-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-muted-foreground text-xs">Vehicle</Label>
              <p className="font-medium text-sm">{`${tradeIn.year} ${tradeIn.make} ${tradeIn.model}`}</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">VIN</Label>
              <p className="font-medium font-mono text-xs">{tradeIn.vin}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2">
            {tradeIn.trim && (
              <div>
                <Label className="text-muted-foreground text-xs">Trim</Label>
                <p className="font-medium text-sm">{tradeIn.trim}</p>
              </div>
            )}
            <div>
              <Label className="text-muted-foreground text-xs">Odometer</Label>
              <p className="font-medium text-sm">{formatNumber(tradeIn.valuation_odometer)} miles</p>
            </div>
          </div>

          <div className="border-t mt-2 pt-2 space-y-1">
            <div className="flex justify-between items-center">
              <Label className="text-muted-foreground text-xs">Final Offer</Label>
              <p className="font-semibold text-sm text-green-600">{formatCurrency(tradeIn.final_offer)}</p>
            </div>
            <div className="flex justify-between items-center">
              <Label className="text-muted-foreground text-xs">Payoff Amount</Label>
              <p className="font-medium text-sm">{formatCurrency(tradeIn.payoff_amount)}</p>
            </div>
            <div className="flex justify-between items-center">
              <Label className="text-muted-foreground text-xs">Net Trade-In</Label>
              <p className="font-semibold text-sm">{formatCurrency(tradeIn.net_trade_in)}</p>
            </div>
            {tradeIn.equity_payout_amount > 0 && (
              <div className="flex justify-between items-center">
                <Label className="text-muted-foreground text-xs">Equity Payout</Label>
                <p className="font-semibold text-sm text-blue-600">{formatCurrency(tradeIn.equity_payout_amount)}</p>
              </div>
            )}
            {tradeIn.lien_holder && (
              <div className="flex justify-between items-center pt-1 border-t">
                <Label className="text-muted-foreground text-xs">Lien Holder</Label>
                <p className="font-medium text-sm">{tradeIn.lien_holder}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TradeInSection;
