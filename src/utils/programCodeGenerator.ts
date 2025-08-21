export interface VehicleStyleRecord {
  vehicle_style_id: string;
  model_year: string | number;
  make?: string;
  model?: string;
  trim?: string;
  style_name?: string;
  variant?: string;
}

export interface ProgramCodeParams {
  vehicleCondition: string;
  financialProduct: string;
  vehicleStyleId: string;
  vehicleStyleRecord?: VehicleStyleRecord;
  programStartDate: string;
}

/**
 * Generates a program code in the format: NR_AP24_0525_1
 * Where:
 * - N = First letter of Vehicle Condition (N=New, U=Used, D=Demo, C=CPO)
 * - R = First letter of Financial Product type (R=Loan, L=Lease)
 * - A = 4th character from vehicle_style_id after parsing
 * - P = 5th character from vehicle_style_id after parsing  
 * - 24 = Model year from vehicle_style_coding table
 * - 05 = Month from program start date (zero-padded)
 * - 25 = Last 2 digits of year from program start date
 * - 1 = Version number (increment if code exists)
 */
export const generateProgramCode = (
  params: ProgramCodeParams,
  existingCodes: string[] = []
): string => {
  // Get vehicle condition code (first letter)
  const conditionCode = getVehicleConditionCode(params.vehicleCondition);
  
  // Get financial product code (first letter)
  const productCode = getFinancialProductCode(params.financialProduct);
  
  // Extract style codes from vehicle_style_id
  const { styleCodeA, styleCodeP } = parseVehicleStyleId(params.vehicleStyleId);
  
  // Get model year (last 2 digits)
  const modelYear = params.vehicleStyleRecord?.model_year 
    ? String(params.vehicleStyleRecord.model_year).slice(-2)
    : new Date().getFullYear().toString().slice(-2);
  
  // Get date codes from program start date
  const startDate = new Date(params.programStartDate);
  const monthCode = String(startDate.getMonth() + 1).padStart(2, '0');
  const yearCode = startDate.getFullYear().toString().slice(-2);
  
  // Build base code without version
  const baseCode = `${conditionCode}${productCode}_${styleCodeA}${styleCodeP}${modelYear}_${monthCode}${yearCode}`;
  
  // Find next available version number
  let version = 1;
  let fullCode = `${baseCode}_${version}`;
  
  while (existingCodes.includes(fullCode)) {
    version++;
    fullCode = `${baseCode}_${version}`;
  }
  
  return fullCode;
};

/**
 * Get vehicle condition code (first letter)
 */
const getVehicleConditionCode = (condition: string): string => {
  const conditionMap: Record<string, string> = {
    'New': 'N',
    'Used': 'U', 
    'Demo': 'D',
    'CPO': 'C'
  };
  
  return conditionMap[condition] || 'N';
};

/**
 * Get financial product code (first letter of type)
 */
const getFinancialProductCode = (productId: string): string => {
  // Extract product type from ID or assume based on common patterns
  if (productId.toLowerCase().includes('loan')) {
    return 'R'; // R for Loan (Retail)
  } else if (productId.toLowerCase().includes('lease')) {
    return 'L'; // L for Lease
  } else {
    // Default logic - check first character or default to R
    return productId.charAt(0).toUpperCase() || 'R';
  }
};

/**
 * Parse vehicle style ID to extract A and P codes
 * Example: "NA-US_25_L_A_P_" -> A=A, P=P
 * or "ABCD123" -> A=C, P=D (4th and 5th characters)
 */
const parseVehicleStyleId = (vehicleStyleId: string): { styleCodeA: string; styleCodeP: string } => {
  // Remove any prefix and split by underscores
  const parts = vehicleStyleId.split('_').filter(Boolean);
  
  // Look for A and P in the parts
  let styleCodeA = 'A'; // default
  let styleCodeP = 'P'; // default
  
  // Method 1: Look for actual A and P in the parts
  const aPart = parts.find(part => part === 'A');
  const pPart = parts.find(part => part === 'P');
  
  if (aPart && pPart) {
    styleCodeA = 'A';
    styleCodeP = 'P';
  } else {
    // Method 2: Extract from positions in the cleaned string
    const cleanId = vehicleStyleId.replace(/[-_]/g, '');
    if (cleanId.length >= 4) {
      styleCodeA = cleanId.charAt(3).toUpperCase() || 'A';
    }
    if (cleanId.length >= 5) {
      styleCodeP = cleanId.charAt(4).toUpperCase() || 'P';
    }
  }
  
  return { styleCodeA, styleCodeP };
};

/**
 * Parse existing program codes to extract base patterns for conflict checking
 */
export const getExistingCodeBases = (codes: string[]): string[] => {
  return codes.map(code => {
    const parts = code.split('_');
    if (parts.length >= 3) {
      // Remove version number (last part)
      return parts.slice(0, -1).join('_');
    }
    return code;
  });
};