
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
      supabase.from('pricing_types').select('type_code, is_lender_specific'),
      supabase.from('credit_profiles').select('profile_id'),
      supabase.from('pricing_configs').select('pricing_rule_id'),
      supabase.from('lenders').select('lender_name'),
      supabase.from('geo_location').select('geo_code')
    ]);

    const validPricingTypes = pricingTypesResult.data?.map(p => p.type_code) || [];
    const pricingTypeMap = new Map(pricingTypesResult.data?.map(p => [p.type_code, p.is_lender_specific !== false]) || []);
    const validCreditProfiles = creditProfilesResult.data?.map(c => c.profile_id) || [];
    const validPricingConfigs = pricingConfigsResult.data?.map(p => p.pricing_rule_id) || [];
    const validLenders = (lendersResult.data?.map(l => l.lender_name) || []).filter(Boolean);
    const validGeoCodes = (geoLocationsResult.data?.map(g => g.geo_code) || []).filter(Boolean);

    const validationResults = await validateWorkbook(
      workbook,
      session.id,
      validPricingTypes,
      pricingTypeMap,
      validCreditProfiles,
      validPricingConfigs,
      validLenders,
      validGeoCodes,
      programConfigMap
    );

    if (validationResults.isValid) {
      const bulletinRecords = await parseWorkbookData(workbook, session.id, user.id, pricingTypeMap);
      
      // Insert valid records into the pending_bulletin_pricing table for approval
      if (bulletinRecords.length > 0) {
        // Create change request
        const changeRequestId = crypto.randomUUID();
        const { error: changeRequestError } = await adminSupabase
          .from('change_requests')
          .insert({
            id: changeRequestId,
            created_by: user.id,
            status: 'IN_REVIEW',
            version_id: session.id,
            table_schema_ids: ['bulletin_pricing'],
            comment: `Bulletin pricing upload: ${bulletinRecords.length} records for programs ${programCodesCsv}`
          });

        if (changeRequestError) {
          console.error('Error creating change request:', changeRequestError);
          await updateSessionStatus(session.id, 'failed', 'failed');
          return new Response(
            JSON.stringify({ 
              error: 'Failed to create change request',
              sessionId: session.id
            }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Insert into pending table
        const { error: insertError } = await adminSupabase
          .from('pending_bulletin_pricing')
          .insert(bulletinRecords.map(record => ({
            session_id: session.id,
            bulletin_id: record.bulletin_id,
            financial_program_code: record.financial_program_code,
            pricing_type: record.pricing_type,
            pricing_config: record.pricing_config,
            credit_profile: record.credit_profile,
            pricing_value: record.pricing_value,
            lender_list: record.lender_list,
            geo_code: record.geo_code,
            advertised: record.advertised,
            created_by: user.id,
            upload_date: new Date().toISOString()
          })));

        if (insertError) {
          console.error('Failed to insert pending bulletin records:', insertError);
          await updateSessionStatus(session.id, 'failed', 'failed');
          return new Response(
            JSON.stringify({ 
              error: 'Failed to insert bulletin pricing records',
              sessionId: session.id
            }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Create change details for each record
        const changeDetails = bulletinRecords.map(record => ({
          request_id: changeRequestId,
          table_name: 'bulletin_pricing',
          rule_key: record.bulletin_id,
          old_value: null,
          new_value: record,
          status: 'PENDING'
        }));

        const { error: changeDetailsError } = await adminSupabase
          .from('change_details')
          .insert(changeDetails);

        if (changeDetailsError) {
          console.error('Error creating change details:', changeDetailsError);
          await updateSessionStatus(session.id, 'failed', 'failed');
          return new Response(
            JSON.stringify({ 
              error: 'Failed to create change details',
              sessionId: session.id
            }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Lock the bulletin_pricing table
        const { error: lockError } = await adminSupabase
          .from('table_locks')
          .insert({
            schema_id: 'bulletin_pricing',
            locked_by: user.id,
            request_id: changeRequestId
          });

        if (lockError) {
          console.error('Warning: Could not lock table:', lockError);
          // Don't throw here as it's not critical
        }

        // Update session with change request ID
        const { error: sessionUpdateError } = await adminSupabase
          .from('bulletin_upload_sessions')
          .update({
            change_request_id: changeRequestId,
            approval_status: 'pending_approval'
          })
          .eq('id', session.id);

        if (sessionUpdateError) {
          console.error('Error updating session:', sessionUpdateError);
          await updateSessionStatus(session.id, 'failed', 'failed');
          return new Response(
            JSON.stringify({ 
              error: 'Failed to update session',
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
  pricingTypeMap: Map<string, boolean>,
  validCreditProfiles: string[],
  validPricingConfigs: string[],
  validLenders: string[],
  validGeoCodes: string[],
  programConfigMap: Record<string, any>
) {
  const errors: any[] = [];
  let totalRecords = 0; // counts non-empty pricing cells only
  let validRecords = 0;
  let invalidRecords = 0;

  // Normalization helpers
  const normalizeLender = (s: string) => s?.toString().trim().toUpperCase();
  const normalizeGeo = (s: string) => s?.toString().trim().toUpperCase().replace(/_/g, '-');

  // Normalize system lists
  const validLenderSet = new Set(validLenders.map(l => normalizeLender(l)).filter(Boolean));
  const validGeoSet = new Set(validGeoCodes.map(g => normalizeGeo(g)).filter(Boolean));

  // Helper to push error for response and also persist to DB
  const pushError = async (
    sheetName: string,
    rowNumber: number | null,
    columnName: string | null,
    errorType: string,
    errorMessage: string,
    fieldValue?: string
  ) => {
    errors.push({ sheet_name: sheetName, row_number: rowNumber, column_name: columnName, error_type: errorType, error_message: errorMessage, field_value: fieldValue });
    await logError(sessionId, sheetName, rowNumber, columnName, errorType, errorMessage, fieldValue);
  };

  // Iterate sheets
  for (const sheetName of workbook.SheetNames) {
    const worksheet = workbook.Sheets[sheetName];

    // Validate tab naming convention: {Program Code}_{Pricing Type}
    const lastUnderscoreIndex = sheetName.lastIndexOf('_');
    if (lastUnderscoreIndex === -1) {
      await pushError(sheetName, null, null, 'TAB_NAMING', 'Tab name should follow format PROGRAM_CODE_PRICINGTYPE');
      continue;
    }

    const sheetProgramCode = sheetName.substring(0, lastUnderscoreIndex).trim();
    const pricingType = sheetName.substring(lastUnderscoreIndex + 1).trim();

    const programCfg = programConfigMap[sheetProgramCode];
    if (!programCfg) {
      await pushError(sheetName, null, null, 'PROGRAM_NOT_FOUND', `Program code ${sheetProgramCode} not found`);
      continue;
    }

    if (!validPricingTypes.includes(pricingType)) {
      await pushError(sheetName, null, null, 'INVALID_PRICING_TYPE', `Pricing type ${pricingType} not found in system`);
      continue;
    }

    // Check if this pricing type is lender-specific
    const isLenderSpecific = pricingTypeMap.get(pricingType) !== false;

    const allowedPricingTypes = Array.isArray(programCfg.template_metadata?.pricingTypes)
      ? programCfg.template_metadata.pricingTypes as string[]
      : [];
    if (allowedPricingTypes.length > 0 && !allowedPricingTypes.includes(pricingType)) {
      await pushError(sheetName, null, null, 'PRICING_TYPE_NOT_ALLOWED', `Pricing type ${pricingType} not allowed for program ${sheetProgramCode}`);
      continue;
    }

    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    if (data.length < 4) {
      await pushError(sheetName, null, null, 'INSUFFICIENT_ROWS', 'Sheet must have at least 4 rows (headers + data)');
      continue;
    }

    // Header rows according to template: C2+=credit profiles, C3+=pricing configs
    const creditProfileRow = (data[1] as any[]) || [];
    const pricingConfigRow = (data[2] as any[]) || [];

    // Determine max columns to scan, starting at col index 2 (column C)
    const maxCols = Math.max(creditProfileRow.length, pricingConfigRow.length);

    // Precompute header validity per column
    const headerInfo: Array<{ cp?: string; pcfg?: string; valid: boolean; col: number }>
      = [];
    for (let col = 2; col < maxCols; col++) {
      const cp = creditProfileRow[col] ? String(creditProfileRow[col]).trim() : '';
      const pcfg = pricingConfigRow[col] ? String(pricingConfigRow[col]).trim() : '';

      let validHeader = true;
      if (!cp) {
        await pushError(sheetName, 2, `Column ${col + 1}`, 'MISSING_CREDIT_PROFILE_HEADER', 'Missing credit profile header');
        validHeader = false;
      } else if (!validCreditProfiles.includes(cp)) {
        await pushError(sheetName, 2, `Column ${col + 1}`, 'INVALID_CREDIT_PROFILE', `Credit profile ${cp} not found in system`);
        validHeader = false;
      }

      if (!pcfg) {
        await pushError(sheetName, 3, `Column ${col + 1}`, 'MISSING_PRICING_CONFIG_HEADER', 'Missing pricing config header');
        validHeader = false;
      } else if (!validPricingConfigs.includes(pcfg)) {
        await pushError(sheetName, 3, `Column ${col + 1}`, 'INVALID_PRICING_CONFIG', `Pricing config ${pcfg} not found in system`);
        validHeader = false;
      }

      headerInfo.push({ cp, pcfg, valid: validHeader, col });
    }

    // Allowed lenders from template metadata (optional allowlist)
    const allowedLenders = Array.isArray(programCfg.template_metadata?.lenders)
      ? (programCfg.template_metadata.lenders as string[])
      : [];
    const allowedLenderSet = new Set(allowedLenders.map(l => normalizeLender(String(l))));
    const hasTemplateLenders = allowedLenderSet.size > 0;

    // Allowed geos from template metadata (optional allowlist)
    const allowedGeos = Array.isArray(programCfg.template_metadata?.geoCodes)
      ? (programCfg.template_metadata.geoCodes as string[])
      : [];
    const allowedGeoSet = new Set(allowedGeos.map(g => normalizeGeo(String(g))));
    const hasTemplateGeos = allowedGeoSet.size > 0;

    // Data rows start at row index 3 (row 4 in Excel)
    for (let row = 3; row < data.length; row++) {
      const rowData = (data[row] as any[]) || [];
      const rowNumber = row + 1;

      let lenderRaw: string;
      let geoRaw: string;
      let lenderPresent: boolean;
      let geoPresent: boolean;
      let lenderNorm: string;
      let geoNorm: string;
      let lenderOK: boolean;
      let geoOK: boolean;

      if (isLenderSpecific) {
        // LENDER-SPECIFIC FORMAT: A = lender, B = geo code
        lenderRaw = rowData[0] !== undefined && rowData[0] !== null ? String(rowData[0]).trim() : '';
        geoRaw = rowData[1] !== undefined && rowData[1] !== null ? String(rowData[1]).trim() : '';

        lenderPresent = !!lenderRaw;
        geoPresent = !!geoRaw;
        lenderNorm = lenderPresent ? normalizeLender(lenderRaw) : '';
        geoNorm = geoPresent ? normalizeGeo(geoRaw) : '';

        // Validate lender
        const lenderAllowedByTemplate = lenderPresent && allowedLenderSet.has(lenderNorm);
        const lenderInSystem = lenderPresent && validLenderSet.has(lenderNorm);
        lenderOK = lenderPresent && (hasTemplateLenders ? lenderAllowedByTemplate : lenderInSystem);

        if (!lenderPresent) {
          await pushError(sheetName, rowNumber, 'Column A', 'MISSING_LENDER', 'Lender is required in column A');
        } else if (!lenderOK) {
          await pushError(
            sheetName,
            rowNumber,
            'Column A',
            hasTemplateLenders ? 'LENDER_NOT_ALLOWED' : 'INVALID_LENDER',
            hasTemplateLenders
              ? `Lender not allowed for program ${sheetProgramCode}: ${lenderRaw}`
              : `Lender not found in system: ${lenderRaw}`,
            lenderRaw
          );
        }
      } else {
        // UNIVERSAL FORMAT: A = geo code, no lender
        geoRaw = rowData[0] !== undefined && rowData[0] !== null ? String(rowData[0]).trim() : '';
        geoPresent = !!geoRaw;
        geoNorm = geoPresent ? normalizeGeo(geoRaw) : '';

        // No lender for universal pricing types
        lenderRaw = '';
        lenderPresent = false;
        lenderNorm = '';
        lenderOK = true; // Not required for universal
      }

      // Validate geo code
      const geoAllowedByTemplate = geoPresent && allowedGeoSet.has(geoNorm);
      const geoInSystem = geoPresent && validGeoSet.has(geoNorm);
      geoOK = geoPresent && (hasTemplateGeos ? geoAllowedByTemplate : geoInSystem);

      if (!geoPresent) {
        await pushError(sheetName, rowNumber, isLenderSpecific ? 'Column B' : 'Column A', 'MISSING_GEO_CODE', 'Geo code is required');
      } else if (!geoOK) {
        await pushError(
          sheetName,
          rowNumber,
          isLenderSpecific ? 'Column B' : 'Column A',
          hasTemplateGeos ? 'GEO_CODE_NOT_ALLOWED' : 'INVALID_GEO_CODE',
          hasTemplateGeos
            ? `Geo code not allowed for program ${sheetProgramCode}: ${geoRaw}`
            : `Geo code not found in system: ${geoRaw}`,
          geoRaw
        );
      }

      // Scan value cells across this row
      for (const h of headerInfo) {
        const col = h.col;
        const cell = rowData[col];
        const colName = `Column ${col + 1}`;

        if (cell === undefined || cell === null || cell === '') {
          // empty cell -> not counted
          continue;
        }

        // Count this cell as a record
        totalRecords++;

        // If row-level prerequisites fail, mark this cell invalid
        if (!(lenderOK && geoOK)) {
          invalidRecords++;
          // Prefer row-level error type in message
          const reason = isLenderSpecific && !lenderPresent
            ? 'MISSING_LENDER'
            : isLenderSpecific && !lenderOK
              ? (hasTemplateLenders ? 'LENDER_NOT_ALLOWED' : 'INVALID_LENDER')
              : !geoPresent
                ? 'MISSING_GEO_CODE'
                : (hasTemplateGeos ? 'GEO_CODE_NOT_ALLOWED' : 'INVALID_GEO_CODE');
          await pushError(sheetName, rowNumber, colName, reason, `Cannot accept value without valid ${isLenderSpecific ? 'lender/geo' : 'geo'}. Value: ${cell}`);
          continue;
        }

        // Header validation per column
        if (!h.valid) {
          invalidRecords++;
          await pushError(sheetName, rowNumber, colName, 'INVALID_HEADER_AT_COLUMN', `Invalid/missing header(s) for column: CP='${h.cp}', CFG='${h.pcfg}'`);
          continue;
        }

        // Numeric validation (supports percentages like 1.9%)
        let valStr = String(cell).trim();
        if (valStr.endsWith('%')) valStr = valStr.slice(0, -1).trim();
        const num = Number(valStr);
        if (isNaN(num)) {
          invalidRecords++;
          await pushError(sheetName, rowNumber, colName, 'INVALID_PRICING_VALUE', `Pricing value must be numeric. Got: ${cell}`);
          continue;
        }

        // Valid cell
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

async function parseWorkbookData(workbook: any, sessionId: string, userId: string, pricingTypeMap: Map<string, boolean>) {
  const bulletinRecords: any[] = [];

  for (const sheetName of workbook.SheetNames) {
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    if (data.length < 4) continue;

    const lastUnderscoreIndex = sheetName.lastIndexOf('_');
    const pricingType = sheetName.substring(lastUnderscoreIndex + 1).trim();
    const sheetProgramCode = sheetName.substring(0, lastUnderscoreIndex).trim();
    
    // Check if this pricing type is lender-specific
    const isLenderSpecific = pricingTypeMap.get(pricingType) !== false;

    const creditProfileRow = (data[1] as any[]) || [];
    const pricingConfigRow = (data[2] as any[]) || [];

    // Data rows start at row index 3 (row 4 in Excel)
    const normalizeLender = (s: string) => s?.toString().trim().toUpperCase();
    const normalizeGeo = (s: string) => s?.toString().trim().toUpperCase().replace(/_/g, '-');
    
    for (let row = 3; row < data.length; row++) {
      const rowData = (data[row] as any[]) || [];
      
      let lenderRaw: string;
      let geoRaw: string;
      let lenderNorm: string;
      let geoNorm: string;
      
      if (isLenderSpecific) {
        // LENDER-SPECIFIC FORMAT: A = lender, B = geo
        lenderRaw = rowData[0] !== undefined && rowData[0] !== null ? String(rowData[0]).trim() : '';
        geoRaw = rowData[1] !== undefined && rowData[1] !== null ? String(rowData[1]).trim() : '';
        
        if (!lenderRaw || !geoRaw) continue;
        
        lenderNorm = normalizeLender(lenderRaw);
        geoNorm = normalizeGeo(geoRaw);
      } else {
        // UNIVERSAL FORMAT: A = geo, no lender
        geoRaw = rowData[0] !== undefined && rowData[0] !== null ? String(rowData[0]).trim() : '';
        
        if (!geoRaw) continue;
        
        lenderNorm = ''; // Empty for universal pricing types
        geoNorm = normalizeGeo(geoRaw);
      }

      // Scan columns from C onward (index 2)
      const maxCols = Math.max(creditProfileRow.length, pricingConfigRow.length, rowData.length);
      for (let col = 2; col < maxCols; col++) {
        const cp = creditProfileRow[col] ? String(creditProfileRow[col]).trim() : '';
        const pcfg = pricingConfigRow[col] ? String(pricingConfigRow[col]).trim() : '';
        if (!cp || !pcfg) continue;

        const raw = rowData[col];
        if (raw === undefined || raw === null || raw === '') continue;
        let valStr = String(raw).trim();
        if (valStr.endsWith('%')) valStr = valStr.slice(0, -1).trim();
        const num = Number(valStr);
        if (isNaN(num)) continue;

        bulletinRecords.push({
          bulletin_id: `${sheetProgramCode}_${lenderNorm || 'UNIVERSAL'}_${geoNorm}_${pricingType}_${cp}_${pcfg}_${Date.now()}`,
          financial_program_code: sheetProgramCode,
          geo_code: geoNorm,
          pricing_type: pricingType,
          credit_profile: cp,
          pricing_config: pcfg,
          pricing_value: num,
          upload_date: new Date().toISOString(),
          updated_date: new Date().toISOString(),
          advertised: false,
          created_by: userId,
          lender_list: lenderNorm // Empty string for universal pricing types
        });
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