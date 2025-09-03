import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface DocumentCategory {
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

export interface DocumentFileType {
  id: string;
  category_id: string;
  file_extension: string;
  max_file_size_mb: number;
  created_at: string;
}

export interface DocumentStatus {
  id: string;
  category_id: string;
  status_name: string;
  status_color: string;
  is_default: boolean;
  sort_order: number;
  created_at: string;
}

export const useDocumentCategories = () => {
  return useQuery({
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
};

export const useDocumentFileTypes = (categoryId?: string) => {
  return useQuery({
    queryKey: ['documentFileTypes', categoryId],
    queryFn: async () => {
      if (!categoryId) return [];
      const { data, error } = await supabase
        .from('document_file_types')
        .select('*')
        .eq('category_id', categoryId)
        .order('file_extension');
      
      if (error) throw error;
      return data as DocumentFileType[];
    },
    enabled: !!categoryId
  });
};

export const useDocumentStatuses = (categoryId?: string) => {
  return useQuery({
    queryKey: ['documentStatuses', categoryId],
    queryFn: async () => {
      if (!categoryId) return [];
      const { data, error } = await supabase
        .from('document_statuses')
        .select('*')
        .eq('category_id', categoryId)
        .order('sort_order');
      
      if (error) throw error;
      return data as DocumentStatus[];
    },
    enabled: !!categoryId
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
      queryClient.invalidateQueries({ queryKey: ['documentFileTypes'] });
      queryClient.invalidateQueries({ queryKey: ['documentStatuses'] });
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

export const useCreateFileType = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (fileTypeData: Omit<DocumentFileType, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('document_file_types')
        .insert([fileTypeData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['documentFileTypes', variables.category_id] });
      toast({ title: 'Success', description: 'File type added successfully' });
    },
    onError: (error: any) => {
      toast({ 
        title: 'Error', 
        description: `Failed to add file type: ${error.message}`, 
        variant: 'destructive' 
      });
    }
  });
};

export const useDeleteFileType = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (fileTypeId: string) => {
      const { error } = await supabase
        .from('document_file_types')
        .delete()
        .eq('id', fileTypeId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentFileTypes'] });
      toast({ title: 'Success', description: 'File type removed successfully' });
    },
    onError: (error: any) => {
      toast({ 
        title: 'Error', 
        description: `Failed to remove file type: ${error.message}`, 
        variant: 'destructive' 
      });
    }
  });
};

export const useCreateDocumentStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (statusData: Omit<DocumentStatus, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('document_statuses')
        .insert([statusData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['documentStatuses', variables.category_id] });
      toast({ title: 'Success', description: 'Status added successfully' });
    },
    onError: (error: any) => {
      toast({ 
        title: 'Error', 
        description: `Failed to add status: ${error.message}`, 
        variant: 'destructive' 
      });
    }
  });
};

export const useUpdateDocumentStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<DocumentStatus> & { id: string }) => {
      const { data, error } = await supabase
        .from('document_statuses')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentStatuses'] });
      toast({ title: 'Success', description: 'Status updated successfully' });
    },
    onError: (error: any) => {
      toast({ 
        title: 'Error', 
        description: `Failed to update status: ${error.message}`, 
        variant: 'destructive' 
      });
    }
  });
};

export const useDeleteDocumentStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (statusId: string) => {
      const { error } = await supabase
        .from('document_statuses')
        .delete()
        .eq('id', statusId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentStatuses'] });
      toast({ title: 'Success', description: 'Status deleted successfully' });
    },
    onError: (error: any) => {
      toast({ 
        title: 'Error', 
        description: `Failed to delete status: ${error.message}`, 
        variant: 'destructive' 
      });
    }
  });
};