
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

    // Build sheet info (supports multiple program codes per workbook)
    const sheetInfos: { sheetName: string; programCode: string; pricingType: string }[] = [];
    let badSheet: string | null = null;
    for (const name of workbook.SheetNames) {
      const idx = name.lastIndexOf('_');
      if (idx === -1) {
        badSheet = name;
        break;
      }
      sheetInfos.push({
        sheetName: name,
        programCode: name.substring(0, idx).trim(),
        pricingType: name.substring(idx + 1).trim(),
      });
    }

    if (badSheet) {
      return new Response(
        JSON.stringify({ error: `Sheet names must follow format: PROGRAM_CODE_PRICINGTYPE. Found sheet: ${badSheet}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const uniqueProgramCodes = Array.from(new Set(sheetInfos.map(s => s.programCode)));
    const programCodesCsv = uniqueProgramCodes.join(',');
    console.log(`Processing upload for programs: ${JSON.stringify(uniqueProgramCodes)}, file: ${file.name}`);

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

    // Create upload session (store all program codes present in workbook)
    const { data: session, error: sessionError } = await adminSupabase
      .from('bulletin_upload_sessions')
      .insert({
        filename: file.name,
        file_size: file.size,
        program_code: programCodesCsv,
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

    // Get program configurations for all program codes in the workbook (use most recent per program)
    const { data: programConfigsData, error: configError } = await supabase
      .from('financial_program_configs')
      .select('id, program_code, created_at, is_active, program_start_date, program_end_date, template_metadata')
      .in('program_code', uniqueProgramCodes);

    if (configError) {
      console.error('Failed to fetch program configs:', configError);
      await updateSessionStatus(session.id, 'failed', 'failed');
      return new Response(
        JSON.stringify({ error: 'Failed to fetch program configurations', sessionId: session.id }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const programConfigMap: Record<string, any> = {};
    (programConfigsData || [])
      .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .forEach((cfg: any) => {
        if (!programConfigMap[cfg.program_code]) programConfigMap[cfg.program_code] = cfg;
      });

    console.log('Program lookup result:', { programCodes: uniqueProgramCodes, found: Object.keys(programConfigMap) });

    // Get related configuration data
    const [pricingTypesResult, creditProfilesResult, pricingConfigsResult, lendersResult, geoLocationsResult] = await Promise.all([
      supabase.from('pricing_types').select('type_code'),
      supabase.from('credit_profiles').select('profile_id'),
      supabase.from('pricing_configs').select('pricing_rule_id'),
      supabase.from('lenders').select('lender_name'),
      supabase.from('geo_location').select('geo_code')
    ]);

    const validPricingTypes = pricingTypesResult.data?.map(p => p.type_code) || [];
    const validCreditProfiles = creditProfilesResult.data?.map(c => c.profile_id) || [];
    const validPricingConfigs = pricingConfigsResult.data?.map(p => p.pricing_rule_id) || [];
    const validLenders = (lendersResult.data?.map(l => l.lender_name) || []).filter(Boolean);
    const validGeoCodes = (geoLocationsResult.data?.map(g => g.geo_code) || []).filter(Boolean);

    const validationResults = await validateWorkbook(
      workbook,
      session.id,
      validPricingTypes,
      validCreditProfiles,
      validPricingConfigs,
      validLenders,
      validGeoCodes,
      programConfigMap
    );

    if (validationResults.isValid) {
      const bulletinRecords = await parseWorkbookData(workbook, session.id, user.id);
      
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

async function validateWorkbook(
  workbook: any,
  sessionId: string,
  validPricingTypes: string[],
  validCreditProfiles: string[],
  validPricingConfigs: string[],
  validLenders: string[],
  validGeoCodes: string[],
  programConfigMap: Record<string, any>
) {
  const errors: any[] = [];
  let totalRecords = 0;
  let validRecords = 0;
  let invalidRecords = 0;

  const validLenderSet = new Set(validLenders.map(l => l.toLowerCase()));
  const validGeoSet = new Set(validGeoCodes.map(g => g?.toString().trim()));

  for (const sheetName of workbook.SheetNames) {
    const worksheet = workbook.Sheets[sheetName];

    // Validate tab naming convention: {Program Code}_{Pricing Type} where pricing type is after last underscore
    const lastUnderscoreIndex = sheetName.lastIndexOf('_');
    if (lastUnderscoreIndex === -1) {
      await logError(sessionId, sheetName, null, null, 'TAB_NAMING', `Tab name should follow format PROGRAM_CODE_PRICINGTYPE`);
      invalidRecords++;
      continue;
    }

    const sheetProgramCode = sheetName.substring(0, lastUnderscoreIndex).trim();
    const pricingType = sheetName.substring(lastUnderscoreIndex + 1).trim();

    const programCfg = programConfigMap[sheetProgramCode];
    if (!programCfg) {
      await logError(sessionId, sheetName, null, null, 'PROGRAM_NOT_FOUND', `Program code ${sheetProgramCode} not found`);
      invalidRecords++;
      continue;
    }

    if (!validPricingTypes.includes(pricingType)) {
      await logError(sessionId, sheetName, null, null, 'INVALID_PRICING_TYPE', `Pricing type ${pricingType} not found in system`);
      invalidRecords++;
      continue;
    }

    const allowedPricingTypes = Array.isArray(programCfg.template_metadata?.pricingTypes)
      ? programCfg.template_metadata.pricingTypes
      : [];
    if (allowedPricingTypes.length > 0 && !allowedPricingTypes.includes(pricingType)) {
      await logError(sessionId, sheetName, null, null, 'PRICING_TYPE_NOT_ALLOWED', `Pricing type ${pricingType} not allowed for program ${sheetProgramCode}`);
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

    // Lender validation: expect comma-separated lenders in cell B1
    const lendersCellRaw = (programRow[1] ?? '').toString().trim();
    const allowedLenders = Array.isArray(programCfg.template_metadata?.lenders)
      ? (programCfg.template_metadata.lenders as string[])
      : [];
    const allowedLenderSet = new Set(allowedLenders.map((l: string) => l.toLowerCase()));

    if (!lendersCellRaw) {
      await logError(sessionId, sheetName, 1, 'Column B', 'MISSING_LENDERS', 'Lender list (B1) is required');
      invalidRecords++;
    } else {
      const lendersList = lendersCellRaw.split(',').map((s: string) => s.trim()).filter(Boolean);
      if (lendersList.length === 0) {
        await logError(sessionId, sheetName, 1, 'Column B', 'MISSING_LENDERS', 'No lenders provided in cell B1');
        invalidRecords++;
      } else {
        for (const lender of lendersList) {
          const lenderLc = lender.toLowerCase();
          if (!validLenderSet.has(lenderLc)) {
            await logError(sessionId, sheetName, 1, 'Column B', 'INVALID_LENDER', `Lender not found in system: ${lender}`, lender);
            invalidRecords++;
          } else if (allowedLenderSet.size > 0 && !allowedLenderSet.has(lenderLc)) {
            await logError(sessionId, sheetName, 1, 'Column B', 'LENDER_NOT_ALLOWED', `Lender not allowed for program ${sheetProgramCode}: ${lender}`, lender);
            invalidRecords++;
          }
        }
      }
    }

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
      if (!validGeoSet.has(String(geoCode))) {
        await logError(sessionId, sheetName, row + 1, 'Column A', 'INVALID_GEO_CODE', `Geo code not found in system: ${geoCode}`, String(geoCode));
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

async function parseWorkbookData(workbook: any, sessionId: string, userId: string) {
  const bulletinRecords: any[] = [];

  for (const sheetName of workbook.SheetNames) {
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    if (data.length < 4) continue;

    const lastUnderscoreIndex = sheetName.lastIndexOf('_');
    const pricingType = sheetName.substring(lastUnderscoreIndex + 1);
    const sheetProgramCode = sheetName.substring(0, lastUnderscoreIndex).trim();
    const programRow = data[0] as any[];
    const creditProfileRow = data[1] as any[];
    const pricingConfigRow = data[2] as any[];
    const lendersCellRaw = (programRow[1] ?? '').toString();
    const lenderList = lendersCellRaw.split(',').map((s: string) => s.trim()).filter(Boolean).join(', ');

    // Parse data rows
    for (let row = 3; row < data.length; row++) {
      const rowData = data[row] as any[];
      const geoCode = rowData[0];

      if (!geoCode) continue;

      for (let col = 1; col < rowData.length; col++) {
        const pricingValue = rowData[col];
        if (pricingValue !== undefined && pricingValue !== null && pricingValue !== '' && !isNaN(Number(pricingValue))) {
          bulletinRecords.push({
            bulletin_id: `${sheetProgramCode}_${geoCode}_${pricingType}_${col}_${Date.now()}`,
            financial_program_code: sheetProgramCode,
            geo_code: String(geoCode),
            pricing_type: pricingType,
            credit_profile: creditProfileRow[col],
            pricing_config: pricingConfigRow[col],
            pricing_value: Number(pricingValue),
            upload_date: new Date().toISOString(),
            updated_date: new Date().toISOString(),
            advertised: false,
            created_by: userId,
            lender_list: lenderList
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