
import React from 'react';
import { LoanFinancialSummaryTabData } from '@/types/application';
import { DataField } from './OrderDetails/DataField';

interface LoanFinancialSummaryViewProps {
  activeTab: string;
  tabData: LoanFinancialSummaryTabData;
}

const LoanFinancialSummaryView: React.FC<LoanFinancialSummaryViewProps> = ({ activeTab, tabData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Column 1 */}
      <div className="space-y-4">
        {/* Federal Truth */}
        <section className="mb-4">
          <h4 className="font-medium mb-3">Federal Truth</h4>
          <div className="space-y-2">
            <DataField label="Bank APR" value={tabData.bankApr} />
            <DataField label="Customer APR" value={tabData.customerApr} />
            <DataField label="APR Difference" value={tabData.aprDifference} />
            <DataField label="Term" value={tabData.term} />
            <DataField label="Amount Financed" value={tabData.amountFinanced} />
            <DataField label="Monthly Payment" value={tabData.monthlyPayment} />
            <DataField label="Adjusted Total Finance Charge" value={tabData.adjustedTotalFinanceCharge} />
            <DataField label="Computed LTV Ratio %" value={tabData.computedLtvRatio} />
          </div>
        </section>

        {/* Payment */}
        <section className="mb-4">
          <h4 className="font-medium mb-3">Payment</h4>
          <div className="space-y-2">
            <DataField label="Cash down/ deposit" value={tabData.cashDownDeposit} />
            <DataField label="Other down payment" value={tabData.otherDownPayment} />
            <DataField label="Total Down Payment" value={tabData.totalDownPayment} />
          </div>
        </section>

        {/* Miscellaneous */}
        <section className="mb-4">
          <h4 className="font-medium mb-3">Miscellaneous</h4>
          <div className="space-y-2">
            <DataField label="PA Transaction ID" value={tabData.transactionId} />
            <DataField label="Offer Accepted Date" value={tabData.acceptedOfferDate} />
          </div>
        </section>
      </div>

      {/* Column 2 */}
      <div className="space-y-4">
        {/* Pricing */}
        <section className="mb-4">
          <h4 className="font-medium mb-3">Pricing</h4>
          <div className="space-y-2">
            <DataField label="Base Price" value={tabData.basePrice} />
            <DataField label="Credits and Discounts" value={tabData.creditsAndDiscounts} />
            <DataField label="Destination Fee" value={tabData.destinationFee} />
            <DataField label="Tire Fee/Tire Waste Fee" value={tabData.tireFeeWasteFee} />
            <DataField label="Lead Acid Battery Fee" value={tabData.leadAcidBatteryFee} />
            <DataField label="Documentation Fee" value={tabData.documentationFee} />
            <DataField label="Taxable Sub-total" value={tabData.taxableSubTotal} />
          </div>
        </section>

        {/* Fees */}
        <section className="mb-4">
          <h4 className="font-medium mb-3">Fees</h4>
          <div className="space-y-2">
            <DataField label="Electronic Filing Fee" value={tabData.electronicFilingFee} />
            <DataField label="Registration/Transfer/Titling Fees" value={tabData.registrationTransferTitlingFees} />
            <DataField label="Total Govt and Additional Fees" value={tabData.totalGovtAndAdditionalFees} />
          </div>
        </section>

        {/* Taxes */}
        <section className="mb-4">
          <h4 className="font-medium mb-3">Taxes</h4>
          <div className="space-y-2">
            <DataField label="State Tax" value={tabData.stateTax} />
            <DataField label="County Tax" value={tabData.countyTax} />
            <DataField label="City Tax" value={tabData.cityTax} />
            <DataField label="Total Taxes" value={tabData.totalTaxes} />
          </div>
        </section>
      </div>

      {/* Column 3 */}
      <div className="space-y-4">
        {/* Approved Offers */}
        <section className="mb-4">
          <h4 className="font-medium mb-3">Approved Offers</h4>
          <div className="space-y-2">
            <DataField label="Term" value={tabData.term} />
            <DataField label="APR" value={tabData.customerApr} />
            <DataField label="Down Payment" value={tabData.totalDownPayment} />
            <DataField label="Amount Financed" value={tabData.amountFinanced} />
            <DataField label="Monthly Payment" value={tabData.monthlyPayment} />
            <DataField label="Approved Date" value={tabData.acceptedOfferDate} />
            <DataField label="Lender Name" value="Bank of America" />
          </div>
        </section>

        {/* TradeIn Details */}
        <section className="mb-4">
          <h4 className="font-medium mb-3">TradeIn Details</h4>
          <div className="space-y-2">
            <DataField label="Year" value="-" />
            <DataField label="Make" value="-" />
            <DataField label="Model" value="-" />
            <DataField label="Trim" value="-" />
            <DataField label="Lien Holder" value="-" />
            <DataField label="Total Value" value="-" />
            <DataField label="PayOff Amount" value="-" />
          </div>
        </section>
      </div>
    </div>
  );
};

export default LoanFinancialSummaryView;
