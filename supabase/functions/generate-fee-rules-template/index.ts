import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

console.log("Generate Fee Rules Template function started");

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create CSV template for fee rules
    const headers = [
      'Fee ID',
      'Fee Name', 
      'Fee Type',
      'Amount',
      'Fee Active',
      'Fee Country',
      'Fee Currency', 
      'Fee State',
      'Fee Taxable',
      'Category',
      'Subcategory',
      'Description',
      'Pay Type'
    ];

    // Sample data row
    const sampleRow = [
      'FEE_001',
      'Documentation Fee',
      'Fixed',
      '299.99',
      'Yes',
      'USA',
      'USD',
      'CA',
      'No',
      'Processing',
      'Documentation',
      'Standard documentation processing fee',
      'Dealer'
    ];

    // Create CSV content
    const csvContent = [
      headers.join(','),
      sampleRow.join(','),
      // Add empty rows for user to fill
      headers.map(() => '').join(','),
      headers.map(() => '').join(',')
    ].join('\n');

    console.log('Generated fee rules template');

    return new Response(csvContent, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="fee_rules_template.csv"'
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