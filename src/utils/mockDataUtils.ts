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
        },
        { 
          id: "BT01", 
          financialProgramCode: "AIPUNR07241", 
          programId: "FPUS01",
          pricingConfig: "", 
          geoCode: "NA-US-CA",
          lenderName: "CMB, BAC",
          advertised: true,
          pricingType: "SUBAPR", 
          bulletinId: "BT01",
          pricingValue: 2.99,
          uploadDate: "2024-07-24"
        },
        { 
          id: "BT02", 
          financialProgramCode: "AIPUNR07241", 
          programId: "FPUS02",
          pricingConfig: "PR002", 
          geoCode: "NA-US-CA",
          lenderName: "CMB, BAC",
          advertised: true,
          pricingType: "SUBAPR", 
          bulletinId: "BT02",
          pricingValue: 7.49,
          uploadDate: "2024-07-24"
        },
        { 
          id: "BT03", 
          financialProgramCode: "AIPUNL07241", 
          programId: "FPUS03",
          pricingConfig: "PR003", 
          geoCode: "NA-US-CA",
          lenderName: "LFS",
          advertised: true,
          pricingType: "ENHRV", 
          bulletinId: "BT03",
          pricingValue: 60.50,
          uploadDate: "2024-07-24"
        },
        { 
          id: "BT04", 
          financialProgramCode: "AIPUNL07241", 
          programId: "FPUS04",
          pricingConfig: "PR003", 
          geoCode: "NA-US-CA",
          lenderName: "LFS",
          advertised: true,
          pricingType: "SUBMF", 
          bulletinId: "BT04",
          pricingValue: 60.50,
          uploadDate: "2024-07-24"
        },
        { 
          id: "BT05", 
          financialProgramCode: "AIPUNR07241", 
          programId: "FPUS05",
          pricingConfig: "PR001", 
          geoCode: "NA-US-CA",
          lenderName: "CMB",
          advertised: true,
          pricingType: "MAXBDAPR", 
          bulletinId: "BT05",
          pricingValue: 2,
          uploadDate: "2024-07-24"
        },
        { 
          id: "BT06", 
          financialProgramCode: "AIPUNR07241", 
          programId: "FPUS06",
          pricingConfig: "PR002", 
          geoCode: "NA-US-CA",
          lenderName: "CMB",
          advertised: true,
          pricingType: "MAXMUAPR", 
          bulletinId: "BT06",
          pricingValue: 3,
          uploadDate: "2024-07-24"
        },
        { 
          id: "BTKSA01-1", 
          financialProgramCode: "SNBAIPUNL04251", 
          programId: "FPKSA02",
          pricingConfig: "KSAPR001", 
          geoCode: "ME-KSA",
          lenderName: "KSASNB",
          advertised: false,
          pricingType: "ADF", 
          bulletinId: "BTKSA01",
          pricingValue: 3500.00,
          uploadDate: "2025-04-25"
        },
        { 
          id: "BTKSA01-2", 
          financialProgramCode: "SNBAIPUNL04251", 
          programId: "FPKSA03",
          pricingConfig: "KSAPR001", 
          geoCode: "ME-KSA",
          lenderName: "KSASNB",
          advertised: false,
          pricingType: "INR", 
          bulletinId: "BTKSA01",
          pricingValue: 2.0,
          uploadDate: "2025-04-25"
        }
      ];
    case 'pricing-types':
      return [
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
    case 'credit-profile':
      return [
        {
          id: "P001",
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

// Helper functions for wizard data
export const getVehicleStyles = () => [
  { id: "L25A1", label: "L25A1 - 2025 Lucid Air Grand Touring" },
  { id: "L25A2", label: "L25A2 - 2025 Lucid Air Pure" },
  { id: "L25A3", label: "L25A3 - 2025 Lucid Air Pure" },
  { id: "KSA25A1", label: "KSA25A1 - 2025 Lucid Air Pure (KSA)" }
];

export const getVehicleConditions = () => [
  { id: "New", label: "New" },
  { id: "Used", label: "Used" },
  { id: "Demo", label: "Demo" },
  { id: "CPO", label: "Certified Pre-Owned" }
];

export const getLenders = () => [
  { id: "CMB", name: "Chase Manhattan Bank" },
  { id: "BAC", name: "Bank of America" },
  { id: "LFS", name: "Lucid Financial Services" },
  { id: "KSASNB", name: "KSA Saudi National Bank" },
  { id: "KSAAJB", name: "KSA Al Jazira Bank" }
];

export const getGeoCodes = () => [
  { id: "NA-US", name: "North America - United States" },
  { id: "NA-US-CA", name: "North America - United States - California" },
  { id: "ME-KSA", name: "Middle East - Saudi Arabia" },
  { id: "ME-UAE", name: "Middle East - United Arab Emirates" }
];
