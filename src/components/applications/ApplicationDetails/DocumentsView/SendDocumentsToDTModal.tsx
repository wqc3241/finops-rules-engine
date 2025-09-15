import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, XCircle, Send, FileText } from 'lucide-react';
import { useDocuments } from '@/hooks/useDocuments';
import { DocumentSelectionList } from './DocumentSelectionList';
import { LenderDocumentTypeMapper } from './LenderDocumentTypeMapper';
import { useSendDocumentsToDT } from '@/hooks/useSendDocumentsToDT';
import { toast } from 'sonner';

interface SendDocumentsToDTModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  applicationId: string;
}

export interface SelectedDocument {
  id: string;
  name: string;
  category: string;
  documentType: string;
  lenderDocumentType?: string;
  fileUrl?: string;
  fileName?: string;
}

export const SendDocumentsToDTModal: React.FC<SendDocumentsToDTModalProps> = ({
  open,
  onOpenChange,
  applicationId
}) => {
  const [selectedDocuments, setSelectedDocuments] = useState<SelectedDocument[]>([]);
  const [step, setStep] = useState<'selection' | 'mapping' | 'sending'>('selection');
  
  const { data: documents = [], isLoading } = useDocuments(applicationId);
  const sendDocumentsToDT = useSendDocumentsToDT();

  const handleDocumentSelection = (selected: SelectedDocument[]) => {
    setSelectedDocuments(selected);
  };

  const handleLenderMappingComplete = (mappedDocuments: SelectedDocument[]) => {
    setSelectedDocuments(mappedDocuments);
  };

  const handleSendToDT = async () => {
    if (selectedDocuments.length === 0) {
      toast.error('Please select documents to send');
      return;
    }

    const unmappedDocuments = selectedDocuments.filter(doc => !doc.lenderDocumentType);
    if (unmappedDocuments.length > 0) {
      toast.error('Please map all selected documents to lender document types');
      return;
    }

    setStep('sending');
    
    try {
      await sendDocumentsToDT.mutateAsync({
        applicationId,
        documents: selectedDocuments
      });
      
      toast.success(`Successfully sent ${selectedDocuments.length} document(s) to DT`);
      onOpenChange(false);
      
      // Reset state
      setSelectedDocuments([]);
      setStep('selection');
    } catch (error) {
      console.error('Failed to send documents to DT:', error);
      toast.error('Failed to send documents to DT. Please try again.');
      setStep('mapping');
    }
  };

  const handleNext = () => {
    if (selectedDocuments.length === 0) {
      toast.error('Please select at least one document');
      return;
    }
    setStep('mapping');
  };

  const handleBack = () => {
    setStep('selection');
  };

  const handleClose = () => {
    onOpenChange(false);
    setSelectedDocuments([]);
    setStep('selection');
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Send Documents To DT
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Loading documents...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl max-h-[85vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Send Documents To DT
          </DialogTitle>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${step === 'selection' ? 'bg-primary' : 'bg-muted'}`} />
              <span className={`text-sm ${step === 'selection' ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                Select Documents
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${step === 'mapping' ? 'bg-primary' : 'bg-muted'}`} />
              <span className={`text-sm ${step === 'mapping' ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                Map Document Types
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${step === 'sending' ? 'bg-primary' : 'bg-muted'}`} />
              <span className={`text-sm ${step === 'sending' ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                Sending
              </span>
            </div>
          </div>
        </DialogHeader>

        <Separator className="flex-shrink-0" />

        <div className="flex-1 overflow-hidden">
          {step === 'selection' && (
            <div className="h-full flex flex-col">
              <div className="flex-shrink-0 mb-4">
                <p className="text-sm text-muted-foreground">
                  Select the documents you want to send to DT. You can select individual documents or entire categories.
                </p>
              </div>
              <ScrollArea className="flex-1">
                <DocumentSelectionList
                  documents={documents}
                  selectedDocuments={selectedDocuments}
                  onSelectionChange={handleDocumentSelection}
                />
              </ScrollArea>
            </div>
          )}

          {step === 'mapping' && (
            <div className="h-full flex flex-col">
              <div className="flex-shrink-0 mb-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Map each selected document to a lender document type for DT submission.
                  </p>
                  <Badge variant="secondary" className="text-xs">
                    {selectedDocuments.length} document{selectedDocuments.length !== 1 ? 's' : ''} selected
                  </Badge>
                </div>
              </div>
              <ScrollArea className="flex-1">
                <LenderDocumentTypeMapper
                  selectedDocuments={selectedDocuments}
                  onMappingComplete={handleLenderMappingComplete}
                />
              </ScrollArea>
            </div>
          )}

          {step === 'sending' && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
                <p className="text-sm text-muted-foreground">
                  Sending {selectedDocuments.length} document{selectedDocuments.length !== 1 ? 's' : ''} to DT...
                </p>
              </div>
            </div>
          )}
        </div>

        <Separator className="flex-shrink-0" />

        <DialogFooter className="flex-shrink-0">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              {selectedDocuments.length > 0 && (
                <Badge variant="outline" className="text-xs">
                  <FileText className="h-3 w-3 mr-1" />
                  {selectedDocuments.length} selected
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              {step === 'selection' && (
                <Button 
                  onClick={handleNext}
                  disabled={selectedDocuments.length === 0}
                >
                  Next: Map Document Types
                </Button>
              )}
              {step === 'mapping' && (
                <>
                  <Button variant="outline" onClick={handleBack}>
                    Back
                  </Button>
                  <Button 
                    onClick={handleSendToDT}
                    disabled={selectedDocuments.some(doc => !doc.lenderDocumentType) || sendDocumentsToDT.isPending}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send to DT
                  </Button>
                </>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};