
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DataField } from './DataField';

interface VehicleTradeInProps {
  vehicleTradeIn: {
    year: string;
    make: string;
    model: string;
    trim: string;
    lienHolder: string;
    totalValue: string;
    payoffAmount: string;
  };
}

const VehicleTradeInCard: React.FC<VehicleTradeInProps> = ({ vehicleTradeIn }) => {
  // Only show if there's meaningful vehicle trade in data
  const hasVehicleTradeIn = 
    vehicleTradeIn && 
    (vehicleTradeIn.year || 
     vehicleTradeIn.make || 
     vehicleTradeIn.model);

  if (!hasVehicleTradeIn) {
    return null;
  }

  return (
    <Card className="h-fit">
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">Vehicle Trade In</h3>
        <div className="space-y-2">
          <DataField label="Year" value={vehicleTradeIn.year} />
          <DataField label="Make" value={vehicleTradeIn.make} />
          <DataField label="Model" value={vehicleTradeIn.model} />
          <DataField label="Trim" value={vehicleTradeIn.trim} />
          <DataField label="Lien Holder" value={vehicleTradeIn.lienHolder} />
          <DataField label="Total Value" value={vehicleTradeIn.totalValue} />
          <DataField label="Payoff Amount" value={vehicleTradeIn.payoffAmount} />
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleTradeInCard;
