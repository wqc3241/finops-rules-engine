import { supabase } from "@/integrations/supabase/client";
import * as XLSX from 'xlsx';
import { toast } from "sonner";
import JSZip from 'jszip';

interface BulletinPricingRow {
  bulletin_id: string;
  financial_program_code: string;
  lender_list: string;
  geo_code: string;
  pricing_type: string;
  credit_profile: string;
  pricing_config: string;
  pricing_value: number;
  advertised: boolean;
  upload_date: string;
  updated_date: string;
  created_by: string;
}

interface ProgramConfig {
  program_code: string;
  financial_product_id: string;
  credit_profiles: string[];
  pricing_configs: string[];
  template_metadata?: {
    pricing_types?: string[];
    credit_profiles?: string[];
    pricing_configs?: string[];
    sample_geo_codes?: string[];
  };
}

/**
 * Export bulletin pricing for selected financial program codes
 * Combines full data sheets and blank templates into a single Excel file
 */
export async function exportSelectedProgramsBulletinPricing(selectedProgramCodes: string[]) {
  if (!selectedProgramCodes.length) {
    toast.error("No programs selected for export");
    return;
  }

  try {
    toast.info("Preparing bulletin pricing export...");

    // Fetch bulletin pricing data for selected programs
    const { data: bulletinData, error: bulletinError } = await supabase
      .from('bulletin_pricing')
      .select('*')
      .in('financial_program_code', selectedProgramCodes)
      .order('financial_program_code')
      .order('lender_list')
      .order('pricing_type');

    if (bulletinError) {
      throw bulletinError;
    }

    // Fetch program configurations for selected programs
    const { data: programConfigs, error: configError } = await supabase
      .from('financial_program_configs')
      .select('*')
      .in('program_code', selectedProgramCodes);

    if (configError) {
      throw configError;
    }

    // Determine which programs have data and which need templates
    const programsWithData = new Set(bulletinData?.map(row => row.financial_program_code) || []);
    const programsNeedingTemplates = selectedProgramCodes.filter(code => !programsWithData.has(code));

    const workbook = XLSX.utils.book_new();

    // Create sheets for programs with existing data
    if (bulletinData && bulletinData.length > 0) {
      const groupedData = groupByProgramAndType(bulletinData);
      
      for (const [programCode, typeData] of Object.entries(groupedData)) {
        for (const [pricingType, rows] of Object.entries(typeData)) {
          const sheetName = sanitizeSheetName(`${programCode}_${pricingType}`);
          const worksheet = createDataWorksheet(programCode, pricingType, rows);
          XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
        }
      }
    }

    // Create template sheets for programs without data
    for (const programCode of programsNeedingTemplates) {
      const programConfig = programConfigs?.find(config => config.program_code === programCode);
      if (programConfig) {
        await createTemplateSheets(workbook, programCode, programConfig);
      }
    }

    // Generate and download the Excel file
    const arrayBuffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
    const blob = new Blob([arrayBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `Selected_Programs_Bulletin_Pricing_${new Date().toISOString().split('T')[0]}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    const totalSheets = Object.keys(workbook.Sheets).length;
    toast.success(`Export complete! Generated ${totalSheets} sheet(s) for ${selectedProgramCodes.length} program(s).`);

    return { fileCount: 1, sheetCount: totalSheets };
  } catch (error) {
    console.error('Selected programs export failed:', error);
    toast.error("Export failed. Please try again.");
    throw error;
  }
}

function groupByProgramAndType(data: BulletinPricingRow[]) {
  const grouped: Record<string, Record<string, BulletinPricingRow[]>> = {};
  
  for (const row of data) {
    const programCode = row.financial_program_code;
    const pricingType = row.pricing_type;
    
    if (!grouped[programCode]) {
      grouped[programCode] = {};
    }
    
    if (!grouped[programCode][pricingType]) {
      grouped[programCode][pricingType] = [];
    }
    
    grouped[programCode][pricingType].push(row);
  }
  
  return grouped;
}

function createDataWorksheet(programCode: string, pricingType: string, data: BulletinPricingRow[]) {
  // Get unique credit profiles and pricing configs from the data
  const creditProfiles = [...new Set(data.map(row => row.credit_profile))].sort();
  const pricingConfigs = [...new Set(data.map(row => row.pricing_config))].sort();
  const geoCodes = [...new Set(data.map(row => row.geo_code))].sort();
  
  const worksheetData: any[][] = [];
  
  // Header rows
  const row1 = ['Program Code', 'Lender', 'Pricing Type', 'Upload Date', ...creditProfiles];
  worksheetData.push(row1);
  
  const row2 = ['Geo Code', '', '', '', ...pricingConfigs.slice(0, creditProfiles.length)];
  worksheetData.push(row2);
  
  // Data rows
  for (const geoCode of geoCodes) {
    const geoData = data.filter(row => row.geo_code === geoCode);
    if (geoData.length === 0) continue;
    
    // Get representative row for metadata
    const sampleRow = geoData[0];
    const row = [
      programCode,
      sampleRow.lender_list,
      pricingType,
      new Date(sampleRow.upload_date).toLocaleDateString(),
    ];
    
    // Add pricing values for each credit profile/config combination
    for (let i = 0; i < creditProfiles.length; i++) {
      const creditProfile = creditProfiles[i];
      const pricingConfig = pricingConfigs[i] || pricingConfigs[0] || '';
      
      const matchingRow = geoData.find(d => 
        d.credit_profile === creditProfile && 
        d.pricing_config === pricingConfig
      );
      
      row.push(matchingRow?.pricing_value?.toString() || '');
    }
    
    worksheetData.push(row);
  }
  
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  applyWorksheetFormatting(worksheet, pricingType);
  
  return worksheet;
}

async function createTemplateSheets(workbook: XLSX.WorkBook, programCode: string, programConfig: any) {
  // Get available pricing types, credit profiles, and pricing configs
  const [pricingTypesResult, creditProfilesResult, pricingConfigsResult, geoCodesResult] = await Promise.all([
    supabase.from('pricing_types').select('*'),
    supabase.from('credit_profiles').select('profile_id'),
    supabase.from('pricing_configs').select('pricing_rule_id'),
    supabase.from('geo_location').select('geo_code').limit(10)
  ]);

  const pricingTypes = pricingTypesResult.data || [];
  const creditProfiles = creditProfilesResult.data || [];
  const pricingConfigs = pricingConfigsResult.data || [];
  const geoCodes = geoCodesResult.data || [];

  // Create a template sheet for each pricing type
  for (const pricingType of pricingTypes) {
    const sheetName = sanitizeSheetName(`${programCode}_${(pricingType as any).type_code}_Template`);
    const isLenderSpecific = (pricingType as any).is_lender_specific === true;
    
    const worksheet = createTemplateSheet(
      programCode,
      (pricingType as any).type_code,
      creditProfiles.map(c => c.profile_id),
      pricingConfigs.map(p => p.pricing_rule_id),
      geoCodes.map(g => g.geo_code),
      isLenderSpecific
    );
    
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  }
}

function createTemplateSheet(programCode: string, pricingType: string, creditProfiles: string[], pricingConfigs: string[], geoCodes: string[], isLenderSpecific: boolean) {
  const data: any[][] = [];

  if (isLenderSpecific) {
    // LENDER-SPECIFIC TEMPLATE FORMAT
    // Row 1: Program information headers
    const row1 = ['Program Code', 'Lender', 'Pricing Type', 'Template'];
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
    const row1 = ['Program Code', 'Pricing Type', 'Template'];
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

function applyWorksheetFormatting(worksheet: XLSX.WorkSheet, pricingType: string) {
  const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
  
  // Set column widths
  const colWidths = [
    { wch: 15 }, // Program Code
    { wch: 20 }, // Lender
    { wch: 12 }, // Pricing Type
    { wch: 12 }, // Upload Date
  ];
  
  // Add widths for credit profile columns
  for (let i = 4; i <= range.e.c; i++) {
    colWidths.push({ wch: 12 });
  }
  
  worksheet['!cols'] = colWidths;
  
  // Freeze panes (first 2 rows and first column)
  worksheet['!freeze'] = { xSplit: 1, ySplit: 2 };
  
  // Apply number format to pricing values based on pricing type
  const numFmt = pricingType.toLowerCase().includes('rate') ? '0.00%' : '#,##0.00';
  
  for (let R = 2; R <= range.e.r; R++) {
    for (let C = 4; C <= range.e.c; C++) {
      const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
      if (worksheet[cellRef]) {
        worksheet[cellRef].z = numFmt;
      }
    }
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