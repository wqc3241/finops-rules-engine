import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileText, AlertCircle, CheckCircle, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface BulletinPricingUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete?: () => void;
}

interface UploadError {
  sheet_name: string;
  row_number?: number;
  column_name?: string;
  error_type: string;
  error_message: string;
}

interface UploadResult {
  success: boolean;
  sessionId: string;
  totalRecords: number;
  validRecords: number;
  invalidRecords: number;
  errors?: UploadError[];
  message: string;
}

const BulletinPricingUploadModal = ({
  isOpen,
  onClose,
  onUploadComplete
}: BulletinPricingUploadModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith('.xlsx')) {
        toast.error("Please select an Excel (.xlsx) file");
        return;
      }
      setSelectedFile(file);
      setUploadResult(null);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith('.xlsx')) {
        toast.error("Please select an Excel (.xlsx) file");
        return;
      }
      setSelectedFile(file);
      setUploadResult(null);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      // Use direct fetch instead of supabase.functions.invoke for FormData
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`https://izxgyxqpgpcqvyzlwcgl.supabase.co/functions/v1/bulletin-pricing-upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP ${response.status}`);
      }

      const data = await response.json();

      setUploadResult(data);

      if (data.success) {
        toast.success(data.message);
        onUploadComplete?.();
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error instanceof Error ? error.message : 'Upload failed');
      setUploadResult({
        success: false,
        sessionId: '',
        totalRecords: 0,
        validRecords: 0,
        invalidRecords: 0,
        message: 'Upload failed due to an unexpected error'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setUploadResult(null);
    setIsUploading(false);
    onClose();
  };

  const downloadErrorReport = async () => {
    if (!uploadResult?.sessionId) return;

    try {
      const { data: errors } = await supabase
        .from('bulletin_upload_errors')
        .select('*')
        .eq('session_id', uploadResult.sessionId)
        .order('sheet_name', { ascending: true })
        .order('row_number', { ascending: true });

      if (!errors || errors.length === 0) {
        toast.info("No errors to download");
        return;
      }

      // Create CSV content
      const csvHeader = "Sheet Name,Row Number,Column Name,Error Type,Error Message,Field Value\n";
      const csvContent = errors.map(error => 
        `"${error.sheet_name}","${error.row_number || ''}","${error.column_name || ''}","${error.error_type}","${error.error_message}","${error.field_value || ''}"`
      ).join('\n');

      const csvData = csvHeader + csvContent;
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `bulletin_upload_errors_${uploadResult.sessionId}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Error report downloaded");
    } catch (error) {
      console.error('Error downloading report:', error);
      toast.error("Failed to download error report");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Bulletin Pricing
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* File Upload Area */}
          <div className="space-y-2">
            <Label>Excel File *</Label>
            <div
              className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              {selectedFile ? (
                <div className="flex items-center justify-center gap-2">
                  <FileText className="h-5 w-5" />
                  <span className="text-sm">{selectedFile.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedFile(null)}
                    disabled={isUploading}
                    className="h-6 w-6"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Drag and drop your Excel file here, or{" "}
                      <label className="text-primary hover:underline cursor-pointer">
                        browse
                        <Input
                          type="file"
                          accept=".xlsx"
                          onChange={handleFileSelect}
                          disabled={isUploading}
                          className="hidden"
                        />
                      </label>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Excel sheets must be named as PROGRAMCODE_PRICINGTYPE (e.g., PROG001_LEASE)
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading and validating...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          )}

          {/* Upload Results */}
          {uploadResult && (
            <div className="space-y-4">
              <Alert className={uploadResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                <div className="flex items-start gap-2">
                  {uploadResult.success ? (
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-2">
                    <AlertDescription className={uploadResult.success ? "text-green-800" : "text-red-800"}>
                      {uploadResult.message}
                    </AlertDescription>
                    <div className="text-sm space-y-1">
                      <div>Total Records: {uploadResult.totalRecords}</div>
                      <div>Valid Records: {uploadResult.validRecords}</div>
                      {uploadResult.invalidRecords > 0 && (
                        <div>Invalid Records: {uploadResult.invalidRecords}</div>
                      )}
                    </div>
                  </div>
                </div>
              </Alert>

              {!uploadResult.success && uploadResult.invalidRecords > 0 && (
                <Button
                  variant="outline"
                  onClick={downloadErrorReport}
                  className="w-full"
                >
                  Download Error Report
                </Button>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleClose} disabled={isUploading}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpload} 
              disabled={!selectedFile || isUploading}
            >
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BulletinPricingUploadModal;