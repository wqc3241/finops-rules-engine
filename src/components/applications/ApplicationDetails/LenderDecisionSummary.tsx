import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, AlertCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface LenderDecisionSummaryProps {
  lenderName?: string;
  lenderOffer?: {
    applicationType: 'Lease' | 'Loan';
    termLength: string;
    apr?: string;
    mf?: string;
    monthlyPayment: string;
    downPayment?: string;
    dueAtSigning?: string;
    status: string;
  };
  isShownToCustomer?: boolean;
  hasNoLender?: boolean;
}

const LenderDecisionSummary: React.FC<LenderDecisionSummaryProps> = ({
  lenderName,
  lenderOffer,
  isShownToCustomer,
  hasNoLender
}) => {
  if (hasNoLender) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Card className="border-dashed border-muted-foreground/30 bg-muted/30">
              <CardContent className="p-2 flex items-center gap-2">
                <AlertCircle className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">No lender offer associated</span>
              </CardContent>
            </Card>
          </TooltipTrigger>
          <TooltipContent>
            <p>This version has no associated lender decision</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (!lenderOffer) return null;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'declined': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className={`${isShownToCustomer ? 'border-primary bg-primary/5' : 'border-border'}`}>
      <CardContent className="p-2">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1">
            <Building2 className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs font-medium">{lenderName}</span>
            {isShownToCustomer && (
              <Badge variant="outline" className="text-[10px] px-1 py-0 bg-primary text-primary-foreground">
                Shown to Customer
              </Badge>
            )}
          </div>
          <Badge variant="outline" className={`text-[10px] px-1 py-0 ${getStatusColor(lenderOffer.status)}`}>
            {lenderOffer.status}
          </Badge>
        </div>
        
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>{lenderOffer.applicationType}</span>
          <span>•</span>
          <span>{lenderOffer.termLength} mo</span>
          <span>•</span>
          <span>{lenderOffer.monthlyPayment}/mo</span>
          {lenderOffer.apr && (
            <>
              <span>•</span>
              <span>{lenderOffer.apr} APR</span>
            </>
          )}
          {lenderOffer.mf && (
            <>
              <span>•</span>
              <span>{lenderOffer.mf} MF</span>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LenderDecisionSummary;