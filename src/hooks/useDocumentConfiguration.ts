import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface DocumentCategory {
  id: string;
  name: string;
  description?: string;
  icon: string;
  allowed_teams: string[];
  created_at: string;
  updated_at?: string;
}

export interface DocumentType {
  id: string;
  category_id: string;
  name: string;
  description?: string;
  is_required: boolean;
  requires_signature: boolean;
  is_internal_only: boolean;
  product_types: string[];
  sort_order: number;
  docusign_template_id?: string;
  created_at: string;
  updated_at?: string;
}

export interface DocumentAcceptableFile {
  id: string;
  document_type_id: string;
  file_extension: string;
  max_file_size_mb: number;
  created_at: string;
}

// Document Categories
export const useDocumentCategories = () => {
  return useQuery({
    queryKey: ['documentCategories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('document_categories')
        .select('id, name, description, icon, allowed_teams, created_at, updated_at')
        .order('name');
      
      if (error) throw error;
      return data as DocumentCategory[];
    }
  });
};

export const useCreateDocumentCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
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
      toast({ title: 'Success', description: 'Document category created successfully' });
    },
    onError: (error: any) => {
      toast({ 
        title: 'Error', 
        description: `Failed to create category: ${error.message}`, 
        variant: 'destructive' 
      });
    }
  });
};

export const useUpdateDocumentCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
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
      toast({ title: 'Success', description: 'Document category updated successfully' });
    },
    onError: (error: any) => {
      toast({ 
        title: 'Error', 
        description: `Failed to update category: ${error.message}`, 
        variant: 'destructive' 
      });
    }
  });
};

export const useDeleteDocumentCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (categoryId: string) => {
      const { error } = await supabase
        .from('document_categories')
        .delete()
        .eq('id', categoryId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentCategories'] });
      queryClient.invalidateQueries({ queryKey: ['documentTypes'] });
      toast({ title: 'Success', description: 'Document category deleted successfully' });
    },
    onError: (error: any) => {
      toast({ 
        title: 'Error', 
        description: `Failed to delete category: ${error.message}`, 
        variant: 'destructive' 
      });
    }
  });
};

// Document Types
export const useDocumentTypes = (categoryId?: string) => {
  return useQuery({
    queryKey: ['documentTypes', categoryId],
    queryFn: async () => {
      if (!categoryId) return [];
      const { data, error } = await supabase
        .from('document_types')
        .select('*')
        .eq('category_id', categoryId)
        .order('sort_order');
      
      if (error) throw error;
      return data as DocumentType[];
    },
    enabled: !!categoryId
  });
};

export const useCreateDocumentType = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (typeData: Omit<DocumentType, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('document_types')
        .insert([typeData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['documentTypes', variables.category_id] });
      toast({ title: 'Success', description: 'Document type created successfully' });
    },
    onError: (error: any) => {
      toast({ 
        title: 'Error', 
        description: `Failed to create document type: ${error.message}`, 
        variant: 'destructive' 
      });
    }
  });
};

export const useUpdateDocumentType = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

    return useMutation({
      mutationFn: async ({ id, ...updates }: Partial<DocumentType> & { id: string }) => {
        const { data, error } = await supabase
          .from('document_types')
          .update(updates)
          .eq('id', id)
          .select()
          .maybeSingle();
        
        if (error) throw error;
        return data ?? { id, ...updates };
      },
      onSuccess: (_data, variables) => {
        // Refresh lists globally and specifically for the affected category
        queryClient.invalidateQueries({ queryKey: ['documentTypes'] });
        if ((variables as any).category_id) {
          queryClient.invalidateQueries({ queryKey: ['documentTypes', (variables as any).category_id] });
        }
        toast({ title: 'Success', description: 'Document type updated successfully' });
      },
      onError: (error: any) => {
        toast({ 
          title: 'Error', 
          description: `Failed to update document type: ${error.message}`, 
          variant: 'destructive' 
        });
      }
    });
};

export const useDeleteDocumentType = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (typeId: string) => {
      const { error } = await supabase
        .from('document_types')
        .delete()
        .eq('id', typeId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentTypes'] });
      queryClient.invalidateQueries({ queryKey: ['documentAcceptableFiles'] });
      toast({ title: 'Success', description: 'Document type deleted successfully' });
    },
    onError: (error: any) => {
      toast({ 
        title: 'Error', 
        description: `Failed to delete document type: ${error.message}`, 
        variant: 'destructive' 
      });
    }
  });
};

// Document Acceptable Files
export const useDocumentAcceptableFiles = (documentTypeId?: string) => {
  return useQuery({
    queryKey: ['documentAcceptableFiles', documentTypeId],
    queryFn: async () => {
      if (!documentTypeId) return [];
      const { data, error } = await supabase
        .from('document_acceptable_files')
        .select('*')
        .eq('document_type_id', documentTypeId)
        .order('file_extension');
      
      if (error) throw error;
      return data as DocumentAcceptableFile[];
    },
    enabled: !!documentTypeId
  });
};

export const useCreateAcceptableFile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (fileData: Omit<DocumentAcceptableFile, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('document_acceptable_files')
        .insert([fileData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['documentAcceptableFiles', variables.document_type_id] });
      toast({ title: 'Success', description: 'Acceptable file type added successfully' });
    },
    onError: (error: any) => {
      toast({ 
        title: 'Error', 
        description: `Failed to add acceptable file type: ${error.message}`, 
        variant: 'destructive' 
      });
    }
  });
};

export const useUpdateAcceptableFile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<DocumentAcceptableFile> & { id: string }) => {
      const { data, error } = await supabase
        .from('document_acceptable_files')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentAcceptableFiles'] });
      toast({ title: 'Success', description: 'Acceptable file type updated successfully' });
    },
    onError: (error: any) => {
      toast({ 
        title: 'Error', 
        description: `Failed to update acceptable file type: ${error.message}`, 
        variant: 'destructive' 
      });
    }
  });
};

export const useDeleteAcceptableFile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (fileId: string) => {
      const { error } = await supabase
        .from('document_acceptable_files')
        .delete()
        .eq('id', fileId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentAcceptableFiles'] });
      toast({ title: 'Success', description: 'Acceptable file type removed successfully' });
    },
    onError: (error: any) => {
      toast({ 
        title: 'Error', 
        description: `Failed to remove acceptable file type: ${error.message}`, 
        variant: 'destructive' 
      });
    }
  });
};