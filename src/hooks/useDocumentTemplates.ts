import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface DocumentTemplate {
  id: string;
  name: string;
  template_type: 'docusign' | 'lucid_html';
  template_id: string;
  template_content?: string;
  docusign_template_id?: string;
  description?: string;
  is_active: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateDocumentTemplateData {
  name: string;
  template_type: 'docusign' | 'lucid_html';
  template_content?: string;
  docusign_template_id?: string;
  description?: string;
}

export interface UpdateDocumentTemplateData {
  name?: string;
  template_content?: string;
  docusign_template_id?: string;
  description?: string;
  is_active?: boolean;
}

// Fetch all document templates
export const useDocumentTemplates = () => {
  return useQuery({
    queryKey: ['document-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('document_templates')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Error fetching document templates: ${error.message}`);
      }

      return data as DocumentTemplate[];
    }
  });
};

// Fetch templates by type
export const useDocumentTemplatesByType = (templateType?: 'docusign' | 'lucid_html') => {
  return useQuery({
    queryKey: ['document-templates', templateType],
    queryFn: async () => {
      let query = supabase
        .from('document_templates')
        .select('*')
        .eq('is_active', true);

      if (templateType) {
        query = query.eq('template_type', templateType);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Error fetching document templates: ${error.message}`);
      }

      return data as DocumentTemplate[];
    },
    enabled: !!templateType
  });
};

// Create document template
export const useCreateDocumentTemplate = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (templateData: CreateDocumentTemplateData) => {
      // First generate the template ID
      const { data: templateId, error: idError } = await supabase
        .rpc('generate_template_id');

      if (idError) {
        throw new Error(`Error generating template ID: ${idError.message}`);
      }

      const { data, error } = await supabase
        .from('document_templates')
        .insert({
          ...templateData,
          template_id: templateId,
          created_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Error creating document template: ${error.message}`);
      }

      return data as DocumentTemplate;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['document-templates'] });
      toast({
        title: "Success",
        description: `Template "${data.name}" created with ID: ${data.template_id}`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Update document template
export const useUpdateDocumentTemplate = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateDocumentTemplateData }) => {
      const { data: result, error } = await supabase
        .from('document_templates')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`Error updating document template: ${error.message}`);
      }

      return result as DocumentTemplate;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['document-templates'] });
      toast({
        title: "Success",
        description: `Template "${data.name}" updated successfully`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Delete document template
export const useDeleteDocumentTemplate = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      // Soft delete by setting is_active to false
      const { error } = await supabase
        .from('document_templates')
        .update({ is_active: false })
        .eq('id', id);

      if (error) {
        throw new Error(`Error deleting document template: ${error.message}`);
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document-templates'] });
      toast({
        title: "Success",
        description: "Template deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Check template usage in document types
export const useTemplateUsage = (templateId: string) => {
  return useQuery({
    queryKey: ['template-usage', templateId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('document_types')
        .select('id, name')
        .eq('template_id', templateId);

      if (error) {
        throw new Error(`Error fetching template usage: ${error.message}`);
      }

      return (data || []) as Array<{ id: string; name: string }>;
    },
    enabled: !!templateId
  });
};