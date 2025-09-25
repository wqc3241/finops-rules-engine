import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useCreateDocumentTemplate, useUpdateDocumentTemplate, CreateDocumentTemplateData } from '@/hooks/useDocumentTemplates';

interface DocumentTemplate {
  id: string;
  name: string;
  template_type: 'docusign' | 'lucid_html';
  description?: string;
  docusign_template_id?: string;
  template_content?: string;
  template_id: string;
}

interface CreateTemplateModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  template?: DocumentTemplate; // For editing mode
  mode?: 'create' | 'edit';
}

export function CreateTemplateModal({ 
  open, 
  onOpenChange, 
  trigger, 
  template, 
  mode = 'create' 
}: CreateTemplateModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<CreateDocumentTemplateData>({
    name: template?.name || '',
    template_type: template?.template_type || 'docusign',
    description: template?.description || '',
    docusign_template_id: template?.docusign_template_id || '',
    template_content: template?.template_content || ''
  });

  const createTemplate = useCreateDocumentTemplate();
  const updateTemplate = useUpdateDocumentTemplate();

  // Update form data when template changes (for edit mode)
  useEffect(() => {
    if (template && mode === 'edit') {
      setFormData({
        name: template.name,
        template_type: template.template_type,
        description: template.description || '',
        docusign_template_id: template.docusign_template_id || '',
        template_content: template.template_content || ''
      });
    }
  }, [template, mode]);

  const handleOpenChange = (newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen);
    } else {
      setIsOpen(newOpen);
    }
    
    if (!newOpen) {
      // Reset form when closing (only for create mode)
      if (mode === 'create') {
        setFormData({
          name: '',
          template_type: 'docusign',
          description: '',
          docusign_template_id: '',
          template_content: ''
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      return;
    }

    const submitData: CreateDocumentTemplateData = {
      name: formData.name.trim(),
      template_type: formData.template_type,
      description: formData.description?.trim() || undefined,
    };

    if (formData.template_type === 'docusign') {
      submitData.docusign_template_id = formData.docusign_template_id?.trim() || undefined;
    } else {
      submitData.template_content = formData.template_content?.trim() || undefined;
    }

    try {
      if (mode === 'edit' && template) {
        await updateTemplate.mutateAsync({
          id: template.id,
          data: submitData
        });
      } else {
        await createTemplate.mutateAsync(submitData);
      }
      handleOpenChange(false);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const isLoading = mode === 'edit' ? updateTemplate.isPending : createTemplate.isPending;
  const isControlled = open !== undefined && onOpenChange !== undefined;
  const modalOpen = isControlled ? open : isOpen;

  return (
    <Dialog open={modalOpen} onOpenChange={handleOpenChange}>
      {trigger ? (
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Create Template
          </Button>
        </DialogTrigger>
      )}
      
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'edit' ? 'Edit Document Template' : 'Create Document Template'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Template Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter template name"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="template_type">Template Type *</Label>
              <Select
                value={formData.template_type}
                onValueChange={(value: 'docusign' | 'lucid_html') => 
                  setFormData(prev => ({ ...prev, template_type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="docusign">DocuSign</SelectItem>
                  <SelectItem value="lucid_html">Lucid HTML</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter template description"
              rows={3}
            />
          </div>

          {formData.template_type === 'docusign' ? (
            <div>
              <Label htmlFor="docusign_template_id">DocuSign Template ID</Label>
              <Input
                id="docusign_template_id"
                value={formData.docusign_template_id}
                onChange={(e) => setFormData(prev => ({ ...prev, docusign_template_id: e.target.value }))}
                placeholder="Enter DocuSign template ID"
              />
            </div>
          ) : (
            <div>
              <Label htmlFor="template_content">HTML Content</Label>
              <Textarea
                id="template_content"
                value={formData.template_content}
                onChange={(e) => setFormData(prev => ({ ...prev, template_content: e.target.value }))}
                placeholder="Enter HTML template content"
                rows={8}
                className="font-mono text-sm"
              />
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !formData.name.trim()}>
              {isLoading 
                ? (mode === 'edit' ? 'Updating...' : 'Creating...') 
                : (mode === 'edit' ? 'Update Template' : 'Create Template')
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}