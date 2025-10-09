
import React from 'react';
import { VehicleData } from '@/types/application';
import DataField from './DataField';

interface VehicleDataSectionProps {
  vehicleData: VehicleData;
}

const VehicleDataSection: React.FC<VehicleDataSectionProps> = ({ vehicleData }) => {
  if (!vehicleData) {
    return (
      <section className="mt-3">
        <h4 className="text-sm font-medium mb-2">Vehicle Data</h4>
        <p className="text-sm text-muted-foreground">No vehicle data available</p>
      </section>
    );
  }

  return (
    <section className="mt-3">
      <h4 className="text-sm font-medium mb-2">Vehicle Data</h4>
      <div className="grid grid-cols-1 gap-y-1">
        <DataField label="VIN" value={vehicleData.vin} />
        <DataField label="Trim" value={vehicleData.trim} />
        <DataField label="Year" value={vehicleData.year} />
        <DataField label="Model" value={vehicleData.model} />
        <DataField label="MSRP" value={vehicleData.msrp} />
        <DataField label="GCC/Cash Price" value={vehicleData.gccCashPrice} />
        <DataField label="Applicable Discounts" value={vehicleData.applicableDiscounts} />
        <DataField label="Total Discount Amount" value={vehicleData.totalDiscountAmount} />
      </div>
    </section>
  );
};

export default VehicleDataSection;
