import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, XCircle, GitCommit } from "lucide-react";
import { useSupabaseApprovalWorkflow } from "@/hooks/useSupabaseApprovalWorkflow";
import { ChangeDetail } from "@/types/approval";

interface TableReviewInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  requestId: string;
  tableId: string;
}

const TableReviewInterface = ({ isOpen, onClose, onBack, requestId, tableId }: TableReviewInterfaceProps) => {
  const [comment, setComment] = useState("");
  const { getChangeRequestWithDetails, approveTableChanges, rejectTableChanges, finalizeChangeRequest } = useSupabaseApprovalWorkflow();

  const request = getChangeRequestWithDetails(requestId);
  const tableChanges = request?.tableChanges.find(t => t.schemaId === tableId);

  if (!request || !tableChanges) {
    return null;
  }

  const handleApprove = () => {
    approveTableChanges(requestId, tableId, comment || undefined);
    finalizeChangeRequest(requestId);
    onBack();
  };

  const handleReject = () => {
    rejectTableChanges(requestId, tableId, comment || undefined);
    finalizeChangeRequest(requestId);
    onBack();
  };

  const formatValue = (value: any) => {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'number') return value.toLocaleString();
    if (typeof value === 'string' && value.includes('T') && value.includes('Z')) {
      try {
        return new Date(value).toLocaleDateString();
      } catch {
        return value;
      }
    }
    return value;
  };

  const getBulletinPricingFields = () => [
    { key: 'bulletin_id', label: 'Bulletin ID' },
    { key: 'financial_program_code', label: 'Program Code' },
    { key: 'pricing_type', label: 'Pricing Type' },
    { key: 'pricing_value', label: 'Pricing Value' },
    { key: 'geo_code', label: 'Geo Code' },
    { key: 'lender_list', label: 'Lender List' },
    { key: 'credit_profile', label: 'Credit Profile' },
    { key: 'pricing_config', label: 'Pricing Config' },
    { key: 'advertised', label: 'Advertised' },
    { key: 'upload_date', label: 'Upload Date' },
    { key: 'updated_date', label: 'Updated Date' }
  ];

  const renderBulletinPricingTable = (data: any, variant: 'new' | 'deleted' | 'before' | 'after') => {
    const fields = getBulletinPricingFields();
    const bgColor = variant === 'new' || variant === 'after' ? 'bg-green-50' : 'bg-red-50';
    const borderColor = variant === 'new' || variant === 'after' ? 'border-green-200' : 'border-red-200';

    return (
      <div className={`${bgColor} p-4 rounded border ${borderColor}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <tbody>
              {fields.map(field => (
                <tr key={field.key} className="border-b border-gray-200">
                  <td className="py-2 pr-4 font-medium text-gray-700 w-1/3">{field.label}</td>
                  <td className="py-2 text-gray-900">{formatValue(data?.[field.key])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderValueDiff = (change: ChangeDetail) => {
    const isNew = !change.oldValue;
    const isDeleted = !change.newValue;
    const isBulletinPricing = tableId === 'bulletin-pricing';

    if (isNew) {
      return (
        <div className="space-y-2">
          <Badge className="bg-green-100 text-green-800">NEW RECORD</Badge>
          {isBulletinPricing ? 
            renderBulletinPricingTable(change.newValue, 'new') :
            <div className="bg-green-50 p-3 rounded border border-green-200">
              <pre className="text-xs text-green-800 whitespace-pre-wrap">
                {JSON.stringify(change.newValue, null, 2)}
              </pre>
            </div>
          }
        </div>
      );
    }

    if (isDeleted) {
      return (
        <div className="space-y-2">
          <Badge className="bg-red-100 text-red-800">DELETED RECORD</Badge>
          {isBulletinPricing ? 
            renderBulletinPricingTable(change.oldValue, 'deleted') :
            <div className="bg-red-50 p-3 rounded border border-red-200">
              <pre className="text-xs text-red-800 whitespace-pre-wrap">
                {JSON.stringify(change.oldValue, null, 2)}
              </pre>
            </div>
          }
        </div>
      );
    }

    // Modified record - show side by side
    return (
      <div className="space-y-2">
        <Badge className="bg-blue-100 text-blue-800">MODIFIED RECORD</Badge>
        {isBulletinPricing ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h5 className="font-medium text-sm text-red-600 mb-2">Before</h5>
              {renderBulletinPricingTable(change.oldValue, 'before')}
            </div>
            <div>
              <h5 className="font-medium text-sm text-green-600 mb-2">After</h5>
              {renderBulletinPricingTable(change.newValue, 'after')}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h5 className="font-medium text-sm text-red-600 mb-2">Before</h5>
              <div className="bg-red-50 p-3 rounded border border-red-200">
                <pre className="text-xs text-red-800 whitespace-pre-wrap">
                  {JSON.stringify(change.oldValue, null, 2)}
                </pre>
              </div>
            </div>
            <div>
              <h5 className="font-medium text-sm text-green-600 mb-2">After</h5>
              <div className="bg-green-50 p-3 rounded border border-green-200">
                <pre className="text-xs text-green-800 whitespace-pre-wrap">
                  {JSON.stringify(change.newValue, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const isAlreadyReviewed = tableChanges.status !== "PENDING";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <GitCommit className="h-5 w-5" />
            Review: {tableId.replace(/-/g, ' ').toUpperCase()}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Table Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Table Changes Summary</span>
                <Badge className={
                  tableChanges.status === "APPROVED" ? "bg-green-100 text-green-800" :
                  tableChanges.status === "REJECTED" ? "bg-red-100 text-red-800" :
                  "bg-yellow-100 text-yellow-800"
                }>
                  {tableChanges.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {tableChanges.changedRowsCount} record{tableChanges.changedRowsCount !== 1 ? 's' : ''} will be modified in this table
              </p>
            </CardContent>
          </Card>

          {/* Change Details */}
          <div className="space-y-4">
            <h3 className="font-semibold">Record Changes</h3>
            {tableChanges.changes.map((change, index) => (
              <Card key={`${change.ruleKey}-${index}`}>
                <CardHeader>
                  <CardTitle className="text-sm font-mono">
                    Record ID: {change.ruleKey}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {renderValueDiff(change)}
                </CardContent>
              </Card>
            ))}
          </div>

          {!isAlreadyReviewed && (
            <>
              {/* Comment Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Review Comments (Optional)</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Add any comments about these changes..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                  />
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t">
                <Button variant="outline" onClick={onBack}>
                  Back to Summary
                </Button>

                <div className="flex gap-2">
                  <Button
                    variant="destructive"
                    onClick={handleReject}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject Changes
                  </Button>
                  <Button
                    onClick={handleApprove}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Changes
                  </Button>
                </div>
              </div>
            </>
          )}

          {isAlreadyReviewed && (
            <Alert>
              <AlertDescription>
                This table has already been {tableChanges.status.toLowerCase()}.
                {tableChanges.changes[0]?.comment && (
                  <div className="mt-2 p-2 bg-muted rounded">
                    <strong>Comment:</strong> {tableChanges.changes[0].comment}
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TableReviewInterface;