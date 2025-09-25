import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Plus, FileText, FolderOpen, File, Trash2, Edit } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useDocumentCategories, useDocumentTypes, useDocumentAcceptableFiles, useCreateDocumentCategory, useUpdateDocumentCategory, useDeleteDocumentCategory, useCreateDocumentType, useUpdateDocumentType, useDeleteDocumentType, useCreateAcceptableFile, useUpdateAcceptableFile, useDeleteAcceptableFile, DocumentCategory, DocumentType, DocumentAcceptableFile } from '@/hooks/useDocumentConfiguration';
import { useDocumentTemplates } from '@/hooks/useDocumentTemplates';
import { MultiSelect } from '@/components/ui/multi-select';
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog';
import SectionHeader from '@/components/dashboard/SectionHeader';
import { DocumentTemplatesSection } from '@/components/documents/DocumentTemplatesSection';
const DocumentConfiguration: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeItem, setActiveItem] = useState('Document Configuration');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDocumentType, setSelectedDocumentType] = useState<string | null>(null);
  const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false);
  const [isCreateTypeOpen, setIsCreateTypeOpen] = useState(false);
  const [isCreateFileOpen, setIsCreateFileOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<DocumentCategory | null>(null);
  const [editingType, setEditingType] = useState<DocumentType | null>(null);
  const [editingFile, setEditingFile] = useState<DocumentAcceptableFile | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<string | null>(null);
  const [deletingType, setDeletingType] = useState<string | null>(null);
  const [deletingFile, setDeletingFile] = useState<string | null>(null);
  const {
    toast
  } = useToast();
  const {
    data: categories = [],
    isLoading: categoriesLoading
  } = useDocumentCategories();
  const {
    data: documentTypes = []
  } = useDocumentTypes(selectedCategory);
  const {
    data: acceptableFiles = []
  } = useDocumentAcceptableFiles(selectedDocumentType);
  const {
    data: templates = []
  } = useDocumentTemplates();
  const createCategoryMutation = useCreateDocumentCategory();
  const updateCategoryMutation = useUpdateDocumentCategory();
  const deleteCategoryMutation = useDeleteDocumentCategory();
  const createTypeMutation = useCreateDocumentType();
  const updateTypeMutation = useUpdateDocumentType();
  const deleteTypeMutation = useDeleteDocumentType();
  const createFileMutation = useCreateAcceptableFile();
  const updateFileMutation = useUpdateAcceptableFile();
  const deleteFileMutation = useDeleteAcceptableFile();
  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);
  const selectedTypeData = documentTypes.find(type => type.id === selectedDocumentType);

  // Get template information for the selected document type
  const getTemplateInfo = () => {
    if (!selectedTypeData) return null;
    if (selectedTypeData.template_id) {
      const template = templates.find(t => t.id === selectedTypeData.template_id);
      return template ? {
        type: template.template_type,
        id: template.template_id,
        name: template.name
      } : null;
    }
    if (selectedTypeData.docusign_template_id) {
      return {
        type: 'docusign',
        id: selectedTypeData.docusign_template_id,
        name: 'DocuSign Template'
      };
    }
    return null;
  };
  const templateInfo = getTemplateInfo();
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedDocumentType(null);
  };
  const handleTypeSelect = (typeId: string) => {
    setSelectedDocumentType(typeId);
  };
  return <div className="h-screen flex flex-col bg-gray-50">
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar open={sidebarOpen} activeItem={activeItem} setActiveItem={setActiveItem} />
        <main className="flex-1 overflow-auto p-4">
          <div className="container mx-auto px-4 py-6 space-y-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold">Document Configuration</h1>
                <p className="text-muted-foreground">
                  Manage document templates, categories, types, and acceptable file formats
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">

              <div className="grid grid-cols-12 gap-6">
                {/* Categories List */}
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 justify-between">
                      <div className="flex items-center gap-2 text-sm">
                        <FolderOpen className="h-5 w-5" />
                        Categories
                      </div>
                      <Dialog open={isCreateCategoryOpen} onOpenChange={setIsCreateCategoryOpen}>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Plus className="h-3 w-3 mr-1" />
                            Add Category
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Create Document Category</DialogTitle>
                            <DialogDescription>
                              Add a new document category with its configuration
                            </DialogDescription>
                          </DialogHeader>
                          <CategoryForm onSubmit={data => {
                          createCategoryMutation.mutate(data as Omit<DocumentCategory, 'id' | 'created_at' | 'updated_at'>);
                          setIsCreateCategoryOpen(false);
                        }} isLoading={createCategoryMutation.isPending} />
                        </DialogContent>
                      </Dialog>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                     {categoriesLoading ? <div className="space-y-2">
                         {[...Array(3)].map((_, i) => <div key={i} className="h-12 bg-muted animate-pulse rounded" />)}
                       </div> : categories.map(category => <div key={category.id} className={`group p-3 rounded-md cursor-pointer transition-colors ${selectedCategory === category.id ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`} onClick={() => handleCategorySelect(category.id)}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <FolderOpen className="h-4 w-4" />
                                <div className="flex flex-col gap-1">
                                  <span className="font-medium text-sm">{category.name}</span>
                                  {category.allowed_teams && category.allowed_teams.length > 0 && <div className="flex gap-1 flex-wrap">
                                      {category.allowed_teams.map(team => {
                              const teamOption = TEAM_OPTIONS.find(opt => opt.value === team);
                              return <Badge key={team} variant="outline" className="text-xs h-4 px-1 py-0">
                                            {teamOption?.label || team}
                                          </Badge>;
                            })}
                                    </div>}
                                </div>
                              </div>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button size="sm" variant="ghost" onClick={e => {
                          e.stopPropagation();
                          setEditingCategory(category);
                        }} className="h-6 w-6 p-0">
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="ghost" onClick={e => {
                          e.stopPropagation();
                          setDeletingCategory(category.id);
                        }} className="h-6 w-6 p-0 text-destructive">
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                         </div>)}
                  </CardContent>
                </Card>

                {/* Document Types */}
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 justify-between">
                      <div className="flex items-center gap-2 text-sm">
                        <FileText className="h-5 w-5" />
                        Document Types
                      </div>
                      {selectedCategory && <Dialog open={isCreateTypeOpen} onOpenChange={setIsCreateTypeOpen}>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <Plus className="h-3 w-3 mr-1" />
                              Add Type
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Create Document Type</DialogTitle>
                              <DialogDescription>
                                Add a new document type under {selectedCategoryData?.name}
                              </DialogDescription>
                            </DialogHeader>
                            <DocumentTypeForm categoryId={selectedCategory} onSubmit={data => {
                          createTypeMutation.mutate(data);
                          setIsCreateTypeOpen(false);
                        }} isLoading={createTypeMutation.isPending} />
                          </DialogContent>
                        </Dialog>}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {selectedCategory ? documentTypes.length > 0 ? documentTypes.map(type => <div key={type.id} className={`group p-3 rounded-md cursor-pointer transition-colors ${selectedDocumentType === type.id ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`} onClick={() => handleTypeSelect(type.id)}>
                             <div className="flex items-center justify-between">
                                 <div className="flex items-center gap-2">
                                   <FileText className="h-4 w-4" />
                                   <span className="font-medium text-sm">{type.name}</span>
                                   {type.template_id && <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                                       Template
                                     </Badge>}
                                   {/* Backward compatibility for legacy DocuSign template IDs */}
                                   {!type.template_id && type.docusign_template_id && <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                                       DocuSign
                                     </Badge>}
                                 </div>
                               <div className="flex items-center gap-2">
                                 {type.is_required && <Badge variant="secondary" className="text-xs">Required</Badge>}
                                 <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                   <Button size="sm" variant="ghost" onClick={e => {
                            e.stopPropagation();
                            setEditingType(type);
                          }} className="h-6 w-6 p-0">
                                     <Edit className="h-3 w-3" />
                                   </Button>
                                   <Button size="sm" variant="ghost" onClick={e => {
                            e.stopPropagation();
                            setDeletingType(type.id);
                          }} className="h-6 w-6 p-0 text-destructive">
                                     <Trash2 className="h-3 w-3" />
                                   </Button>
                                 </div>
                               </div>
                             </div>
                           </div>) : <div className="text-center py-8 text-muted-foreground">
                          <FileText className="h-8 w-8 mx-auto mb-2" />
                          <p className="text-sm">No document types</p>
                        </div> : <div className="text-center py-8 text-muted-foreground">
                        <p className="text-sm">Select a category first</p>
                      </div>}
                  </CardContent>
                </Card>

                {/* Acceptable Files */}
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 justify-between">
                      <div className="flex items-center gap-2 text-sm">
                        <File className="h-5 w-5" />
                        Acceptable Files
                      </div>
                      {selectedDocumentType && !(selectedTypeData?.template_id || selectedTypeData?.docusign_template_id) && <Dialog open={isCreateFileOpen} onOpenChange={setIsCreateFileOpen}>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" className="text-xs px-2">
                              <Plus className="h-3 w-3 mr-1" />
                              Add
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Add Acceptable File Type</DialogTitle>
                              <DialogDescription>
                                Add an acceptable file type for {selectedTypeData?.name}
                              </DialogDescription>
                            </DialogHeader>
                            <AcceptableFileForm documentTypeId={selectedDocumentType} onSubmit={data => {
                          createFileMutation.mutate(data);
                          setIsCreateFileOpen(false);
                        }} isLoading={createFileMutation.isPending} />
                          </DialogContent>
                        </Dialog>}
                    </CardTitle>
                  </CardHeader>
                    <CardContent className="space-y-2">
                       {selectedDocumentType ? templateInfo ? <div className="p-3 rounded-md bg-blue-50 border border-blue-200">
                            <div className="flex items-center gap-2 mb-2">
                              <svg className="h-4 w-4 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="font-medium text-blue-900 text-sm">
                                {templateInfo.type === 'lucid_html' ? 'Lucid HTML Template' : 'DocuSign Template'}
                              </span>
                            </div>
                            <p className="text-blue-800 text-sm font-mono bg-blue-100 px-2 py-1 rounded">
                              {templateInfo.id}
                            </p>
                            <p className="text-blue-700 text-xs mt-2">
                              {templateInfo.type === 'lucid_html' ? 'This document uses Lucid HTML templates for document generation. File type restrictions are managed by the template system.' : 'This document uses DocuSign for electronic signing. File type restrictions are managed by DocuSign.'}
                            </p>
                          </div> : acceptableFiles.length > 0 ? acceptableFiles.map(file => <div key={file.id} className="group p-2 rounded-md bg-muted flex flex-col gap-1">
                               <div className="flex items-center justify-between">
                                 <div className="flex items-center gap-1">
                                   <File className="h-3 w-3 flex-shrink-0" />
                                   <span className="font-medium text-sm truncate">{file.file_extension}</span>
                                 </div>
                                 <div className="flex gap-1 flex-shrink-0">
                                   <Button size="sm" variant="ghost" onClick={() => setEditingFile(file)} className="h-5 w-5 p-0">
                                     <Edit className="h-2.5 w-2.5" />
                                   </Button>
                                   <Button size="sm" variant="ghost" onClick={() => setDeletingFile(file.id)} className="h-5 w-5 p-0 text-destructive">
                                     <Trash2 className="h-2.5 w-2.5" />
                                   </Button>
                                 </div>
                               </div>
                               <Badge variant="outline" className="text-xs w-fit">
                                 {file.max_file_size_mb}MB max
                               </Badge>
                              </div>) : <div className="text-center py-8 text-muted-foreground">
                           <File className="h-8 w-8 mx-auto mb-2" />
                           <p className="text-sm">No acceptable file types</p>
                         </div> : <div className="text-center py-8 text-muted-foreground">
                         <p className="text-sm">Select a document type first</p>
                       </div>}
                  </CardContent>
                </Card>
               </div>
             </div>
             
             {/* Document Templates Section */}
             <DocumentTemplatesSection />
           </div>
        </main>
      </div>

      {/* Edit Category Dialog */}
      {editingCategory && <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Document Category</DialogTitle>
              <DialogDescription>
                Update the category information
              </DialogDescription>
            </DialogHeader>
            <CategoryForm category={editingCategory} onSubmit={data => {
          updateCategoryMutation.mutate({
            id: editingCategory.id,
            ...data
          });
          setEditingCategory(null);
        }} isLoading={updateCategoryMutation.isPending} />
          </DialogContent>
        </Dialog>}

      {/* Edit Document Type Dialog */}
      {editingType && <Dialog open={!!editingType} onOpenChange={() => setEditingType(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Document Type</DialogTitle>
              <DialogDescription>
                Update the document type information
              </DialogDescription>
            </DialogHeader>
            <DocumentTypeForm categoryId={editingType.category_id} documentType={editingType} onSubmit={data => {
          updateTypeMutation.mutate({
            id: editingType.id,
            ...data
          });
          setEditingType(null);
        }} isLoading={updateTypeMutation.isPending} />
          </DialogContent>
        </Dialog>}

      {/* Edit Acceptable File Dialog */}
      {editingFile && <Dialog open={!!editingFile} onOpenChange={() => setEditingFile(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Acceptable File Type</DialogTitle>
              <DialogDescription>
                Update the acceptable file type information
              </DialogDescription>
            </DialogHeader>
            <AcceptableFileForm documentTypeId={editingFile.document_type_id} acceptableFile={editingFile} onSubmit={data => {
          updateFileMutation.mutate({
            id: editingFile.id,
            ...data
          });
          setEditingFile(null);
        }} isLoading={updateFileMutation.isPending} />
          </DialogContent>
        </Dialog>}

      {/* Delete Confirmation Dialogs */}
      <DeleteConfirmationDialog open={!!deletingCategory} onOpenChange={() => setDeletingCategory(null)} onConfirm={() => {
      if (deletingCategory) {
        deleteCategoryMutation.mutate(deletingCategory);
        setDeletingCategory(null);
      }
    }} title="Delete Document Category" description={(() => {
      const categoryToDelete = categories.find(cat => cat.id === deletingCategory);
      const associatedTypes = documentTypes.filter(type => type.category_id === deletingCategory);
      return `Are you sure you want to delete "${categoryToDelete?.name}"? This will also permanently delete ${associatedTypes.length} document type${associatedTypes.length !== 1 ? 's' : ''} and all associated documents. This action cannot be undone.`;
    })()} />

      <DeleteConfirmationDialog open={!!deletingType} onOpenChange={() => setDeletingType(null)} onConfirm={() => {
      if (deletingType) {
        deleteTypeMutation.mutate(deletingType);
        setDeletingType(null);
      }
    }} title="Delete Document Type" description="Are you sure you want to delete this document type? This action cannot be undone and will also delete all associated acceptable files." />

      <DeleteConfirmationDialog open={!!deletingFile} onOpenChange={() => setDeletingFile(null)} onConfirm={() => {
      if (deletingFile) {
        deleteFileMutation.mutate(deletingFile);
        setDeletingFile(null);
      }
    }} title="Delete Acceptable File Type" description="Are you sure you want to delete this acceptable file type? This action cannot be undone." />
    </div>;
};

// Team options for multi-select
const TEAM_OPTIONS = [{
  value: 'SALES',
  label: 'Sales'
}, {
  value: 'ORDER_OPS',
  label: 'Order Ops'
}, {
  value: 'FS_OPS',
  label: 'FS Ops'
}, {
  value: 'SERVICE',
  label: 'Service'
}, {
  value: 'REMARKETING',
  label: 'Remarketing'
}];

// Category Form Component
const CategoryForm: React.FC<{
  category?: DocumentCategory;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}> = ({
  category,
  onSubmit,
  isLoading
}) => {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    description: category?.description || '',
    icon: category?.icon || 'FileText',
    allowed_teams: category?.allowed_teams || []
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  return <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Category Name</Label>
          <Input id="name" value={formData.name} onChange={e => setFormData(prev => ({
          ...prev,
          name: e.target.value
        }))} placeholder="Enter category name" required />
        </div>
        
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" value={formData.description} onChange={e => setFormData(prev => ({
        ...prev,
        description: e.target.value
      }))} placeholder="Enter category description" rows={3} />
      </div>

      <div>
        <Label htmlFor="teams">Owner</Label>
        <MultiSelect options={TEAM_OPTIONS} selected={formData.allowed_teams} onChange={teams => setFormData(prev => ({
        ...prev,
        allowed_teams: teams
      }))} placeholder="Select teams that can manage this category" className="w-full" />
        <p className="text-sm text-muted-foreground mt-1">
          If no teams are selected, all teams with document access can manage this category
        </p>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : category ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>;
};

