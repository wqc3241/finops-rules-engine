import { supabase } from "@/integrations/supabase/client";
import * as XLSX from 'xlsx';
import JSZip from 'jszip';

interface BulletinPricingRow {
  bulletin_id: string;
  financial_program_code: string | null;
  pricing_config: string | null;
  geo_code: string | null;
  lender_list: string | null;
  advertised: boolean | null;
  pricing_type: string | null;
  pricing_value: number | null;
  upload_date: string | null;
  updated_date: string | null;
  credit_profile: string | null;
}

interface ProgramConfig {
  financial_program_code: string;
  financial_product_id: string;
  vehicle_style_id: string;
  financing_vehicle_condition: string;
  program_start_date: string;
  program_end_date: string;
  credit_profiles: string[];
  pricing_configs: string[];
  geo_codes: string[];
  pricing_types: string[];
}

export async function exportBulletinPricing(selectedProgramCodes?: string[]) {
  try {
    // 1) Fetch all bulletin pricing rows for the selection (or all if none specified)
    const bulletinData = await fetchAllBulletinPricing(selectedProgramCodes);

    // 2) Determine target program codes (always use the user's selection if provided)
    const targetProgramCodes = (selectedProgramCodes && selectedProgramCodes.length > 0)
      ? selectedProgramCodes
      : Array.from(new Set((bulletinData || []).map(r => r.financial_program_code).filter(Boolean))) as string[];

    if (!targetProgramCodes || targetProgramCodes.length === 0) {
      // Nothing selected and no data found
      throw new Error('No program codes provided or found for export');
    }

    // 3) Load program configurations for all target programs
    const { data: programConfigs, error: configError } = await supabase
      .from('financial_program_configs')
      .select('*')
      .in('program_code', targetProgramCodes);
    if (configError) throw new Error(`Failed to fetch program configurations: ${configError.message}`);

    // Also fetch global pricing types for fallback template generation
    const { data: pricingTypesRows } = await supabase
      .from('pricing_types')
      .select('type_code');
    const defaultPricingTypes: string[] = (pricingTypesRows || []).map((r: any) => r.type_code).filter(Boolean);

    for (const programCode of targetProgramCodes) {
      const programConfig: any = (programConfigs || []).find((c: any) => c.program_code === programCode);

      // Determine supported pricing types for this program
      const supportedTypesRaw: string[] =
        (programConfig?.pricing_types as string[] | undefined)
        || (programConfig?.template_metadata?.pricing_types as string[] | undefined)
        || Array.from(new Set((bulletinData || [])
            .filter(r => (r.financial_program_code || '').toUpperCase() === programCode.toUpperCase())
            .map(r => (r.pricing_type || '').toString())
            .filter(Boolean)
          ));

      const supportedTypes = (supportedTypesRaw || []).filter(Boolean);

      // If there are no explicit types, skip creating empty sheets
      for (const pricingType of supportedTypes) {
        // Filter data rows for current tab
        const rows = (bulletinData || []).filter(
          r => (r.financial_program_code || '').toUpperCase() === programCode.toUpperCase()
            && (r.pricing_type || '').toUpperCase() === pricingType.toString().toUpperCase()
        );

        const desiredName = `${programCode}_${pricingType}`;
        const sheetName = makeUniqueSheetName(desiredName, usedNames);

        const worksheet = createUnifiedWorksheet(programCode, pricingType, rows, programConfig);
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
        usedNames.add(sheetName);
      }
    }

    // 5) Download a single Excel file with naming rules
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const filename = targetProgramCodes.length === 1
      ? `bulletin_${targetProgramCodes[0]}_${dateStr}.xlsx`
      : `bulletin_multi_${targetProgramCodes.length}programs_${dateStr}.xlsx`;

    XLSX.writeFile(workbook, filename);

    return { success: true, fileCount: 1 };
  } catch (error) {
    console.error('Export failed:', error);
    throw error;
  }
}

