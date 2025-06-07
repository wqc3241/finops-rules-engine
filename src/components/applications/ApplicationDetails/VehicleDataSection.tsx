
import React from 'react';
import { VehicleData } from '@/types/application';
import DataField from './DataField';

interface VehicleDataSectionProps {
  vehicleData: VehicleData;
}

const VehicleDataSection: React.FC<VehicleDataSectionProps> = ({ vehicleData }) => {
  return (
    <section className="mt-6">
      <h4 className="text-md font-medium mb-4">Vehicle Data</h4>
      <div className="grid grid-cols-1 gap-y-3">
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
