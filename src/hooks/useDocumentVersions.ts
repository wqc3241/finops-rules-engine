import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface DocumentVersion {
  id: string;
  name: string;
  version_number: number;
  parent_document_id?: string;
  generation_count: number;
  is_generated: boolean;
  generated_from_template_id?: string;
  status: string;
  file_url?: string;
  file_name?: string;
  uploaded_date?: string;
  uploaded_by?: string;
  created_at: string;
  document_type?: {
    id: string;
    name: string;
    template_id?: string;
  };
}

// Hook to fetch all versions of a document
export const useDocumentVersions = (documentId: string) => {
  return useQuery({
    queryKey: ['document-versions', documentId],
    queryFn: async (): Promise<DocumentVersion[]> => {
      // First get the document to find if it's a parent or child
      const { data: document, error: docError } = await supabase
        .from('documents')
        .select('id, parent_document_id')
        .eq('id', documentId)
        .single();

      if (docError) throw docError;

      // Find the root parent document
      const rootDocumentId = document.parent_document_id || document.id;

      // Get all versions (parent + all children)
      const { data, error } = await supabase
        .from('documents')
        .select(`
          id,
          name,
          version_number,
          parent_document_id,
          generation_count,
          is_generated,
          generated_from_template_id,
          status,
          file_url,
          file_name,
          uploaded_date,
          uploaded_by,
          created_at,
          document_type:document_types(id, name, template_id)
        `)
        .or(`id.eq.${rootDocumentId},parent_document_id.eq.${rootDocumentId}`)
        .order('version_number', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!documentId,
  });
};

// Hook to generate a new version of a document from template
export const useGenerateDocumentVersion = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      parentDocumentId,
      templateId,
    }: {
      parentDocumentId: string;
      templateId: string;
    }) => {
      // First get the parent document details
      const { data: parentDoc, error: parentError } = await supabase
        .from('documents')
        .select(`
          *,
          document_type:document_types(*)
        `)
        .eq('id', parentDocumentId)
        .single();

      if (parentError) throw parentError;

      // Get the current highest version number for this document family
      const rootDocumentId = parentDoc.parent_document_id || parentDoc.id;
      const { data: versions, error: versionsError } = await supabase
        .from('documents')
        .select('version_number')
        .or(`id.eq.${rootDocumentId},parent_document_id.eq.${rootDocumentId}`)
        .order('version_number', { ascending: false })
        .limit(1);

      if (versionsError) throw versionsError;

      const nextVersion = (versions[0]?.version_number || 0) + 1;

      // Update the root document's generation count
      await supabase
        .from('documents')
        .update({ generation_count: nextVersion })
        .eq('id', rootDocumentId);

      // Create new version - keep original name without version suffix
      const originalName = parentDoc.name.replace(/\s*\(v\d+\).*$/, ''); // Remove any existing version suffixes
      
      const { data, error } = await supabase
        .from('documents')
        .insert({
          name: originalName, // Keep original name without version number
          application_id: parentDoc.application_id,
          category_id: parentDoc.category_id,
          document_type_id: parentDoc.document_type_id,
          parent_document_id: rootDocumentId,
          version_number: nextVersion,
          generation_count: nextVersion,
          is_generated: true,
          generated_from_template_id: templateId,
          status: 'Generated',
          is_required: parentDoc.is_required,
          requires_signature: parentDoc.requires_signature,
          uploaded_by: 'System',
        })
        .select(`
          *,
          document_type:document_types(*)
        `)
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['document-versions'] });
      toast({ title: 'Success', description: 'New document version generated successfully' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: `Failed to generate document version: ${error.message}`,
        variant: 'destructive'
      });
    }
  });
};

// Hook to check if a document type already exists for an application
export const useCheckDuplicateDocument = (applicationId: string) => {
  return useQuery({
    queryKey: ['duplicate-check', applicationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('documents')
        .select('document_type_id')
        .eq('application_id', applicationId)
        .is('parent_document_id', null); // Only check root documents, not versions

      if (error) throw error;
      return data?.map(doc => doc.document_type_id) || [];
    },
    enabled: !!applicationId,
  });
};