import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PricingConfigRule {
  id: string;
  minLTV: number | null;
  maxLTV: number | null;
  minTerm: number | null;
  maxTerm: number | null;
  minLeaseMileage: number | null;
  maxLeaseMileage: number | null;
  priority: number;
}

const initialPricingConfigRules: PricingConfigRule[] = [
  {
    id: "PR001",
    minLTV: 80,
    maxLTV: 100,
    minTerm: 24,
    maxTerm: 48,
    minLeaseMileage: null,
    maxLeaseMileage: null,
    priority: 1
  },
  {
    id: "PR002",
    minLTV: 0,
    maxLTV: 80.9,
    minTerm: 0,
    maxTerm: 36,
    minLeaseMileage: null,
    maxLeaseMileage: null,
    priority: 1
  },
  {
    id: "PR003",
    minLTV: 0,
    maxLTV: 80.9,
    minTerm: 24,
    maxTerm: 36,
    minLeaseMileage: 12000,
    maxLeaseMileage: 24000,
    priority: 1
  },
  {
    id: "KSAPR001",
    minLTV: null,
    maxLTV: null,
    minTerm: 60,
    maxTerm: 60,
    minLeaseMileage: null,
    maxLeaseMileage: null,
    priority: 1
  }
];

const formatPercent = (value: number | null) => {
  if (value === null) return '';
  return `${value}%`;
};

const formatNumber = (value: number | null) => {
  if (value === null) return '';
  return value.toLocaleString();
};

const PricingConfigRulesTable = () => {
  const [pricingConfigRules, setPricingConfigRules] = useState<PricingConfigRule[]>(initialPricingConfigRules);
  const [selectedRules, setSelectedRules] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ruleToDelete, setRuleToDelete] = useState<string | null>(null);

  const toggleSelectAll = () => {
    if (selectedRules.length === pricingConfigRules.length) {
      setSelectedRules([]);
    } else {
      setSelectedRules(pricingConfigRules.map(rule => rule.id));
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
      setPricingConfigRules(current => current.filter(rule => rule.id !== ruleToDelete));
      setSelectedRules(current => current.filter(id => id !== ruleToDelete));
      toast.success("Pricing config rule deleted");
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
                checked={selectedRules.length === pricingConfigRules.length && pricingConfigRules.length > 0} 
                onCheckedChange={toggleSelectAll}
                aria-label="Select all"
              />
            </TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Min LTV</TableHead>
            <TableHead>Max LTV</TableHead>
            <TableHead>Min Term</TableHead>
            <TableHead>Max Term</TableHead>
            <TableHead>Min Lease Mileage</TableHead>
            <TableHead>Max Lease Mileage</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pricingConfigRules.map((rule, index) => (
            <TableRow key={`${rule.id}-${index}`} className="hover:bg-gray-50">
              <TableCell>
                <Checkbox 
                  checked={selectedRules.includes(rule.id)}
                  onCheckedChange={() => toggleSelectRule(rule.id)}
                  aria-label={`Select rule ${rule.id}`}
                />
              </TableCell>
              <TableCell>{rule.id}</TableCell>
              <TableCell>{formatPercent(rule.minLTV)}</TableCell>
              <TableCell>{formatPercent(rule.maxLTV)}</TableCell>
              <TableCell>{rule.minTerm}</TableCell>
              <TableCell>{rule.maxTerm}</TableCell>
              <TableCell>{formatNumber(rule.minLeaseMileage)}</TableCell>
              <TableCell>{formatNumber(rule.maxLeaseMileage)}</TableCell>
              <TableCell>{rule.priority}</TableCell>
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
            <AlertDialogTitle>Delete Pricing Config Rule</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this pricing config rule? This action cannot be undone.
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

export default PricingConfigRulesTable;
