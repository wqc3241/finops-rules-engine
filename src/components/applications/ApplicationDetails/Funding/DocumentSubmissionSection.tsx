
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
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'generated': 
      case 'submitted': return <Upload className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
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
      <CardHeader>
        <CardTitle>Document Generation & Submission</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-3 border rounded">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>DR0026 Form</span>
            </div>
            <Badge variant={getStatusColor(documents.dr0026Form)}>
              {getStatusIcon(documents.dr0026Form)}
              {documents.dr0026Form}
            </Badge>
          </div>
          <div className="flex items-center justify-between p-3 border rounded">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>ST556 Form</span>
            </div>
            <Badge variant={getStatusColor(documents.st556Form)}>
              {getStatusIcon(documents.st556Form)}
              {documents.st556Form}
            </Badge>
          </div>
          <div className="flex items-center justify-between p-3 border rounded">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Letter of Guarantee</span>
            </div>
            <Badge variant={getStatusColor(documents.letterOfGuarantee)}>
              {getStatusIcon(documents.letterOfGuarantee)}
              {documents.letterOfGuarantee}
            </Badge>
          </div>
        </div>
        
        <Separator />
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={onSubmitForFunding} className="flex-1">
            <Upload className="h-4 w-4 mr-2" />
            Submit for Funding
          </Button>
          {caseManagement.currentCaseId && (
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="outline">
                Case: {caseManagement.currentCaseId}
              </Badge>
              <Badge variant={caseManagement.status === 'ready-for-funding' ? 'default' : 'secondary'}>
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
