import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

console.log("Generate Discount Rules Template function started");

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create CSV template for discount rules
    const headers = [
      'Discount Name',
      'Discount Type',
      'Discount Amount',
      'Discount Active',
      'Discount Geo',
      'Taxable',
      'Category',
      'Subcategory',
      'Description',
      'Start Date',
      'End Date',
      'Pay Type',
      'Applicable Vehicle Years',
      'Applicable Vehicle Models',
      'Applicable Purchase Types',
      'Applicable Title Status'
    ];

    // Sample data row with new geo code format
    const sampleRow = [
      'Military Discount',
      'Percentage',
      '5.00',
      'Yes',
      'NA-US',
      'No',
      'Customer',
      'Military',
      'Discount for active military personnel',
      '2024-01-01',
      '2024-12-31',
      'Customer',
      '2020;2021;2022',
      'Honda Civic;Toyota Camry',
      'Purchase;Lease',
      'Clean;Lien'
    ];

    // Create CSV content
    const csvContent = [
      headers.join(','),
      sampleRow.join(','),
      // Add empty rows for user to fill
      headers.map(() => '').join(','),
      headers.map(() => '').join(',')
    ].join('\n');

    console.log('Generated discount rules template');

    return new Response(csvContent, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="discount_rules_template.csv"'
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