
import React from 'react';
import VehicleTradeInCard from './VehicleTradeInCard';
import RegistrationDataCard from './RegistrationDataCard';
import SaleCard from './SaleCard';
import { OrderDetail } from '@/types/application';

interface OrderDetailsViewProps {
  orderDetails: OrderDetail;
}

const OrderDetailsView: React.FC<OrderDetailsViewProps> = ({ orderDetails }) => {
  if (!orderDetails) {
    return (
      <div className="flex items-center justify-center p-8 text-muted-foreground">
        No order details available
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left Column: Vehicle Trade In and Registration Data */}
      <div className="space-y-6">
        {/* Vehicle Trade In Card */}
        <VehicleTradeInCard vehicleTradeIn={orderDetails.vehicleTradeIn} />

        {/* Registration Data Card */}
        <RegistrationDataCard registrationData={orderDetails.registrationData} />
      </div>

      {/* Right Column: Sale Card with Invoice Summary */}
      <div>
        <SaleCard sale={orderDetails.sale} />
      </div>
    </div>
  );
};

export default OrderDetailsView;
