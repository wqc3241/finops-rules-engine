import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Edit, Trash2, FileText, Code } from 'lucide-react';
import { useDocumentTemplates, useDeleteDocumentTemplate, useTemplateUsage, DocumentTemplate } from '@/hooks/useDocumentTemplates';
import { CreateTemplateModal } from './CreateTemplateModal';
import { format } from 'date-fns';

export function DocumentTemplatesSection() {
  const { data: templates, isLoading } = useDocumentTemplates();
  const deleteTemplate = useDeleteDocumentTemplate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<DocumentTemplate | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const { data: templateUsage } = useTemplateUsage(templateToDelete || '');

  const handleDeleteClick = (templateId: string) => {
    setTemplateToDelete(templateId);
    setDeleteDialogOpen(true);
  };

  const handleEditClick = (template: DocumentTemplate) => {
    setEditingTemplate(template);
    setEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setEditingTemplate(null);
  };

  const handleConfirmDelete = async () => {
    if (templateToDelete) {
      try {
        await deleteTemplate.mutateAsync(templateToDelete);
        setDeleteDialogOpen(false);
        setTemplateToDelete(null);
      } catch (error) {
        // Error handling is done in the hook
      }
    }
  };

  const getTemplateTypeIcon = (type: string) => {
    return type === 'docusign' ? <FileText className="h-4 w-4" /> : <Code className="h-4 w-4" />;
  };

  const getTemplateTypeBadge = (type: string) => {
    return (
      <Badge variant={type === 'docusign' ? 'default' : 'secondary'} className="gap-1">
        {getTemplateTypeIcon(type)}
        {type === 'docusign' ? 'DocuSign' : 'Lucid HTML'}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Document Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">Loading templates...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Document Templates</CardTitle>
          <CreateTemplateModal />
        </CardHeader>
        <CardContent>
          {!templates || templates.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No templates created</h3>
              <p className="text-muted-foreground mb-4">
                Create your first document template to get started.
              </p>
              <CreateTemplateModal trigger={
                <Button>
                  <FileText className="h-4 w-4 mr-2" />
                  Create Your First Template
                </Button>
              } />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Template ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell className="font-medium">{template.name}</TableCell>
                      <TableCell>
                        <code className="bg-muted px-2 py-1 rounded font-mono text-sm">
                          {template.template_id}
                        </code>
                      </TableCell>
                      <TableCell>
                        {getTemplateTypeBadge(template.template_type)}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {template.description || '-'}
                      </TableCell>
                      <TableCell>
                        {format(new Date(template.created_at), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 w-8 p-0"
                            onClick={() => handleEditClick(template)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            onClick={() => handleDeleteClick(template.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Template Modal */}
      <CreateTemplateModal
        open={editModalOpen}
        onOpenChange={handleEditModalClose}
        template={editingTemplate}
        mode="edit"
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Template</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this template? This action cannot be undone.
              {templateUsage && templateUsage.length > 0 && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="font-medium text-yellow-800">Warning:</p>
                  <p className="text-yellow-700">
                    This template is currently being used by {templateUsage.length} document type(s):
                  </p>
                  <ul className="list-disc list-inside text-yellow-700 mt-1">
                    {templateUsage.map((docType) => (
                      <li key={docType.id}>{docType.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Template
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}