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
import { dealStructureData, loanOfferTemplate, leaseOfferTemplate } from './dealStructure';

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
          },
          {
            lenderName: "Chase",
            status: "Application Declined",
            requested: [
              { name: "termLength", label: "Term Length (months)", value: "24" },
              { name: "mileageAllowance", label: "Mileage Allowance", value: "12,000" },
              { name: "rv", label: "RV%", value: "65.00%" },
              { name: "rvs", label: "RV$", value: "$53,300.00" },
              { name: "ccrDownPayment", label: "CCR/Down Payment", value: "$5,000.00" },
              { name: "maxLtv", label: "Max LTV", value: "90%" },
              { name: "ltv", label: "LTV", value: "92%" },
              { name: "dti", label: "DTI", value: "51%" },
              { name: "pti", label: "PTI", value: "22%" },
              { name: "fico", label: "FICO", value: "580" },
              { name: "mf", label: "MF", value: "0.00090" }
            ],
            approved: [],
            customer: [],
            stipulations: [],
            contractStatus: "Application Declined",
            collapsedView: {
              termLength: "24",
              monthlyPayments: "950.25",
              dueAtSigning: "5000.00"
            }
          },
          {
            lenderName: "Capital One Auto Finance",
            status: "Application Declined",
            requested: [
              { name: "termLength", label: "Term Length (months)", value: "48" },
              { name: "apr", label: "APR", value: "12.99%" },
              { name: "downPayment", label: "Down Payment", value: "$10,000.00" },
              { name: "maxLtv", label: "Max LTV", value: "90%" },
              { name: "ltv", label: "LTV", value: "88%" },
              { name: "dti", label: "DTI", value: "51%" },
              { name: "pti", label: "PTI", value: "22%" },
              { name: "fico", label: "FICO", value: "580" }
            ],
            approved: [],
            customer: [],
            stipulations: [],
            contractStatus: "Application Declined",
            collapsedView: {
              termLength: "48",
              monthlyPayments: "1,125.60",
              dueAtSigning: "10000.00"
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
          },
          {
            lenderName: "Chase",
            status: "Application Under Review",
            requested: [
              { name: "termLength", label: "Term Length (months)", value: "36" },
              { name: "mileageAllowance", label: "Mileage Allowance", value: "10,000" },
              { name: "rv", label: "RV%", value: "58.00%" },
              { name: "rvs", label: "RV$", value: "$64,960.00" },
              { name: "ccrDownPayment", label: "CCR/Down Payment", value: "$9,000.00" },
              { name: "maxLtv", label: "Max LTV", value: "85%" },
              { name: "ltv", label: "LTV", value: "82%" },
              { name: "dti", label: "DTI", value: "32%" },
              { name: "pti", label: "PTI", value: "12%" },
              { name: "fico", label: "FICO", value: "710" },
              { name: "mf", label: "MF", value: "0.00035" }
            ],
            approved: [],
            customer: [],
            stipulations: [],
            contractStatus: "Application Under Review",
            collapsedView: {
              termLength: "36",
              monthlyPayments: "825.40",
              dueAtSigning: "9000.00"
            }
          },
          {
            lenderName: "US Bank",
            status: "Not Submitted",
            requested: [
              { name: "termLength", label: "Term Length (months)", value: "48" },
              { name: "apr", label: "APR", value: "5.75%" },
              { name: "downPayment", label: "Down Payment", value: "$12,000.00" },
              { name: "maxLtv", label: "Max LTV", value: "90%" },
              { name: "ltv", label: "LTV", value: "80%" },
              { name: "dti", label: "DTI", value: "32%" },
              { name: "pti", label: "PTI", value: "12%" },
              { name: "fico", label: "FICO", value: "710" }
            ],
            approved: [],
            customer: [],
            stipulations: [],
            contractStatus: "Not Submitted",
            collapsedView: {
              termLength: "48",
              monthlyPayments: "1,050.80",
              dueAtSigning: "12000.00"
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
          },
          {
            lenderName: "Bank of America",
            status: "Not Selected",
            requested: [
              { name: "termLength", label: "Term Length (months)", value: "72" },
              { name: "apr", label: "APR", value: "4.49%" },
              { name: "downPayment", label: "Down Payment", value: "$12,000.00" },
              { name: "maxLtv", label: "Max LTV", value: "105%" },
              { name: "ltv", label: "LTV", value: "98%" },
              { name: "dti", label: "DTI", value: "28%" },
              { name: "pti", label: "PTI", value: "15%" },
              { name: "fico", label: "FICO", value: "752" }
            ],
            approved: [
              { name: "termLength", label: "Term Length (months)", value: "72" },
              { name: "apr", label: "APR", value: "4.49%" },
              { name: "downPayment", label: "Down Payment", value: "$12,000.00" },
              { name: "maxLtv", label: "Max LTV", value: "105%" },
              { name: "ltv", label: "LTV", value: "98%" },
              { name: "dti", label: "DTI", value: "28%" },
              { name: "pti", label: "PTI", value: "15%" },
              { name: "fico", label: "FICO", value: "752" }
            ],
            customer: [],
            stipulations: [],
            contractStatus: "Not Selected",
            collapsedView: {
              termLength: "72",
              monthlyPayments: "1,390.80",
              dueAtSigning: "12000.00"
            }
          },
          {
            lenderName: "Chase",
            status: "Not Selected",
            requested: [
              { name: "termLength", label: "Term Length (months)", value: "60" },
              { name: "apr", label: "APR", value: "4.35%" },
              { name: "downPayment", label: "Down Payment", value: "$18,000.00" },
              { name: "maxLtv", label: "Max LTV", value: "100%" },
              { name: "ltv", label: "LTV", value: "90%" },
              { name: "dti", label: "DTI", value: "28%" },
              { name: "pti", label: "PTI", value: "13%" },
              { name: "fico", label: "FICO", value: "752" }
            ],
            approved: [
              { name: "termLength", label: "Term Length (months)", value: "60" },
              { name: "apr", label: "APR", value: "4.35%" },
              { name: "downPayment", label: "Down Payment", value: "$18,000.00" },
              { name: "maxLtv", label: "Max LTV", value: "100%" },
              { name: "ltv", label: "LTV", value: "90%" },
              { name: "dti", label: "DTI", value: "28%" },
              { name: "pti", label: "PTI", value: "13%" },
              { name: "fico", label: "FICO", value: "752" }
            ],
            customer: [],
            stipulations: [],
            contractStatus: "Not Selected",
            collapsedView: {
              termLength: "60",
              monthlyPayments: "1,520.40",
              dueAtSigning: "18000.00"
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
          },
          {
            lenderName: "Wells Fargo Auto",
            status: "Not Selected",
            requested: [
              { name: "termLength", label: "Term Length (months)", value: "60" },
              { name: "apr", label: "APR", value: "5.49%" },
              { name: "downPayment", label: "Down Payment", value: "$15,000.00" },
              { name: "maxLtv", label: "Max LTV", value: "110%" },
              { name: "ltv", label: "LTV", value: "95%" },
              { name: "dti", label: "DTI", value: "35%" },
              { name: "pti", label: "PTI", value: "19%" },
              { name: "fico", label: "FICO", value: "725" }
            ],
            approved: [
              { name: "termLength", label: "Term Length (months)", value: "60" },
              { name: "apr", label: "APR", value: "5.49%" },
              { name: "downPayment", label: "Down Payment", value: "$15,000.00" },
              { name: "maxLtv", label: "Max LTV", value: "110%" },
              { name: "ltv", label: "LTV", value: "95%" },
              { name: "dti", label: "DTI", value: "35%" },
              { name: "pti", label: "PTI", value: "19%" },
              { name: "fico", label: "FICO", value: "725" }
            ],
            customer: [],
            stipulations: [],
            contractStatus: "Not Selected",
            collapsedView: {
              termLength: "60",
              monthlyPayments: "1,520.75",
              dueAtSigning: "15000.00"
            }
          },
          {
            lenderName: "Chase",
            status: "Not Selected",
            requested: [
              { name: "termLength", label: "Term Length (months)", value: "48" },
              { name: "apr", label: "APR", value: "4.99%" },
              { name: "downPayment", label: "Down Payment", value: "$18,000.00" },
              { name: "maxLtv", label: "Max LTV", value: "100%" },
              { name: "ltv", label: "LTV", value: "90%" },
              { name: "dti", label: "DTI", value: "35%" },
              { name: "pti", label: "PTI", value: "17%" },
              { name: "fico", label: "FICO", value: "725" }
            ],
            approved: [
              { name: "termLength", label: "Term Length (months)", value: "48" },
              { name: "apr", label: "APR", value: "4.99%" },
              { name: "downPayment", label: "Down Payment", value: "$18,000.00" },
              { name: "maxLtv", label: "Max LTV", value: "100%" },
              { name: "ltv", label: "LTV", value: "90%" },
              { name: "dti", label: "DTI", value: "35%" },
              { name: "pti", label: "PTI", value: "17%" },
              { name: "fico", label: "FICO", value: "725" }
            ],
            customer: [],
            stipulations: [],
            contractStatus: "Not Selected",
            collapsedView: {
              termLength: "48",
              monthlyPayments: "1,625.30",
              dueAtSigning: "18000.00"
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
          },
          {
            lenderName: "BMW Financial Services",
            status: "Not Selected",
            requested: [
              { name: "termLength", label: "Term Length (months)", value: "24" },
              { name: "mileageAllowance", label: "Mileage Allowance", value: "10,000" },
              { name: "rv", label: "RV%", value: "75.00%" },
              { name: "rvs", label: "RV$", value: "$97,500.00" },
              { name: "ccrDownPayment", label: "CCR/Down Payment", value: "$15,000.00" },
              { name: "maxLtv", label: "Max LTV", value: "N/A" },
              { name: "ltv", label: "LTV", value: "60%" },
              { name: "dti", label: "DTI", value: "22%" },
              { name: "pti", label: "PTI", value: "10%" },
              { name: "fico", label: "FICO", value: "815" },
              { name: "mf", label: "MF", value: "0.00015" }
            ],
            approved: [
              { name: "termLength", label: "Term Length (months)", value: "24" },
              { name: "mileageAllowance", label: "Mileage Allowance", value: "10,000" },
              { name: "rv", label: "RV%", value: "75.00%" },
              { name: "rvs", label: "RV$", value: "$97,500.00" },
              { name: "ccrDownPayment", label: "CCR/Down Payment", value: "$15,000.00" },
              { name: "maxLtv", label: "Max LTV", value: "N/A" },
              { name: "ltv", label: "LTV", value: "60%" },
              { name: "dti", label: "DTI", value: "22%" },
              { name: "pti", label: "PTI", value: "10%" },
              { name: "fico", label: "FICO", value: "815" },
              { name: "mf", label: "MF", value: "0.00015" }
            ],
            customer: [],
            stipulations: [],
            contractStatus: "Not Selected",
            collapsedView: {
              termLength: "24",
              monthlyPayments: "2,190.45",
              dueAtSigning: "15000.00"
            }
          },
          {
            lenderName: "Chase",
            status: "Not Selected",
            requested: [
              { name: "termLength", label: "Term Length (months)", value: "36" },
              { name: "mileageAllowance", label: "Mileage Allowance", value: "12,000" },
              { name: "rv", label: "RV%", value: "62.00%" },
              { name: "rvs", label:
