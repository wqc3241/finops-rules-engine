import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SelectedDocument {
  id: string;
  name: string;
  category: string;
  documentType: string;
  lenderDocumentType: string;
  fileUrl?: string;
  fileName?: string;
}

interface SendDocumentsToDTRequest {
  applicationId: string;
  documents: SelectedDocument[];
}

interface ProcessedDocument {
  documentId: string;
  status: 'success' | 'failed';
  dtDocumentId?: string;
  error?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { applicationId, documents }: SendDocumentsToDTRequest = await req.json()

    console.log(`Processing DT document submission for application ${applicationId}`, {
      documentCount: documents.length,
      documents: documents.map(d => ({ id: d.id, name: d.name, type: d.lenderDocumentType }))
    });

    // Validate request
    if (!applicationId || !documents || documents.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Missing required fields: applicationId and documents' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Validate that all documents have lender document types
    const unmappedDocs = documents.filter(doc => !doc.lenderDocumentType);
    if (unmappedDocs.length > 0) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: `${unmappedDocs.length} documents are missing lender document type mapping` 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Process each document
    const processedDocuments: ProcessedDocument[] = [];
    let successCount = 0;
    let failureCount = 0;

    for (const document of documents) {
      try {
        console.log(`Processing document ${document.id} (${document.name}) as ${document.lenderDocumentType}`);

        // Simulate DT API submission
        // In a real implementation, you would:
        // 1. Download the document from the file URL
        // 2. Convert/format it according to DT requirements
        // 3. Submit to DT API with proper authentication
        // 4. Handle DT response and error cases

        const dtResponse = await simulateDTSubmission(document);
        
        if (dtResponse.success) {
          processedDocuments.push({
            documentId: document.id,
            status: 'success',
            dtDocumentId: dtResponse.dtDocumentId
          });
          successCount++;
          
          // Update document status in database
          await supabaseClient
            .from('documents')
            .update({ 
              status: 'submitted',
              notes: `Submitted to DT as ${document.lenderDocumentType} on ${new Date().toISOString()}`
            })
            .eq('id', document.id);

        } else {
          processedDocuments.push({
            documentId: document.id,
            status: 'failed',
            error: dtResponse.error
          });
          failureCount++;
        }

      } catch (error) {
        console.error(`Failed to process document ${document.id}:`, error);
        processedDocuments.push({
          documentId: document.id,
          status: 'failed',
          error: error.message
        });
        failureCount++;
      }
    }

    // Log the submission attempt in application history
    try {
      await supabaseClient
        .from('application_history')
        .insert({
          application_id: applicationId,
          action: 'Documents Sent to DT',
          description: `Sent ${successCount} document(s) to DT successfully. ${failureCount} failed.`,
          user_name: 'System', // In real implementation, get from auth context
          date: new Date().toISOString()
        });
    } catch (historyError) {
      console.error('Failed to log history:', historyError);
    }

    const response = {
      success: failureCount === 0,
      message: failureCount === 0 
        ? `Successfully sent ${successCount} document(s) to DT`
        : `Sent ${successCount} document(s) successfully, ${failureCount} failed`,
      dtSubmissionId: generateSubmissionId(),
      processedDocuments
    };

    console.log('DT submission completed:', response);

    return new Response(
      JSON.stringify(response),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in send-documents-to-dt function:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Internal server error',
        error: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

// Simulate DT API submission
async function simulateDTSubmission(document: SelectedDocument): Promise<{
  success: boolean;
  dtDocumentId?: string;
  error?: string;
}> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

  // Simulate success/failure (90% success rate)
  const isSuccess = Math.random() > 0.1;

  if (isSuccess) {
    return {
      success: true,
      dtDocumentId: `DT_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  } else {
    const errors = [
      'Document format not supported by DT',
      'File size exceeds DT limits',
      'Invalid document type mapping',
      'DT API temporarily unavailable',
      'Authentication failed with DT'
    ];
    
    return {
      success: false,
      error: errors[Math.floor(Math.random() * errors.length)]
    };
  }
}

function generateSubmissionId(): string {
  return `DT_SUB_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}