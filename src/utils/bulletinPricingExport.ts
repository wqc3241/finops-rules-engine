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
    // Step 1: Fetch bulletin pricing data
    let query = supabase
      .from('bulletin_pricing')
      .select('*');

    if (selectedProgramCodes && selectedProgramCodes.length > 0) {
      query = query.in('financial_program_code', selectedProgramCodes);
    }

    const { data: bulletinData, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch bulletin pricing data: ${error.message}`);
    }

    if (!bulletinData || bulletinData.length === 0) {
      throw new Error('No bulletin pricing data found');
    }

    // Step 2: Get unique program codes and fetch their configurations
    const programCodes = Array.from(new Set(bulletinData.map(row => row.financial_program_code).filter(Boolean))) as string[];
    
    const { data: programConfigs, error: configError } = await supabase
      .from('financial_program_configs')
      .select('*')
      .in('program_code', programCodes);

    if (configError) {
      throw new Error(`Failed to fetch program configurations: ${configError.message}`);
    }

    // Step 3: Group data by lender
    const lenderGroups = groupByLender(bulletinData);

    // Debug: summarize lenders and row counts
    const lenderCounts: Record<string, number> = {};
    for (const row of bulletinData) {
      const lenders = (row.lender_list ?? 'Unknown')
        .split(',')
        .map(l => l.trim())
        .filter(Boolean);
      if (lenders.length === 0) lenders.push('Unknown');
      for (const l of lenders) lenderCounts[l] = (lenderCounts[l] ?? 0) + 1;
    }
    console.info('Bulletin Export Debug:lenderSummary', {
      distinctLenders: Object.keys(lenderCounts).sort(),
      counts: lenderCounts,
      totalRows: bulletinData.length
    });

    // Step 4: Generate workbooks
    const workbooks: { filename: string; workbook: XLSX.WorkBook }[] = [];

    for (const [lender, lenderData] of Object.entries(lenderGroups)) {
      const workbook = createWorkbookForLender(lender, lenderData, programConfigs || []);
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      
      // Debug: list sheets created per lender
      try {
        console.info('Bulletin Export Debug:workbookSheets', {
          lender,
          sheetCount: workbook.SheetNames?.length ?? 0,
          sheets: workbook.SheetNames?.slice(0, 50)
        });
      } catch {}
      
      let filename: string;
      const uniquePrograms = Array.from(new Set(lenderData.map(row => row.financial_program_code).filter(Boolean)));
      
      const lenderSafe = String(lender).replace(/[^\w.-]+/g, '_');
      
      if (uniquePrograms.length === 1) {
        const progSafe = String(uniquePrograms[0]).replace(/[^\w.-]+/g, '_');
        filename = `bulletin_${progSafe}_${lenderSafe}_${dateStr}.xlsx`;
      } else {
        filename = `bulletin_multi_${lenderSafe}_${dateStr}.xlsx`;
      }
      
      workbooks.push({ filename, workbook });
    }

    // Step 5: Download files
    if (workbooks.length === 1) {
      // Single workbook - direct download
      const { filename, workbook } = workbooks[0];
      XLSX.writeFile(workbook, filename);
    } else {
      // Multiple workbooks - zip them
      const zip = new JSZip();
      
      for (const { filename, workbook } of workbooks) {
        const buffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
        zip.file(filename, buffer);
      }
      
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const zipFilename = `bulletin_pricing_export_${dateStr}.zip`;
      
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = zipFilename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    return { success: true, fileCount: workbooks.length };
  } catch (error) {
    console.error('Export failed:', error);
    throw error;
  }
}

function groupByLender(data: BulletinPricingRow[]): Record<string, BulletinPricingRow[]> {
  return data.reduce((groups, row) => {
    const lendersRaw = row.lender_list ?? 'Unknown';
    const lenders = lendersRaw
      .split(',')
      .map(l => l.trim())
      .filter(Boolean);

    // If no lenders after split (e.g., empty string), put under Unknown
    const effectiveLenders = lenders.length > 0 ? lenders : ['Unknown'];

    for (const lender of effectiveLenders) {
      if (!groups[lender]) {
        groups[lender] = [];
      }
      groups[lender].push(row);
    }
    return groups;
  }, {} as Record<string, BulletinPricingRow[]>);
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
  // Remove invalid Excel sheet name characters and normalize spaces
  let cleaned = String(name)
    .replace(/[\u200B\u00A0]/g, '') // hidden spaces
    .replace(/[\\\/:\?\*\[\]]/g, '-') // invalid chars: \ / : ? * [ ]
    .replace(/'/g, '') // remove apostrophes
    .trim()
    .replace(/\s+/g, ' ');
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