
import { useState, useEffect } from "react";

export type PricingType = {
  id: string;
  typeCode: string;
  typeName: string;
};

const STORAGE_KEY = "pricingTypesTableData";

const getInitialPricingTypes = (): PricingType[] => [
  { id: "1", typeCode: "STDAPR", typeName: "Standard APR" },
  { id: "2", typeCode: "SUBAPR", typeName: "Subvented APR" },
  { id: "3", typeCode: "MINDWPAY", typeName: "Min Down Payment" },
  { id: "4", typeCode: "SPR", typeName: "Special Rate" },
  { id: "5", typeCode: "INR", typeName: "Interest Rate" },
  { id: "6", typeCode: "ENHRV", typeName: "Enhanced Residual Value" },
  { id: "7", typeCode: "SUBMF", typeName: "Subvented Money Factor" },
  { id: "8", typeCode: "MAXBDAPR", typeName: "Max Base Down APR" },
  { id: "9", typeCode: "MAXMUAPR", typeName: "Max Markup APR" },
  { id: "10", typeCode: "ADF", typeName: "Additional Dealer Fee" }
];

export const usePricingTypes = () => {
  const [pricingTypes, setPricingTypes] = useState<PricingType[]>([]);

  // Load from localStorage or initial data.
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setPricingTypes(JSON.parse(saved));
        return;
      } catch {}
    }
    setPricingTypes(getInitialPricingTypes());
  }, []);

  // Save to localStorage.
  useEffect(() => {
    if (pricingTypes.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pricingTypes));
    }
  }, [pricingTypes]);

  const addPricingType = (typeCode: string, typeName: string) => {
    // Prevent duplicates based on typeCode
    if (pricingTypes.some(pt => pt.typeCode === typeCode)) {
      return false;
    }
    setPricingTypes(prev => [
      ...prev,
      {
        id: (prev.length + 1).toString(),
        typeCode,
        typeName,
      },
    ]);
    return true;
  };

  return { pricingTypes, addPricingType, setPricingTypes };
};

