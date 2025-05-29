
export interface Country {
  code: string;
  name: string;
  flag: string;
  region: 'North America' | 'Europe' | 'Middle East';
  currency: string;
}

export const COUNTRIES: Country[] = [
  // North America
  { code: 'US', name: 'United States', flag: '🇺🇸', region: 'North America', currency: 'USD' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', region: 'North America', currency: 'CAD' },
  // Europe
  { code: 'DE', name: 'Germany', flag: '🇩🇪', region: 'Europe', currency: 'EUR' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', region: 'Europe', currency: 'EUR' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭', region: 'Europe', currency: 'CHF' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴', region: 'Europe', currency: 'NOK' },
  // Middle East
  { code: 'KSA', name: 'Saudi Arabia', flag: '🇸🇦', region: 'Middle East', currency: 'SAR' },
  { code: 'UAE', name: 'United Arab Emirates', flag: '🇦🇪', region: 'Middle East', currency: 'AED' },
];

export const REGIONS = ['North America', 'Europe', 'Middle East'] as const;
