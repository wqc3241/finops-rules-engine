import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { DocumentItem, DocumentCategory, DocumentCategoryInfo } from '@/types/application/documents';

interface AddDocumentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddDocument: (document: DocumentItem) => void;
  categories: DocumentCategoryInfo[];
  selectedCategory?: DocumentCategory | 'all';
}

const AddDocumentModal: React.FC<AddDocumentModalProps> = ({
  open,
  onOpenChange,
  onAddDocument,
  categories,
  selectedCategory,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    category: selectedCategory && selectedCategory !== 'all' ? selectedCategory : '',
    notes: '',
    isRequired: false,
    expirationDate: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.type.trim() || !formData.category) return;

    const newDocument: DocumentItem = {
      id: `doc_${Date.now()}`,
      name: formData.name,
      type: formData.type,
      category: formData.category as DocumentCategory,
      status: 'not_submitted',
      isRequired: formData.isRequired,
      notes: formData.notes || undefined,
      expirationDate: formData.expirationDate || undefined
    };

    onAddDocument(newDocument);
    
    // Reset form
    setFormData({
      name: '',
      type: '',
      category: selectedCategory && selectedCategory !== 'all' ? selectedCategory : '',
      notes: '',
      isRequired: false,
      expirationDate: ''
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
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
            <Label htmlFor="document-type">Document Type</Label>
            <Input
              id="document-type"
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              placeholder="e.g., PDF, Image, Word Document"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="document-category">Category</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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

          <div className="flex items-center space-x-2">
            <Switch
              id="is-required"
              checked={formData.isRequired}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isRequired: checked }))}
            />
            <Label htmlFor="is-required">Required document</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Add Document
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDocumentModal;