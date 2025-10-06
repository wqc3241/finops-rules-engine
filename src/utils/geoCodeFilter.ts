import { Country } from '@/types/country';

/**
 * Get SQL filter pattern for geo_code based on country
 * @param countryCode - Country code ('US' or 'CA')
 * @returns SQL ILIKE pattern (e.g., 'NA-US%')
 */
export const getGeoCodeFilter = (countryCode: string): string => {
  return `NA-${countryCode}%`;
};

/**
 * Check if a geo_code matches a specific country
 * @param geoCode - Geo code to check (e.g., 'NA-US', 'NA-US-CA', 'NA-CA-ON')
 * @param countryCode - Country code to match ('US' or 'CA')
 * @returns true if geo_code belongs to the country
 */
export const matchesCountry = (geoCode: string | null | undefined, countryCode: string): boolean => {
  if (!geoCode) return false;
  
  // Normalize to use hyphens (handle both NA-US and NA_US formats)
  const normalizedGeoCode = geoCode.replace(/_/g, '-').toUpperCase();
  const pattern = `NA-${countryCode.toUpperCase()}`;
  
  return normalizedGeoCode.startsWith(pattern);
};

/**
 * Format geo_code in standard format
 * @param countryCode - Country code ('US' or 'CA')
 * @param stateCode - Optional state/province code (e.g., 'CA', 'ON')
 * @returns Formatted geo_code (e.g., 'NA-US', 'NA-US-CA', 'NA-CA-ON')
 */
export const formatGeoCode = (countryCode: string, stateCode?: string): string => {
  const baseCode = `NA-${countryCode.toUpperCase()}`;
  
  if (stateCode) {
    return `${baseCode}-${stateCode.toUpperCase()}`;
  }
  
  return baseCode;
};

/**
 * Extract state/province code from geo_code
 * @param geoCode - Full geo code (e.g., 'NA-US-CA', 'NA-CA-ON')
 * @returns State/province code or null if not present
 */
export const extractStateCode = (geoCode: string | null | undefined): string | null => {
  if (!geoCode) return null;
  
  const parts = geoCode.split('-');
  // Format: NA-{COUNTRY}-{STATE}
  return parts.length >= 3 ? parts[2] : null;
};

/**
 * Get all US state codes for filtering
 */
export const US_STATE_CODES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

/**
 * Get all Canadian province/territory codes for filtering
 */
export const CA_PROVINCE_CODES = [
  'AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT'
];

/**
 * Get state/province codes for a country
 * @param countryCode - Country code ('US' or 'CA')
 * @returns Array of state/province codes
 */
export const getStateCodesForCountry = (countryCode: string): string[] => {
  return countryCode === 'US' ? US_STATE_CODES : CA_PROVINCE_CODES;
};
