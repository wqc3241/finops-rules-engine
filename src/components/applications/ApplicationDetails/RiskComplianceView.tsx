
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { RequiredNotice, ComplianceCheck, ActivityHistoryItem, QCError } from '@/types/application';

interface RiskComplianceViewProps {
  requiredNotices: RequiredNotice[];
  complianceChecks: ComplianceCheck[];
  activityHistory: ActivityHistoryItem[];
  qcErrors: QCError[];
}

const RiskComplianceView: React.FC<RiskComplianceViewProps> = ({
  requiredNotices,
  complianceChecks,
  activityHistory,
  qcErrors
}) => {
  return (
    <div className="space-y-6">
      {/* LFS R&C Review Section */}
      <Card>
        <CardHeader>
          <CardTitle>LFS R&C Review</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Required Notices</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Entry</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requiredNotices.map((notice, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{notice.name}</TableCell>
                    <TableCell>{notice.data}</TableCell>
                    <TableCell>{notice.time}</TableCell>
                    <TableCell>{notice.entry}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="border rounded-md mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Compliance Check</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Entry</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {complianceChecks.map((check, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{check.name}</TableCell>
                    <TableCell>{check.data || ""}</TableCell>
                    <TableCell>{check.time || ""}</TableCell>
                    <TableCell>{check.entry || ""}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Activity History Section */}
      <Card>
        <CardHeader>
          <CardTitle>Activity History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action Name</TableHead>
                  <TableHead>User Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activityHistory.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.actionName}</TableCell>
                    <TableCell>{item.userName}</TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>{item.time}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* QC Check Section */}
      <Card>
        <CardHeader>
          <CardTitle>QC Check</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Critical Errors */}
            <div className="border rounded-md p-4">
              <h3 className="text-lg font-medium mb-4">Critical Errors</h3>
              {qcErrors.filter(error => error.isCritical).map((error, index) => (
                <div key={`critical-${index}`} className="space-y-3 mb-6">
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium">Error Type</label>
                    <input
                      type="text"
                      className="border rounded px-2 py-1"
                      value={error.errorType || ""}
                      readOnly
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium">Date</label>
                    <input
                      type="text"
                      className="border rounded px-2 py-1"
                      value={error.date || ""}
                      readOnly
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium">Who made error?</label>
                    <input
                      type="text"
                      className="border rounded px-2 py-1"
                      value={error.errorBy || ""}
                      readOnly
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium">QC Open Text Field</label>
                    <textarea
                      className="border rounded px-2 py-1"
                      value={error.description || ""}
                      readOnly
                      rows={3}
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium">What step in the process was QC issue found?</label>
                    <input
                      type="text"
                      className="border rounded px-2 py-1"
                      value={error.processStep || ""}
                      readOnly
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium">Area</label>
                    <input
                      type="text"
                      className="border rounded px-2 py-1"
                      value={error.area || ""}
                      readOnly
                    />
                  </div>
                </div>
              ))}
              {qcErrors.filter(error => error.isCritical).length === 0 && (
                <p className="text-sm text-gray-500">No critical errors reported</p>
              )}
            </div>

            {/* Non-Critical Errors */}
            <div className="border rounded-md p-4">
              <h3 className="text-lg font-medium mb-4">Non-Critical Errors</h3>
              {qcErrors.filter(error => !error.isCritical).map((error, index) => (
                <div key={`non-critical-${index}`} className="space-y-3 mb-6">
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium">Error Type</label>
                    <input
                      type="text"
                      className="border rounded px-2 py-1"
                      value={error.errorType || ""}
                      readOnly
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium">Date</label>
                    <input
                      type="text"
                      className="border rounded px-2 py-1"
                      value={error.date || ""}
                      readOnly
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium">Who made error?</label>
                    <input
                      type="text"
                      className="border rounded px-2 py-1"
                      value={error.errorBy || ""}
                      readOnly
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium">QC Open Text Field</label>
                    <textarea
                      className="border rounded px-2 py-1"
                      value={error.description || ""}
                      readOnly
                      rows={3}
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium">What step in the process was QC issue found?</label>
                    <input
                      type="text"
                      className="border rounded px-2 py-1"
                      value={error.processStep || ""}
                      readOnly
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium">Area</label>
                    <input
                      type="text"
                      className="border rounded px-2 py-1"
                      value={error.area || ""}
                      readOnly
                    />
                  </div>
                </div>
              ))}
              {qcErrors.filter(error => !error.isCritical).length === 0 && (
                <p className="text-sm text-gray-500">No non-critical errors reported</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskComplianceView;
