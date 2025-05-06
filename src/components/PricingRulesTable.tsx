
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ruleToDelete, setRuleToDelete] = useState<string | null>(null);

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

  const handleDeleteClick = (id: string) => {
    setRuleToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (ruleToDelete) {
      setPricingRules(current => current.filter(rule => rule.id !== ruleToDelete));
      setSelectedRules(current => current.filter(id => id !== ruleToDelete));
      toast.success("Pricing rule deleted");
    }
    setDeleteDialogOpen(false);
    setRuleToDelete(null);
  };

  const handleEditClick = (id: string) => {
    // This would open an edit modal in a real implementation
    toast.info(`Editing rule ${id} - functionality to be implemented`);
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
              <TableCell className="text-right space-x-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleEditClick(rule.id)}
                  className="h-8 w-8"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleDeleteClick(rule.id)}
                  className="h-8 w-8 text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Pricing Rule</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this pricing rule? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PricingRulesTable;
