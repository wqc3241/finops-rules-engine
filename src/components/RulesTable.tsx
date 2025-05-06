
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

interface Rule {
  id: string;
  priority: number;
  minCreditScore: number;
  maxCreditScore: number;
  minIncome: number;
  maxIncome: number;
  minAge: number;
  maxAge: number;
  minPTI: number | null;
  maxPTI: number | null;
  minDTI: number;
  maxDTI: number;
}

const initialRules: Rule[] = [
  {
    id: "P001",
    priority: 1,
    minCreditScore: 800,
    maxCreditScore: 999,
    minIncome: 80000,
    maxIncome: 100000,
    minAge: 23,
    maxAge: 28,
    minPTI: 10,
    maxPTI: 20,
    minDTI: 50,
    maxDTI: 60
  },
  {
    id: "P002",
    priority: 2,
    minCreditScore: 800,
    maxCreditScore: 999,
    minIncome: 80000,
    maxIncome: 100000,
    minAge: 23,
    maxAge: 28,
    minPTI: null,
    maxPTI: null,
    minDTI: 50,
    maxDTI: 60
  },
  {
    id: "P003",
    priority: 3,
    minCreditScore: 800,
    maxCreditScore: 999,
    minIncome: 0,
    maxIncome: 0,
    minAge: 0,
    maxAge: 0,
    minPTI: null,
    maxPTI: null,
    minDTI: 0,
    maxDTI: 0
  }
];

const formatCurrency = (value: number) => {
  if (value === 0) return '';
  return `$${value.toLocaleString()}`;
};

const formatPercent = (value: number | null) => {
  if (value === null || value === 0) return '';
  return `${value}%`;
};

const RulesTable = () => {
  const [rules, setRules] = useState<Rule[]>(initialRules);
  const [selectedRules, setSelectedRules] = useState<string[]>([]);

  const toggleSelectAll = () => {
    if (selectedRules.length === rules.length) {
      setSelectedRules([]);
    } else {
      setSelectedRules(rules.map(rule => rule.id));
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
                checked={selectedRules.length === rules.length && rules.length > 0} 
                onCheckedChange={toggleSelectAll}
                aria-label="Select all"
              />
            </TableHead>
            <TableHead>Profile ID</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Min Credit Score</TableHead>
            <TableHead>Max Credit Score</TableHead>
            <TableHead>Min Income</TableHead>
            <TableHead>Max Income</TableHead>
            <TableHead>Min Age</TableHead>
            <TableHead>Max Age</TableHead>
            <TableHead>Min PTI</TableHead>
            <TableHead>Max PTI</TableHead>
            <TableHead className="highlight">Min DTI</TableHead>
            <TableHead className="highlight">Max DTI</TableHead>
            <TableHead className="text-right">Actions</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rules.map((rule) => (
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
              <TableCell>{rule.minCreditScore || ''}</TableCell>
              <TableCell>{rule.maxCreditScore || ''}</TableCell>
              <TableCell>{formatCurrency(rule.minIncome)}</TableCell>
              <TableCell>{formatCurrency(rule.maxIncome)}</TableCell>
              <TableCell>{rule.minAge || ''}</TableCell>
              <TableCell>{rule.maxAge || ''}</TableCell>
              <TableCell>{formatPercent(rule.minPTI)}</TableCell>
              <TableCell>{formatPercent(rule.maxPTI)}</TableCell>
              <TableCell className="highlight">{formatPercent(rule.minDTI)}</TableCell>
              <TableCell className="highlight">{formatPercent(rule.maxDTI)}</TableCell>
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

export default RulesTable;