function groupByLender(data: BulletinPricingRow[]): Record<string, BulletinPricingRow[]> {
  const normLender = (s?: string | null) =>
    (s ?? '')
      .replace(/[\u200B\u00A0]/g, '')
      .trim()
      .replace(/[()\[\]{}"']/g, '') // strip brackets/quotes
      .replace(/\s+/g, ' ')
      .toUpperCase();

  const splitLenders = (s: string) => {
    const raw = (s ?? '').replace(/[\u200B\u00A0]/g, '').trim();
    if (!raw) return [];
    const parts = raw.includes(',') ? raw.split(',') : [raw];
    return parts
      .map((l) => normLender(l))
      .filter(Boolean)
      .map((l) => (l.replace(/\s+/g, '').includes('LFS') ? 'LFS' : l));
  };

  const groups: Record<string, BulletinPricingRow[]> = {};
  
  for (const row of data) {
    const lendersRaw = row.lender_list ?? 'UNKNOWN';
    const lenders = splitLenders(lendersRaw);
    const effectiveLenders = lenders.length > 0 ? lenders : ['UNKNOWN'];

    for (const lender of effectiveLenders) {
      if (!groups[lender]) groups[lender] = [];
      groups[lender].push(row);
    }
  }


  // Debug: Log all lenders found
  console.info('Bulletin Export Debug:groupByLender', {
    totalRows: data.length,
    lenders: Object.keys(groups).sort(),
    lenderCounts: Object.fromEntries(
      Object.entries(groups).map(([k, v]) => [k, v.length])
    )
  });

  return groups;
}

function createWorkbookForLender(
  lender: string, 
  data: BulletinPricingRow[], 
  programConfigs: any[]
): XLSX.WorkBook {
  const workbook = XLSX.utils.book_new();

  // Group by program and pricing type combinations
  const sheetGroups = groupDataForSheets(data);
  const sheetCount = Object.keys(sheetGroups).length;
  if (sheetCount === 0) {
    console.warn('Bulletin Export Debug:noSheetsForLender', { lender, rows: data.length });
  } else {
    console.info('Bulletin Export Debug:createWorkbookForLender', {
      lender,
      sheetCount,
      sampleSheets: Object.keys(sheetGroups).slice(0, 10)
    });
  }

  // Extra debug for NL programs under this lender
  const nlSheets = Object.keys(sheetGroups).filter((k) => k.startsWith('NL|'));
  if (nlSheets.length > 0) {
    console.info('Bulletin Export Debug:NL group presence', { lender, nlSheets });
  }

  // Ensure unique, Excel-safe sheet names
  const usedNames = new Set<string>();

  for (const [sheetKey, sheetData] of Object.entries(sheetGroups)) {
    const [programCode, pricingType] = sheetKey.split('|');
    const desiredName = `${programCode}_${pricingType}`;
    const sheetName = makeUniqueSheetName(desiredName, usedNames);

    const worksheet = createWorksheet(lender, programCode, pricingType, sheetData, programConfigs);
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    usedNames.add(sheetName);
  }

  if (lender === 'LFS') {
    const names = workbook.SheetNames || [];
    const hasSUBRV = names.some(n => n.includes('NL_GDE26_0825_1_SUBRV'));
    const hasSUBMF = names.some(n => n.includes('NL_GDE26_0825_1_SUBMF'));
    console.info('Bulletin Export Debug:LFS workbook check', {
      lender,
      sheetCount: names.length,
      names: names.slice(0, 50),
      hasSUBRV,
      hasSUBMF,
    });
  }

  if ((workbook.SheetNames?.length ?? 0) === 0) {
    const info = XLSX.utils.aoa_to_sheet([[`No sheetable data for lender ${lender}. Rows: ${data.length}`]]);
    XLSX.utils.book_append_sheet(workbook, info, 'INFO');
  }

  return workbook;
}

function groupDataForSheets(data: BulletinPricingRow[]): Record<string, BulletinPricingRow[]> {
  // Normalize to avoid subtle mismatches (case, spaces, zero-width chars)
  const norm = (s?: string | null) =>
    (s ?? '')
      .replace(/[\u200B\u00A0]/g, '')
      .trim()
      .replace(/\s+/g, ' ')
      .toUpperCase();

  return data.reduce((groups, row) => {
    const programCode = norm(row.financial_program_code) || 'UNKNOWN';
    const pricingType = norm(row.pricing_type) || 'UNKNOWN';
    const key = `${programCode}|${pricingType}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(row);
    return groups;
  }, {} as Record<string, BulletinPricingRow[]>);
}

function createWorksheet(
  lender: string,
  programCode: string,
  pricingType: string,
  data: BulletinPricingRow[],
  programConfigs: any[]
): XLSX.WorkSheet {
  // Normalize helper (trim, collapse spaces, remove zero-width, uppercase)
  const norm = (s?: string | null) =>
    (s ?? '')
      .replace(/\u200B/g, '')
      .trim()
      .replace(/\s+/g, ' ')
      .toUpperCase();

  // Find program config for metadata
  const programConfig = programConfigs.find((config) => config.program_code === programCode);

  // Build unique, normalized headers/axes
  const geoCodes = Array.from(
    new Set(data.map((row) => norm(row.geo_code)).filter((v) => !!v))
  ).sort();
  const creditProfiles = Array.from(
    new Set(data.map((row) => norm(row.credit_profile)).filter((v) => !!v))
  ).sort();
  const pricingConfigs = Array.from(
    new Set(data.map((row) => norm(row.pricing_config)).filter((v) => !!v))
  ).sort(); // Explicit sorting for consistent column ordering

  // Debug overview
  console.info('Bulletin Export Debug:createWorksheet', {
    lender,
    programCode,
    pricingType,
    rows: data.length,
    geoCodes: geoCodes.length,
    creditProfiles: creditProfiles.length,
    pricingConfigs: pricingConfigs.length,
    pricingConfigsList: pricingConfigs,
    expectedColumns: creditProfiles.length * pricingConfigs.length
  });
  if (programCode === 'NL_GDE26_0825_1_SUBRV' || programCode === 'NL_GDE26_0825_1_SUBMF') {
    console.info('Bulletin Export Debug:targetSheetHeaders', {
      lender,
      programCode,
      pricingType,
      geoCodes,
      creditProfiles,
      pricingConfigs,
    });
  }

  // Validation: Log warning if pricing configs seem too few
  if (pricingConfigs.length < 4 && lender === 'BAC') {
    console.warn('BAC Pricing Configs Warning:', {
      found: pricingConfigs.length,
      configs: pricingConfigs,
      sampleData: data.slice(0, 3).map(row => ({
        pricing_config: row.pricing_config,
        normalized: norm(row.pricing_config)
      }))
    });
  }

  // Index data for fast, robust lookup
  const index = new Map<string, BulletinPricingRow[]>();
  for (const row of data) {
    const key = `${norm(row.geo_code)}|${norm(row.credit_profile)}|${norm(row.pricing_config)}`;
    if (!index.has(key)) index.set(key, []);
    index.get(key)!.push(row);
  }

  // Create data matrix
  const worksheet: any[][] = [];

  // A1: Metadata
  const metadata = `Program: ${programCode} | Lender: ${lender} | Product: ${
    programConfig?.financial_product_id || 'N/A'
  } | Vehicle: ${programConfig?.vehicle_style_id || 'N/A'}/${
    programConfig?.financing_vehicle_condition || 'N/A'
  } | Dates: ${programConfig?.program_start_date || 'N/A'}–${
    programConfig?.program_end_date || 'N/A'
  }`;
  worksheet[0] = [metadata];

  // Row 1: Credit Profile headers (starting from B1)
  const row1: any[] = [''];
  for (const creditProfile of creditProfiles) {
    for (let j = 0; j < pricingConfigs.length; j++) {
      row1.push(creditProfile);
    }
  }
  worksheet[1] = row1;

  // Row 2: Pricing Config headers (under each Credit Profile)
  const row2: any[] = [''];
  for (let i = 0; i < creditProfiles.length; i++) {
    for (const pricingConfig of pricingConfigs) {
      row2.push(pricingConfig);
    }
  }
  worksheet[2] = row2;

  // Data rows (starting from row 3, A3 down)
  let missingCount = 0;
  const sampleMisses: Array<{ geo: string; profile: string; config: string }> = [];

  for (let rowIndex = 0; rowIndex < geoCodes.length; rowIndex++) {
    const geoCode = geoCodes[rowIndex];
    const dataRow: any[] = [geoCode];

    for (const creditProfile of creditProfiles) {
      for (const pricingConfig of pricingConfigs) {
        const key = `${geoCode}|${creditProfile}|${pricingConfig}`;
        const matchingRows = index.get(key) || [];

        let cellValue: any = '';

        if (matchingRows.length === 0) {
          missingCount++;
          if (sampleMisses.length < 10) {
            sampleMisses.push({ geo: geoCode, profile: creditProfile, config: pricingConfig });
          }
          cellValue = 'N/A';
        } else if (matchingRows.length === 1) {
          cellValue = matchingRows[0].pricing_value as any;
        } else {
          // Multiple matches - use most recent
          const sorted = matchingRows.sort((a, b) => {
            const aDate = new Date(a.upload_date || a.updated_date || 0);
            const bDate = new Date(b.upload_date || b.updated_date || 0);
            return bDate.getTime() - aDate.getTime();
          });
          cellValue = sorted[0].pricing_value as any;
        }

        // Coerce numeric strings to numbers for proper Excel formatting
        if (typeof cellValue === 'string' && cellValue.trim() !== '' && !isNaN(Number(cellValue))) {
          cellValue = Number(cellValue);
        }

        dataRow.push(cellValue);
      }
    }

    worksheet[rowIndex + 3] = dataRow;
  }

  if (missingCount > 0) {
    console.warn('Bulletin Export Debug: missing combinations', {
      lender,
      programCode,
      pricingType,
      missingCount,
      sampleMisses,
    });
  }

  // Convert to worksheet
  const ws = XLSX.utils.aoa_to_sheet(worksheet);

  // Apply formatting
  applyWorksheetFormatting(
    ws,
    pricingType,
    geoCodes.length + 3,
    creditProfiles.length * pricingConfigs.length + 1
  );

  return ws;
}

function createUnifiedWorksheet(
  programCode: string,
  pricingType: string,
  data: BulletinPricingRow[],
  programConfig: any
): XLSX.WorkSheet {
  const norm = (s?: string | null) =>
    (s ?? '')
      .replace(/[\u200B\u00A0]/g, '')
      .trim()
      .replace(/\s+/g, ' ')
      .toUpperCase();

  // Program selections (fallback to template_metadata if present)
  const tm = (programConfig?.template_metadata || {}) as any;
  const selCreditProfiles: string[] = (programConfig?.credit_profiles as string[]) || (tm.credit_profiles as string[]) || [];
  const selPricingConfigs: string[] = (programConfig?.pricing_configs as string[]) || (tm.pricing_configs as string[]) || [];
  const selGeoCodes: string[] = (programConfig?.geo_codes as string[]) || (tm.geo_codes as string[]) || (tm.sample_geo_codes as string[]) || [];
  const selLenders: string[] = (tm.lenders as string[]) || (tm.lender_list as string[]) || [];

  // Collect from data
  const dataLenders = Array.from(new Set((data || []).map(r => norm(r.lender_list)).filter(Boolean)));
  const dataGeos = Array.from(new Set((data || []).map(r => norm(r.geo_code)).filter(Boolean)));
  const dataProfiles = Array.from(new Set((data || []).map(r => norm(r.credit_profile)).filter(Boolean)));
  const dataConfigs = Array.from(new Set((data || []).map(r => norm(r.pricing_config)).filter(Boolean)));

  // Sorting helpers
  const alpha = (a: string, b: string) => a.localeCompare(b, undefined, { numeric: true });
  const naturalNum = (a: string, b: string) => {
    const na = parseInt((a.match(/\d+/)?.[0] ?? ''), 10);
    const nb = parseInt((b.match(/\d+/)?.[0] ?? ''), 10);
    if (!isNaN(na) && !isNaN(nb)) return na - nb;
    return a.localeCompare(b, undefined, { numeric: true });
  };
  const orderWithSelection = (dataVals: string[], selection: string[] | undefined, cmp: (a:string,b:string)=>number) => {
    const vals = Array.from(new Set((selection || []).map(norm))).filter(Boolean);
    const setSel = new Set(vals);
    const rest = dataVals.filter(v => !setSel.has(v)).sort(cmp);
    return vals.length > 0 ? [...vals, ...rest] : dataVals.sort(cmp);
  };

  const lenders = orderWithSelection(dataLenders, selLenders, alpha);
  const geoCodes = orderWithSelection(dataGeos, selGeoCodes, alpha);
  const creditProfiles = orderWithSelection(dataProfiles, selCreditProfiles, alpha);
  const pricingConfigs = orderWithSelection(dataConfigs, selPricingConfigs, naturalNum);

  // Index data by lender|geo|profile|config (treat lender_list as atomic)
  const index = new Map<string, BulletinPricingRow[]>();
  for (const row of data) {
    const key = `${norm(row.lender_list)}|${norm(row.geo_code)}|${norm(row.credit_profile)}|${norm(row.pricing_config)}`;
    if (!index.has(key)) index.set(key, []);
    index.get(key)!.push(row);
  }

  // Build worksheet AOA
  const aoa: any[][] = [];

  // Row 1: Metadata
  const metadata = `Program: ${programCode} | Pricing Type: ${pricingType} | Product: ${programConfig?.financial_product_id || 'N/A'} | Vehicle: ${programConfig?.vehicle_style_id || 'N/A'}/${programConfig?.financing_vehicle_condition || 'N/A'} | Dates: ${programConfig?.program_start_date || 'N/A'}–${programConfig?.program_end_date || 'N/A'}`;
  aoa[0] = [metadata];

  // Row 2: Credit Profile headers starting at C1 (A,B reserved for Lender/Geo)
  const row1: any[] = ['', ''];
  for (const cp of creditProfiles) {
    for (let j = 0; j < pricingConfigs.length; j++) row1.push(cp);
  }
  aoa[1] = row1;

  // Row 3: Pricing Config headers under each Credit Profile
  const row2: any[] = ['LENDER', 'GEO_CODE'];
  for (let i = 0; i < creditProfiles.length; i++) {
    for (const pc of pricingConfigs) row2.push(pc);
  }
  aoa[2] = row2;

  // Track comments to add after sheet creation
  const comments: Array<{ r: number; c: number; text: string }> = [];

  let outR = 3;
  for (const lender of lenders) {
    for (const geo of geoCodes) {
      const rowArr: any[] = [lender, geo];
      for (const cp of creditProfiles) {
        for (const pc of pricingConfigs) {
          const key = `${lender}|${geo}|${cp}|${pc}`;
          const matches = index.get(key) || [];
          let val: any = '';
          if (matches.length === 1) {
            val = matches[0].pricing_value as any;
          } else if (matches.length > 1) {
            // Conflict resolution: advertised desc, upload_date desc, updated_date desc
            const toTime = (s?: string | null) => (s ? Date.parse(s) : 0);
            matches.sort((a, b) => {
              const adv = (Number(!!b.advertised) - Number(!!a.advertised));
              if (adv !== 0) return adv;
              const up = toTime(b.upload_date) - toTime(a.upload_date);
              if (up !== 0) return up;
              return toTime(b.updated_date) - toTime(a.updated_date);
            });
            val = matches[0].pricing_value as any;
            // Add comment for duplicate resolution
            comments.push({ r: outR, c: rowArr.length, text: 'Multiple matches—used most recent.' });
          }
          if (typeof val === 'string' && val.trim() !== '' && !isNaN(Number(val))) val = Number(val);
          rowArr.push(val);
        }
      }
      aoa[outR++] = rowArr;
    }
  }

  const ws = XLSX.utils.aoa_to_sheet(aoa);

  // Apply comments
  for (const cmt of comments) {
    const cellRef = XLSX.utils.encode_cell({ r: cmt.r, c: cmt.c });
    (ws as any)[cellRef] = (ws as any)[cellRef] || { v: '' };
    (ws as any)[cellRef].c = [{ t: cmt.text, a: 'System' }];
  }

  // Columns widths
  const numCols = 2 + creditProfiles.length * pricingConfigs.length;
  (ws as any)['!cols'] = Array.from({ length: numCols }, (_, i) => ({ width: i < 2 ? 16 : 12 }));

  // Freeze panes at B3
  (ws as any)['!freeze'] = { xSplit: 2, ySplit: 3 };

  // Number formats based on pricingType
  let numFmt = '0.000';
  const pt = (pricingType || '').toLowerCase();
  if (pt.includes('apr') || pt.includes('rate')) numFmt = '0.000%';
  else if (pt.includes('money')) numFmt = '0.000000';
  else if (pt.includes('rv')) numFmt = '0.0%';

  const totalRows = aoa.length;
  for (let r = 3; r < totalRows; r++) {
    for (let c = 2; c < numCols; c++) {
      const ref = XLSX.utils.encode_cell({ r, c });
      if ((ws as any)[ref] && typeof (ws as any)[ref].v === 'number') (ws as any)[ref].z = numFmt;
    }
  }

  return ws;
}

function applyWorksheetFormatting(
  ws: XLSX.WorkSheet, 
  pricingType: string, 
  numRows: number, 
  numCols: number
) {
  // Set column widths
  const colWidths = [];
  for (let i = 0; i < numCols; i++) {
    colWidths.push({ width: i === 0 ? 15 : 12 });
  }
  ws['!cols'] = colWidths;

  // Freeze panes at A3
  ws['!freeze'] = { xSplit: 1, ySplit: 3 };

  // Apply number formatting based on pricing type
  let numFmt = '0.000';
  if (pricingType?.toLowerCase().includes('apr') || pricingType?.toLowerCase().includes('rate')) {
    numFmt = '0.000%';
  } else if (pricingType?.toLowerCase().includes('money')) {
    numFmt = '0.000000';
  } else if (pricingType?.toLowerCase().includes('rv')) {
    numFmt = '0.0%';
  }

  // Apply formatting to data cells
  for (let row = 3; row < numRows; row++) {
    for (let col = 1; col < numCols; col++) {
      const cellAddr = XLSX.utils.encode_cell({ r: row, c: col });
      if (ws[cellAddr] && typeof ws[cellAddr].v === 'number') {
        ws[cellAddr].z = numFmt;
      }
    }
  }
}

function sanitizeSheetName(name: string): string {
  // Excel restrictions: invalid chars and 31-char limit; replace invalids with underscore
  let cleaned = String(name)
    .replace(/[\u200B\u00A0]/g, '')
    .replace(/[\\\/\*\?\[\]:]/g, '_')
    .replace(/'/g, '')
    .trim();
  if (cleaned.length > 31) cleaned = cleaned.slice(0, 31);
  if (!cleaned) cleaned = 'Sheet';
  return cleaned;
}

function makeUniqueSheetName(desired: string, usedNames: Set<string>): string {
  const baseRaw = sanitizeSheetName(desired);
  // initial truncate
  let base = baseRaw.length > 31 ? baseRaw.slice(0, 31) : baseRaw;
  let name = base;
  let counter = 2;
  while (usedNames.has(name)) {
    const suffix = ` (${counter})`;
    const maxBaseLen = 31 - suffix.length;
    const trimmedBase = base.slice(0, Math.max(1, maxBaseLen));
    name = `${trimmedBase}${suffix}`;
    counter++;
  }
  return name;
}

// Backward-compatible helper if used elsewhere
function truncateSheetName(name: string): string {
  return sanitizeSheetName(name).slice(0, 31);
}

// Fetch all bulletin_pricing rows in batches to bypass range limits
async function fetchAllBulletinPricing(selectedProgramCodes?: string[]): Promise<BulletinPricingRow[]> {
  // Supabase enforces a 1000 row per request cap. Page through all rows.
  const batchSize = 1000;
  let offset = 0;
  let page = 1;
  const all: BulletinPricingRow[] = [];
  let total: number | null = null;

  while (true) {
    const from = offset;
    const to = offset + batchSize - 1;

    let q = supabase
      .from('bulletin_pricing')
      .select('*', { count: 'exact' })
      .range(from, to);

    if (selectedProgramCodes && selectedProgramCodes.length > 0) {
      q = q.in('financial_program_code', selectedProgramCodes);
    }

    const { data, error, count } = await q;
    if (error) throw new Error(`Failed to fetch bulletin pricing data: ${error.message}`);

    const chunk = (data as any as BulletinPricingRow[]) ?? [];
    all.push(...chunk);
    if (total === null && typeof count === 'number') total = count;

    // Per-page debug for visibility
    console.debug('Bulletin Export Debug:fetchPage', {
      page,
      from,
      to,
      returned: chunk.length,
      cumulative: all.length,
      total: total ?? undefined,
    });

    if (chunk.length === 0) break; // no more rows

    // Advance by actual rows returned to avoid gaps with server-side caps
    offset += chunk.length;
    page += 1;

    // Stop when we reached the known total
    if (total !== null && all.length >= total) break;
  }

  console.info('Bulletin Export Debug:fetchAll', {
    batchSize,
    fetched: all.length,
    total: total ?? all.length,
    pages: page - 1,
  });

  return all;
}