// Document Type Form Component
const DocumentTypeForm: React.FC<{
  categoryId: string;
  documentType?: DocumentType;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}> = ({
  categoryId,
  documentType,
  onSubmit,
  isLoading
}) => {
  const {
    data: templates = []
  } = useDocumentTemplates();
  const [formData, setFormData] = useState({
    name: documentType?.name || '',
    description: documentType?.description || '',
    is_required: documentType?.is_required || false,
    requires_signature: documentType?.requires_signature || false,
    is_internal_only: documentType?.is_internal_only || false,
    product_types: documentType?.product_types || [],
    sort_order: documentType?.sort_order || 0,
    template_id: documentType?.template_id || '',
    category_id: categoryId
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  return <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Type Name</Label>
          <Input id="name" value={formData.name} onChange={e => setFormData(prev => ({
          ...prev,
          name: e.target.value
        }))} placeholder="Enter document type name" required />
        </div>
        
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" value={formData.description} onChange={e => setFormData(prev => ({
        ...prev,
        description: e.target.value
      }))} placeholder="Enter document type description" rows={3} />
      </div>

      <div>
        <Label htmlFor="template">Document Template</Label>
        <Select value={formData.template_id || "no-template"} onValueChange={value => setFormData(prev => ({
        ...prev,
        template_id: value === "no-template" ? "" : value
      }))}>
          <SelectTrigger>
            <SelectValue placeholder="Select a template (optional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="no-template">No template</SelectItem>
            {templates.map(template => <SelectItem key={template.id} value={template.id}>
                <div className="flex items-center gap-2">
                  <span>{template.name}</span>
                  <Badge variant={template.template_type === 'docusign' ? 'default' : 'secondary'} className="text-xs">
                    {template.template_type === 'docusign' ? 'DocuSign' : 'HTML'}
                  </Badge>
                  <code className="text-xs text-muted-foreground">({template.template_id})</code>
                </div>
              </SelectItem>)}
          </SelectContent>
        </Select>
        {formData.template_id && <p className="text-sm text-muted-foreground mt-1">
            Note: When a template is selected, file type restrictions will be managed by the template.
          </p>}
      </div>

      <div>
        <Label>Product Types</Label>
        <div className="grid grid-cols-3 gap-4 mt-2">
          {['Cash', 'Loan', 'Lease'].map(productType => <div key={productType} className="flex items-center space-x-2">
              <Checkbox id={`product_type_${productType}`} checked={formData.product_types.includes(productType)} onCheckedChange={checked => {
            if (checked) {
              setFormData(prev => ({
                ...prev,
                product_types: [...prev.product_types, productType]
              }));
            } else {
              setFormData(prev => ({
                ...prev,
                product_types: prev.product_types.filter(type => type !== productType)
              }));
            }
          }} />
              <Label htmlFor={`product_type_${productType}`}>{productType}</Label>
            </div>)}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center space-x-2">
          <Switch id="is_required" checked={formData.is_required} onCheckedChange={checked => setFormData(prev => ({
          ...prev,
          is_required: checked
        }))} />
          <Label htmlFor="is_required">Mandatory</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch id="requires_signature" checked={formData.requires_signature} onCheckedChange={checked => setFormData(prev => ({
          ...prev,
          requires_signature: checked
        }))} />
          <Label htmlFor="requires_signature">Requires Signature</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch id="is_internal_only" checked={formData.is_internal_only} onCheckedChange={checked => setFormData(prev => ({
          ...prev,
          is_internal_only: checked
        }))} />
          <Label htmlFor="is_internal_only">Internal Only</Label>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : documentType ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>;
};

