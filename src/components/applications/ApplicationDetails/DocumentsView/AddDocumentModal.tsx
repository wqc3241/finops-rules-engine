import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useDocumentCategories, useDocumentTypes } from '@/hooks/useDocumentConfiguration';
import { useCreateDocument } from '@/hooks/useDocuments';
import { Loader2, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AddDocumentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  applicationId: string;
  selectedCategory?: string;
}

const AddDocumentModal: React.FC<AddDocumentModalProps> = ({
  open,
  onOpenChange,
  applicationId,
  selectedCategory,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    categoryId: selectedCategory && selectedCategory !== 'all' ? selectedCategory : '',
    documentTypeId: '',
    notes: '',
    isRequired: false,
    expirationDate: ''
  });

  // Fetch document categories and types
  const { data: categories = [], isLoading: categoriesLoading } = useDocumentCategories();
  const { data: documentTypes = [], isLoading: typesLoading } = useDocumentTypes(formData.categoryId);
  const createDocument = useCreateDocument();

  // Reset document type when category changes
  useEffect(() => {
    if (formData.categoryId) {
      setFormData(prev => ({ ...prev, documentTypeId: '' }));
    }
  }, [formData.categoryId]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!open) {
      setFormData({
        name: '',
        categoryId: selectedCategory && selectedCategory !== 'all' ? selectedCategory : '',
        documentTypeId: '',
        notes: '',
        isRequired: false,
        expirationDate: ''
      });
    }
  }, [open, selectedCategory]);

  const selectedDocumentType = documentTypes.find(type => type.id === formData.documentTypeId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.categoryId || !formData.documentTypeId) return;

    try {
      await createDocument.mutateAsync({
        name: formData.name.trim(),
        application_id: applicationId,
        category_id: formData.categoryId,
        document_type_id: formData.documentTypeId,
        status: 'Pending',
        notes: formData.notes.trim() || undefined,
        is_required: selectedDocumentType?.is_required || formData.isRequired,
        requires_signature: selectedDocumentType?.requires_signature || false,
        expiration_date: formData.expirationDate || undefined,
        uploaded_by: 'System', // This could be replaced with actual user info
      });

      onOpenChange(false);
    } catch (error) {
      // Error is handled by the mutation hook's onError callback
      console.error('Failed to create document:', error);
    }
  };

  const getCategoryById = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Document</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="document-name">Document Name</Label>
            <Input
              id="document-name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter document name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="document-category">Document Category</Label>
            <Select 
              value={formData.categoryId} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                {categoriesLoading ? (
                  <div className="flex items-center justify-center p-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="ml-2">Loading categories...</span>
                  </div>
                ) : (
                  categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex flex-col">
                        <span>{category.name}</span>
                        {category.description && (
                          <span className="text-xs text-muted-foreground">{category.description}</span>
                        )}
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {formData.categoryId && getCategoryById(formData.categoryId)?.description && (
              <p className="text-xs text-muted-foreground">
                {getCategoryById(formData.categoryId)?.description}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="document-type">Document Type</Label>
            <Select 
              value={formData.documentTypeId} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, documentTypeId: value }))}
              required
              disabled={!formData.categoryId}
            >
              <SelectTrigger>
                <SelectValue placeholder={
                  !formData.categoryId 
                    ? "Select a category first" 
                    : "Select document type"
                } />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                {typesLoading ? (
                  <div className="flex items-center justify-center p-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="ml-2">Loading types...</span>
                  </div>
                ) : documentTypes.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground">
                    No document types available for this category
                  </div>
                ) : (
                  documentTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span>{type.name}</span>
                          {type.is_required && (
                            <span className="text-xs bg-red-100 text-red-800 px-1 rounded">Required</span>
                          )}
                          {type.requires_signature && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-1 rounded">Signature</span>
                          )}
                        </div>
                        {type.description && (
                          <span className="text-xs text-muted-foreground">{type.description}</span>
                        )}
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {selectedDocumentType && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1 text-sm">
                  {selectedDocumentType.description && (
                    <p>{selectedDocumentType.description}</p>
                  )}
                  <div className="flex gap-4">
                    {selectedDocumentType.is_required && (
                      <span className="text-red-600">• This document is required</span>
                    )}
                    {selectedDocumentType.requires_signature && (
                      <span className="text-blue-600">• Signature required</span>
                    )}
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="document-notes">Notes (Optional)</Label>
            <Textarea
              id="document-notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes about this document"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiration-date">Expiration Date (Optional)</Label>
            <Input
              id="expiration-date"
              type="date"
              value={formData.expirationDate}
              onChange={(e) => setFormData(prev => ({ ...prev, expirationDate: e.target.value }))}
            />
          </div>

          {/* Only show the manual required toggle if the document type doesn't already require it */}
          {!selectedDocumentType?.is_required && (
            <div className="flex items-center space-x-2">
              <Switch
                id="is-required"
                checked={formData.isRequired}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isRequired: checked }))}
              />
              <Label htmlFor="is-required">Mark as required document</Label>
            </div>
          )}

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={createDocument.isPending}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={
                !formData.name.trim() || 
                !formData.categoryId || 
                !formData.documentTypeId || 
                createDocument.isPending
              }
            >
              {createDocument.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                'Add Document'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDocumentModal;