
import React from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { useCountry } from '@/hooks/useCountry';
import { REGIONS } from '@/types/country';

const CountrySelector = () => {
  const { selectedCountry, setSelectedCountry, getCountriesByRegion } = useCountry();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="h-8 px-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-base">{selectedCountry.flag}</span>
            <span className="font-medium">{selectedCountry.code}</span>
            <ChevronDown className="h-3 w-3" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 bg-white border border-gray-200 shadow-lg" align="end">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Select Country</h3>
          </div>
          <p className="text-sm text-gray-600 mt-1">Choose your country to view relevant data</p>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {REGIONS.map((region) => {
            const countries = getCountriesByRegion(region);
            return (
              <div key={region} className="p-2">
                <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {region}
                </div>
                <div className="space-y-1">
                  {countries.map((country) => (
                    <button
                      key={country.code}
                      onClick={() => setSelectedCountry(country)}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
                        selectedCountry.code === country.code
                          ? 'bg-blue-50 text-blue-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-base">{country.flag}</span>
                      <div className="flex-1 text-left">
                        <div className="font-medium">{country.name}</div>
                        <div className="text-xs text-gray-500">{country.code} • {country.currency}</div>
                      </div>
                      {selectedCountry.code === country.code && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CountrySelector;