// Common file format options
const FILE_FORMAT_OPTIONS = [
  { value: '.pdf', label: 'PDF (.pdf)' },
  { value: '.jpg', label: 'JPEG (.jpg)' },
  { value: '.jpeg', label: 'JPEG (.jpeg)' },
  { value: '.png', label: 'PNG (.png)' },
  { value: '.gif', label: 'GIF (.gif)' },
  { value: '.webp', label: 'WebP (.webp)' },
  { value: '.doc', label: 'Word 97-2003 (.doc)' },
  { value: '.docx', label: 'Word (.docx)' },
  { value: '.xls', label: 'Excel 97-2003 (.xls)' },
  { value: '.xlsx', label: 'Excel (.xlsx)' },
  { value: '.ppt', label: 'PowerPoint 97-2003 (.ppt)' },
  { value: '.pptx', label: 'PowerPoint (.pptx)' },
  { value: '.txt', label: 'Text (.txt)' },
  { value: '.csv', label: 'CSV (.csv)' },
  { value: '.zip', label: 'ZIP Archive (.zip)' },
  { value: '.rar', label: 'RAR Archive (.rar)' },
  { value: '.mp3', label: 'MP3 Audio (.mp3)' },
  { value: '.mp4', label: 'MP4 Video (.mp4)' },
  { value: '.avi', label: 'AVI Video (.avi)' },
  { value: '.mov', label: 'QuickTime (.mov)' }
];

