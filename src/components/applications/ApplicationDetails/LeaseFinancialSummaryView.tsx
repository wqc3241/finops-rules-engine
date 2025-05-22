
import React from 'react';
import { LeaseFinancialSummaryTabData } from '@/types/application';
import { DataField } from './OrderDetails/DataField';

interface LeaseFinancialSummaryViewProps {
  activeTab: string;
  tabData: LeaseFinancialSummaryTabData;
}

const LeaseFinancialSummaryView: React.FC<LeaseFinancialSummaryViewProps> = ({ activeTab, tabData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left Column */}
      <div className="space-y-4">
        {/* Capitalized Value Selection */}
        <section className="mb-4">
          <h4 className="font-medium mb-3">Capitalized Value Selection</h4>
          <div className="space-y-2">
            <DataField label="Base Price" value={tabData.basePrice} />
            <DataField label="Dest. Fee" value={tabData.destFee} />
            <DataField label="MSRP" value={tabData.msrp} />
            <DataField label="Discounts" value={tabData.discounts} />
            <DataField label="Cash Price on Contract" value={tabData.cashPriceOnContract} />
            <DataField label="Federal EV Credit" value={tabData.federalEvCredit} />
            <DataField label="Additional Advance Amount" value={tabData.additionalAdvanceAmount} />
            <DataField label="Rebate" value={tabData.rebate} />
            <DataField label="Capitalized Cost Base" value={tabData.capitalizedCostBase} />
            <DataField label="Gross Capitalized Cost" value={tabData.grossCapitalizedCost} />
            <DataField label="Adjusted Capitalized Cost" value={tabData.adjustedCapitalizedCost} />
          </div>
        </section>
        
        {/* Residual Value */}
        <section className="mb-4">
          <h4 className="font-medium mb-3">Residual Value</h4>
          <div className="space-y-2">
            <DataField label="Original RV %" value={tabData.originalRvPercent} />
            <DataField label="Subvented RV %" value={tabData.subventedRvPercent} />
            <DataField label="Enhanced RV %" value={tabData.enhancedRvPercent} />
            <DataField label="Enhanced RV" value={tabData.enhancedRv} />
          </div>
        </section>
        
        {/* Payment */}
        <section className="mb-4">
          <h4 className="font-medium mb-3">Payment</h4>
          <div className="space-y-2">
            <DataField label="Standard MF" value={tabData.standardMf} />
            <DataField label="Customer MF" value={tabData.customerMf} />
            <DataField label="Depreciation and Amortized Amounts" value={tabData.depreciationAndAmortizedAmounts} />
            <DataField label="Rent Charge" value={tabData.rentCharge} />
            <DataField label="Total Of Base Monthly Payment" value={tabData.totalOfBaseMonthlyPayment} />
            <DataField label="Lease Term" value={tabData.leaseTerm} />
            <DataField label="Base Monthly Payment" value={tabData.baseMonthlyPayment} />
          </div>
        </section>
      </div>

      {/* Right Column */}
      <div className="space-y-4">
        {/* Capitalized Tax */}
        <section className="mb-4">
          <h4 className="font-medium mb-3">Capitalized Tax</h4>
          <div className="space-y-2">
            <DataField label="CCR Tax" value={tabData.ccrTaxCap} />
            <DataField label="Sales Tax" value={tabData.salesTaxCap} />
            <DataField label="Total Capitalized Tax" value={tabData.totalCapitalizedTax} />
          </div>
        </section>
        
        {/* Upfront Tax */}
        <section className="mb-4">
          <h4 className="font-medium mb-3">Upfront Tax</h4>
          <div className="space-y-2">
            <DataField label="CCR Tax" value={tabData.ccrTaxUpfront} />
            <DataField label="Sales Tax" value={tabData.salesTaxUpfront} />
            <DataField label="Total Upfront Tax" value={tabData.totalUpfrontTax} />
          </div>
        </section>
        
        {/* Capitalized Fees */}
        <section className="mb-4">
          <h4 className="font-medium mb-3">Capitalized Fees</h4>
          <div className="space-y-2">
            <DataField label="Documentation Fee" value={tabData.documentationFee} />
            <DataField label="Acquisition Fee" value={tabData.acquisitionFee} />
            <DataField label="Total Capitalized Fees" value={tabData.totalCapitalizedFees} />
          </div>
        </section>
        
        {/* Upfront Fees */}
        <section className="mb-4">
          <h4 className="font-medium mb-3">Upfront Fees</h4>
          <div className="space-y-2">
            <DataField label="Optional Electronic Registration Fee" value={tabData.optionalElectronicRegistrationFee} />
            <DataField label="Registration/Transfer/Titling Fees" value={tabData.registrationTransferTitlingFees} />
            <DataField label="Total Govt and Additional Fees" value={tabData.totalGovtAndAdditionalFees} />
          </div>
        </section>
        
        {/* Amount Paid In Signing */}
        <section className="mb-4">
          <h4 className="font-medium mb-3">Amount Paid In Signing</h4>
          <div className="space-y-2">
            <DataField label="Cash Paid by Customer" value={tabData.cashPaidByCustomer} />
            <DataField label="Amount Financed" value={tabData.amountFinanced} />
          </div>
        </section>

        {/* Financial Term */}
        <section className="mt-6">
          <h4 className="font-medium mb-3">Financial Term</h4>
          <div className="p-4">
            <div className="space-y-2">
              <DataField label="Term" value="18" />
              <DataField label="Allowed Mileage" value="15,000" />
              <DataField label="Down Payment" value="0" />
              <DataField label="Est. Monthly Pmt (incl. tax)" value="1,610.77" />
              <DataField label="Due At Delivery" value="4,106.34" />
              <DataField label="Approved Date" value="Apr 27, 2025" />
              <DataField label="Lender Name" value="Lucid Financial Services" />
            </div>
          </div>
        </section>

        {/* TradeIn Details */}
        <section className="mt-6">
          <h4 className="font-medium mb-3">TradeIn Details</h4>
          <div className="p-4">
            <div className="space-y-2">
              <DataField label="Total Value" value="-" />
              <DataField label="PayOff Amount" value="-" />
              <DataField label="Gross Trade Allowance" value="-" />
              <DataField label="Net TradeIn" value="-" />
              <DataField label="Max Allowed CCR from Trade" value="-" />
              <DataField label="Max allowed Cash CCR" value="28847.83" />
              <DataField label="Equity applied to due at delivery" value="-" />
              <DataField label="Equity Applied to CCR" value="0" />
              <DataField label="Remaining equity post financing" value="0" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LeaseFinancialSummaryView;
