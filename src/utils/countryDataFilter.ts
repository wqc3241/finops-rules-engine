
import { useCountry } from '@/hooks/useCountry';

export const useCountryFilteredData = <T extends { country?: string }>(data: T[]): T[] => {
  const { selectedCountry } = useCountry();
  
  // Filter data by selected country
  // If no country field exists on the data, assume it's US data (legacy)
  return data.filter(item => {
    const itemCountry = item.country || 'US';
    return itemCountry === selectedCountry.code;
  });
};

export const filterDataByCountry = <T extends { country?: string }>(data: T[], countryCode: string): T[] => {
  return data.filter(item => {
    const itemCountry = item.country || 'US';
    return itemCountry === countryCode;
  });
};
