import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, AlertCircle, CheckCircle, X, ChevronDown, ChevronRight, Search } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface BulletinPricingUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete?: () => void;
}

interface UploadError {
  id: string;
  sheet_name: string;
  row_number?: number;
  column_name?: string;
  error_type: string;
  error_message: string;
  field_value?: string;
  created_at: string;
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
  const [detailedErrors, setDetailedErrors] = useState<UploadError[]>([]);
  const [isLoadingErrors, setIsLoadingErrors] = useState(false);
  const [showErrorDetails, setShowErrorDetails] = useState(false);
  const [errorSearchTerm, setErrorSearchTerm] = useState("");

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
        // Fetch detailed errors if validation failed
        if (data.sessionId && data.invalidRecords > 0) {
          fetchDetailedErrors(data.sessionId);
        }
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

  const fetchDetailedErrors = async (sessionId: string) => {
    setIsLoadingErrors(true);
    try {
      const { data: errors } = await supabase
        .from('bulletin_upload_errors')
        .select('*')
        .eq('session_id', sessionId)
        .order('sheet_name', { ascending: true })
        .order('row_number', { ascending: true });

      if (errors) {
        setDetailedErrors(errors);
        setShowErrorDetails(true);
      }
    } catch (error) {
      console.error('Error fetching detailed errors:', error);
      toast.error("Failed to load error details");
    } finally {
      setIsLoadingErrors(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setUploadResult(null);
    setDetailedErrors([]);
    setShowErrorDetails(false);
    setErrorSearchTerm("");
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
                <div className="space-y-4">
                  {/* Error Details Section */}
                  <Collapsible open={showErrorDetails} onOpenChange={setShowErrorDetails}>
                    <CollapsibleTrigger asChild>
                      <Button variant="outline" className="w-full justify-between">
                        <span className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4" />
                          View Error Details ({detailedErrors.length} errors)
                        </span>
                        {showErrorDetails ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-4 mt-4">
                      {isLoadingErrors ? (
                        <div className="text-center py-4 text-muted-foreground">
                          Loading error details...
                        </div>
                      ) : (
                        <ErrorDetailsDisplay 
                          errors={detailedErrors} 
                          searchTerm={errorSearchTerm}
                          onSearchChange={setErrorSearchTerm}
                        />
                      )}
                    </CollapsibleContent>
                  </Collapsible>

                  <Button
                    variant="outline"
                    onClick={downloadErrorReport}
                    className="w-full"
                  >
                    Download Error Report (CSV)
                  </Button>
                </div>
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

// Error Details Display Component
interface ErrorDetailsDisplayProps {
  errors: UploadError[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const ErrorDetailsDisplay = ({ errors, searchTerm, onSearchChange }: ErrorDetailsDisplayProps) => {
  // Filter errors based on search term
  const filteredErrors = errors.filter(error => 
    error.error_message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    error.sheet_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    error.error_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (error.column_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (error.field_value?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Group errors by type for summary
  const errorsByType = filteredErrors.reduce((acc, error) => {
    acc[error.error_type] = (acc[error.error_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Group errors by sheet for display
  const errorsBySheet = filteredErrors.reduce((acc, error) => {
    if (!acc[error.sheet_name]) {
      acc[error.sheet_name] = [];
    }
    acc[error.sheet_name].push(error);
    return acc;
  }, {} as Record<string, UploadError[]>);

  const getErrorTypeColor = (errorType: string) => {
    switch (errorType.toUpperCase()) {
      case 'INVALID_CREDIT_PROFILE':
        return 'destructive';
      case 'INVALID_PRICING_CONFIG':
        return 'destructive';
      case 'INVALID_PRICING_VALUE':
        return 'secondary';
      case 'PROGRAM_NOT_FOUND':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-4 border rounded-lg p-4 bg-muted/20">
      {/* Search and Summary */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search errors by message, sheet, column, or value..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        
        {/* Error Type Summary */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(errorsByType).map(([type, count]) => (
            <Badge key={type} variant={getErrorTypeColor(type)} className="text-xs">
              {type.replace(/_/g, ' ')}: {count}
            </Badge>
          ))}
        </div>
        
        <div className="text-sm text-muted-foreground">
          Showing {filteredErrors.length} of {errors.length} errors
        </div>
      </div>

      {/* Error List */}
      <ScrollArea className="h-64 w-full">
        <div className="space-y-4">
          {Object.entries(errorsBySheet).map(([sheetName, sheetErrors]) => (
            <div key={sheetName} className="space-y-2">
              <h4 className="font-medium text-sm bg-muted px-2 py-1 rounded">
                Sheet: {sheetName} ({sheetErrors.length} errors)
              </h4>
              <div className="space-y-2">
                {sheetErrors.map((error) => (
                  <div 
                    key={error.id} 
                    className="border rounded p-3 bg-background space-y-2 text-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <Badge variant={getErrorTypeColor(error.error_type)} className="text-xs">
                        {error.error_type.replace(/_/g, ' ')}
                      </Badge>
                      {error.row_number && (
                        <span className="text-xs text-muted-foreground">
                          Row {error.row_number}
                          {error.column_name && `, Column ${error.column_name}`}
                        </span>
                      )}
                    </div>
                    <p className="text-foreground">{error.error_message}</p>
                    {error.field_value && (
                      <div className="text-xs">
                        <span className="text-muted-foreground">Value: </span>
                        <span className="font-mono bg-muted px-1 rounded">{error.field_value}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {filteredErrors.length === 0 && searchTerm && (
        <div className="text-center py-4 text-muted-foreground">
          No errors match your search criteria.
        </div>
      )}
    </div>
  );
};

export default BulletinPricingUploadModal;