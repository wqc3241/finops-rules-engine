
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { FinancialSummary } from '@/types/application';
import { Button } from '@/components/ui/button';
import LoanFinancialSummaryView from './LoanFinancialSummaryView';
import { loanFinancialSummaryData } from '@/data/mock/loanFinancialSummary';

interface FinancialSummaryViewProps {
  financialSummary: FinancialSummary;
}

const FinancialSummaryView: React.FC<FinancialSummaryViewProps> = ({ financialSummary }) => {
  const [activeTab, setActiveTab] = useState(
    financialSummary.type === 'Loan' 
      ? financialSummary.loan?.activeTab || 'Approved' 
      : financialSummary.lfs.activeTab
  );
  const [expanded, setExpanded] = useState(true);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  // Use loan data from financialSummary if available, otherwise use mock data
  const loanData = financialSummary.loan || {
    tabs: ['Requested', 'Approved', 'Customer'],
    activeTab: 'Approved',
    ...loanFinancialSummaryData
  };

  // Determine which tabs to show based on application type
  const tabs = financialSummary.type === 'Loan' 
    ? loanData.tabs 
    : financialSummary.lfs.tabs;

  return (
    <Card className="h-fit">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Financial Summary</h3>
          <div className="flex items-center cursor-pointer" onClick={toggleExpanded}>
            {expanded ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
          </div>
        </div>
        
        {expanded && (
          <>
            {/* Tabs */}
            <div className="flex mb-4">
              {tabs.map((tab, index) => (
                <Button 
                  key={index} 
                  variant={tab === activeTab ? "default" : "outline"}
                  size="sm"
                  className="mr-2 text-xs"
                  onClick={() => handleTabChange(tab)}
                >
                  {tab}
                </Button>
              ))}
            </div>
            
            {financialSummary.type === 'Loan' ? (
              // Loan Financial Summary
              <LoanFinancialSummaryView 
                activeTab={activeTab} 
                tabData={loanData[activeTab.toLowerCase()]} 
              />
            ) : (
              // Lease Financial Summary (existing view)
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  {/* Capitalized Value Selection */}
                  <section className="mb-4">
                    <h4 className="font-medium mb-3">Capitalized Value Selection</h4>
                    <div className="space-y-2">
                      <DataField label="Base Price" value={financialSummary.lfs[activeTab.toLowerCase()].basePrice} />
                      <DataField label="Dest. Fee" value={financialSummary.lfs[activeTab.toLowerCase()].destFee} />
                      <DataField label="MSRP" value={financialSummary.lfs[activeTab.toLowerCase()].msrp} />
                      <DataField label="Discounts" value={financialSummary.lfs[activeTab.toLowerCase()].discounts} />
                      <DataField label="Cash Price on Contract" value={financialSummary.lfs[activeTab.toLowerCase()].cashPriceOnContract} />
                      <DataField label="Federal EV Credit" value={financialSummary.lfs[activeTab.toLowerCase()].federalEvCredit} />
                      <DataField label="Additional Advance Amount" value={financialSummary.lfs[activeTab.toLowerCase()].additionalAdvanceAmount} />
                      <DataField label="Rebate" value={financialSummary.lfs[activeTab.toLowerCase()].rebate} />
                      <DataField label="Capitalized Cost Base" value={financialSummary.lfs[activeTab.toLowerCase()].capitalizedCostBase} />
                      <DataField label="Gross Capitalized Cost" value={financialSummary.lfs[activeTab.toLowerCase()].grossCapitalizedCost} />
                      <DataField label="Adjusted Capitalized Cost" value={financialSummary.lfs[activeTab.toLowerCase()].adjustedCapitalizedCost} />
                    </div>
                  </section>
                  
                  {/* Residual Value */}
                  <section className="mb-4">
                    <h4 className="font-medium mb-3">Residual Value</h4>
                    <div className="space-y-2">
                      <DataField label="Original RV %" value={financialSummary.lfs[activeTab.toLowerCase()].originalRvPercent} />
                      <DataField label="Subvented RV %" value={financialSummary.lfs[activeTab.toLowerCase()].subventedRvPercent} />
                      <DataField label="Enhanced RV %" value={financialSummary.lfs[activeTab.toLowerCase()].enhancedRvPercent} />
                      <DataField label="Enhanced RV" value={financialSummary.lfs[activeTab.toLowerCase()].enhancedRv} />
                    </div>
                  </section>
                  
                  {/* Payment */}
                  <section className="mb-4">
                    <h4 className="font-medium mb-3">Payment</h4>
                    <div className="space-y-2">
                      <DataField label="Standard MF" value={financialSummary.lfs[activeTab.toLowerCase()].standardMf} />
                      <DataField label="Customer MF" value={financialSummary.lfs[activeTab.toLowerCase()].customerMf} />
                      <DataField label="Depreciation and Amortized Amounts" value={financialSummary.lfs[activeTab.toLowerCase()].depreciationAndAmortizedAmounts} />
                      <DataField label="Rent Charge" value={financialSummary.lfs[activeTab.toLowerCase()].rentCharge} />
                      <DataField label="Total Of Base Monthly Payment" value={financialSummary.lfs[activeTab.toLowerCase()].totalOfBaseMonthlyPayment} />
                      <DataField label="Lease Term" value={financialSummary.lfs[activeTab.toLowerCase()].leaseTerm} />
                      <DataField label="Base Monthly Payment" value={financialSummary.lfs[activeTab.toLowerCase()].baseMonthlyPayment} />
                    </div>
                  </section>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {/* Capitalized Tax */}
                  <section className="mb-4">
                    <h4 className="font-medium mb-3">Capitalized Tax</h4>
                    <div className="space-y-2">
                      <DataField label="CCR Tax" value={financialSummary.lfs[activeTab.toLowerCase()].ccrTaxCap} />
                      <DataField label="Sales Tax" value={financialSummary.lfs[activeTab.toLowerCase()].salesTaxCap} />
                      <DataField label="Total Capitalized Tax" value={financialSummary.lfs[activeTab.toLowerCase()].totalCapitalizedTax} />
                    </div>
                  </section>
                  
                  {/* Upfront Tax */}
                  <section className="mb-4">
                    <h4 className="font-medium mb-3">Upfront Tax</h4>
                    <div className="space-y-2">
                      <DataField label="CCR Tax" value={financialSummary.lfs[activeTab.toLowerCase()].ccrTaxUpfront} />
                      <DataField label="Sales Tax" value={financialSummary.lfs[activeTab.toLowerCase()].salesTaxUpfront} />
                      <DataField label="Total Upfront Tax" value={financialSummary.lfs[activeTab.toLowerCase()].totalUpfrontTax} />
                    </div>
                  </section>
                  
                  {/* Capitalized Fees */}
                  <section className="mb-4">
                    <h4 className="font-medium mb-3">Capitalized Fees</h4>
                    <div className="space-y-2">
                      <DataField label="Documentation Fee" value={financialSummary.lfs[activeTab.toLowerCase()].documentationFee} />
                      <DataField label="Acquisition Fee" value={financialSummary.lfs[activeTab.toLowerCase()].acquisitionFee} />
                      <DataField label="Total Capitalized Fees" value={financialSummary.lfs[activeTab.toLowerCase()].totalCapitalizedFees} />
                    </div>
                  </section>
                  
                  {/* Upfront Fees */}
                  <section className="mb-4">
                    <h4 className="font-medium mb-3">Upfront Fees</h4>
                    <div className="space-y-2">
                      <DataField label="Optional Electronic Registration Fee" value={financialSummary.lfs[activeTab.toLowerCase()].optionalElectronicRegistrationFee} />
                      <DataField label="Registration/Transfer/Titling Fees" value={financialSummary.lfs[activeTab.toLowerCase()].registrationTransferTitlingFees} />
                      <DataField label="Total Govt and Additional Fees" value={financialSummary.lfs[activeTab.toLowerCase()].totalGovtAndAdditionalFees} />
                    </div>
                  </section>
                  
                  {/* Amount Paid In Signing */}
                  <section className="mb-4">
                    <h4 className="font-medium mb-3">Amount Paid In Signing</h4>
                    <div className="space-y-2">
                      <DataField label="Cash Paid by Customer" value={financialSummary.lfs[activeTab.toLowerCase()].cashPaidByCustomer} />
                      <DataField label="Amount Financed" value={financialSummary.lfs[activeTab.toLowerCase()].amountFinanced} />
                    </div>
                  </section>

                  {/* Financial Term (previously "Approved Offers") */}
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
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

const DataField: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm text-gray-600">{label}</span>
    <span className="text-sm">{value}</span>
  </div>
);

export default FinancialSummaryView;
