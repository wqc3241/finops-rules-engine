import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.53.0';
import * as XLSX from 'https://esm.sh/xlsx@0.18.5';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? '',
);

const adminSupabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new Response(
        JSON.stringify({ error: 'File is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Read and parse Excel file to extract program code
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });
    
    console.log(`Excel file parsed. Sheet names: ${JSON.stringify(workbook.SheetNames)}`);
    
    if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Excel file must contain at least one sheet' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract program code from first sheet name (format: PROGRAM_CODE_SEGMENTS_PRICINGTYPE)
    const firstSheetName = workbook.SheetNames[0];
    console.log(`First sheet name: ${firstSheetName}`);
    
    const lastUnderscoreIndex = firstSheetName.lastIndexOf('_');
    console.log(`Last underscore index: ${lastUnderscoreIndex}`);
    
    if (lastUnderscoreIndex === -1) {
      return new Response(
        JSON.stringify({ error: `Sheet names must follow format: PROGRAM_CODE_PRICINGTYPE. Found sheet: ${firstSheetName}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const programCode = firstSheetName.substring(0, lastUnderscoreIndex).trim();
    const pricingType = firstSheetName.substring(lastUnderscoreIndex + 1).trim();
    console.log(`Extracted program code: ${programCode}, pricing type: ${pricingType}`);
    
    // Validate all sheets use the same program code (everything before the last underscore)
    for (const sheetName of workbook.SheetNames) {
      const lastUnderscore = sheetName.lastIndexOf('_');
      const sheetProgramCode = lastUnderscore > -1 ? sheetName.substring(0, lastUnderscore) : sheetName;
      
      if (sheetProgramCode !== programCode) {
        return new Response(
          JSON.stringify({ error: `All sheet names must use the same program code. Expected: ${programCode}, Found: ${sheetProgramCode} in sheet: ${sheetName}` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    console.log(`Processing upload for program: ${programCode}, file: ${file.name}`);

    // Get user ID from JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create upload session
    const { data: session, error: sessionError } = await adminSupabase
      .from('bulletin_upload_sessions')
      .insert({
        filename: file.name,
        file_size: file.size,
        program_code: programCode,
        uploaded_by: user.id,
        upload_status: 'processing'
      })
      .select()
      .single();

    if (sessionError || !session) {
      console.error('Failed to create upload session:', sessionError);
      return new Response(
        JSON.stringify({ error: 'Failed to create upload session' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Excel file already parsed above for program code extraction

    // Get program configuration (pick the most recent if multiple exist)
    const { data: programConfig, error: configError } = await supabase
      .from('financial_program_configs')
      .select('id, program_code, created_at, is_active, program_start_date, program_end_date')
      .eq('program_code', programCode.trim())
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    console.log('Program lookup result:', { programCode, found: !!programConfig, error: configError?.message });

    if (configError || !programConfig) {
      await logError(session.id, 'General', null, null, 'PROGRAM_NOT_FOUND', `Program code ${programCode} not found`);
      await updateSessionStatus(session.id, 'failed', 'failed');
      return new Response(
        JSON.stringify({ 
          error: 'Program not found',
          sessionId: session.id
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get related configuration data
    const [pricingTypesResult, creditProfilesResult, pricingConfigsResult] = await Promise.all([
      supabase.from('pricing_types').select('type_code'),
      supabase.from('credit_profiles').select('profile_id'),
      supabase.from('pricing_configs').select('pricing_rule_id')
    ]);

    const validPricingTypes = pricingTypesResult.data?.map(p => p.type_code) || [];
    const validCreditProfiles = creditProfilesResult.data?.map(c => c.profile_id) || [];
    const validPricingConfigs = pricingConfigsResult.data?.map(p => p.pricing_rule_id) || [];

    const validationResults = await validateWorkbook(
      workbook, 
      session.id, 
      programCode, 
      validPricingTypes, 
      validCreditProfiles, 
      validPricingConfigs
    );

    if (validationResults.isValid) {
      const bulletinRecords = await parseWorkbookData(workbook, programCode, session.id, user.id);
      
      // Insert valid records with pending approval status
      if (bulletinRecords.length > 0) {
        const { error: insertError } = await adminSupabase
          .from('bulletin_pricing')
          .insert(bulletinRecords);

        if (insertError) {
          console.error('Failed to insert bulletin records:', insertError);
          await updateSessionStatus(session.id, 'failed', 'failed');
          return new Response(
            JSON.stringify({ 
              error: 'Failed to insert bulletin pricing records',
              sessionId: session.id
            }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      }

      await updateSessionStatus(session.id, 'completed', 'passed', bulletinRecords.length, bulletinRecords.length, 0);

      return new Response(
        JSON.stringify({
          success: true,
          sessionId: session.id,
          totalRecords: bulletinRecords.length,
          validRecords: bulletinRecords.length,
          invalidRecords: 0,
          message: 'Upload completed successfully. Records are pending approval.'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      await updateSessionStatus(session.id, 'completed', 'failed', validationResults.totalRecords, validationResults.validRecords, validationResults.invalidRecords);
      
      return new Response(
        JSON.stringify({
          success: false,
          sessionId: session.id,
          totalRecords: validationResults.totalRecords,
          validRecords: validationResults.validRecords,
          invalidRecords: validationResults.invalidRecords,
          errors: validationResults.errors,
          message: 'Upload completed with validation errors'
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('Upload processing error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error during upload processing' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function validateWorkbook(workbook: any, sessionId: string, programCode: string, validPricingTypes: string[], validCreditProfiles: string[], validPricingConfigs: string[]) {
  const errors: any[] = [];
  let totalRecords = 0;
  let validRecords = 0;
  let invalidRecords = 0;

  for (const sheetName of workbook.SheetNames) {
    const worksheet = workbook.Sheets[sheetName];
    
    // Validate tab naming convention: {Program Code}_{Pricing Type} where pricing type is after last underscore
    const lastUnderscoreIndex = sheetName.lastIndexOf('_');
    if (lastUnderscoreIndex === -1) {
      await logError(sessionId, sheetName, null, null, 'TAB_NAMING', `Tab name should follow format PROGRAM_CODE_PRICINGTYPE`);
      invalidRecords++;
      continue;
    }

    const sheetProgramCode = sheetName.substring(0, lastUnderscoreIndex);
    const pricingType = sheetName.substring(lastUnderscoreIndex + 1);
    
    if (sheetProgramCode !== programCode) {
      await logError(sessionId, sheetName, null, null, 'TAB_NAMING', `Tab program code ${sheetProgramCode} does not match expected ${programCode}`);
      invalidRecords++;
      continue;
    }
    if (!validPricingTypes.includes(pricingType)) {
      await logError(sessionId, sheetName, null, null, 'INVALID_PRICING_TYPE', `Pricing type ${pricingType} not found in system`);
      invalidRecords++;
      continue;
    }

    // Parse worksheet data
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    if (data.length < 4) {
      await logError(sessionId, sheetName, null, null, 'INSUFFICIENT_ROWS', 'Sheet must have at least 4 rows (headers + data)');
      invalidRecords++;
      continue;
    }

    // Validate header structure
    const programRow = data[0] as any[];
    const creditProfileRow = data[1] as any[];
    const pricingConfigRow = data[2] as any[];

    // Validate credit profiles in row 2
    for (let col = 1; col < creditProfileRow.length; col++) {
      const creditProfile = creditProfileRow[col];
      if (creditProfile && !validCreditProfiles.includes(creditProfile)) {
        await logError(sessionId, sheetName, 2, `Column ${col + 1}`, 'INVALID_CREDIT_PROFILE', `Credit profile ${creditProfile} not found in system`);
        invalidRecords++;
      }
    }

    // Validate pricing configs in row 3  
    for (let col = 1; col < pricingConfigRow.length; col++) {
      const pricingConfig = pricingConfigRow[col];
      if (pricingConfig && !validPricingConfigs.includes(pricingConfig)) {
        await logError(sessionId, sheetName, 3, `Column ${col + 1}`, 'INVALID_PRICING_CONFIG', `Pricing config ${pricingConfig} not found in system`);
        invalidRecords++;
      }
    }

    // Validate data rows (row 4 onwards)
    for (let row = 3; row < data.length; row++) {
      const rowData = data[row] as any[];
      totalRecords++;
      
      const geoCode = rowData[0];
      if (!geoCode) {
        await logError(sessionId, sheetName, row + 1, 'Column A', 'MISSING_GEO_CODE', 'Geo code is required');
        invalidRecords++;
        continue;
      }

      // Validate pricing values
      let hasValidPricingValue = false;
      for (let col = 1; col < rowData.length; col++) {
        const pricingValue = rowData[col];
        if (pricingValue !== undefined && pricingValue !== null && pricingValue !== '') {
          if (isNaN(Number(pricingValue))) {
            await logError(sessionId, sheetName, row + 1, `Column ${col + 1}`, 'INVALID_PRICING_VALUE', `Pricing value must be numeric: ${pricingValue}`);
            invalidRecords++;
          } else {
            hasValidPricingValue = true;
          }
        }
      }

      if (hasValidPricingValue) {
        validRecords++;
      }
    }
  }

  return {
    isValid: invalidRecords === 0,
    totalRecords,
    validRecords,
    invalidRecords,
    errors
  };
}

async function parseWorkbookData(workbook: any, programCode: string, sessionId: string, userId: string) {
  const bulletinRecords: any[] = [];

  for (const sheetName of workbook.SheetNames) {
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    if (data.length < 4) continue;

    const lastUnderscoreIndex = sheetName.lastIndexOf('_');
    const pricingType = sheetName.substring(lastUnderscoreIndex + 1);
    const creditProfileRow = data[1] as any[];
    const pricingConfigRow = data[2] as any[];

    // Parse data rows
    for (let row = 3; row < data.length; row++) {
      const rowData = data[row] as any[];
      const geoCode = rowData[0];
      
      if (!geoCode) continue;

      for (let col = 1; col < rowData.length; col++) {
        const pricingValue = rowData[col];
        if (pricingValue !== undefined && pricingValue !== null && pricingValue !== '' && !isNaN(Number(pricingValue))) {
          bulletinRecords.push({
            bulletin_id: `${programCode}_${geoCode}_${pricingType}_${col}_${Date.now()}`,
            financial_program_code: programCode,
            geo_code: geoCode,
            pricing_type: pricingType,
            credit_profile: creditProfileRow[col],
            pricing_config: pricingConfigRow[col],
            pricing_value: Number(pricingValue),
            upload_date: new Date().toISOString(),
            updated_date: new Date().toISOString(),
            advertised: false,
            upload_session_id: sessionId,
            approval_status: 'pending_approval',
            created_by: userId
          });
        }
      }
    }
  }

  return bulletinRecords;
}

async function logError(sessionId: string, sheetName: string, rowNumber: number | null, columnName: string | null, errorType: string, errorMessage: string, fieldValue?: string) {
  await adminSupabase
    .from('bulletin_upload_errors')
    .insert({
      session_id: sessionId,
      sheet_name: sheetName,
      row_number: rowNumber,
      column_name: columnName,
      error_type: errorType,
      error_message: errorMessage,
      field_value: fieldValue
    });
}

async function updateSessionStatus(sessionId: string, uploadStatus: string, validationStatus: string, totalRecords?: number, validRecords?: number, invalidRecords?: number) {
  const updates: any = {
    upload_status: uploadStatus,
    validation_status: validationStatus,
    updated_at: new Date().toISOString()
  };

  if (totalRecords !== undefined) updates.total_records = totalRecords;
  if (validRecords !== undefined) updates.valid_records = validRecords;
  if (invalidRecords !== undefined) updates.invalid_records = invalidRecords;
  
  if (validationStatus !== 'pending') {
    updates.validation_completed_at = new Date().toISOString();
  }

  await adminSupabase
    .from('bulletin_upload_sessions')
    .update(updates)
    .eq('id', sessionId);
}