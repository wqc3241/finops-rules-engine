import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

console.log("Generate Tax Rules Template function started");

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create CSV template for tax rules
    const headers = [
      'Tax Name',
      'Tax Type',
      'Tax Rate',
      'Tax Active',
      'Geo Code'
    ];

    // Sample data row
    const sampleRow = [
      'California Sales Tax',
      'Percentage',
      '8.75',
      'Yes',
      'CA'
    ];

    // Create CSV content
    const csvContent = [
      headers.join(','),
      sampleRow.join(','),
      // Add empty rows for user to fill
      headers.map(() => '').join(','),
      headers.map(() => '').join(',')
    ].join('\n');

    console.log('Generated tax rules template');

    return new Response(csvContent, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="tax_rules_template.csv"'
      },
      status: 200,
    });

  } catch (error) {
    console.error('Template generation error:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Failed to generate template',
      message: error.message 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});