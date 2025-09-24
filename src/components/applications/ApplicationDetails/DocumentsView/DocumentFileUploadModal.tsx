import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, X, File, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { DocumentWithCategory } from '@/hooks/useDocuments';

interface DocumentFileUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: DocumentWithCategory;
  applicationId: string;
}

const DocumentFileUploadModal = ({ open, onOpenChange, document, applicationId }: DocumentFileUploadModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [notes, setNotes] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const acceptedTypes = [
    'application/pdf',
    'image/png',
    'image/jpeg', 
    'image/jpg',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];

  const maxSizeMB = 50;

  const validateFile = (file: File) => {
    if (!acceptedTypes.includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload PDF, Word, image, or text files only.',
        variant: 'destructive'
      });
      return false;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: `File must be smaller than ${maxSizeMB}MB.`,
        variant: 'destructive'
      });
      return false;
    }

    return true;
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      const selectedFile = droppedFiles[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile);
    }
  };

  const generateNewVersion = async () => {
    // Get the highest version number for this document family
    const rootDocumentId = document.parent_document_id || document.id;
    const { data: versions, error: versionsError } = await supabase
      .from('documents')
      .select('version_number')
      .or(`id.eq.${rootDocumentId},parent_document_id.eq.${rootDocumentId}`)
      .order('version_number', { ascending: false })
      .limit(1);

    if (versionsError) throw versionsError;

    const nextVersion = (versions[0]?.version_number || 0) + 1;
    return nextVersion;
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    try {
      const nextVersion = await generateNewVersion();
      const fileExtension = file.name.split('.').pop();
      const rootDocumentId = document.parent_document_id || document.id;
      const fileName = `${applicationId || 'no-app'}/${rootDocumentId}/v${nextVersion}/${file.name}`;
      
      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName);

      // Create new document version
      const { error: insertError } = await supabase
        .from('documents')
        .insert({
          name: document.name,
          application_id: applicationId,
          category_id: document.category_id,
          document_type_id: document.document_type_id,
          parent_document_id: rootDocumentId,
          version_number: nextVersion,
          file_url: publicUrl,
          file_name: file.name,
          file_size_mb: Number((file.size / (1024 * 1024)).toFixed(2)),
          file_extension: fileExtension,
          status: 'submitted',
          notes: notes,
          is_required: document.is_required,
          requires_signature: false,
          uploaded_by: 'Current User', // This should be replaced with actual user info
        });

      if (insertError) throw insertError;

      // Update root document's generation count
      await supabase
        .from('documents')
        .update({ generation_count: nextVersion })
        .eq('id', rootDocumentId);

      // Invalidate queries to refresh the UI
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['document-versions'] });

      toast({
        title: 'Success',
        description: 'File uploaded successfully',
      });

      // Reset form and close modal
      setFile(null);
      setNotes('');
      onOpenChange(false);

    } catch (error: any) {
      toast({
        title: 'Upload failed',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload File for {document.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* File Upload Area */}
          <div
            className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragActive 
                ? 'border-primary bg-primary/5' 
                : file 
                  ? 'border-green-300 bg-green-50' 
                  : 'border-muted-foreground/25 hover:border-muted-foreground/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              onChange={handleFileSelect}
              accept={acceptedTypes.join(',')}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isUploading}
            />
            
            {file ? (
              <div className="space-y-2">
                <File className="mx-auto h-8 w-8 text-green-600" />
                <div className="text-sm font-medium text-green-700">{file.name}</div>
                <div className="text-xs text-green-600">{formatFileSize(file.size)}</div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFile(null)}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                <div className="text-sm font-medium">Drop files here or click to browse</div>
                <div className="text-xs text-muted-foreground">
                  Supports PDF, Word, images, and text files (max {maxSizeMB}MB)
                </div>
              </div>
            )}
          </div>

          {/* Notes Section */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any notes about this document..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* Version Info */}
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-md">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <div className="text-sm text-blue-800">
              This will create version {document.generation_count + 1} of this document.
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isUploading}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpload} 
              disabled={!file || isUploading}
              className="min-w-[80px]"
            >
              {isUploading ? 'Uploading...' : 'Upload'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentFileUploadModal;