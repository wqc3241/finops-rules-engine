import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.53.0';
import XLSX from 'https://esm.sh/xlsx@0.18.5';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? '',
);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { programCode } = await req.json();

    if (!programCode) {
      return new Response(
        JSON.stringify({ error: 'Program code is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Generating template for program: ${programCode}`);

    // Get program configuration
    const { data: programConfig, error: configError } = await supabase
      .from('financial_program_configs')
      .select('*')
      .eq('program_code', programCode)
      .single();

    if (configError || !programConfig) {
      return new Response(
        JSON.stringify({ error: 'Program not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get available pricing types, credit profiles, pricing configs, and geo codes
    const [pricingTypesResult, creditProfilesResult, pricingConfigsResult, geoCodesResult] = await Promise.all([
      supabase.from('pricing_types').select('type_code, type_name, is_lender_specific'),
      supabase.from('credit_profiles').select('profile_id'),
      supabase.from('pricing_configs').select('pricing_rule_id'),
      supabase.from('geo_location').select('geo_code').limit(10) // Sample geo codes
    ]);

    const pricingTypes = pricingTypesResult.data || [];
    const creditProfiles = creditProfilesResult.data || [];
    const pricingConfigs = pricingConfigsResult.data || [];
    const geoCodes = geoCodesResult.data || [];

    // Create workbook
    const workbook = XLSX.utils.book_new();

    // Create a sheet for each pricing type
    for (const pricingType of pricingTypes) {
      const sheetName = `${programCode}_${pricingType.type_code}`;
      const isLenderSpecific = pricingType.is_lender_specific === true;
      
      const worksheet = createTemplateSheet(
        programCode,
        pricingType.type_code,
        creditProfiles.map(c => c.profile_id),
        pricingConfigs.map(p => p.pricing_rule_id),
        geoCodes.map(g => g.geo_code),
        isLenderSpecific
      );
      
      XLSX.utils.book_append_sheet(workbook, worksheet, sanitizeSheetName(sheetName));
    }

    // Generate Excel file ArrayBuffer
    const arrayBuffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });

    // Update program config with template metadata
    const templateMetadata = {
      generated_at: new Date().toISOString(),
      pricing_types: pricingTypes.map(p => p.type_code),
      credit_profiles: creditProfiles.map(c => c.profile_id),
      pricing_configs: pricingConfigs.map(p => p.pricing_rule_id),
      sample_geo_codes: geoCodes.map(g => g.geo_code)
    };

    await supabase
      .from('financial_program_configs')
      .update({ template_metadata: templateMetadata })
      .eq('program_code', programCode);

    // Return Excel file
    const filename = `${programCode}_Bulletin_Pricing_Template.xlsx`;
    
    return new Response(arrayBuffer, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });

  } catch (error) {
    console.error('Template generation error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error during template generation' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function createTemplateSheet(programCode: string, pricingType: string, creditProfiles: string[], pricingConfigs: string[], geoCodes: string[], isLenderSpecific: boolean) {
  const data: any[][] = [];

  if (isLenderSpecific) {
    // LENDER-SPECIFIC TEMPLATE FORMAT
    // Row 1: Program information headers
    const row1 = ['Program Code', 'Lender', 'Financial Product', 'Vehicle Style', 'Start Date', 'End Date'];
    // Fill remaining columns for credit profiles
    for (let i = row1.length; i < creditProfiles.length + 1; i++) {
      row1.push('');
    }
    data.push(row1);

    // Row 2: Credit profiles  
    const row2 = ['Geo Code']; // First column header
    creditProfiles.forEach(profile => row2.push(profile));
    data.push(row2);

    // Row 3: Pricing configs
    const row3 = [''];  // Empty first cell
    pricingConfigs.slice(0, creditProfiles.length).forEach(config => row3.push(config));
    data.push(row3);

    // Sample geo code rows (empty pricing values for template)
    geoCodes.forEach(geoCode => {
      const row = [geoCode];
      // Add empty cells for each credit profile column
      for (let i = 0; i < creditProfiles.length; i++) {
        row.push('');
      }
      data.push(row);
    });

    // Add a few more empty rows for user input
    for (let i = 0; i < 10; i++) {
      const row = [''];
      for (let j = 0; j < creditProfiles.length; j++) {
        row.push('');
      }
      data.push(row);
    }

    const worksheet = XLSX.utils.aoa_to_sheet(data);

    // Set column widths
    const colWidths = [{ wch: 15 }]; // Geo code column
    for (let i = 0; i < creditProfiles.length; i++) {
      colWidths.push({ wch: 12 });
    }
    worksheet['!cols'] = colWidths;

    // Freeze panes (first 3 rows and first column)
    worksheet['!freeze'] = { xSplit: 1, ySplit: 3 };

    return worksheet;

  } else {
    // UNIVERSAL TEMPLATE FORMAT (no lender column)
    // Row 1: Program information headers (no lender)
    const row1 = ['Program Code', 'Financial Product', 'Vehicle Style', 'Start Date', 'End Date'];
    // Fill remaining columns for credit profiles
    for (let i = row1.length; i < creditProfiles.length + 1; i++) {
      row1.push('');
    }
    data.push(row1);

    // Row 2: Geo Code header + Credit profiles
    const row2 = ['Geo Code'];
    creditProfiles.forEach(profile => row2.push(profile));
    data.push(row2);

    // Row 3: Empty first cell + Pricing configs aligned with credit profiles
    const row3 = [''];
    pricingConfigs.slice(0, creditProfiles.length).forEach(config => row3.push(config));
    data.push(row3);

    // Sample geo code rows (empty pricing values for template)
    geoCodes.forEach(geoCode => {
      const row = [geoCode];
      // Add empty cells for each credit profile column
      for (let i = 0; i < creditProfiles.length; i++) {
        row.push('');
      }
      data.push(row);
    });

    // Add a few more empty rows for user input
    for (let i = 0; i < 10; i++) {
      const row = [''];
      for (let j = 0; j < creditProfiles.length; j++) {
        row.push('');
      }
      data.push(row);
    }

    const worksheet = XLSX.utils.aoa_to_sheet(data);

    // Set column widths
    const colWidths: any[] = [];
    for (let i = 0; i < creditProfiles.length; i++) {
      colWidths.push({ wch: 12 });
    }
    worksheet['!cols'] = colWidths;

    // Freeze panes (first 3 rows)
    worksheet['!freeze'] = { xSplit: 0, ySplit: 3 };

    return worksheet;
  }
}

function sanitizeSheetName(name: string): string {
  // Excel sheet names have restrictions
  let sanitized = name.replace(/[\\\/\*\?\[\]:]/g, '_');
  if (sanitized.length > 31) {
    sanitized = sanitized.substring(0, 31);
  }
  return sanitized;
}