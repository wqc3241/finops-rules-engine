export interface CreditAccount {
  id: string;
  accountName: string;
  accountType: string;
  balance: number;
  creditLimit: number;
  paymentStatus: string;
  monthsReviewed: number;
  dateOpened: string;
  lastActivity: string;
}

export interface CreditInquiry {
  id: string;
  creditorName: string;
  inquiryDate: string;
  inquiryType: string;
}

export interface PublicRecord {
  id: string;
  recordType: string;
  amount: number;
  date: string;
  status: string;
}

export interface CreditReport {
  applicantType: 'primary' | 'co-applicant';
  personalInfo: {
    name: string;
    address: string;
    ssn: string;
    dateOfBirth: string;
  };
  creditScore: {
    score: number;
    range: string;
    factors: string[];
  };
  accounts: CreditAccount[];
  paymentHistory: {
    onTimePayments: number;
    latePayments: number;
    missedPayments: number;
  };
  inquiries: CreditInquiry[];
  publicRecords: PublicRecord[];
  summary: {
    totalAccounts: number;
    totalBalance: number;
    totalCreditLimit: number;
    utilizationRatio: number;
  };
  reportDate: string;
}