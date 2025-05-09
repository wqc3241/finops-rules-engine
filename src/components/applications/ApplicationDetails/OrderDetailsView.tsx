
import React from 'react';
import { OrderDetail } from '@/types/application';
import OrderDetailsView from './OrderDetails/OrderDetailsView';

interface OrderDetailsViewProps {
  orderDetails: OrderDetail;
}

// This is a wrapper component that maintains the same API for backward compatibility
const OrderDetailsViewWrapper: React.FC<OrderDetailsViewProps> = ({ orderDetails }) => {
  return <OrderDetailsView orderDetails={orderDetails} />;
};

export default OrderDetailsViewWrapper;
