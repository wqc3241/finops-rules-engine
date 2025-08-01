import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { DocumentCategoryInfo } from '@/types/application/documents';
import { 
  FileText, 
  Car, 
  User, 
  AlertCircle, 
  Shield, 
  Folder,
  Plus
} from 'lucide-react';

interface AddDocumentCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddCategory: (category: DocumentCategoryInfo) => void;
}

const iconOptions = [
  { value: 'FileText', label: 'File Text', icon: FileText },
  { value: 'Car', label: 'Car', icon: Car },
  { value: 'User', label: 'User', icon: User },
  { value: 'AlertCircle', label: 'Alert Circle', icon: AlertCircle },
  { value: 'Shield', label: 'Shield', icon: Shield },
  { value: 'Folder', label: 'Folder', icon: Folder },
  { value: 'Plus', label: 'Plus', icon: Plus },
];

const AddDocumentCategoryModal: React.FC<AddDocumentCategoryModalProps> = ({
  open,
  onOpenChange,
  onAddCategory,
}) => {
  const [formData, setFormData] = useState({
    label: '',
    description: '',
    icon: 'Folder'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.label.trim()) return;

    const newCategory: DocumentCategoryInfo = {
      id: formData.label.toLowerCase().replace(/\s+/g, '_') as any,
      label: formData.label,
      description: formData.description,
      icon: formData.icon
    };

    onAddCategory(newCategory);
    
    // Reset form
    setFormData({
      label: '',
      description: '',
      icon: 'Folder'
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Document Category</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category-label">Category Name</Label>
            <Input
              id="category-label"
              value={formData.label}
              onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
              placeholder="Enter category name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category-description">Description</Label>
            <Textarea
              id="category-description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter category description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Icon</Label>
            <div className="grid grid-cols-4 gap-2">
              {iconOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, icon: option.value }))}
                    className={`p-3 rounded-lg border transition-all flex flex-col items-center gap-1 ${
                      formData.icon === option.value
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background hover:bg-muted border-border'
                    }`}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span className="text-xs">{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Add Category
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDocumentCategoryModal;