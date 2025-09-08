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
import { 
  useDocumentCategories,
  useDocumentTypes,
  useDocumentAcceptableFiles,
  useCreateDocumentCategory,
  useUpdateDocumentCategory,
  useDeleteDocumentCategory,
  useCreateDocumentType,
  useUpdateDocumentType,
  useDeleteDocumentType,
  useCreateAcceptableFile,
  useUpdateAcceptableFile,
  useDeleteAcceptableFile,
  DocumentCategory,
  DocumentType,
  DocumentAcceptableFile
} from '@/hooks/useDocumentConfiguration';
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog';

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
  const { toast } = useToast();

  const { data: categories = [], isLoading: categoriesLoading } = useDocumentCategories();
  const { data: documentTypes = [] } = useDocumentTypes(selectedCategory);
  const { data: acceptableFiles = [] } = useDocumentAcceptableFiles(selectedDocumentType);

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

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedDocumentType(null);
  };

  const handleTypeSelect = (typeId: string) => {
    setSelectedDocumentType(typeId);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          open={sidebarOpen}
          activeItem={activeItem}
          setActiveItem={setActiveItem} 
        />
        <main className="flex-1 overflow-auto p-4">
          <div className="container mx-auto px-4 py-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold">Document Configuration</h1>
                  <p className="text-muted-foreground">
                    Configure document categories, types, and acceptable file formats
                  </p>
                </div>
                <Dialog open={isCreateCategoryOpen} onOpenChange={setIsCreateCategoryOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
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
                    <CategoryForm 
                      onSubmit={(data) => {
                        createCategoryMutation.mutate(data as Omit<DocumentCategory, 'id' | 'created_at' | 'updated_at'>);
                        setIsCreateCategoryOpen(false);
                      }}
                      isLoading={createCategoryMutation.isPending}
                    />
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-12 gap-6">
                {/* Categories List */}
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FolderOpen className="h-5 w-5" />
                      Categories
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                     {categoriesLoading ? (
                       <div className="space-y-2">
                         {[...Array(3)].map((_, i) => (
                           <div key={i} className="h-12 bg-muted animate-pulse rounded" />
                         ))}
                       </div>
                     ) : (
                       categories.map((category) => (
                         <div
                           key={category.id}
                           className={`group p-3 rounded-md cursor-pointer transition-colors ${
                             selectedCategory === category.id
                               ? 'bg-primary text-primary-foreground'
                               : 'bg-muted hover:bg-muted/80'
                           }`}
                           onClick={() => handleCategorySelect(category.id)}
                         >
                           <div className="flex items-center justify-between">
                             <div className="flex items-center gap-2">
                               <FolderOpen className="h-4 w-4" />
                               <span className="font-medium text-sm">{category.name}</span>
                             </div>
                             <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                               <Button
                                 size="sm"
                                 variant="ghost"
                                 onClick={(e) => {
                                   e.stopPropagation();
                                   setEditingCategory(category);
                                 }}
                                 className="h-6 w-6 p-0"
                               >
                                 <Edit className="h-3 w-3" />
                               </Button>
                               <Button
                                 size="sm"
                                 variant="ghost"
                                 onClick={(e) => {
                                   e.stopPropagation();
                                   setDeletingCategory(category.id);
                                 }}
                                 className="h-6 w-6 p-0 text-destructive"
                               >
                                 <Trash2 className="h-3 w-3" />
                               </Button>
                             </div>
                           </div>
                         </div>
                       ))
                     )}
                  </CardContent>
                </Card>

                {/* Document Types */}
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Document Types
                      </div>
                      {selectedCategory && (
                        <Dialog open={isCreateTypeOpen} onOpenChange={setIsCreateTypeOpen}>
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
                            <DocumentTypeForm 
                              categoryId={selectedCategory}
                              onSubmit={(data) => {
                                createTypeMutation.mutate(data);
                                setIsCreateTypeOpen(false);
                              }}
                              isLoading={createTypeMutation.isPending}
                            />
                          </DialogContent>
                        </Dialog>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {selectedCategory ? (
                      documentTypes.length > 0 ? (
                         documentTypes.map((type) => (
                           <div
                             key={type.id}
                             className={`group p-3 rounded-md cursor-pointer transition-colors ${
                               selectedDocumentType === type.id
                                 ? 'bg-primary text-primary-foreground'
                                 : 'bg-muted hover:bg-muted/80'
                             }`}
                             onClick={() => handleTypeSelect(type.id)}
                           >
                             <div className="flex items-center justify-between">
                               <div className="flex items-center gap-2">
                                 <FileText className="h-4 w-4" />
                                 <span className="font-medium text-sm">{type.name}</span>
                               </div>
                               <div className="flex items-center gap-2">
                                 {type.is_required && (
                                   <Badge variant="secondary" className="text-xs">Required</Badge>
                                 )}
                                 <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                   <Button
                                     size="sm"
                                     variant="ghost"
                                     onClick={(e) => {
                                       e.stopPropagation();
                                       setEditingType(type);
                                     }}
                                     className="h-6 w-6 p-0"
                                   >
                                     <Edit className="h-3 w-3" />
                                   </Button>
                                   <Button
                                     size="sm"
                                     variant="ghost"
                                     onClick={(e) => {
                                       e.stopPropagation();
                                       setDeletingType(type.id);
                                     }}
                                     className="h-6 w-6 p-0 text-destructive"
                                   >
                                     <Trash2 className="h-3 w-3" />
                                   </Button>
                                 </div>
                               </div>
                             </div>
                           </div>
                         ))
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <FileText className="h-8 w-8 mx-auto mb-2" />
                          <p className="text-sm">No document types</p>
                        </div>
                      )
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <p className="text-sm">Select a category first</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Acceptable Files */}
                <Card className="col-span-5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 justify-between">
                      <div className="flex items-center gap-2">
                        <File className="h-5 w-5" />
                        Acceptable Files
                      </div>
                      {selectedDocumentType && (
                        <Dialog open={isCreateFileOpen} onOpenChange={setIsCreateFileOpen}>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <Plus className="h-3 w-3 mr-1" />
                              Add File Type
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Add Acceptable File Type</DialogTitle>
                              <DialogDescription>
                                Add an acceptable file type for {selectedTypeData?.name}
                              </DialogDescription>
                            </DialogHeader>
                            <AcceptableFileForm 
                              documentTypeId={selectedDocumentType}
                              onSubmit={(data) => {
                                createFileMutation.mutate(data);
                                setIsCreateFileOpen(false);
                              }}
                              isLoading={createFileMutation.isPending}
                            />
                          </DialogContent>
                        </Dialog>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {selectedDocumentType ? (
                      acceptableFiles.length > 0 ? (
                         acceptableFiles.map((file) => (
                           <div
                             key={file.id}
                             className="group p-3 rounded-md bg-muted flex items-center justify-between"
                           >
                             <div className="flex items-center gap-2">
                               <File className="h-4 w-4" />
                               <span className="font-medium text-sm">{file.file_extension}</span>
                               <Badge variant="outline" className="text-xs">
                                 {file.max_file_size_mb}MB max
                               </Badge>
                             </div>
                             <div className="flex gap-1">
                               <Button
                                 size="sm"
                                 variant="ghost"
                                 onClick={() => setEditingFile(file)}
                                 className="h-6 w-6 p-0"
                               >
                                 <Edit className="h-3 w-3" />
                               </Button>
                               <Button
                                 size="sm"
                                 variant="ghost"
                                 onClick={() => setDeletingFile(file.id)}
                                 className="h-6 w-6 p-0 text-destructive"
                               >
                                 <Trash2 className="h-3 w-3" />
                               </Button>
                             </div>
                           </div>
                         ))
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <File className="h-8 w-8 mx-auto mb-2" />
                          <p className="text-sm">No acceptable file types</p>
                        </div>
                      )
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <p className="text-sm">Select a document type first</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Edit Category Dialog */}
      <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Document Category</DialogTitle>
            <DialogDescription>
              Update the category information
            </DialogDescription>
          </DialogHeader>
          {editingCategory && (
            <CategoryForm 
              category={editingCategory}
              onSubmit={(data) => {
                updateCategoryMutation.mutate({ id: editingCategory.id, ...data });
                setEditingCategory(null);
              }}
              isLoading={updateCategoryMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Document Type Dialog */}
      <Dialog open={!!editingType} onOpenChange={() => setEditingType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Document Type</DialogTitle>
            <DialogDescription>
              Update the document type information
            </DialogDescription>
          </DialogHeader>
          {editingType && (
            <DocumentTypeForm 
              categoryId={editingType.category_id}
              documentType={editingType}
              onSubmit={(data) => {
                updateTypeMutation.mutate({ id: editingType.id, ...data });
                setEditingType(null);
              }}
              isLoading={updateTypeMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Acceptable File Dialog */}
      <Dialog open={!!editingFile} onOpenChange={() => setEditingFile(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Acceptable File Type</DialogTitle>
            <DialogDescription>
              Update the acceptable file type settings
            </DialogDescription>
          </DialogHeader>
          {editingFile && (
            <AcceptableFileForm 
              documentTypeId={editingFile.document_type_id}
              acceptableFile={editingFile}
              onSubmit={(data) => {
                updateFileMutation.mutate({ id: editingFile.id, ...data });
                setEditingFile(null);
              }}
              isLoading={updateFileMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialogs */}
      <DeleteConfirmationDialog
        open={!!deletingCategory}
        onOpenChange={() => setDeletingCategory(null)}
        onConfirm={() => {
          if (deletingCategory) {
            deleteCategoryMutation.mutate(deletingCategory);
            setDeletingCategory(null);
          }
        }}
        title="Delete Document Category"
        description="Are you sure you want to delete this category? This will also delete all associated document types and acceptable files. This action cannot be undone."
      />

      <DeleteConfirmationDialog
        open={!!deletingType}
        onOpenChange={() => setDeletingType(null)}
        onConfirm={() => {
          if (deletingType) {
            deleteTypeMutation.mutate(deletingType);
            setDeletingType(null);
          }
        }}
        title="Delete Document Type"
        description="Are you sure you want to delete this document type? This will also delete all associated acceptable files. This action cannot be undone."
      />

      <DeleteConfirmationDialog
        open={!!deletingFile}
        onOpenChange={() => setDeletingFile(null)}
        onConfirm={() => {
          if (deletingFile) {
            deleteFileMutation.mutate(deletingFile);
            setDeletingFile(null);
          }
        }}
        title="Delete Acceptable File Type"
        description="Are you sure you want to remove this acceptable file type? This action cannot be undone."
      />
    </div>
  );
};

// Category Form Component
const CategoryForm: React.FC<{
  category?: DocumentCategory;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}> = ({ category, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    description: category?.description || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Category Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : category ? 'Update Category' : 'Create Category'}
        </Button>
      </div>
    </form>
  );
};

// Document Type Form Component
const DocumentTypeForm: React.FC<{
  categoryId: string;
  documentType?: DocumentType;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}> = ({ categoryId, documentType, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    category_id: categoryId,
    name: documentType?.name || '',
    description: documentType?.description || '',
    is_required: documentType?.is_required || false,
    requires_signature: documentType?.requires_signature || false,
    is_internal_only: documentType?.is_internal_only || false,
    product_types: documentType?.product_types || [],
    sort_order: documentType?.sort_order || 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Document Type Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="required"
            checked={formData.is_required}
            onCheckedChange={(checked) => setFormData({ ...formData, is_required: checked })}
          />
          <Label htmlFor="required">Required Document</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="signature"
            checked={formData.requires_signature}
            onCheckedChange={(checked) => setFormData({ ...formData, requires_signature: checked })}
          />
          <Label htmlFor="signature">Requires E-Signature</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="internal"
            checked={formData.is_internal_only}
            onCheckedChange={(checked) => setFormData({ ...formData, is_internal_only: checked })}
          />
          <Label htmlFor="internal">Internal Use Only</Label>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Product Types</Label>
        <div className="flex flex-wrap gap-2">
          {['Cash', 'Loan', 'Lease'].map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={type}
                checked={formData.product_types.includes(type)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setFormData({
                      ...formData,
                      product_types: [...formData.product_types, type]
                    });
                  } else {
                    setFormData({
                      ...formData,
                      product_types: formData.product_types.filter(t => t !== type)
                    });
                  }
                }}
              />
              <Label htmlFor={type}>{type}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : documentType ? 'Update Type' : 'Create Type'}
        </Button>
      </div>
    </form>
  );
};

// Acceptable File Form Component
const AcceptableFileForm: React.FC<{
  documentTypeId: string;
  acceptableFile?: DocumentAcceptableFile;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}> = ({ documentTypeId, acceptableFile, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    document_type_id: documentTypeId,
    file_extension: acceptableFile?.file_extension || '',
    max_file_size_mb: acceptableFile?.max_file_size_mb || 10
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const commonExtensions = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.gif', '.txt', '.xlsx', '.csv'];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="extension">File Extension</Label>
        <Select 
          value={formData.file_extension} 
          onValueChange={(value) => setFormData({ ...formData, file_extension: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select file extension" />
          </SelectTrigger>
          <SelectContent>
            {commonExtensions.map((ext) => (
              <SelectItem key={ext} value={ext}>{ext}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="maxSize">Maximum File Size (MB)</Label>
        <Input
          id="maxSize"
          type="number"
          min="1"
          max="100"
          value={formData.max_file_size_mb}
          onChange={(e) => setFormData({ ...formData, max_file_size_mb: parseInt(e.target.value) || 10 })}
          required
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : acceptableFile ? 'Update File Type' : 'Add File Type'}
        </Button>
      </div>
    </form>
  );
};

export default DocumentConfiguration;