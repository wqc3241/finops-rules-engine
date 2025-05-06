
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

interface PricingRule {
  id: string;
  priority: number;
  programName: string;
  programType: string;
  term: number;
  buyRate: number;
  maxMarkup: number;
  dealerDiscount: number;
  programFee: number;
}

const initialPricingRules: PricingRule[] = [
  {
    id: "BP001",
    priority: 1,
    programName: "60 Month Loan",
    programType: "Loan",
    term: 60,
    buyRate: 4.5,
    maxMarkup: 2.0,
    dealerDiscount: 0.5,
    programFee: 395
  },
  {
    id: "BP002",
    priority: 2,
    programName: "48 Month Loan",
    programType: "Loan",
    term: 48,
    buyRate: 4.2,
    maxMarkup: 1.8,
    dealerDiscount: 0.4,
    programFee: 295
  },
  {
    id: "BP003",
    priority: 3,
    programName: "36 Month Lease",
    programType: "Lease",
    term: 36,
    buyRate: 3.9,
    maxMarkup: 1.5,
    dealerDiscount: 0.3,
    programFee: 395
  }
];

const formatPercent = (value: number | null) => {
  if (value === null || value === 0) return '';
  return `${value}%`;
};

const formatCurrency = (value: number) => {
  if (value === 0) return '';
  return `$${value}`;
};

const PricingRulesTable = () => {
  const [pricingRules, setPricingRules] = useState<PricingRule[]>(initialPricingRules);
  const [selectedRules, setSelectedRules] = useState<string[]>([]);

  const toggleSelectAll = () => {
    if (selectedRules.length === pricingRules.length) {
      setSelectedRules([]);
    } else {
      setSelectedRules(pricingRules.map(rule => rule.id));
    }
  };

  const toggleSelectRule = (id: string) => {
    setSelectedRules(current =>
      current.includes(id) ? current.filter(ruleId => ruleId !== id) : [...current, id]
    );
  };

  return (
    <div className="table-container">
      <Table>
        <TableHeader className="sticky-header">
          <TableRow>
            <TableHead className="w-10">
              <Checkbox 
                checked={selectedRules.length === pricingRules.length && pricingRules.length > 0} 
                onCheckedChange={toggleSelectAll}
                aria-label="Select all"
              />
            </TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Program Name</TableHead>
            <TableHead>Program Type</TableHead>
            <TableHead>Term</TableHead>
            <TableHead className="highlight">Buy Rate</TableHead>
            <TableHead className="highlight">Max Markup</TableHead>
            <TableHead>Dealer Discount</TableHead>
            <TableHead>Program Fee</TableHead>
            <TableHead className="text-right">Actions</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pricingRules.map((rule) => (
            <TableRow key={rule.id} className="hover:bg-gray-50">
              <TableCell>
                <Checkbox 
                  checked={selectedRules.includes(rule.id)}
                  onCheckedChange={() => toggleSelectRule(rule.id)}
                  aria-label={`Select rule ${rule.id}`}
                />
              </TableCell>
              <TableCell>{rule.id}</TableCell>
              <TableCell>{rule.priority}</TableCell>
              <TableCell>{rule.programName}</TableCell>
              <TableCell>{rule.programType}</TableCell>
              <TableCell>{rule.term} mo</TableCell>
              <TableCell className="highlight">{formatPercent(rule.buyRate)}</TableCell>
              <TableCell className="highlight">{formatPercent(rule.maxMarkup)}</TableCell>
              <TableCell>{formatPercent(rule.dealerDiscount)}</TableCell>
              <TableCell>{formatCurrency(rule.programFee)}</TableCell>
              <TableCell className="text-right">
                <button className="action-icon" title="Edit">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </TableCell>
              <TableCell className="text-right">
                <button className="action-icon" title="Delete">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PricingRulesTable;
