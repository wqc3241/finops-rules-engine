import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SelectedDocument } from '@/components/applications/ApplicationDetails/DocumentsView/SendDocumentsToDTModal';

interface SendDocumentsToDTRequest {
  applicationId: string;
  documents: SelectedDocument[];
}

interface SendDocumentsToDTResponse {
  success: boolean;
  message: string;
  dtSubmissionId?: string;
  processedDocuments: Array<{
    documentId: string;
    status: 'success' | 'failed';
    dtDocumentId?: string;
    error?: string;
  }>;
}

export const useSendDocumentsToDT = () => {
  return useMutation({
    mutationFn: async (request: SendDocumentsToDTRequest): Promise<SendDocumentsToDTResponse> => {
      const { data, error } = await supabase.functions.invoke('send-documents-to-dt', {
        body: request
      });

      if (error) {
        throw new Error(error.message || 'Failed to send documents to DT');
      }

      return data;
    },
    onError: (error) => {
      console.error('Send documents to DT error:', error);
    },
  });
};