// Acceptable File Form Component
const AcceptableFileForm: React.FC<{
  documentTypeId: string;
  acceptableFile?: DocumentAcceptableFile;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}> = ({
  documentTypeId,
  acceptableFile,
  onSubmit,
  isLoading
}) => {
  const [formData, setFormData] = useState({
    file_extension: acceptableFile?.file_extension ? [acceptableFile.file_extension] : [],
    max_file_size_mb: acceptableFile?.max_file_size_mb || 10,
    document_type_id: documentTypeId
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Submit each file extension as a separate entry
    formData.file_extension.forEach(extension => {
      onSubmit({
        ...formData,
        file_extension: extension
      });
    });
  };
  return <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="file_extension">File Extensions</Label>
          <MultiSelect
            options={FILE_FORMAT_OPTIONS}
            selected={formData.file_extension}
            onChange={(extensions) => setFormData(prev => ({
              ...prev,
              file_extension: extensions
            }))}
            placeholder="Select file extensions"
            className="w-full"
          />
        </div>
        <div>
          <Label htmlFor="max_file_size_mb">Max Size (MB)</Label>
          <Input id="max_file_size_mb" type="number" value={formData.max_file_size_mb} onChange={e => setFormData(prev => ({
          ...prev,
          max_file_size_mb: parseInt(e.target.value) || 10
        }))} placeholder="10" min="1" />
        </div>
      </div>


      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : acceptableFile ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>;
};
export default DocumentConfiguration;