
import { useState } from "react";

export type FinancialProduct = {
  id: string;
  productType: string;
  productSubtype: string | null;
  geoCode: string;
  category: string;
  isActive: boolean;
};

const initialFinancialProducts: FinancialProduct[] = [
  {
    id: "USLN",
    productType: "Loan",
    productSubtype: null,
    geoCode: "NA-US",
    category: "Personal",
    isActive: true
  },
  {
    id: "USLE",
    productType: "Lease",
    productSubtype: null,
    geoCode: "NA-US",
    category: "Personal",
    isActive: true
  },
  {
    id: "DEL",
    productType: "Loan",
    productSubtype: null,
    geoCode: "EU-DE",
    category: "Personal",
    isActive: true
  },
  {
    id: "DELC",
    productType: "Loan",
    productSubtype: null,
    geoCode: "EU-DE",
    category: "Commercial",
    isActive: true
  },
  {
    id: "KSABM",
    productType: "Balloon",
    productSubtype: "Monthly",
    geoCode: "ME-KSA",
    category: "Personal",
    isActive: true
  },
  {
    id: "KSABA",
    productType: "Balloon",
    productSubtype: "Annual",
    geoCode: "ME-KSA",
    category: "Personal",
    isActive: true
  }
];

export function useFinancialProducts() {
  // In real app, this could fetch and update from state
  const [products] = useState(initialFinancialProducts);
  return products;
}
