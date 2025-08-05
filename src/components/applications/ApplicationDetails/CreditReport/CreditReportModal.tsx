import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Printer, Mail, Download } from 'lucide-react';
import { CreditReport } from '@/types/application/creditReport';
import CreditReportViewer from './CreditReportViewer';
import { toast } from 'sonner';

interface CreditReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  creditReport: CreditReport;
}

const CreditReportModal: React.FC<CreditReportModalProps> = ({
  isOpen,
  onClose,
  creditReport
}) => {
  const [showDisclosureDialog, setShowDisclosureDialog] = useState(false);

  const handlePrintReport = () => {
    window.print();
    toast.success('Print dialog opened');
  };

  const handleSendDisclosure = () => {
    setShowDisclosureDialog(false);
    // Simulate sending disclosure
    toast.success(`Credit disclosure sent to ${creditReport.personalInfo.name}`);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl w-full h-[90vh]">
          <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <DialogTitle className="text-xl">
              Credit Report - {creditReport.personalInfo.name} ({creditReport.applicantType === 'primary' ? 'Applicant' : 'Co-Applicant'})
            </DialogTitle>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrintReport}
                className="flex items-center space-x-2"
              >
                <Printer className="h-4 w-4" />
                <span>Print PDF</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDisclosureDialog(true)}
                className="flex items-center space-x-2"
              >
                <Mail className="h-4 w-4" />
                <span>Send Disclosure</span>
              </Button>
            </div>
          </DialogHeader>
          
          <div className="flex-1 overflow-hidden">
            <CreditReportViewer creditReport={creditReport} />
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDisclosureDialog} onOpenChange={setShowDisclosureDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Send Credit Disclosure</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to send the credit disclosure to {creditReport.personalInfo.name}? 
              This action will notify the customer that their credit report has been accessed for financing purposes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSendDisclosure}>
              Send Disclosure
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CreditReportModal;