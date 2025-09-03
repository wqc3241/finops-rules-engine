import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Plus, FileText, Settings, Trash2, Edit } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface DocumentCategory {
  id: string;
  name: string;
  description?: string;
  icon: string;
  is_required: boolean;
  requires_signature: boolean;
  is_internal_only: boolean;
  product_types: string[];
  created_at: string;
  updated_at?: string;
}

interface DocumentFileType {
  id: string;
  category_id: string;
  file_extension: string;
  max_file_size_mb: number;
  created_at: string;
}

interface DocumentStatus {
  id: string;
  category_id: string;
  status_name: string;
  status_color: string;
  is_default: boolean;
  sort_order: number;
  created_at: string;
}

const DocumentConfiguration: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false);
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch document categories
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['documentCategories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('document_categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as DocumentCategory[];
    }
  });

  // Fetch file types for selected category
  const { data: fileTypes = [] } = useQuery({
    queryKey: ['documentFileTypes', selectedCategory],
    queryFn: async () => {
      if (!selectedCategory) return [];
      const { data, error } = await supabase
        .from('document_file_types')
        .select('*')
        .eq('category_id', selectedCategory)
        .order('file_extension');
      
      if (error) throw error;
      return data as DocumentFileType[];
    },
    enabled: !!selectedCategory
  });

  // Fetch statuses for selected category
  const { data: statuses = [] } = useQuery({
    queryKey: ['documentStatuses', selectedCategory],
    queryFn: async () => {
      if (!selectedCategory) return [];
      const { data, error } = await supabase
        .from('document_statuses')
        .select('*')
        .eq('category_id', selectedCategory)
        .order('sort_order');
      
      if (error) throw error;
      return data as DocumentStatus[];
    },
    enabled: !!selectedCategory
  });

  // Create category mutation
  const createCategoryMutation = useMutation({
    mutationFn: async (categoryData: Omit<DocumentCategory, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('document_categories')
        .insert([categoryData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentCategories'] });
      setIsCreateCategoryOpen(false);
      toast({ title: 'Success', description: 'Document category created successfully' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: `Failed to create category: ${error.message}`, variant: 'destructive' });
    }
  });

  // Update category mutation
  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<DocumentCategory> & { id: string }) => {
      const { data, error } = await supabase
        .from('document_categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentCategories'] });
      setIsEditCategoryOpen(false);
      toast({ title: 'Success', description: 'Document category updated successfully' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: `Failed to update category: ${error.message}`, variant: 'destructive' });
    }
  });

  // Delete category mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: async (categoryId: string) => {
      const { error } = await supabase
        .from('document_categories')
        .delete()
        .eq('id', categoryId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentCategories'] });
      setSelectedCategory(null);
      toast({ title: 'Success', description: 'Document category deleted successfully' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: `Failed to delete category: ${error.message}`, variant: 'destructive' });
    }
  });

  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Document Configuration</h1>
          <p className="text-muted-foreground">
            Configure document categories, file types, and requirements for applications
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
              onSubmit={(data) => createCategoryMutation.mutate(data as Omit<DocumentCategory, 'id' | 'created_at' | 'updated_at'>)}
              isLoading={createCategoryMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Categories List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Document Categories
            </CardTitle>
            <CardDescription>
              Select a category to configure its settings
            </CardDescription>
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
                  className={`p-3 rounded-md cursor-pointer transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <div className="flex gap-1">
                      {category.is_required && (
                        <Badge variant="secondary" className="text-xs">Required</Badge>
                      )}
                      {category.requires_signature && (
                        <Badge variant="outline" className="text-xs">Signature</Badge>
                      )}
                    </div>
                  </div>
                  {category.description && (
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {category.description}
                    </p>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Category Details */}
        <div className="lg:col-span-2">
          {selectedCategoryData ? (
            <Tabs defaultValue="settings" className="space-y-4">
              <TabsList>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="filetypes">File Types</TabsTrigger>
                <TabsTrigger value="statuses">Statuses</TabsTrigger>
              </TabsList>

              <TabsContent value="settings">
                <CategorySettingsTab 
                  category={selectedCategoryData}
                  onUpdate={(updates) => updateCategoryMutation.mutate({ id: selectedCategoryData.id, ...updates })}
                  onDelete={() => deleteCategoryMutation.mutate(selectedCategoryData.id)}
                  isUpdating={updateCategoryMutation.isPending}
                  isDeleting={deleteCategoryMutation.isPending}
                />
              </TabsContent>

              <TabsContent value="filetypes">
                <FileTypesTab 
                  categoryId={selectedCategory!}
                  fileTypes={fileTypes}
                />
              </TabsContent>

              <TabsContent value="statuses">
                <StatusesTab 
                  categoryId={selectedCategory!}
                  statuses={statuses}
                />
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Category Selected</h3>
                  <p className="text-muted-foreground">
                    Select a document category from the list to view and configure its settings
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
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
    icon: category?.icon || 'FileText',
    is_required: category?.is_required || false,
    requires_signature: category?.requires_signature || false,
    is_internal_only: category?.is_internal_only || false,
    product_types: category?.product_types || []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const productTypes = ['Cash', 'Loan', 'Lease'];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
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
          <Label htmlFor="icon">Icon</Label>
          <Select value={formData.icon} onValueChange={(value) => setFormData({ ...formData, icon: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FileText">FileText</SelectItem>
              <SelectItem value="File">File</SelectItem>
              <SelectItem value="FileImage">FileImage</SelectItem>
              <SelectItem value="CreditCard">CreditCard</SelectItem>
              <SelectItem value="User">User</SelectItem>
              <SelectItem value="Car">Car</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
          {productTypes.map((type) => (
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
          {isLoading ? 'Saving...' : category ? 'Update Category' : 'Create Category'}
        </Button>
      </div>
    </form>
  );
};

// Category Settings Tab
const CategorySettingsTab: React.FC<{
  category: DocumentCategory;
  onUpdate: (updates: Partial<DocumentCategory>) => void;
  onDelete: () => void;
  isUpdating: boolean;
  isDeleting: boolean;
}> = ({ category, onUpdate, onDelete, isUpdating, isDeleting }) => {
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Category Settings
            </CardTitle>
            <CardDescription>Configure category properties and behavior</CardDescription>
          </div>
          <div className="flex gap-2">
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Edit Category</DialogTitle>
                  <DialogDescription>Update category configuration</DialogDescription>
                </DialogHeader>
                <CategoryForm 
                  category={category}
                  onSubmit={(data) => {
                    onUpdate(data);
                    setIsEditOpen(false);
                  }}
                  isLoading={isUpdating}
                />
              </DialogContent>
            </Dialog>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={onDelete}
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2">Basic Information</h4>
            <div className="space-y-2 text-sm">
              <div><strong>Name:</strong> {category.name}</div>
              <div><strong>Icon:</strong> {category.icon}</div>
              {category.description && (
                <div><strong>Description:</strong> {category.description}</div>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Configuration</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant={category.is_required ? "default" : "secondary"}>
                  {category.is_required ? "Required" : "Optional"}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={category.requires_signature ? "default" : "secondary"}>
                  {category.requires_signature ? "Signature Required" : "View Only"}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={category.is_internal_only ? "default" : "secondary"}>
                  {category.is_internal_only ? "Internal Only" : "External Use"}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Product Types</h4>
          <div className="flex flex-wrap gap-2">
            {category.product_types.length > 0 ? (
              category.product_types.map((type) => (
                <Badge key={type} variant="outline">{type}</Badge>
              ))
            ) : (
              <span className="text-muted-foreground text-sm">No product types specified</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// File Types Tab
const FileTypesTab: React.FC<{
  categoryId: string;
  fileTypes: DocumentFileType[];
}> = ({ categoryId, fileTypes }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Acceptable File Types</CardTitle>
        <CardDescription>Configure which file types are allowed for this category</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {fileTypes.map((fileType) => (
            <Badge key={fileType.id} variant="outline">
              {fileType.file_extension} (max {fileType.max_file_size_mb}MB)
            </Badge>
          ))}
        </div>
        {fileTypes.length === 0 && (
          <p className="text-muted-foreground text-sm">No file types configured</p>
        )}
      </CardContent>
    </Card>
  );
};

// Statuses Tab
const StatusesTab: React.FC<{
  categoryId: string;
  statuses: DocumentStatus[];
}> = ({ categoryId, statuses }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Statuses</CardTitle>
        <CardDescription>Configure available statuses for documents in this category</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {statuses.map((status) => (
            <div key={status.id} className="flex items-center justify-between p-2 rounded border">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: status.status_color }}
                />
                <span>{status.status_name}</span>
                {status.is_default && (
                  <Badge variant="secondary" className="text-xs">Default</Badge>
                )}
              </div>
            </div>
          ))}
        </div>
        {statuses.length === 0 && (
          <p className="text-muted-foreground text-sm">No statuses configured</p>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentConfiguration;