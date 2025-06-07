
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FileText, Upload, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { DocumentStatus, CaseStatus } from '@/types/application/funding';

interface DocumentSubmissionSectionProps {
  documents: DocumentStatus;
  caseManagement: CaseStatus;
  onSubmitForFunding: () => Promise<void>;
}

const DocumentSubmissionSection: React.FC<DocumentSubmissionSectionProps> = ({ 
  documents, 
  caseManagement, 
  onSubmitForFunding 
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-3 w-3" />;
      case 'generated': 
      case 'submitted': return <Upload className="h-3 w-3" />;
      case 'approved': return <CheckCircle className="h-3 w-3" />;
      default: return <AlertCircle className="h-3 w-3" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'generated': return 'default';
      case 'submitted': return 'default';
      case 'approved': return 'default';
      default: return 'destructive';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Document Generation & Submission</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="flex items-center justify-between p-2 border rounded">
            <div className="flex items-center gap-2">
              <FileText className="h-3 w-3" />
              <span className="text-xs">DR0026 Form</span>
            </div>
            <Badge variant={getStatusColor(documents.dr0026Form)} className="text-xs">
              {getStatusIcon(documents.dr0026Form)}
              {documents.dr0026Form}
            </Badge>
          </div>
          <div className="flex items-center justify-between p-2 border rounded">
            <div className="flex items-center gap-2">
              <FileText className="h-3 w-3" />
              <span className="text-xs">ST556 Form</span>
            </div>
            <Badge variant={getStatusColor(documents.st556Form)} className="text-xs">
              {getStatusIcon(documents.st556Form)}
              {documents.st556Form}
            </Badge>
          </div>
          <div className="flex items-center justify-between p-2 border rounded">
            <div className="flex items-center gap-2">
              <FileText className="h-3 w-3" />
              <span className="text-xs">Letter of Guarantee</span>
            </div>
            <Badge variant={getStatusColor(documents.letterOfGuarantee)} className="text-xs">
              {getStatusIcon(documents.letterOfGuarantee)}
              {documents.letterOfGuarantee}
            </Badge>
          </div>
        </div>
        
        <Separator />
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={onSubmitForFunding} className="flex-1 h-8 text-xs">
            <Upload className="h-3 w-3 mr-1" />
            Submit for Funding
          </Button>
          {caseManagement.currentCaseId && (
            <div className="flex items-center gap-2 text-xs">
              <Badge variant="outline" className="text-xs">
                Case: {caseManagement.currentCaseId}
              </Badge>
              <Badge variant={caseManagement.status === 'ready-for-funding' ? 'default' : 'secondary'} className="text-xs">
                {caseManagement.status.replace('-', ' ')}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentSubmissionSection;
