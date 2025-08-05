import React from 'react';
import { CreditReport } from '@/types/application/creditReport';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface CreditReportViewerProps {
  creditReport: CreditReport;
}

const CreditReportViewer: React.FC<CreditReportViewerProps> = ({ creditReport }) => {
  const getScoreColor = (score: number) => {
    if (score >= 740) return 'bg-green-500';
    if (score >= 670) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'current': return 'default';
      case 'late': return 'destructive';
      case 'missed': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6 max-h-[80vh] overflow-y-auto">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold">Credit Report</h2>
        <p className="text-muted-foreground">Report Date: {new Date(creditReport.reportDate).toLocaleDateString()}</p>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Name:</p>
              <p>{creditReport.personalInfo.name}</p>
            </div>
            <div>
              <p className="font-medium">SSN:</p>
              <p>{creditReport.personalInfo.ssn}</p>
            </div>
            <div>
              <p className="font-medium">Date of Birth:</p>
              <p>{new Date(creditReport.personalInfo.dateOfBirth).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="font-medium">Address:</p>
              <p>{creditReport.personalInfo.address}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Credit Score */}
      <Card>
        <CardHeader>
          <CardTitle>Credit Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <div className={`text-4xl font-bold text-white p-4 rounded-lg ${getScoreColor(creditReport.creditScore.score)}`}>
              {creditReport.creditScore.score}
            </div>
            <div>
              <p className="font-medium">{creditReport.creditScore.range}</p>
              <p className="text-sm text-muted-foreground">Scale: 300-850</p>
            </div>
          </div>
          <div>
            <p className="font-medium mb-2">Key Factors:</p>
            <ul className="list-disc list-inside space-y-1">
              {creditReport.creditScore.factors.map((factor, index) => (
                <li key={index} className="text-sm">{factor}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Account Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="font-medium">Total Accounts</p>
              <p className="text-2xl font-bold">{creditReport.summary.totalAccounts}</p>
            </div>
            <div>
              <p className="font-medium">Total Balance</p>
              <p className="text-2xl font-bold">${creditReport.summary.totalBalance.toLocaleString()}</p>
            </div>
            <div>
              <p className="font-medium">Credit Limit</p>
              <p className="text-2xl font-bold">${creditReport.summary.totalCreditLimit.toLocaleString()}</p>
            </div>
            <div>
              <p className="font-medium">Utilization</p>
              <p className="text-2xl font-bold">{creditReport.summary.utilizationRatio}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Credit Accounts */}
      <Card>
        <CardHeader>
          <CardTitle>Credit Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {creditReport.accounts.map((account) => (
              <div key={account.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">{account.accountName}</h4>
                    <p className="text-sm text-muted-foreground">{account.accountType}</p>
                  </div>
                  <Badge variant={getPaymentStatusColor(account.paymentStatus)}>
                    {account.paymentStatus}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  <div>
                    <p className="font-medium">Balance:</p>
                    <p>${account.balance.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="font-medium">Credit Limit:</p>
                    <p>${account.creditLimit.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="font-medium">Date Opened:</p>
                    <p>{new Date(account.dateOpened).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="font-medium">Last Activity:</p>
                    <p>{new Date(account.lastActivity).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{creditReport.paymentHistory.onTimePayments}</p>
              <p className="text-sm">On-Time Payments</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{creditReport.paymentHistory.latePayments}</p>
              <p className="text-sm">Late Payments</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{creditReport.paymentHistory.missedPayments}</p>
              <p className="text-sm">Missed Payments</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Credit Inquiries */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Credit Inquiries</CardTitle>
        </CardHeader>
        <CardContent>
          {creditReport.inquiries.length > 0 ? (
            <div className="space-y-3">
              {creditReport.inquiries.map((inquiry) => (
                <div key={inquiry.id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">{inquiry.creditorName}</p>
                    <p className="text-sm text-muted-foreground">{inquiry.inquiryType}</p>
                  </div>
                  <p className="text-sm">{new Date(inquiry.inquiryDate).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No recent credit inquiries</p>
          )}
        </CardContent>
      </Card>

      {/* Public Records */}
      <Card>
        <CardHeader>
          <CardTitle>Public Records</CardTitle>
        </CardHeader>
        <CardContent>
          {creditReport.publicRecords.length > 0 ? (
            <div className="space-y-3">
              {creditReport.publicRecords.map((record) => (
                <div key={record.id} className="border rounded p-3">
                  <div className="flex justify-between">
                    <span className="font-medium">{record.recordType}</span>
                    <span>${record.amount.toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(record.date).toLocaleDateString()} - {record.status}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No public records found</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CreditReportViewer;