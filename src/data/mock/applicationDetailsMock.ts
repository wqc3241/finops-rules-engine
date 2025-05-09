
import { 
  ApplicationFullDetails, 
  DealStructureOffer,
  ApplicationDetails,
  FinancialSummary 
} from '../../types/application';
import { applicantInfo, coApplicantInfo } from './applicantInfo';
import { vehicleData, appDtReferences } from './vehicleData';
import { orderDetails } from './orderDetails';
import { historyItems, notes } from './history';
import { financialSummaryData } from './financialSummary';
import { dealStructureData } from './dealStructure';

// Mock data for application details based on ID
export const getMockApplicationDetailsById = (id: string): ApplicationFullDetails => {
  // Default data structure
  const baseData: ApplicationFullDetails = {
    details: {
      orderNumber: 'AD 00000-00000',
      model: 'Air',
      edition: 'Standard',
      orderedBy: 'Unknown Customer',
      status: 'Pending'
    },
    applicantInfo,
    coApplicantInfo,
    vehicleData,
    appDtReferences,
    orderDetails,
    history: historyItems,
    notes,
    financialSummary: {
      lfs: {
        tabs: ['Requested', 'Approved', 'Customer'],
        activeTab: 'Approved',
        requested: financialSummaryData.requested,
        approved: financialSummaryData.approved,
        customer: financialSummaryData.customer
      }
    },
    dealStructure: dealStructureData
  };

  // Extended mock data for specific applications
  switch (id) {
    case '8': // Aisha Washington - Lease - Declined
      return {
        ...baseData,
        details: {
          orderNumber: 'AD 76543-10987',
          model: 'Air Pure',
          edition: 'Base',
          orderedBy: 'Aisha Washington',
          status: 'Declined'
        },
        dealStructure: [
          {
            lenderName: "LFS",
            status: "Application Declined",
            requested: [
              { name: "termLength", label: "Term Length (months)", value: "36" },
              { name: "mileageAllowance", label: "Mileage Allowance", value: "10,000" },
              { name: "rv", label: "RV%", value: "55.12%" },
              { name: "rvs", label: "RV$", value: "$45,198.40" },
              { name: "ccrDownPayment", label: "CCR/Down Payment", value: "$4,500.00" },
              { name: "maxLtv", label: "Max LTV", value: "N/A" },
              { name: "ltv", label: "LTV", value: "95%" },
              { name: "dti", label: "DTI", value: "51%" }, // High DTI led to decline
              { name: "pti", label: "PTI", value: "22%" },
              { name: "fico", label: "FICO", value: "580" }, // Low FICO score
              { name: "mf", label: "MF", value: "0.00084" }
            ],
            approved: [],
            customer: [],
            stipulations: [
              {
                customerRole: "Primary",
                requestedDocument: "Credit History Explanation",
                status: "Not Submitted",
                date: "05/04/2025"
              }
            ],
            contractStatus: "Application Declined",
            collapsedView: {
              termLength: "36",
              monthlyPayments: "825.50",
              dueAtSigning: "4500.00"
            }
          }
        ]
      };

    case '9': // Carlos Rodriguez - Lease - Conditionally Approved
      return {
        ...baseData,
        details: {
          orderNumber: 'AD 98765-23456',
          model: 'Air Touring',
          edition: 'Touring',
          orderedBy: 'Carlos Rodriguez',
          status: 'Conditionally Approved'
        },
        dealStructure: [
          {
            lenderName: "LFS",
            requested: [
              { name: "termLength", label: "Term Length (months)", value: "24" },
              { name: "mileageAllowance", label: "Mileage Allowance", value: "12,000" },
              { name: "rv", label: "RV%", value: "65.38%" },
              { name: "rvs", label: "RV$", value: "$73,225.60" },
              { name: "ccrDownPayment", label: "CCR/Down Payment", value: "$8,500.00" },
              { name: "maxLtv", label: "Max LTV", value: "90%" },
              { name: "ltv", label: "LTV", value: "85%" },
              { name: "dti", label: "DTI", value: "32%" },
              { name: "pti", label: "PTI", value: "12%" },
              { name: "fico", label: "FICO", value: "710" },
              { name: "mf", label: "MF", value: "0.00033" }
            ],
            approved: [
              { name: "termLength", label: "Term Length (months)", value: "24" },
              { name: "mileageAllowance", label: "Mileage Allowance", value: "12,000" },
              { name: "rv", label: "RV%", value: "65.38%" },
              { name: "rvs", label: "RV$", value: "$73,225.60" },
              { name: "ccrDownPayment", label: "CCR/Down Payment", value: "$10,000.00" }, // Increased down payment condition
              { name: "maxLtv", label: "Max LTV", value: "90%" },
              { name: "ltv", label: "LTV", value: "80%" },
              { name: "dti", label: "DTI", value: "32%" },
              { name: "pti", label: "PTI", value: "11%" },
              { name: "fico", label: "FICO", value: "710" },
              { name: "mf", label: "MF", value: "0.00033" }
            ],
            customer: [],
            stipulations: [
              {
                customerRole: "Primary",
                requestedDocument: "Proof of Residence",
                status: "Not Submitted",
                date: "05/05/2025"
              },
              {
                customerRole: "Primary",
                requestedDocument: "Recent Pay Stub",
                status: "Not Submitted",
                date: "05/05/2025"
              }
            ],
            contractStatus: "Conditionally Approved",
            collapsedView: {
              termLength: "24",
              monthlyPayments: "899.75",
              dueAtSigning: "10000.00"
            }
          }
        ]
      };

    case '10': // Emily Chang - Loan - Pending Signature
      return {
        ...baseData,
        details: {
          orderNumber: 'AD 34567-98765',
          model: 'Air Grand Touring',
          edition: 'Grand Touring',
          orderedBy: 'Emily Chang',
          status: 'Pending Signature'
        },
        dealStructure: [
          {
            lenderName: "Liberty Financial",
            requested: [
              { name: "termLength", label: "Term Length (months)", value: "60" },
              { name: "apr", label: "APR", value: "4.25%" },
              { name: "downPayment", label: "Down Payment", value: "$15,000.00" },
              { name: "maxLtv", label: "Max LTV", value: "110%" },
              { name: "ltv", label: "LTV", value: "95%" },
              { name: "dti", label: "DTI", value: "28%" },
              { name: "pti", label: "PTI", value: "14%" },
              { name: "fico", label: "FICO", value: "752" }
            ],
            approved: [
              { name: "termLength", label: "Term Length (months)", value: "60" },
              { name: "apr", label: "APR", value: "4.25%" },
              { name: "downPayment", label: "Down Payment", value: "$15,000.00" },
              { name: "maxLtv", label: "Max LTV", value: "110%" },
              { name: "ltv", label: "LTV", value: "95%" },
              { name: "dti", label: "DTI", value: "28%" },
              { name: "pti", label: "PTI", value: "14%" },
              { name: "fico", label: "FICO", value: "752" }
            ],
            customer: [
              { name: "termLength", label: "Term Length (months)", value: "60" },
              { name: "apr", label: "APR", value: "4.25%" },
              { name: "downPayment", label: "Down Payment", value: "$15,000.00" },
              { name: "offerAcceptedBy", label: "Offer Accepted By", value: "Emily Chang" },
            ],
            stipulations: [],
            contractStatus: "Pending Customer Signature",
            collapsedView: {
              termLength: "60",
              monthlyPayments: "1,583.25",
              dueAtSigning: "15000.00"
            }
          }
        ],
        orderDetails: {
          ...orderDetails,
          vehicleTradeIn: {
            year: '2020',
            make: 'Tesla',
            model: 'Model Y',
            trim: 'Long Range',
            lienHolder: 'Wells Fargo',
            totalValue: '$43,000',
            payoffAmount: '$28,500'
          }
        }
      };

    case '11': // James Wilson - Loan - Booked
      return {
        ...baseData,
        details: {
          orderNumber: 'AD 11223-45678',
          model: 'Air Touring',
          edition: 'Touring',
          orderedBy: 'James Wilson',
          status: 'Booked'
        },
        dealStructure: [
          {
            lenderName: "Capital One Auto Finance",
            requested: [
              { name: "termLength", label: "Term Length (months)", value: "72" },
              { name: "apr", label: "APR", value: "5.25%" },
              { name: "downPayment", label: "Down Payment", value: "$12,000.00" },
              { name: "maxLtv", label: "Max LTV", value: "120%" },
              { name: "ltv", label: "LTV", value: "98%" },
              { name: "dti", label: "DTI", value: "35%" },
              { name: "pti", label: "PTI", value: "18%" },
              { name: "fico", label: "FICO", value: "725" }
            ],
            approved: [
              { name: "termLength", label: "Term Length (months)", value: "72" },
              { name: "apr", label: "APR", value: "5.25%" },
              { name: "downPayment", label: "Down Payment", value: "$12,000.00" },
              { name: "maxLtv", label: "Max LTV", value: "120%" },
              { name: "ltv", label: "LTV", value: "98%" },
              { name: "dti", label: "DTI", value: "35%" },
              { name: "pti", label: "PTI", value: "18%" },
              { name: "fico", label: "FICO", value: "725" }
            ],
            customer: [
              { name: "termLength", label: "Term Length (months)", value: "72" },
              { name: "apr", label: "APR", value: "5.25%" },
              { name: "downPayment", label: "Down Payment", value: "$12,000.00" },
              { name: "offerAcceptedBy", label: "Offer Accepted By", value: "James Wilson" },
            ],
            stipulations: [],
            contractStatus: "Contract Booked",
            collapsedView: {
              termLength: "72",
              monthlyPayments: "1,405.60",
              dueAtSigning: "12000.00"
            }
          }
        ],
        orderDetails: {
          ...orderDetails,
          vehicleTradeIn: {
            year: '2019',
            make: 'Honda',
            model: 'Accord',
            trim: 'EX-L',
            lienHolder: 'Honda Financial',
            totalValue: '$22,000',
            payoffAmount: '$8,500'
          }
        }
      };

    case '12': // Sophia Martinez - Lease - Funded
      return {
        ...baseData,
        details: {
          orderNumber: 'AD 87654-32109',
          model: 'Air Dream Edition',
          edition: 'Dream Edition',
          orderedBy: 'Sophia Martinez',
          status: 'Funded'
        },
        dealStructure: [
          {
            lenderName: "LFS",
            requested: [
              { name: "termLength", label: "Term Length (months)", value: "36" },
              { name: "mileageAllowance", label: "Mileage Allowance", value: "15,000" },
              { name: "rv", label: "RV%", value: "60.25%" },
              { name: "rvs", label: "RV$", value: "$78,325.00" },
              { name: "ccrDownPayment", label: "CCR/Down Payment", value: "$10,000.00" },
              { name: "maxLtv", label: "Max LTV", value: "N/A" },
              { name: "ltv", label: "LTV", value: "65%" },
              { name: "dti", label: "DTI", value: "22%" },
              { name: "pti", label: "PTI", value: "9%" },
              { name: "fico", label: "FICO", value: "815" }, // Excellent credit
              { name: "mf", label: "MF", value: "0.00018" }
            ],
            approved: [
              { name: "termLength", label: "Term Length (months)", value: "36" },
              { name: "mileageAllowance", label: "Mileage Allowance", value: "15,000" },
              { name: "rv", label: "RV%", value: "60.25%" },
              { name: "rvs", label: "RV$", value: "$78,325.00" },
              { name: "ccrDownPayment", label: "CCR/Down Payment", value: "$10,000.00" },
              { name: "maxLtv", label: "Max LTV", value: "N/A" },
              { name: "ltv", label: "LTV", value: "65%" },
              { name: "dti", label: "DTI", value: "22%" },
              { name: "pti", label: "PTI", value: "9%" },
              { name: "fico", label: "FICO", value: "815" },
              { name: "mf", label: "MF", value: "0.00018" }
            ],
            customer: [
              { name: "termLength", label: "Term Length (months)", value: "36" },
              { name: "mileageAllowance", label: "Mileage Allowance", value: "15,000" },
              { name: "rv", label: "RV%", value: "60.25%" },
              { name: "rvs", label: "RV$", value: "$78,325.00" },
              { name: "ccrDownPayment", label: "CCR/Down Payment", value: "$10,000.00" },
              { name: "offerAcceptedBy", label: "Offer Accepted By", value: "Sophia Martinez" },
            ],
            stipulations: [],
            contractStatus: "Contract Funded",
            collapsedView: {
              termLength: "36",
              monthlyPayments: "1,785.30",
              dueAtSigning: "10000.00"
            }
          }
        ],
        orderDetails: {
          ...orderDetails,
          vehicleTradeIn: {
            year: '',
            make: '',
            model: '',
            trim: '',
            lienHolder: '',
            totalValue: '',
            payoffAmount: ''
          }
        }
      };

    case '13': // Robert Kim - Loan - Pending
      return {
        ...baseData,
        details: {
          orderNumber: 'AD 55443-21098',
          model: 'Air Pure',
          edition: 'Pure',
          orderedBy: 'Robert Kim',
          status: 'Pending'
        },
        dealStructure: [
          {
            lenderName: "Bank of America",
            requested: [
              { name: "termLength", label: "Term Length (months)", value: "48" },
              { name: "apr", label: "APR", value: "3.99%" },
              { name: "downPayment", label: "Down Payment", value: "$8,000.00" },
              { name: "maxLtv", label: "Max LTV", value: "100%" },
              { name: "ltv", label: "LTV", value: "92%" },
              { name: "dti", label: "DTI", value: "38%" },
              { name: "pti", label: "PTI", value: "16%" },
              { name: "fico", label: "FICO", value: "698" }
            ],
            approved: [],
            customer: [],
            stipulations: [
              {
                customerRole: "Primary",
                requestedDocument: "Employment Verification",
                status: "Pending",
                date: "05/07/2025"
              },
              {
                customerRole: "Primary",
                requestedDocument: "Bank Statements",
                status: "Submitted",
                date: "05/07/2025"
              }
            ],
            contractStatus: "Application Pending Review",
            collapsedView: {
              termLength: "48",
              monthlyPayments: "1,515.40",
              dueAtSigning: "8000.00"
            }
          }
        ],
        orderDetails: {
          ...orderDetails,
          vehicleTradeIn: {
            year: '2018',
            make: 'Kia',
            model: 'Stinger',
            trim: 'GT',
            lienHolder: 'Kia Motors Finance',
            totalValue: '$25,500',
            payoffAmount: '$18,200'
          }
        }
      };

    case '14': // Olivia Thompson - Lease - Approved
      return {
        ...baseData,
        details: {
          orderNumber: 'AD 66778-99001',
          model: 'Air Sapphire',
          edition: 'Sapphire',
          orderedBy: 'Olivia Thompson',
          status: 'Approved'
        },
        dealStructure: [
          {
            lenderName: "LFS",
            requested: [
              { name: "termLength", label: "Term Length (months)", value: "18" },
              { name: "mileageAllowance", label: "Mileage Allowance", value: "10,000" },
              { name: "rv", label: "RV%", value: "75.50%" },
              { name: "rvs", label: "RV$", value: "$119,790.00" },
              { name: "ccrDownPayment", label: "CCR/Down Payment", value: "$20,000.00" },
              { name: "maxLtv", label: "Max LTV", value: "N/A" },
              { name: "ltv", label: "LTV", value: "55%" },
              { name: "dti", label: "DTI", value: "18%" },
              { name: "pti", label: "PTI", value: "7%" },
              { name: "fico", label: "FICO", value: "835" },
              { name: "mf", label: "MF", value: "0.00012" }
            ],
            approved: [
              { name: "termLength", label: "Term Length (months)", value: "18" },
              { name: "mileageAllowance", label: "Mileage Allowance", value: "10,000" },
              { name: "rv", label: "RV%", value: "75.50%" },
              { name: "rvs", label: "RV$", value: "$119,790.00" },
              { name: "ccrDownPayment", label: "CCR/Down Payment", value: "$20,000.00" },
              { name: "maxLtv", label: "Max LTV", value: "N/A" },
              { name: "ltv", label: "LTV", value: "55%" },
              { name: "dti", label: "DTI", value: "18%" },
              { name: "pti", label: "PTI", value: "7%" },
              { name: "fico", label: "FICO", value: "835" },
              { name: "mf", label: "MF", value: "0.00012" }
            ],
            customer: [],
            stipulations: [],
            contractStatus: "Application Approved",
            collapsedView: {
              termLength: "18",
              monthlyPayments: "2,350.75",
              dueAtSigning: "20000.00"
            }
          }
        ],
        orderDetails: {
          ...orderDetails,
          vehicleTradeIn: {
            year: '2022',
            make: 'BMW',
            model: 'X5',
            trim: 'xDrive40i',
            lienHolder: 'BMW Financial Services',
            totalValue: '$55,000',
            payoffAmount: '$48,000'
          }
        }
      };

    case '15': // Daniel Patel - Loan - Submitted
      return {
        ...baseData,
        details: {
          orderNumber: 'AD 12345-67890',
          model: 'Air Touring',
          edition: 'Touring',
          orderedBy: 'Daniel Patel',
          status: 'Submitted'
        },
        dealStructure: [
          {
            lenderName: "Chase Auto Finance",
            requested: [
              { name: "termLength", label: "Term Length (months)", value: "60" },
              { name: "apr", label: "APR", value: "4.49%" },
              { name: "downPayment", label: "Down Payment", value: "$15,000.00" },
              { name: "maxLtv", label: "Max LTV", value: "115%" },
              { name: "ltv", label: "LTV", value: "90%" },
              { name: "dti", label: "DTI", value: "33%" },
              { name: "pti", label: "PTI", value: "15%" },
              { name: "fico", label: "FICO", value: "705" }
            ],
            approved: [],
            customer: [],
            stipulations: [],
            contractStatus: "Application Submitted",
            collapsedView: {
              termLength: "60",
              monthlyPayments: "1,680.25",
              dueAtSigning: "15000.00"
            }
          }
        ],
        orderDetails: {
          ...orderDetails,
          vehicleTradeIn: {
            year: '',
            make: '',
            model: '',
            trim: '',
            lienHolder: '',
            totalValue: '',
            payoffAmount: ''
          }
        }
      };

    case '16': // Maria Garcia - Lease - Conditionally Approved
      return {
        ...baseData,
        details: {
          orderNumber: 'AD 54321-09876',
          model: 'Air Pure',
          edition: 'Pure',
          orderedBy: 'Maria Garcia',
          status: 'Conditionally Approved'
        },
        dealStructure: [
          {
            lenderName: "LFS",
            requested: [
              { name: "termLength", label: "Term Length (months)", value: "36" },
              { name: "mileageAllowance", label: "Mileage Allowance", value: "12,000" },
              { name: "rv", label: "RV%", value: "58.40%" },
              { name: "rvs", label: "RV$", value: "$48,720.00" },
              { name: "ccrDownPayment", label: "CCR/Down Payment", value: "$5,000.00" },
              { name: "maxLtv", label: "Max LTV", value: "N/A" },
              { name: "ltv", label: "LTV", value: "87%" },
              { name: "dti", label: "DTI", value: "42%" },
              { name: "pti", label: "PTI", value: "19%" },
              { name: "fico", label: "FICO", value: "675" },
              { name: "mf", label: "MF", value: "0.00054" }
            ],
            approved: [
              { name: "termLength", label: "Term Length (months)", value: "36" },
              { name: "mileageAllowance", label: "Mileage Allowance", value: "12,000" },
              { name: "rv", label: "RV%", value: "58.40%" },
              { name: "rvs", label: "RV$", value: "$48,720.00" },
              { name: "ccrDownPayment", label: "CCR/Down Payment", value: "$8,000.00" }, // Increased down payment
              { name: "maxLtv", label: "Max LTV", value: "N/A" },
              { name: "ltv", label: "LTV", value: "82%" }, // Improved with higher down
              { name: "dti", label: "DTI", value: "42%" },
              { name: "pti", label: "PTI", value: "17%" }, // Lower with higher down
              { name: "fico", label: "FICO", value: "675" },
              { name: "mf", label: "MF", value: "0.00054" }
            ],
            customer: [],
            stipulations: [
              {
                customerRole: "Primary",
                requestedDocument: "Proof of Income",
                status: "Submitted",
                date: "05/06/2025"
              }
            ],
            contractStatus: "Conditionally Approved",
            collapsedView: {
              termLength: "36",
              monthlyPayments: "1,045.60",
              dueAtSigning: "8000.00"
            }
          }
        ],
        orderDetails: {
          ...orderDetails,
          vehicleTradeIn: {
            year: '2017',
            make: 'Toyota',
            model: 'Camry',
            trim: 'SE',
            lienHolder: 'Toyota Financial Services',
            totalValue: '$16,000',
            payoffAmount: '$5,200'
          }
        }
      };

    case '17': // William Johnson - Loan - Funded
      return {
        ...baseData,
        details: {
          orderNumber: 'AD 13579-24680',
          model: 'Air Grand Touring',
          edition: 'Grand Touring',
          orderedBy: 'William Johnson',
          status: 'Funded'
        },
        dealStructure: [
          {
            lenderName: "Wells Fargo Auto",
            requested: [
              { name: "termLength", label: "Term Length (months)", value: "72" },
              { name: "apr", label: "APR", value: "5.75%" },
              { name: "downPayment", label: "Down Payment", value: "$25,000.00" },
              { name: "maxLtv", label: "Max LTV", value: "125%" },
              { name: "ltv", label: "LTV", value: "75%" },
              { name: "dti", label: "DTI", value: "25%" },
              { name: "pti", label: "PTI", value: "13%" },
              { name: "fico", label: "FICO", value: "780" }
            ],
            approved: [
              { name: "termLength", label: "Term Length (months)", value: "72" },
              { name: "apr", label: "APR", value: "5.49%" }, // Better rate
              { name: "downPayment", label: "Down Payment", value: "$25,000.00" },
              { name: "maxLtv", label: "Max LTV", value: "125%" },
              { name: "ltv", label: "LTV", value: "75%" },
              { name: "dti", label: "DTI", value: "25%" },
              { name: "pti", label: "PTI", value: "13%" },
              { name: "fico", label: "FICO", value: "780" }
            ],
            customer: [
              { name: "termLength", label: "Term Length (months)", value: "72" },
              { name: "apr", label: "APR", value: "5.49%" },
              { name: "downPayment", label: "Down Payment", value: "$25,000.00" },
              { name: "offerAcceptedBy", label: "Offer Accepted By", value: "William Johnson" },
            ],
            stipulations: [],
            contractStatus: "Contract Funded",
            collapsedView: {
              termLength: "72",
              monthlyPayments: "1,650.35",
              dueAtSigning: "25000.00"
            }
          }
        ],
        orderDetails: {
          ...orderDetails,
          vehicleTradeIn: {
            year: '2021',
            make: 'Audi',
            model: 'Q7',
            trim: 'Premium Plus',
            lienHolder: 'Audi Financial Services',
            totalValue: '$45,000',
            payoffAmount: '$37,500'
          }
        }
      };
      
    default:
      return baseData;
  }
};
