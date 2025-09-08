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
              </div>

              <div className="grid grid-cols-10 gap-6">
                {/* Categories List */}
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 justify-between">
                      <div className="flex items-center gap-2">
                        <FolderOpen className="h-3 w-3" />
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
                          <CategoryForm 
                            onSubmit={(data) => {
                              createCategoryMutation.mutate(data as Omit<DocumentCategory, 'id' | 'created_at' | 'updated_at'>);
                              setIsCreateCategoryOpen(false);
                            }}
                            isLoading={createCategoryMutation.isPending}
                          />
                        </DialogContent>
                      </Dialog>
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
                        <FileText className="h-3 w-3" />
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
                <Card className="col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 justify-between">
                      <div className="flex items-center gap-2">
                        <File className="h-3 w-3" />
                        Acceptable Files
                      </div>
                      {selectedDocumentType && (
                        <Dialog open={isCreateFileOpen} onOpenChange={setIsCreateFileOpen}>
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
                              className="group p-2 rounded-md bg-muted flex flex-col gap-1"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                  <File className="h-3 w-3 flex-shrink-0" />
                                  <span className="font-medium text-sm truncate">{file.file_extension}</span>
                                </div>
                                <div className="flex gap-1 flex-shrink-0">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setEditingFile(file)}
                                    className="h-5 w-5 p-0"
                                  >
                                    <Edit className="h-2.5 w-2.5" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setDeletingFile(file.id)}
                                    className="h-5 w-5 p-0 text-destructive"
                                  >
                                    <Trash2 className="h-2.5 w-2.5" />
                                  </Button>
                                </div>
                              </div>
                              <Badge variant="outline" className="text-xs w-fit">
                                {file.max_file_size_mb}MB max
                              </Badge>
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
      {editingCategory && (
        <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Document Category</DialogTitle>
              <DialogDescription>
                Update the category information
              </DialogDescription>
            </DialogHeader>
            <CategoryForm 
              category={editingCategory}
              onSubmit={(data) => {
                updateCategoryMutation.mutate({
                  id: editingCategory.id,
                  ...data
                });
                setEditingCategory(null);
              }}
              isLoading={updateCategoryMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Document Type Dialog */}
      {editingType && (
        <Dialog open={!!editingType} onOpenChange={() => setEditingType(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Document Type</DialogTitle>
              <DialogDescription>
                Update the document type information
              </DialogDescription>
            </DialogHeader>
            <DocumentTypeForm 
              categoryId={editingType.category_id}
              documentType={editingType}
              onSubmit={(data) => {
                updateTypeMutation.mutate({
                  id: editingType.id,
                  ...data
                });
                setEditingType(null);
              }}
              isLoading={updateTypeMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Acceptable File Dialog */}
      {editingFile && (
        <Dialog open={!!editingFile} onOpenChange={() => setEditingFile(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Acceptable File Type</DialogTitle>
              <DialogDescription>
                Update the acceptable file type information
              </DialogDescription>
            </DialogHeader>
            <AcceptableFileForm 
              documentTypeId={editingFile.document_type_id}
              acceptableFile={editingFile}
              onSubmit={(data) => {
                updateFileMutation.mutate({
                  id: editingFile.id,
                  ...data
                });
                setEditingFile(null);
              }}
              isLoading={updateFileMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      )}

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
        title="Delete Category"
        description="Are you sure you want to delete this category? This action cannot be undone and will also delete all associated document types and acceptable files."
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
        description="Are you sure you want to delete this document type? This action cannot be undone and will also delete all associated acceptable files."
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
        description="Are you sure you want to delete this acceptable file type? This action cannot be undone."
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
    description: category?.description || '',
    icon: category?.icon || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Category Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter category name"
            required
          />
        </div>
        <div>
          <Label htmlFor="icon">Icon</Label>
          <Input
            id="icon"
            value={formData.icon}
            onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
            placeholder="Icon name (e.g., folder)"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Enter category description"
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : (category ? 'Update' : 'Create')}
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
    name: documentType?.name || '',
    description: documentType?.description || '',
    is_required: documentType?.is_required || false,
    requires_signature: documentType?.requires_signature || false,
    is_internal_only: documentType?.is_internal_only || false,
    product_types: documentType?.product_types || [],
    sort_order: documentType?.sort_order || 0,
    category_id: categoryId,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Type Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter document type name"
            required
          />
        </div>
        <div>
          <Label htmlFor="sort_order">Sort Order</Label>
          <Input
            id="sort_order"
            type="number"
            value={formData.sort_order}
            onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
            placeholder="0"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Enter document type description"
          rows={3}
        />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="is_required"
            checked={formData.is_required}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_required: checked }))}
          />
          <Label htmlFor="is_required">Required Document</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="requires_signature"
            checked={formData.requires_signature}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, requires_signature: checked }))}
          />
          <Label htmlFor="requires_signature">Requires Signature</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="is_internal_only"
            checked={formData.is_internal_only}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_internal_only: checked }))}
          />
          <Label htmlFor="is_internal_only">Internal Only</Label>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : (documentType ? 'Update' : 'Create')}
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
    file_extension: acceptableFile?.file_extension || '',
    max_file_size_mb: acceptableFile?.max_file_size_mb || 10,
    document_type_id: documentTypeId,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="file_extension">File Extension</Label>
          <Input
            id="file_extension"
            value={formData.file_extension}
            onChange={(e) => setFormData(prev => ({ ...prev, file_extension: e.target.value }))}
            placeholder="e.g., .pdf, .jpg, .docx"
            required
          />
        </div>
        <div>
          <Label htmlFor="max_file_size_mb">Max Size (MB)</Label>
          <Input
            id="max_file_size_mb"
            type="number"
            value={formData.max_file_size_mb}
            onChange={(e) => setFormData(prev => ({ ...prev, max_file_size_mb: parseInt(e.target.value) || 10 }))}
            placeholder="10"
            min="1"
          />
        </div>
      </div>


      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : (acceptableFile ? 'Update' : 'Create')}
        </Button>
      </div>
    </form>
  );
};

export default DocumentConfiguration;