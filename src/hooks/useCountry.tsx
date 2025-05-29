
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Country, COUNTRIES } from '@/types/country';

interface CountryContextType {
  selectedCountry: Country;
  setSelectedCountry: (country: Country) => void;
  getCountriesByRegion: (region: string) => Country[];
}

const CountryContext = createContext<CountryContextType | undefined>(undefined);

const COUNTRY_STORAGE_KEY = 'lucidSelectedCountry';

export const CountryProvider = ({ children }: { children: ReactNode }) => {
  const [selectedCountry, setSelectedCountryState] = useState<Country>(() => {
    const saved = localStorage.getItem(COUNTRY_STORAGE_KEY);
    if (saved) {
      try {
        const countryCode = JSON.parse(saved);
        return COUNTRIES.find(c => c.code === countryCode) || COUNTRIES[0];
      } catch {
        return COUNTRIES[0]; // Default to US
      }
    }
    return COUNTRIES[0]; // Default to US
  });

  const setSelectedCountry = (country: Country) => {
    setSelectedCountryState(country);
    localStorage.setItem(COUNTRY_STORAGE_KEY, JSON.stringify(country.code));
  };

  const getCountriesByRegion = (region: string) => {
    return COUNTRIES.filter(country => country.region === region);
  };

  return (
    <CountryContext.Provider value={{
      selectedCountry,
      setSelectedCountry,
      getCountriesByRegion
    }}>
      {children}
    </CountryContext.Provider>
  );
};

export const useCountry = () => {
  const context = useContext(CountryContext);
  if (context === undefined) {
    throw new Error('useCountry must be used within a CountryProvider');
  }
  return context;
};
