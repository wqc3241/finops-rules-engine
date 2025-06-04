
import { TableData } from "@/types/dynamicTable";

export const getInitialData = (schemaId: string): TableData[] => {
  console.log('Getting initial data for schema:', schemaId);
  switch (schemaId) {
    case 'bulletin-pricing':
      return [
        {
          id: "1",
          financialProgramCode: "KSAAIBM05251",
          programId: "FPKSA01",
          pricingConfig: "PR003",
          geoCode: "ME-KSA",
          lenderName: "KSAAJB",
          advertised: false,
          pricingType: "INR",
          bulletinId: "BTKSA01",
          pricingValue: 0.0300,
          uploadDate: "2023-05-15"
        },
        {
          id: "2",
          financialProgramCode: "KSAAIBM05251",
          programId: "FPKSA01",
          pricingConfig: "PR003",
          geoCode: "ME-KSA",
          lenderName: "KSAAJB",
          advertised: false,
          pricingType: "SPR",
          bulletinId: "BTKSA01",
          pricingValue: 0.0295,
          uploadDate: "2023-05-15"
        }
      ];
    case 'pricing-types':
      return [
        { id: "1", typeCode: "STDAPR", typeName: "Standard APR" },
        { id: "2", typeCode: "SUBAPR", typeName: "Subvented APR" },
        { id: "3", typeCode: "MINDWPAY", typeName: "Min Down Payment" }
      ];
    case 'financial-products':
      return [
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
        }
      ];
    case 'pricing-rules':
      return [
        { id: "BT01", financialProgram: "AIPUNR07241", pricingConfig: "", pricingType: "SUBAPR", advertised: "Yes", pricingValue: "2.99", lenderList: "CMB, BAC", geoCode: "NA-US-CA" },
        { id: "BT02", financialProgram: "AIPUNR07241", pricingConfig: "PR002", pricingType: "SUBAPR", advertised: "Yes", pricingValue: "7.49", lenderList: "CMB, BAC", geoCode: "NA-US-CA" },
        { id: "BT03", financialProgram: "AIPUNL07241", pricingConfig: "PR003", pricingType: "ENHRV", advertised: "Yes", pricingValue: "60.50%", lenderList: "LFS", geoCode: "NA-US-CA" },
        { id: "BT04", financialProgram: "AIPUNL07241", pricingConfig: "PR003", pricingType: "SUBMF", advertised: "Yes", pricingValue: "60.50%", lenderList: "LFS", geoCode: "NA-US-CA" },
        { id: "BT05", financialProgram: "AIPUNR07241", pricingConfig: "PR001", pricingType: "MAXBDAPR", advertised: "Yes", pricingValue: "2", lenderList: "CMB", geoCode: "NA-US-CA" },
        { id: "BT06", financialProgram: "AIPUNR07241", pricingConfig: "PR002", pricingType: "MAXMUAPR", advertised: "Yes", pricingValue: "3", lenderList: "CMB", geoCode: "NA-US-CA" },
        { id: "BTKSA01-1", financialProgram: "SNBAIPUNL04251", pricingConfig: "KSAPR001", pricingType: "ADF", advertised: "", pricingValue: "3500.00", lenderList: "KSASNB", geoCode: "ME-KSA" },
        { id: "BTKSA01-2", financialProgram: "SNBAIPUNL04251", pricingConfig: "KSAPR001", pricingType: "INR", advertised: "", pricingValue: "2%", lenderList: "KSASNB", geoCode: "ME-KSA" }
      ];
    case 'credit-profile':
      return [
        {
          id: "P001",
          uuid: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
          priority: 1,
          minCreditScore: 800,
          maxCreditScore: 999,
          minIncome: 80000,
          maxIncome: 100000,
          minAge: 23,
          maxAge: 28,
          minPTI: 10,
          maxPTI: 20,
          minDTI: 50,
          maxDTI: 60,
          employmentType: "Payroll"
        },
        {
          id: "P002",
          uuid: "550e8400-e29b-41d4-a716-446655440000",
          priority: 2,
          minCreditScore: 800,
          maxCreditScore: 999,
          minIncome: 80000,
          maxIncome: 100000,
          minAge: 23,
          maxAge: 28,
          minPTI: null,
          maxPTI: null,
          minDTI: 50,
          maxDTI: 60,
          employmentType: "Payroll"
        },
        {
          id: "P003",
          uuid: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
          priority: 3,
          minCreditScore: 800,
          maxCreditScore: 999,
          minIncome: 0,
          maxIncome: 0,
          minAge: 0,
          maxAge: 0,
          minPTI: null,
          maxPTI: null,
          minDTI: 0,
          maxDTI: 0,
          employmentType: "Payroll"
        }
      ];
    case 'pricing-config':
      return [
        {
          id: "PR001",
          creditProfile: "P001",
          minLTV: 80,
          maxLTV: 100,
          minTerm: 24,
          maxTerm: 48,
          minLeaseMileage: null,
          maxLeaseMileage: null,
          priority: 1
        },
        {
          id: "PR002",
          creditProfile: "P002",
          minLTV: 0,
          maxLTV: 80.9,
          minTerm: 0,
          maxTerm: 36,
          minLeaseMileage: null,
          maxLeaseMileage: null,
          priority: 1
        },
        {
          id: "PR003",
          creditProfile: "P002",
          minLTV: 0,
          maxLTV: 80.9,
          minTerm: 24,
          maxTerm: 36,
          minLeaseMileage: 12000,
          maxLeaseMileage: 24000,
          priority: 1
        },
        {
          id: "KSAPR001",
          creditProfile: "KSAP001",
          minLTV: null,
          maxLTV: null,
          minTerm: 60,
          maxTerm: 60,
          minLeaseMileage: null,
          maxLeaseMileage: null,
          priority: 1
        }
      ];
    case 'financial-program-config':
      return [
        {
          id: "FPC01",
          programCode: "AIPUNL07241",
          cloneFrom: "AIPUNL06241",
          priority: 1,
          financialProductId: "USLN",
          productType: null,
          vehicleStyleId: "L25A1",
          financingVehicleCondition: "New",
          programStartDate: "2/1/2025",
          programEndDate: "2/28/2025",
          isActive: true,
          orderTypes: "INV, CON",
          version: 1
        },
        {
          id: "FPC02",
          programCode: "AIPUNR07241",
          cloneFrom: null,
          priority: 2,
          financialProductId: "USLE",
          productType: null,
          vehicleStyleId: "L25A2",
          financingVehicleCondition: "New",
          programStartDate: "4/1/2025",
          programEndDate: "4/30/2025",
          isActive: true,
          orderTypes: "INV, CON",
          version: 1
        },
        {
          id: "FPKSA01",
          programCode: "SNBAIPUNL04251",
          cloneFrom: null,
          priority: 1,
          financialProductId: "KSABM",
          productType: null,
          vehicleStyleId: "KSA25A1",
          financingVehicleCondition: "New",
          programStartDate: "4/1/2025",
          programEndDate: "5/30/2025",
          isActive: true,
          orderTypes: "INV, CON",
          version: 1
        }
      ];
    case 'advertised-offers':
      return [
        { 
          id: "1", 
          bulletinPricing: "BT001", 
          disclosure: "Disclosure Text", 
          loanAmountPer10k: "$186.43/month", 
          totalCostOfCredit: "$1,345.80" 
        },
        { 
          id: "2", 
          bulletinPricing: "BTKSA02", 
          disclosure: "Disclosure Text", 
          loanAmountPer10k: "$194.15/month", 
          totalCostOfCredit: "$1,649.00" 
        }
      ];
    default:
      console.log('No mock data found for schema:', schemaId);
      return [];
  }
};
