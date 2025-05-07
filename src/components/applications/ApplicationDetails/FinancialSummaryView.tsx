
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { FinancialSummary } from '@/types/application';
import { Button } from '@/components/ui/button';

interface FinancialSummaryViewProps {
  financialSummary: FinancialSummary;
}

const FinancialSummaryView: React.FC<FinancialSummaryViewProps> = ({ financialSummary }) => {
  const [activeTab, setActiveTab] = useState(financialSummary.lfs.activeTab);
  const [expanded, setExpanded] = useState(true);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">LFS Approved & Accepted Offers</h3>
          <div className="flex items-center cursor-pointer" onClick={toggleExpanded}>
            {expanded ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
          </div>
        </div>
        
        <div className="mb-2 font-medium">
          <span className="text-yellow-600">⬤</span> Accepted Offers 
          <span className="mx-4">Customer Accepted : Yes</span>
        </div>
        
        {expanded && (
          <>
            {/* Tabs */}
            <div className="flex mb-6">
              {financialSummary.lfs.tabs.map((tab, index) => (
                <Button 
                  key={index} 
                  variant={tab === activeTab ? "default" : "outline"}
                  className="mr-2"
                  onClick={() => handleTabChange(tab)}
                >
                  {tab}
                </Button>
              ))}
            </div>
            
            {/* Capitalized Value Selection */}
            <section className="mb-6">
              <h4 className="text-md font-medium mb-4 border-b border-gray-200 pb-2 text-blue-600">Capitalized Value Selection</h4>
              <div className="grid grid-cols-1 lg:grid-cols-9 gap-4">
                <div className="border-b border-gray-100 pb-2">
                  <p className="text-xs text-gray-600 mb-1">Base Price</p>
                  <p className="text-sm text-gray-800">{financialSummary.lfs[activeTab.toLowerCase()].basePrice}</p>
                </div>
                <div className="border-b border-gray-100 pb-2">
                  <p className="text-xs text-gray-600 mb-1">Dest. Fee</p>
                  <p className="text-sm text-gray-800">{financialSummary.lfs[activeTab.toLowerCase()].destFee}</p>
                </div>
                <div className="border-b border-gray-100 pb-2">
                  <p className="text-xs text-gray-600 mb-1">MSRP</p>
                  <p className="text-sm text-gray-800">{financialSummary.lfs[activeTab.toLowerCase()].msrp}</p>
                </div>
                <div className="border-b border-gray-100 pb-2">
                  <p className="text-xs text-gray-600 mb-1">Discounts</p>
                  <p className="text-sm text-gray-800">{financialSummary.lfs[activeTab.toLowerCase()].discounts}</p>
                </div>
                <div className="border-b border-gray-100 pb-2">
                  <p className="text-xs text-gray-600 mb-1">Cash Price on Contract</p>
                  <p className="text-sm text-gray-800">{financialSummary.lfs[activeTab.toLowerCase()].cashPriceOnContract}</p>
                </div>
                <div className="border-b border-gray-100 pb-2">
                  <p className="text-xs text-gray-600 mb-1">Federal EV Credit</p>
                  <p className="text-sm text-gray-800">{financialSummary.lfs[activeTab.toLowerCase()].federalEvCredit}</p>
                </div>
                <div className="border-b border-gray-100 pb-2">
                  <p className="text-xs text-gray-600 mb-1">Additional Advance Amount</p>
                  <p className="text-sm text-gray-800">{financialSummary.lfs[activeTab.toLowerCase()].additionalAdvanceAmount}</p>
                </div>
                <div className="border-b border-gray-100 pb-2">
                  <p className="text-xs text-gray-600 mb-1">Rebate</p>
                  <p className="text-sm text-gray-800">{financialSummary.lfs[activeTab.toLowerCase()].rebate}</p>
                </div>
                <div className="border-b border-gray-100 pb-2">
                  <p className="text-xs text-gray-600 mb-1">Capitalized Cost Base</p>
                  <p className="text-sm text-gray-800">{financialSummary.lfs[activeTab.toLowerCase()].capitalizedCostBase}</p>
                </div>
                <div className="border-b border-gray-100 pb-2">
                  <p className="text-xs text-gray-600 mb-1">Gross Capitalized Cost</p>
                  <p className="text-sm text-gray-800">{financialSummary.lfs[activeTab.toLowerCase()].grossCapitalizedCost}</p>
                </div>
                <div className="border-b border-gray-100 pb-2">
                  <p className="text-xs text-gray-600 mb-1">Adjusted Capitalized Cost</p>
                  <p className="text-sm text-gray-800">{financialSummary.lfs[activeTab.toLowerCase()].adjustedCapitalizedCost}</p>
                </div>
              </div>
            </section>
            
            {/* Residual Value */}
            <section className="mb-6">
              <h4 className="text-md font-medium mb-4 border-b border-gray-200 pb-2 text-blue-600">Residual Value</h4>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div className="border-b border-gray-100 pb-2">
                  <p className="text-xs text-gray-600 mb-1">Original RV %</p>
                  <p className="text-sm text-gray-800">{financialSummary.lfs[activeTab.toLowerCase()].originalRvPercent}</p>
                </div>
                <div className="border-b border-gray-100 pb-2">
                  <p className="text-xs text-gray-600 mb-1">Subvented RV %</p>
                  <p className="text-sm text-gray-800">{financialSummary.lfs[activeTab.toLowerCase()].subventedRvPercent}</p>
                </div>
                <div className="border-b border-gray-100 pb-2">
                  <p className="text-xs text-gray-600 mb-1">Enhanced RV %</p>
                  <p className="text-sm text-gray-800">{financialSummary.lfs[activeTab.toLowerCase()].enhancedRvPercent}</p>
                </div>
                <div className="border-b border-gray-100 pb-2">
                  <p className="text-xs text-gray-600 mb-1">Enhanced RV</p>
                  <p className="text-sm text-gray-800">{financialSummary.lfs[activeTab.toLowerCase()].enhancedRv}</p>
                </div>
              </div>
            </section>
            
            {/* Payment */}
            <section className="mb-6">
              <h4 className="text-md font-medium mb-4 border-b border-gray-200 pb-2 text-blue-600">Payment</h4>
              <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
                <div className="border-b border-gray-100 pb-2">
                  <p className="text-xs text-gray-600 mb-1">Standard MF</p>
                  <p className="text-sm text-gray-800">{financialSummary.lfs[activeTab.toLowerCase()].standardMf}</p>
                </div>
                <div className="border-b border-gray-100 pb-2">
                  <p className="text-xs text-gray-600 mb-1">Customer MF</p>
                  <p className="text-sm text-gray-800">{financialSummary.lfs[activeTab.toLowerCase()].customerMf}</p>
                </div>
                <div className="border-b border-gray-100 pb-2">
                  <p className="text-xs text-gray-600 mb-1">Depreciation and Amortized Amounts</p>
                  <p className="text-sm text-gray-800">{financialSummary.lfs[activeTab.toLowerCase()].depreciationAndAmortizedAmounts}</p>
                </div>
                <div className="border-b border-gray-100 pb-2">
                  <p className="text-xs text-gray-600 mb-1">Rent Charge</p>
                  <p className="text-sm text-gray-800">{financialSummary.lfs[activeTab.toLowerCase()].rentCharge}</p>
                </div>
                <div className="border-b border-gray-100 pb-2">
                  <p className="text-xs text-gray-600 mb-1">Total Of Base Monthly Payment</p>
                  <p className="text-sm text-gray-800">{financialSummary.lfs[activeTab.toLowerCase()].totalOfBaseMonthlyPayment}</p>
                </div>
                <div className="border-b border-gray-100 pb-2">
                  <p className="text-xs text-gray-600 mb-1">Lease Term</p>
                  <p className="text-sm text-gray-800">{financialSummary.lfs[activeTab.toLowerCase()].leaseTerm}</p>
                </div>
                <div className="border-b border-gray-100 pb-2">
                  <p className="text-xs text-gray-600 mb-1">Base Monthly Payment</p>
                  <p className="text-sm text-gray-800">{financialSummary.lfs[activeTab.toLowerCase()].baseMonthlyPayment}</p>
                </div>
              </div>
            </section>
            
            {/* Payment Contd. */}
            <section className="mb-6">
              <h4 className="text-md font-medium mb-4 border-b border-gray-200 pb-2 text-blue-600">Payment Cont.</h4>
              <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
                <div className="border-b border-gray-100 pb-2">
                  <p className="text-xs text-gray-600 mb-1">Monthly Sales Tax / Use Tax Rate</p>
                  <p className="text-sm text-gray-800">{financialSummary.lfs[activeTab.toLowerCase()].monthlySalesTaxRate}</p>
                </div>
                <div className="border-b border-gray-100 pb-2">
                  <p className="text-xs text-gray-600 mb-1">Monthly Sales Tax / Use Tax</p>
                  <p className="text-sm text-gray-800">{financialSummary.lfs[activeTab.toLowerCase()].monthlySalesTax}</p>
                </div>
                <div className="border-b border-gray-100 pb-2">
                  <p className="text-xs text-gray-600 mb-1">Total Monthly Payment(incl. use Taxes)</p>
                  <p className="text-sm text-gray-800">{financialSummary.lfs[activeTab.toLowerCase()].totalMonthlyPayment}</p>
                </div>
                <div className="border-b border-gray-100 pb-2">
                  <p className="text-xs text-gray-600 mb-1">Purchase Option Fee</p>
                  <p className="text-sm text-gray-800">{financialSummary.lfs[activeTab.toLowerCase()].purchaseOptionFee}</p>
                </div>
                <div className="border-b border-gray-100 pb-2">
                  <p className="text-xs text-gray-600 mb-1">Disposition Fee</p>
                  <p className="text-sm text-gray-800">{financialSummary.lfs[activeTab.toLowerCase()].dispositionFee}</p>
                </div>
                <div className="border-b border-gray-100 pb-2">
                  <p className="text-xs text-gray-600 mb-1">Next Payment Date</p>
                  <p className="text-sm text-gray-800">{financialSummary.lfs[activeTab.toLowerCase()].nextPaymentDate}</p>
                </div>
              </div>
            </section>
            
            {/* Capitalized Tax */}
            <section className="mb-6">
              <h4 className="text-md font-medium mb-4 border-b border-gray-200 pb-2 text-blue-600">Capitalized Tax</h4>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="border-b border-gray-100 pb-2">
                  <p className="text-xs text-gray-600 mb-1">CCR Tax</p>
                  <p className="text-sm text-gray-800">{financialSummary.lfs[activeTab.toLowerCase()].ccrTaxCap}</p>
                </div>
                <div className="border-b border-gray-100 pb-2">
                  <p className="text-xs text-gray-600 mb-1">Sales Tax</p>
                  <p className="text-sm text-gray-800">{financialSummary.lfs[activeTab.toLowerCase()].salesTaxCap}</p>
                </div>
                <div className="border-b border-gray-100 pb-2">
                  <p className="text-xs text-gray-600 mb-1">Total Capitalized Tax</p>
                  <p className="text-sm text-gray-800">{financialSummary.lfs[activeTab.toLowerCase()].totalCapitalizedTax}</p>
                </div>
              </div>
            </section>
            
            {/* Upfront Tax */}
            <section className="mb-6">
              <h4 className="text-md font-medium mb-4 border-b border-gray-200 pb-2 text-blue-600">Upfront Tax</h4>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="border-b border-gray-100 pb-2">
                  <p className="text-xs text-gray-600 mb-1">CCR Tax</p>
                  <p className="text-sm text-gray-800">{financialSummary.lfs[activeTab.toLowerCase()].ccrTaxUpfront}</p>
                </div>
                <div className="border-b border-gray-100 pb-2">
                  <p className="text-xs text-gray-600 mb-1">Sales Tax</p>
                  <p className="text-sm text-gray-800">{financialSummary.lfs[activeTab.toLowerCase()].salesTaxUpfront}</p>
                </div>
                <div className="border-b border-gray-100 pb-2">
                  <p className="text-xs text-gray-600 mb-1">Total Upfront Tax</p>
                  <p className="text-sm text-gray-800">{financialSummary.lfs[activeTab.toLowerCase()].totalUpfrontTax}</p>
                </div>
              </div>
            </section>
            
            {/* Capitalized Fees */}
            <section className="mb-6">
              <h4 className="text-md font-medium mb-4 border-b border-gray-200 pb-2 text-blue-600">Capitalized Fees</h4>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="border-b border-gray-100 pb-2">
                  <p className="text-xs text-gray-600 mb-1">Documentation Fee</p>
                  <p className="text-sm text-gray-800">{financialSummary.lfs[activeTab.toLowerCase()].documentationFee}</p>
                </div>
                <div className="border-b border-gray-100 pb-2">
                  <p className="text-xs text-gray-600 mb-1">Acquisition Fee</p>
                  <p className="text-sm text-gray-800">{financialSummary.lfs[activeTab.toLowerCase()].acquisitionFee}</p>
                </div>
                <div className="border-b border-gray-100 pb-2">
                  <p className="text-xs text-gray-600 mb-1">Total Capitalized Fees</p>
                  <p className="text-sm text-gray-800">{financialSummary.lfs[activeTab.toLowerCase()].totalCapitalizedFees}</p>
                </div>
              </div>
            </section>
            
            {/* Upfront Fees */}
            <section className="mb-6">
              <h4 className="text-md font-medium mb-4 border-b border-gray-200 pb-2 text-blue-600">Upfront Fees</h4>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="border-b border-gray-100 pb-2">
                  <p className="text-xs text-gray-600 mb-1">Optional Electronic Registration Fee</p>
                  <p className="text-sm text-gray-800">{financialSummary.lfs[activeTab.toLowerCase()].optionalElectronicRegistrationFee}</p>
                </div>
                <div className="border-b border-gray-100 pb-2">
                  <p className="text-xs text-gray-600 mb-1">Registration/Transfer/Titling Fees</p>
                  <p className="text-sm text-gray-800">{financialSummary.lfs[activeTab.toLowerCase()].registrationTransferTitlingFees}</p>
                </div>
                <div className="border-b border-gray-100 pb-2">
                  <p className="text-xs text-gray-600 mb-1">Total Govt and Additional Fees</p>
                  <p className="text-sm text-gray-800">{financialSummary.lfs[activeTab.toLowerCase()].totalGovtAndAdditionalFees}</p>
                </div>
              </div>
            </section>
            
            {/* Amount Paid In Signing */}
            <section className="mb-6">
              <h4 className="text-md font-medium mb-4 border-b border-gray-200 pb-2 text-blue-600">Amount Paid In Signing</h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="border-b border-gray-100 pb-2">
                  <p className="text-xs text-gray-600 mb-1">Cash Paid by Customer</p>
                  <p className="text-sm text-gray-800">{financialSummary.lfs[activeTab.toLowerCase()].cashPaidByCustomer}</p>
                </div>
                <div className="border-b border-gray-100 pb-2">
                  <p className="text-xs text-gray-600 mb-1">Amount Financed</p>
                  <p className="text-sm text-gray-800">{financialSummary.lfs[activeTab.toLowerCase()].amountFinanced}</p>
                </div>
              </div>
            </section>
            
            {/* Miscellaneous */}
            <section>
              <h4 className="text-md font-medium mb-4 border-b border-gray-200 pb-2 text-blue-600">Miscellaneous</h4>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="border-b border-gray-100 pb-2">
                  <p className="text-xs text-gray-600 mb-1">Accepted Offer Date</p>
                  <p className="text-sm text-gray-800">{financialSummary.lfs[activeTab.toLowerCase()].acceptedOfferDate}</p>
                </div>
                <div className="border-b border-gray-100 pb-2">
                  <p className="text-xs text-gray-600 mb-1">Transaction ID</p>
                  <p className="text-sm text-gray-800">{financialSummary.lfs[activeTab.toLowerCase()].transactionId}</p>
                </div>
                <div className="border-b border-gray-100 pb-2">
                  <p className="text-xs text-gray-600 mb-1">Transaction Version</p>
                  <p className="text-sm text-gray-800">{financialSummary.lfs[activeTab.toLowerCase()].transactionVersion}</p>
                </div>
              </div>
            </section>

            {/* Approved Offers */}
            <section className="mt-8">
              <h4 className="text-md font-semibold mb-4 pb-2">Approved Offers</h4>
              <div className="grid grid-cols-1 lg:grid-cols-7 gap-2 text-xs">
                <div className="font-medium">Term</div>
                <div className="font-medium">Allowed Mileage</div>
                <div className="font-medium">Down Payment</div>
                <div className="font-medium">Estimated Monthly Payment (incl. tax)</div>
                <div className="font-medium">Due At Delivery</div>
                <div className="font-medium">Approved Date</div>
                <div className="font-medium">Lender Name</div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-7 gap-2 text-xs mt-2">
                <div>18</div>
                <div>15,000</div>
                <div>0</div>
                <div>1,610.77</div>
                <div>4,106.34</div>
                <div>Apr 27, 2025</div>
                <div>Lucid Financial Services</div>
              </div>
            </section>

            {/* TradeIn Details */}
            <section className="mt-8">
              <h4 className="text-md font-semibold mb-4 pb-2">TradeIn Details</h4>
              <div className="grid grid-cols-7 gap-2 text-xs">
                <div className="font-medium">Year</div>
                <div className="font-medium">Make</div>
                <div className="font-medium">Model</div>
                <div className="font-medium">Trim</div>
                <div className="font-medium">Lien Holder</div>
                <div className="font-medium">Total Value</div>
                <div className="font-medium">PayOff Amount</div>
              </div>
              <div className="grid grid-cols-7 gap-2 text-xs mt-2 border-b border-gray-200 pb-2">
                <div>-</div>
                <div>-</div>
                <div>-</div>
                <div>-</div>
                <div>-</div>
                <div>-</div>
                <div>-</div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-2 text-xs mt-4">
                <div className="font-medium">Gross Trade Allowance</div>
                <div className="font-medium">Net TradeIn</div>
                <div className="font-medium">Max Allowed CCR from Trade</div>
                <div className="font-medium">Max allowed Cash CCR</div>
                <div className="font-medium">Equity applied to due at delivery</div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-2 text-xs mt-2">
                <div>-</div>
                <div>-</div>
                <div>-</div>
                <div>28847.83</div>
                <div>-</div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 text-xs mt-4">
                <div className="font-medium">Equity Applied to CCR</div>
                <div className="font-medium">Remaining equity post financing</div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 text-xs mt-2">
                <div>0</div>
                <div>0</div>
              </div>
            </section>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default FinancialSummaryView;
