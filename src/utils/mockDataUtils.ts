
import { TableData } from "@/types/dynamicTable";

export const getInitialData = (schemaId: string): TableData[] => {
  switch (schemaId) {
    case 'bulletin-pricing':
      return [
        {
          id: "BP001",
          financialProgramCode: "USLN-2024-Q1",
          programId: "PROG001",
          pricingConfig: "Standard",
          geoCode: "US-CA",
          lenderName: "Prime Bank",
          advertised: true,
          pricingType: "APR",
          pricingValue: 3.99,
          uploadDate: "2024-01-15"
        },
        {
          id: "BP002",
          financialProgramCode: "USLE-2024-Q1",
          programId: "PROG002",
          pricingConfig: "Premium",
          geoCode: "US-TX",
          lenderName: "Auto Credit",
          advertised: false,
          pricingType: "Money Factor",
          pricingValue: 0.00125,
          uploadDate: "2024-01-16"
        }
      ];

    case 'pricing-types':
      return [
        { id: "PT001", typeCode: "APR", typeName: "Annual Percentage Rate" },
        { id: "PT002", typeCode: "MF", typeName: "Money Factor" },
        { id: "PT003", typeCode: "CASH", typeName: "Cash Incentive" }
      ];

    case 'financial-products':
      return [
        {
          id: "FP001",
          productType: "Loan",
          productSubtype: "Standard",
          geoCode: "US",
          category: "Auto",
          isActive: true
        },
        {
          id: "FP002",
          productType: "Lease",
          productSubtype: "Premium",
          geoCode: "CA",
          category: "Auto",
          isActive: true
        }
      ];

    case 'credit-profile':
      return [
        {
          id: "CP001",
          priority: 1,
          minCreditScore: 720,
          maxCreditScore: 850,
          minIncome: 75000,
          maxIncome: null,
          minAge: 21,
          maxAge: 75,
          minPTI: 0,
          maxPTI: 25,
          minDTI: 0,
          maxDTI: 40,
          employmentType: "Full-time"
        }
      ];

    case 'pricing-config':
      return [
        {
          id: "PC001",
          minLTV: 60,
          maxLTV: 120,
          minTerm: 12,
          maxTerm: 84,
          minLeaseMileage: 10000,
          maxLeaseMileage: 15000,
          priority: 1
        }
      ];

    case 'financial-program-config':
      return [
        {
          id: "FPC01",
          programCode: "USLN-2024-Q1",
          cloneFrom: null,
          priority: 1,
          financialProductId: "USLN",
          productType: "Loan",
          vehicleStyleId: "L25A1",
          financingVehicleCondition: "New",
          programStartDate: "2024-01-01",
          programEndDate: "2024-12-31",
          isActive: true,
          orderTypes: "INV, CON",
          version: 1
        }
      ];

    case 'advertised-offers':
      return [
        {
          id: "AO001",
          bulletinPricing: "BP001",
          disclosure: "Standard disclosure text",
          loanAmountPer10k: "$125.50",
          totalCostOfCredit: "$2,500"
        }
      ];

    case 'gateway':
      return [
        { id: "GW001", gatewayName: "RouteOne" },
        { id: "GW002", gatewayName: "DealerTrack" }
      ];

    case 'dealer':
      return [
        { id: "D001", dealerName: "Lucid Beverly Hills" },
        { id: "D002", dealerName: "Lucid Palo Alto" }
      ];

    case 'lender':
      return [
        { id: "L001", lenderName: "Prime Bank" },
        { id: "L002", lenderName: "Auto Credit Union" }
      ];

    case 'country':
      return [
        { id: "US", countryName: "United States", countryCode: "US" },
        { id: "CA", countryName: "Canada", countryCode: "CA" }
      ];

    case 'state':
      return [
        { id: "CA", stateName: "California" },
        { id: "TX", stateName: "Texas" }
      ];

    case 'location-geo':
      return [
        { id: "LG001", locationName: "California", geoCode: "US-CA" },
        { id: "LG002", locationName: "Texas", geoCode: "US-TX" }
      ];

    case 'lease-config':
      return [
        { id: "LC001", configName: "Standard Lease" },
        { id: "LC002", configName: "Premium Lease" }
      ];

    case 'vehicle-condition':
      return [
        { id: "VC001", condition: "New" },
        { id: "VC002", condition: "Used" },
        { id: "VC003", condition: "Demo" }
      ];

    case 'vehicle-options':
      return [
        { id: "VO001", optionName: "Premium Package" },
        { id: "VO002", optionName: "Tech Package" }
      ];

    case 'routing-rule':
      return [
        { id: "RR001", ruleName: "Standard Routing" },
        { id: "RR002", ruleName: "Premium Routing" }
      ];

    case 'stipulation':
      return [
        { id: "S001", stipulationName: "Income Verification" },
        { id: "S002", stipulationName: "Employment Verification" }
      ];

    case 'vehicle-style-coding':
      return [
        { id: "VSC001", code: "L25A1", description: "2025 Lucid Air Grand Touring" },
        { id: "VSC002", code: "L25A2", description: "2025 Lucid Air Pure" }
      ];

    case 'order-type':
      return [
        { id: "OT001", typeName: "Inventory", typeCode: "INV" },
        { id: "OT002", typeName: "Configurator", typeCode: "CON" }
      ];

    case 'fee-rules':
      return [
        { id: "FR001", feeName: "Documentation Fee", feeType: "Fixed", amount: 299, isActive: true },
        { id: "FR002", feeName: "Processing Fee", feeType: "Fixed", amount: 150, isActive: true }
      ];

    case 'tax-rules':
      return [
        { id: "TR001", taxName: "Sales Tax", taxType: "Percentage", rate: 8.25, geoCode: "US-CA", isActive: true },
        { id: "TR002", taxName: "Registration Tax", taxType: "Fixed", rate: 25, geoCode: "US-CA", isActive: true }
      ];

    default:
      return [];
  }
};
