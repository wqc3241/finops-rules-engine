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

    const templateMetadata = programConfig.template_metadata || {};
    const lenderSpecificTypes = templateMetadata.lenderSpecificPricingTypes || [];
    const allPricingTypes = templateMetadata.allPricingTypes || [];
    const selectedPricingTypes = [...lenderSpecificTypes, ...allPricingTypes];

    // Get available pricing types with lender-specific flag
    const { data: pricingTypesData } = await supabase
      .from('pricing_types')
      .select('type_code, type_name, is_lender_specific')
      .in('type_code', selectedPricingTypes);

    const [creditProfilesResult, pricingConfigsResult, geoCodesResult] = await Promise.all([
      supabase.from('credit_profiles').select('profile_id'),
      supabase.from('pricing_configs').select('pricing_rule_id'),
      supabase.from('geo_location').select('geo_code').limit(10)
    ]);

    const creditProfiles = creditProfilesResult.data || [];
    const pricingConfigs = pricingConfigsResult.data || [];
    const geoCodes = geoCodesResult.data || [];

    // Create workbook
    const workbook = XLSX.utils.book_new();

    // Create a sheet for each pricing type
    for (const pricingTypeData of (pricingTypesData || [])) {
      const isLenderSpecific = pricingTypeData.is_lender_specific ?? true;
      const sheetName = `${programCode}_${pricingTypeData.type_code}`;
      const worksheet = createTemplateSheet(
        programCode,
        pricingTypeData.type_code,
        creditProfiles.map(c => c.profile_id),
        pricingConfigs.map(p => p.pricing_rule_id),
        geoCodes.map(g => g.geo_code),
        isLenderSpecific
      );
      
      XLSX.utils.book_append_sheet(workbook, worksheet, sanitizeSheetName(sheetName));
    }

    // Generate Excel file
    const arrayBuffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });

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

  // Row 1: Program information headers
  const row1 = ['Program Code', isLenderSpecific ? 'Lender' : 'Applies to All Lenders', 'Financial Product', 'Vehicle Style', 'Start Date', 'End Date'];
  for (let i = row1.length; i < creditProfiles.length + 1; i++) {
    row1.push('');
  }
  data.push(row1);

  // Row 2: Credit profiles  
  const row2 = ['Geo Code'];
  creditProfiles.forEach(profile => row2.push(profile));
  data.push(row2);

  // Row 3: Pricing configs
  const row3 = [''];
  pricingConfigs.slice(0, creditProfiles.length).forEach(config => row3.push(config));
  data.push(row3);

  // Sample geo code rows
  geoCodes.forEach(geoCode => {
    const row = [geoCode];
    for (let i = 0; i < creditProfiles.length; i++) {
      row.push('');
    }
    data.push(row);
  });

  // Add empty rows
  for (let i = 0; i < 10; i++) {
    const row = [''];
    for (let j = 0; j < creditProfiles.length; j++) {
      row.push('');
    }
    data.push(row);
  }

  const worksheet = XLSX.utils.aoa_to_sheet(data);

  const colWidths = [{ wch: 15 }];
  for (let i = 0; i < creditProfiles.length; i++) {
    colWidths.push({ wch: 12 });
  }
  worksheet['!cols'] = colWidths;
  worksheet['!freeze'] = { xSplit: 1, ySplit: 3 };

  return worksheet;
}

function sanitizeSheetName(name: string): string {
  let sanitized = name.replace(/[\\\/\*\?\[\]:]/g, '_');
  if (sanitized.length > 31) {
    sanitized = sanitized.substring(0, 31);
  }
  return sanitized;
}
