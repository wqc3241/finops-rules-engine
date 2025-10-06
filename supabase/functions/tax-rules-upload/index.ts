import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

console.log("Tax Rules Upload function started");

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

        // Map CSV columns to database columns (based on tax_rules schema)
        const geoCodeValue = values[headers.indexOf('Geo Code')] || '';
        
        // Validate and format geo_code to standard format
        let geoCode = 'NA-US';
        if (geoCodeValue) {
          if (geoCodeValue.startsWith('NA-')) {
            geoCode = geoCodeValue.toUpperCase();
          } else if (geoCodeValue.length === 2) {
            // Assume 2-letter codes are US states
            geoCode = `NA-US-${geoCodeValue.toUpperCase()}`;
          } else {
            geoCode = `NA-US-${geoCodeValue.toUpperCase()}`;
          }
        }
        
        const record: any = {
          tax_name: values[headers.indexOf('Tax Name')] || '',
          tax_type: values[headers.indexOf('Tax Type')] || '',
          rate: parseFloat(values[headers.indexOf('Tax Rate')] || '0'),
          is_active: (values[headers.indexOf('Tax Active')] || '').toLowerCase() === 'yes',
          geo_code: geoCode,
          created_at: new Date().toISOString()
        };

        // Validate required fields
        if (!record.tax_name || !record.tax_type) {
          errors.push(`Row ${i + 1}: Missing required fields (Tax Name, Tax Type)`);
          invalidRecords++;
          continue;
        }

        // Insert into database
        const { error } = await supabaseClient
          .from('tax_rules')
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
        ? `Successfully uploaded ${validRecords} tax rules${invalidRecords > 0 ? ` (${invalidRecords} failed)` : ''}`
        : 'No valid records were uploaded'
    };

    console.log('Upload result:', result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Tax rules upload error:', error);
    
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