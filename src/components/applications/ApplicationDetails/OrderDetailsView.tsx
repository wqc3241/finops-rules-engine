
import React from 'react';
import { OrderDetail } from '@/types/application';
import OrderDetailsView from './OrderDetails/OrderDetailsView';

interface OrderDetailsViewProps {
  orderDetails: OrderDetail;
  applicationId: string;
}

// This is a wrapper component that maintains the same API for backward compatibility
const OrderDetailsViewWrapper: React.FC<OrderDetailsViewProps> = ({ orderDetails, applicationId }) => {
  return <OrderDetailsView orderDetails={orderDetails} applicationId={applicationId} />;
};

export default OrderDetailsViewWrapper;
