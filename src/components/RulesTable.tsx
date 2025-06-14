import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Copy, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  employmentType: string;
}

interface RulesTableProps {
  onEdit: (id: string) => void;
  onCopy: (id: string) => void;
  onRemove: (id: string) => void;
}

// Function to generate a UUID
// const generateUUID = () => {
//   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
//     const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
//     return v.toString(16);
//   });
// };

const initialRulesWithoutUUID = [
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
    maxDTI: 60,
    employmentType: "Payroll"
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
    maxDTI: 60,
    employmentType: "Payroll"
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
    maxDTI: 0,
    employmentType: "Payroll"
  }
];

const initialRules: Rule[] = initialRulesWithoutUUID;

const formatCurrency = (value: number) => {
  if (value === 0) return '';
  return `$${value.toLocaleString()}`;
};

const formatPercent = (value: number | null) => {
  if (value === null || value === 0) return '';
  return `${value}%`;
};

const RulesTable = ({ onEdit, onCopy, onRemove }: RulesTableProps) => {
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
            {/* Removed UUID Header */}
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
            <TableHead>Min DTI</TableHead>
            <TableHead>Max DTI</TableHead>
            <TableHead>Employment Type</TableHead>
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
              {/* Removed UUID cell */}
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
              <TableCell>{formatPercent(rule.minDTI)}</TableCell>
              <TableCell>{formatPercent(rule.maxDTI)}</TableCell>
              <TableCell>{rule.employmentType}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onEdit(rule.id)}
                  className="h-8 w-8"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onCopy(rule.id)}
                  className="h-8 w-8"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onRemove(rule.id)}
                  className="h-8 w-8 text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RulesTable;
