import { CreditReport } from '@/types/application/creditReport';

export const mockCreditReports: Record<string, CreditReport> = {
  primary: {
    applicantType: 'primary',
    personalInfo: {
      name: 'John M. Smith',
      address: '123 Main Street, Anytown, ST 12345',
      ssn: '***-**-1234',
      dateOfBirth: '1985-03-15'
    },
    creditScore: {
      score: 742,
      range: 'Good (670-739)',
      factors: [
        'Low credit utilization',
        'Long credit history',
        'No recent negative marks'
      ]
    },
    accounts: [
      {
        id: '1',
        accountName: 'Chase Freedom Credit Card',
        accountType: 'Credit Card',
        balance: 1250,
        creditLimit: 5000,
        paymentStatus: 'Current',
        monthsReviewed: 36,
        dateOpened: '2018-06-15',
        lastActivity: '2024-01-15'
      },
      {
        id: '2',
        accountName: 'Wells Fargo Auto Loan',
        accountType: 'Auto Loan',
        balance: 18500,
        creditLimit: 25000,
        paymentStatus: 'Current',
        monthsReviewed: 24,
        dateOpened: '2022-03-10',
        lastActivity: '2024-01-01'
      },
      {
        id: '3',
        accountName: 'Bank of America Mortgage',
        accountType: 'Mortgage',
        balance: 285000,
        creditLimit: 320000,
        paymentStatus: 'Current',
        monthsReviewed: 60,
        dateOpened: '2019-09-20',
        lastActivity: '2024-01-01'
      }
    ],
    paymentHistory: {
      onTimePayments: 98,
      latePayments: 2,
      missedPayments: 0
    },
    inquiries: [
      {
        id: '1',
        creditorName: 'Auto Finance Company',
        inquiryDate: '2024-01-10',
        inquiryType: 'Hard Inquiry'
      },
      {
        id: '2',
        creditorName: 'Credit Card Company',
        inquiryDate: '2023-11-15',
        inquiryType: 'Soft Inquiry'
      }
    ],
    publicRecords: [],
    summary: {
      totalAccounts: 3,
      totalBalance: 304750,
      totalCreditLimit: 350000,
      utilizationRatio: 25
    },
    reportDate: '2024-01-20'
  },
  coApplicant: {
    applicantType: 'co-applicant',
    personalInfo: {
      name: 'Jane L. Smith',
      address: '123 Main Street, Anytown, ST 12345',
      ssn: '***-**-5678',
      dateOfBirth: '1987-07-22'
    },
    creditScore: {
      score: 698,
      range: 'Good (670-739)',
      factors: [
        'Moderate credit utilization',
        'Good payment history',
        'Recent credit inquiry'
      ]
    },
    accounts: [
      {
        id: '1',
        accountName: 'Capital One Venture Card',
        accountType: 'Credit Card',
        balance: 2100,
        creditLimit: 8000,
        paymentStatus: 'Current',
        monthsReviewed: 42,
        dateOpened: '2017-11-08',
        lastActivity: '2024-01-18'
      },
      {
        id: '2',
        accountName: 'Student Loan - Federal',
        accountType: 'Student Loan',
        balance: 12500,
        creditLimit: 15000,
        paymentStatus: 'Current',
        monthsReviewed: 72,
        dateOpened: '2015-08-30',
        lastActivity: '2024-01-01'
      }
    ],
    paymentHistory: {
      onTimePayments: 94,
      latePayments: 4,
      missedPayments: 1
    },
    inquiries: [
      {
        id: '1',
        creditorName: 'Auto Finance Company',
        inquiryDate: '2024-01-10',
        inquiryType: 'Hard Inquiry'
      }
    ],
    publicRecords: [],
    summary: {
      totalAccounts: 2,
      totalBalance: 14600,
      totalCreditLimit: 23000,
      utilizationRatio: 26
    },
    reportDate: '2024-01-20'
  }
};