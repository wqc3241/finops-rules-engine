import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

console.log("Discount Rules Upload function started");

interface UploadResult {
  success: boolean;
  totalRecords: number;
  validRecords: number;
  invalidRecords: number;
  message: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the uploaded file from FormData
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      throw new Error('No file provided');
    }

    console.log(`Processing file: ${file.name}, size: ${file.size} bytes`);

    // Read file as array buffer
    const arrayBuffer = await file.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);

    // Parse Excel file using a simple CSV-like approach for now
    const text = new TextDecoder().decode(data);
    
    // For CSV format processing
    const lines = text.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      throw new Error('File must contain at least a header row and one data row');
    }

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    console.log('Headers found:', headers);

    let validRecords = 0;
    let invalidRecords = 0;
    const errors: string[] = [];

    // Process each data row
    for (let i = 1; i < lines.length; i++) {
      try {
        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
        
        if (values.length !== headers.length) {
          errors.push(`Row ${i + 1}: Column count mismatch`);
          invalidRecords++;
          continue;
        }

        // Helper function to parse comma-separated arrays
        const parseArray = (value: string): string[] => {
          return value ? value.split(';').map(item => item.trim()).filter(Boolean) : [];
        };

        // Map CSV columns to database columns
        const record: any = {
          name: values[headers.indexOf('Discount Name')] || '',
          type: values[headers.indexOf('Discount Type')] || '',
          discountAmount: parseFloat(values[headers.indexOf('Discount Amount')] || '0'),
          feeActive: (values[headers.indexOf('Discount Active')] || '').toLowerCase() === 'yes',
          feeState: values[headers.indexOf('Discount State')] || '',
          feeTaxable: (values[headers.indexOf('Taxable')] || '').toLowerCase() === 'yes',
          category: values[headers.indexOf('Category')] || '',
          subcategory: values[headers.indexOf('Subcategory')] || '',
          description: values[headers.indexOf('Description')] || '',
          startDate: values[headers.indexOf('Start Date')] || null,
          endDate: values[headers.indexOf('End Date')] || null,
          payType: values[headers.indexOf('Pay Type')] || '',
          applicable_vehicle_year: parseArray(values[headers.indexOf('Applicable Vehicle Years')] || '').map(Number).filter(Boolean),
          applicable_vehicle_model: parseArray(values[headers.indexOf('Applicable Vehicle Models')] || ''),
          applicable_purchase_type: parseArray(values[headers.indexOf('Applicable Purchase Types')] || ''),
          applicable_title_status: parseArray(values[headers.indexOf('Applicable Title Status')] || ''),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        // Validate required fields
        if (!record.name || !record.type) {
          errors.push(`Row ${i + 1}: Missing required fields (Discount Name, Discount Type)`);
          invalidRecords++;
          continue;
        }

        // Insert into database
        const { error } = await supabaseClient
          .from('discount_rules')
          .insert(record);

        if (error) {
          console.error(`Error inserting row ${i + 1}:`, error);
          errors.push(`Row ${i + 1}: ${error.message}`);
          invalidRecords++;
        } else {
          validRecords++;
        }

      } catch (error) {
        console.error(`Error processing row ${i + 1}:`, error);
        errors.push(`Row ${i + 1}: ${error.message}`);
        invalidRecords++;
      }
    }

    const result: UploadResult = {
      success: validRecords > 0,
      totalRecords: lines.length - 1,
      validRecords,
      invalidRecords,
      message: validRecords > 0 
        ? `Successfully uploaded ${validRecords} discount rules${invalidRecords > 0 ? ` (${invalidRecords} failed)` : ''}`
        : 'No valid records were uploaded'
    };

    console.log('Upload result:', result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Discount rules upload error:', error);
    
    const result: UploadResult = {
      success: false,
      totalRecords: 0,
      validRecords: 0,
      invalidRecords: 0,
      message: error.message || 'Upload failed'
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});