import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Document {
  id: string;
  name: string;
  category_id: string;
  document_type_id: string;
  status: string;
  file_url?: string;
  file_name?: string;
  file_size_mb?: number;
  uploaded_date?: string;
  uploaded_by?: string;
  last_modified?: string;
  is_required: boolean;
  notes?: string;
  product_type?: string;
  file_extension?: string;
  expiration_date?: string;
  created_at?: string;
  updated_at?: string;
  // Joined data from related tables
  category?: {
    id: string;
    name: string;
    description?: string;
    icon?: string;
  };
  document_type?: {
    id: string;
    name: string;
    description?: string;
    docusign_template_id?: string;
  };
}

export interface DocumentWithCategory extends Document {
  category: {
    id: string;
    name: string;
    description?: string;
    icon?: string;
  };
  document_type: {
    id: string;
    name: string;
    description?: string;
    docusign_template_id?: string;
  };
}

// Hook to fetch documents for a specific application
export const useDocuments = (applicationId?: string) => {
  return useQuery({
    queryKey: ['documents', applicationId],
    queryFn: async (): Promise<DocumentWithCategory[]> => {
      let query = supabase
        .from('documents')
        .select(`
          *,
          category:document_categories(*),
          document_type:document_types(*)
        `);
      
      // Filter by application_id if provided
      if (applicationId) {
        query = query.eq('application_id', applicationId);
      } else {
        // If no applicationId, get documents that are not tied to any specific application
        query = query.is('application_id', null);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch documents: ${error.message}`);
      }

      return data || [];
    },
    enabled: true,
  });
};

// Hook to fetch all document categories
export const useDocumentCategoriesWithCounts = () => {
  return useQuery({
    queryKey: ['document-categories-with-counts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('document_categories')
        .select(`
          *,
          documents(count)
        `)
        .order('name');

      if (error) {
        throw new Error(`Failed to fetch categories: ${error.message}`);
      }

      return data || [];
    },
  });
};

// Hook to create a new document
export const useCreateDocument = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (documentData: {
      name: string;
      application_id?: string;
      category_id?: string;
      document_type_id?: string;
      status?: string;
      notes?: string;
      is_required?: boolean;
      requires_signature?: boolean;
      expiration_date?: string;
      uploaded_by?: string;
    }) => {
      const { data, error } = await supabase
        .from('documents')
        .insert([{
          name: documentData.name,
          application_id: documentData.application_id,
          category_id: documentData.category_id,
          document_type_id: documentData.document_type_id,
          status: documentData.status || 'Pending',
          notes: documentData.notes,
          is_required: documentData.is_required || false,
          requires_signature: documentData.requires_signature || false,
          expiration_date: documentData.expiration_date,
          uploaded_by: documentData.uploaded_by,
        }])
        .select(`
          *,
          category:document_categories(*),
          document_type:document_types(*)
        `)
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['document-categories-with-counts'] });
      queryClient.invalidateQueries({ queryKey: ['documentCategories'] });
      toast({ title: 'Success', description: 'Document created successfully' });
    },
    onError: (error: any) => {
      toast({ 
        title: 'Error', 
        description: `Failed to create document: ${error.message}`, 
        variant: 'destructive' 
      });
    }
  });
};

// Hook to update a document
export const useUpdateDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      id, 
      updates 
    }: { 
      id: string; 
      updates: Partial<Document> 
    }) => {
      const { data, error } = await supabase
        .from('documents')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update document: ${error.message}`);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['document-categories-with-counts'] });
    },
  });
};

// Hook to delete a document
export const useDeleteDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (documentId: string) => {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId);

      if (error) {
        throw new Error(`Failed to delete document: ${error.message}`);
      }

      return documentId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['document-categories-with-counts'] });
    },
  });
};

// Hook to seed documents (call the edge function)
export const useSeedDocuments = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params?: { applicationIds?: string[] }) => {
      const { data, error } = await supabase.functions.invoke('seed-documents', {
        body: params || {}
      });

      if (error) {
        throw new Error(`Failed to seed documents: ${error.message}`);
      }

      return data;
    },
    onSuccess: () => {
      // Refetch all document-related queries after seeding
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['document-categories-with-counts'] });
      queryClient.invalidateQueries({ queryKey: ['document-categories'] });
      queryClient.invalidateQueries({ queryKey: ['document-types'] });
    },
  });
};