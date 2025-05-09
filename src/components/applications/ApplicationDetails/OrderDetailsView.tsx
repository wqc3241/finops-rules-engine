
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { OrderDetail } from '@/types/application';
import { InfoIcon } from 'lucide-react';

interface OrderDetailsViewProps {
  orderDetails: OrderDetail;
}

const OrderDetailsView: React.FC<OrderDetailsViewProps> = ({ orderDetails }) => {
  // Check if there's any meaningful vehicle trade in data
  const hasVehicleTradeIn = 
    orderDetails.vehicleTradeIn && 
    (orderDetails.vehicleTradeIn.year || 
     orderDetails.vehicleTradeIn.make || 
     orderDetails.vehicleTradeIn.model);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left Column: Vehicle Trade In and Registration Data */}
      <div className="space-y-6">
        {/* Vehicle Trade In Card - only show if there's vehicle trade in data */}
        {hasVehicleTradeIn && (
          <Card className="h-fit">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Vehicle Trade In</h3>
              <div className="space-y-2">
                <DataField label="Year" value={orderDetails.vehicleTradeIn.year} />
                <DataField label="Make" value={orderDetails.vehicleTradeIn.make} />
                <DataField label="Model" value={orderDetails.vehicleTradeIn.model} />
                <DataField label="Trim" value={orderDetails.vehicleTradeIn.trim} />
                <DataField label="Lien Holder" value={orderDetails.vehicleTradeIn.lienHolder} />
                <DataField label="Total Value" value={orderDetails.vehicleTradeIn.totalValue} />
                <DataField label="Payoff Amount" value={orderDetails.vehicleTradeIn.payoffAmount} />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Registration Data Card */}
        <Card className="h-fit">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Registration Data</h3>
            <div className="space-y-2">
              {orderDetails.registrationData.map((item, index) => (
                <DataField key={index} label={item.label} value={item.value} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column: Sale Card with Invoice Summary */}
      <div>
        <Card className="h-fit">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Sale</h3>
            
            {/* Invoice Summary */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Invoice Summary</h4>
              <div className="grid grid-cols-2 gap-x-4">
                <div>
                  <DataField label="Model" value={orderDetails.sale.invoiceSummary.model} />
                </div>
                <div className="text-right">
                  <span className="font-medium">${orderDetails.sale.invoiceSummary.model === 'Air' ? '89,000.00' : '0'}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-x-4">
                <div>
                  <DataField label="Trim" value={orderDetails.sale.invoiceSummary.trim} />
                </div>
                <div className="text-right">
                  <span className="font-medium">$20,000.00</span>
                </div>
              </div>
              
              {/* Options */}
              {orderDetails.sale.invoiceSummary.options.map((option, index) => (
                <div key={index} className="grid grid-cols-2 gap-x-4">
                  <div>
                    <DataField label="Option" value={option.name} />
                  </div>
                  <div className="text-right">
                    <span className="font-medium">{option.price}</span>
                  </div>
                </div>
              ))}
              
              {/* Discounts */}
              {orderDetails.sale.invoiceSummary.discounts.map((discount, index) => (
                <div key={index} className="grid grid-cols-2 gap-x-4">
                  <div>
                    <DataField label="Discount" value={discount.name} />
                  </div>
                  <div className="text-right">
                    {discount.value && <span className="font-medium">{discount.value}</span>}
                  </div>
                </div>
              ))}
              
              {/* Subtotal */}
              <div className="grid grid-cols-2 gap-x-4 border-t border-gray-200 pt-2 mt-2">
                <div>
                  <span className="font-medium">Sub Total</span>
                </div>
                <div className="text-right">
                  <span className="font-medium">{orderDetails.sale.invoiceSummary.subTotal}</span>
                </div>
              </div>
            </div>
            
            {/* Credits */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Credits</h4>
              
              {orderDetails.sale.credits.items.map((credit, index) => (
                <div key={index} className="grid grid-cols-2 gap-x-4">
                  <div>
                    <DataField label="Credit" value={credit.name} />
                  </div>
                  <div className="text-right">
                    <span className="font-medium">{credit.value}</span>
                  </div>
                </div>
              ))}
              
              {/* Credits Subtotal */}
              <div className="grid grid-cols-2 gap-x-4 border-t border-gray-200 pt-2 mt-2">
                <div>
                  <span className="font-medium">Sub Total</span>
                </div>
                <div className="text-right">
                  <span className="font-medium">{orderDetails.sale.credits.subTotal}</span>
                </div>
              </div>
            </div>
            
            {/* Taxes and Fees */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Taxes and Fees</h4>
              
              <div className="grid grid-cols-2 gap-x-4">
                <div>
                  <DataField label="Sales Tax" value={orderDetails.sale.taxesAndFees.salesTax.rate} />
                </div>
                <div className="text-right">
                  <span className="font-medium">{orderDetails.sale.taxesAndFees.salesTax.amount}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-x-4">
                <div>
                  <DataField label="Registration Fees" value={orderDetails.sale.taxesAndFees.registrationFees.type} />
                </div>
                <div className="text-right">
                  <span className="font-medium">{orderDetails.sale.taxesAndFees.registrationFees.amount}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-x-4">
                <div>
                  <DataField label="Other Fees" value={orderDetails.sale.taxesAndFees.otherFees.type} />
                </div>
                <div className="text-right">
                  <span className="font-medium">{orderDetails.sale.taxesAndFees.otherFees.amount}</span>
                </div>
              </div>
              
              {/* Taxes and Fees Total */}
              <div className="grid grid-cols-2 gap-x-4 border-t border-gray-200 pt-2 mt-2">
                <div>
                  <span className="font-medium">Total</span>
                </div>
                <div className="text-right">
                  <span className="font-medium">{orderDetails.sale.taxesAndFees.total}</span>
                </div>
              </div>
            </div>
            
            {/* Amount Financed */}
            <div className="grid grid-cols-2 gap-x-4 border-t border-gray-200 pt-3 mt-3">
              <div>
                <span className="font-medium">Amount Financed</span>
              </div>
              <div className="text-right">
                <span className="font-medium">{orderDetails.sale.amountFinanced}</span>
              </div>
            </div>
            
            {/* Total Due at Delivery */}
            <div className="grid grid-cols-2 gap-x-4 pt-3 mt-3">
              <div>
                <span className="font-medium">Total Due at Delivery</span>
              </div>
              <div className="text-right">
                <span className="font-medium">{orderDetails.sale.totalDueAtDelivery}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const DataField: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm text-gray-600">{label}</span>
    <span className="text-sm">{value}</span>
  </div>
);

export default OrderDetailsView;
