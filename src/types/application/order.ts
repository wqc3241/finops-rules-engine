
// Order-related types
export interface OrderDetail {
  deliveryDate?: string;
  vehicleTradeIn: {
    year: string;
    make: string;
    model: string;
    trim: string;
    lienHolder: string;
    totalValue: string;
    payoffAmount: string;
  };
  sale: {
    invoiceSummary: {
      model: string;
      trim: string;
      options: Array<{name: string; price: string}>;
      discounts: Array<{name: string; value: string}>;
      subTotal: string;
    };
    credits: {
      items: Array<{name: string; value: string}>;
      subTotal: string;
    };
    taxesAndFees: {
      salesTax: {rate: string; amount: string};
      registrationFees: {type: string; amount: string};
      otherFees: {type: string; amount: string};
      total: string;
    };
    amountFinanced: string;
    totalDueAtDelivery: string;
    invoiceSummaryDetails: Array<{label: string; subLabel: string; value: string}>;
  };
  registrationData: Array<{label: string; value: string}>;
}
