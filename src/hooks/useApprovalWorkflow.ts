import { useState, useEffect, useCallback } from "react";
import { ChangeRequest, ChangeDetail, ApprovalStatus, ChangeRequestWithDetails, TableChangesSummary } from "@/types/approval";
import { TableData } from "@/types/dynamicTable";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export const useApprovalWorkflow = () => {
  const [changeRequests, setChangeRequests] = useState<ChangeRequest[]>([]);
  const [changeDetails, setChangeDetails] = useState<ChangeDetail[]>([]);
  const [pendingChanges, setPendingChanges] = useState<Record<string, TableData[]>>({});
  const [lockedTables, setLockedTables] = useState<Set<string>>(new Set());
  const { user } = useAuth();

  // Load data from localStorage
  useEffect(() => {
    const savedRequests = localStorage.getItem('changeRequests');
    const savedDetails = localStorage.getItem('changeDetails');
    const savedPendingChanges = localStorage.getItem('pendingChanges');
    const savedLockedTables = localStorage.getItem('lockedTables');

    if (savedRequests) {
      setChangeRequests(JSON.parse(savedRequests));
    }
    if (savedDetails) {
      setChangeDetails(JSON.parse(savedDetails));
    }
    if (savedPendingChanges) {
      setPendingChanges(JSON.parse(savedPendingChanges));
    }
    if (savedLockedTables) {
      setLockedTables(new Set(JSON.parse(savedLockedTables)));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('changeRequests', JSON.stringify(changeRequests));
  }, [changeRequests]);

  useEffect(() => {
    localStorage.setItem('changeDetails', JSON.stringify(changeDetails));
  }, [changeDetails]);

  useEffect(() => {
    localStorage.setItem('pendingChanges', JSON.stringify(pendingChanges));
  }, [pendingChanges]);

  useEffect(() => {
    localStorage.setItem('lockedTables', JSON.stringify(Array.from(lockedTables)));
  }, [lockedTables]);

  const submitForReview = useCallback((schemaIds: string[], tableChanges: Record<string, { oldData: TableData[], newData: TableData[] }>) => {
    if (!user) return null;

    const requestId = `CR_${Date.now()}`;
    const versionId = `V_${Date.now()}`;

    // Create change request
    const changeRequest: ChangeRequest = {
      id: requestId,
      createdBy: user.email,
      createdAt: new Date().toISOString(),
      status: "IN_REVIEW",
      versionId,
      submittedAt: new Date().toISOString(),
    };

    // Create change details for each modified record
    const details: ChangeDetail[] = [];
    
    Object.entries(tableChanges).forEach(([schemaId, { oldData, newData }]) => {
      // Find changed records
      newData.forEach(newRecord => {
        const oldRecord = oldData.find(old => old.id === newRecord.id);
        
        if (!oldRecord) {
          // New record
          details.push({
            requestId,
            table: schemaId,
            ruleKey: newRecord.id,
            oldValue: null,
            newValue: newRecord,
            status: "PENDING"
          });
        } else {
          // Check for changes
          const hasChanges = JSON.stringify(oldRecord) !== JSON.stringify(newRecord);
          if (hasChanges) {
            details.push({
              requestId,
              table: schemaId,
              ruleKey: newRecord.id,
              oldValue: oldRecord,
              newValue: newRecord,
              status: "PENDING"
            });
          }
        }
      });

      // Check for deleted records
      oldData.forEach(oldRecord => {
        const exists = newData.find(newRec => newRec.id === oldRecord.id);
        if (!exists) {
          details.push({
            requestId,
            table: schemaId,
            ruleKey: oldRecord.id,
            oldValue: oldRecord,
            newValue: null,
            status: "PENDING"
          });
        }
      });
    });

    // Store pending changes
    const newPendingChanges = { ...pendingChanges };
    Object.entries(tableChanges).forEach(([schemaId, { newData }]) => {
      newPendingChanges[schemaId] = newData;
    });

    // Lock affected tables
    const newLockedTables = new Set([...lockedTables, ...schemaIds]);

    setChangeRequests(prev => [...prev, changeRequest]);
    setChangeDetails(prev => [...prev, ...details]);
    setPendingChanges(newPendingChanges);
    setLockedTables(newLockedTables);

    toast.success(`Change request ${requestId} submitted for review`);
    return requestId;
  }, [user, pendingChanges, lockedTables]);

  const getChangeRequestWithDetails = useCallback((requestId: string): ChangeRequestWithDetails | null => {
    const request = changeRequests.find(r => r.id === requestId);
    if (!request) return null;

    const requestDetails = changeDetails.filter(d => d.requestId === requestId);
    
    // Group by table
    const tableGroups = requestDetails.reduce((acc, detail) => {
      if (!acc[detail.table]) {
        acc[detail.table] = [];
      }
      acc[detail.table].push(detail);
      return acc;
    }, {} as Record<string, ChangeDetail[]>);

    const tableChanges: TableChangesSummary[] = Object.entries(tableGroups).map(([table, changes]) => ({
      table,
      schemaId: table,
      changedRowsCount: changes.length,
      changes,
      status: changes.every(c => c.status === "APPROVED") ? "APPROVED" : 
              changes.every(c => c.status === "REJECTED") ? "REJECTED" : 
              changes.some(c => c.status === "REJECTED") ? "REJECTED" : "PENDING"
    }));

    return {
      ...request,
      tableChanges,
      totalChanges: requestDetails.length
    };
  }, [changeRequests, changeDetails]);

  const approveTableChanges = useCallback((requestId: string, table: string, comment?: string) => {
    if (!user) return;

    setChangeDetails(prev => prev.map(detail => {
      if (detail.requestId === requestId && detail.table === table) {
        return {
          ...detail,
          status: "APPROVED" as ApprovalStatus,
          reviewedBy: user.email,
          reviewedAt: new Date().toISOString(),
          comment
        };
      }
      return detail;
    }));

    toast.success(`${table} changes approved`);
  }, [user]);

  const rejectTableChanges = useCallback((requestId: string, table: string, comment?: string) => {
    if (!user) return;

    setChangeDetails(prev => prev.map(detail => {
      if (detail.requestId === requestId && detail.table === table) {
        return {
          ...detail,
          status: "REJECTED" as ApprovalStatus,
          reviewedBy: user.email,
          reviewedAt: new Date().toISOString(),
          comment
        };
      }
      return detail;
    }));

    toast.success(`${table} changes rejected`);
  }, [user]);

  const finalizeChangeRequest = useCallback((requestId: string) => {
    const requestDetails = changeDetails.filter(d => d.requestId === requestId);
    const allApproved = requestDetails.every(d => d.status === "APPROVED");
    const hasRejected = requestDetails.some(d => d.status === "REJECTED");

    let finalStatus: ApprovalStatus;
    if (allApproved) {
      finalStatus = "APPROVED";
      // Apply approved changes to live data
      requestDetails.forEach(detail => {
        if (detail.status === "APPROVED" && detail.newValue) {
          const currentData = JSON.parse(localStorage.getItem(`dynamicTableData_${detail.table}`) || '[]');
          const updatedData = currentData.map((item: TableData) => 
            item.id === detail.ruleKey ? detail.newValue : item
          );
          // Add new records
          if (!currentData.find((item: TableData) => item.id === detail.ruleKey) && detail.newValue) {
            updatedData.push(detail.newValue);
          }
          localStorage.setItem(`dynamicTableData_${detail.table}`, JSON.stringify(updatedData));
        } else if (detail.status === "APPROVED" && !detail.newValue) {
          // Handle deletions
          const currentData = JSON.parse(localStorage.getItem(`dynamicTableData_${detail.table}`) || '[]');
          const updatedData = currentData.filter((item: TableData) => item.id !== detail.ruleKey);
          localStorage.setItem(`dynamicTableData_${detail.table}`, JSON.stringify(updatedData));
        }
      });
      
      // Unlock tables
      const affectedTables = [...new Set(requestDetails.map(d => d.table))];
      setLockedTables(prev => {
        const newSet = new Set(prev);
        affectedTables.forEach(table => newSet.delete(table));
        return newSet;
      });
      
      toast.success("All changes approved and applied to live data");
    } else if (hasRejected) {
      finalStatus = "REJECTED";
      // Unlock rejected tables for re-editing
      const rejectedTables = requestDetails.filter(d => d.status === "REJECTED").map(d => d.table);
      setLockedTables(prev => {
        const newSet = new Set(prev);
        rejectedTables.forEach(table => newSet.delete(table));
        return newSet;
      });
      toast.info("Some changes rejected. Affected tables unlocked for re-editing");
    } else {
      return; // Still pending
    }

    setChangeRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: finalStatus, reviewedAt: new Date().toISOString() } : req
    ));
  }, [changeDetails]);

  const getPendingRequestsForAdmin = useCallback(() => {
    return changeRequests
      .filter(req => req.status === "IN_REVIEW")
      .map(req => getChangeRequestWithDetails(req.id))
      .filter(Boolean) as ChangeRequestWithDetails[];
  }, [changeRequests, getChangeRequestWithDetails]);

  const isTableLocked = useCallback((schemaId: string) => {
    return lockedTables.has(schemaId);
  }, [lockedTables]);

  return {
    submitForReview,
    getChangeRequestWithDetails,
    approveTableChanges,
    rejectTableChanges,
    finalizeChangeRequest,
    getPendingRequestsForAdmin,
    isTableLocked,
    pendingChanges,
    changeRequests,
    changeDetails
  };
};