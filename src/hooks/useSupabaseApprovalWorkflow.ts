import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useSupabaseAuth';
import { ApprovalStatus, ChangeRequest, ChangeDetail, ChangeRequestWithDetails, TableChangesSummary } from '@/types/approval';
import { TableData } from '@/types/dynamicTable';
import { toast } from 'sonner';

export const useSupabaseApprovalWorkflow = () => {
  const { user } = useAuth();
  const [changeRequests, setChangeRequests] = useState<ChangeRequest[]>([]);
  const [changeDetails, setChangeDetails] = useState<ChangeDetail[]>([]);
  const [lockedTables, setLockedTables] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Load data on mount and set up real-time subscriptions
  useEffect(() => {
    if (user) {
      loadChangeRequests();
      loadChangeDetails();
      loadLockedTables();
      
      // Set up real-time subscriptions
      const requestsChannel = supabase
        .channel('change_requests_changes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'change_requests'
        }, () => {
          loadChangeRequests();
        })
        .subscribe();

      const detailsChannel = supabase
        .channel('change_details_changes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'change_details'
        }, () => {
          loadChangeDetails();
        })
        .subscribe();

      const locksChannel = supabase
        .channel('table_locks_changes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'table_locks'
        }, () => {
          loadLockedTables();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(requestsChannel);
        supabase.removeChannel(detailsChannel);
        supabase.removeChannel(locksChannel);
      };
    }
  }, [user]);

  const loadChangeRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('change_requests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Map database fields to frontend types
      const mappedData: ChangeRequest[] = (data || []).map(item => ({
        id: item.id,
        createdBy: item.created_by,
        createdAt: item.created_at,
        status: item.status,
        versionId: item.version_id,
        comment: item.comment,
        submittedAt: item.submitted_at,
        reviewedBy: item.reviewed_by,
        reviewedAt: item.reviewed_at
      }));
      
      setChangeRequests(mappedData);
    } catch (error) {
      console.error('Error loading change requests:', error);
    }
  };

  const loadChangeDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('change_details')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Map database fields to frontend types
      const mappedData: ChangeDetail[] = (data || []).map(item => ({
        requestId: item.request_id,
        table: item.table_name,
        ruleKey: item.rule_key,
        oldValue: item.old_value,
        newValue: item.new_value,
        status: item.status,
        reviewedBy: item.reviewed_by,
        reviewedAt: item.reviewed_at,
        comment: item.comment
      }));
      
      setChangeDetails(mappedData);
    } catch (error) {
      console.error('Error loading change details:', error);
    }
  };

  const loadLockedTables = async () => {
    try {
      const { data, error } = await supabase
        .from('table_locks')
        .select('schema_id');
      
      if (error) throw error;
      setLockedTables(data?.map(lock => lock.schema_id) || []);
    } catch (err: any) {
      // If table_locks doesn't exist, treat as no locks
      if (err?.code === '42P01' || (typeof err?.message === 'string' && err.message.toLowerCase().includes('table_locks'))) {
        setLockedTables([]);
        console.warn('table_locks not found; skipping lock load');
        return;
      }
      console.error('Error loading locked tables:', err);
    }
  };

  const submitForReview = useCallback(async (
    schemaIds: string[], 
    tableChanges: Record<string, { oldData: TableData[], newData: TableData[] }>
  ): Promise<string | null> => {
    if (!user) return null;

    setLoading(true);
    try {
      // Pre-check for locked tables
      const locked = schemaIds.filter(id => lockedTables.includes(id));
      if (locked.length > 0) {
        toast.error(`Cannot submit: ${locked.join(', ')} are locked by a pending request.`);
        return null;
      }
      const versionId = `v${Date.now()}`;

      // 1) Build change details and lock targets BEFORE creating the request
      type PendingDetail = {
        table_name: string;
        rule_key: any;
        old_value: any;
        new_value: any;
      };

      const pendingDetails: PendingDetail[] = [];
      const lockSchemas = new Set<string>();

      for (const [table, changes] of Object.entries(tableChanges)) {
        const { oldData, newData } = changes;
        lockSchemas.add(table);

        // Compare old vs new data to create change details
        const getPrimaryKey = (item: any) => {
          return (
            item?.id ||
            item?._id ||
            item?.pricing_rule_id ||
            item?.profile_id ||
            Object.values(item || {})[0]
          ); // fallback to first value
        };

        const allKeys = new Set([
          ...oldData.map(item => getPrimaryKey(item)),
          ...newData.map(item => getPrimaryKey(item))
        ]);

        for (const key of allKeys) {
          const oldItem = oldData.find(item => getPrimaryKey(item) === key);
          const newItem = newData.find(item => getPrimaryKey(item) === key);

          if (!oldItem && newItem) {
            // New item
            pendingDetails.push({
              table_name: table,
              rule_key: key,
              old_value: null,
              new_value: newItem
            });
          } else if (oldItem && !newItem) {
            // Deleted item
            pendingDetails.push({
              table_name: table,
              rule_key: key,
              old_value: oldItem,
              new_value: null
            });
          } else if (oldItem && newItem && JSON.stringify(oldItem) !== JSON.stringify(newItem)) {
            // Modified item
            pendingDetails.push({
              table_name: table,
              rule_key: key,
              old_value: oldItem,
              new_value: newItem
            });
          }
        }
      }

      // 2) If no actual changes, do NOT create a request
      if (pendingDetails.length === 0) {
        toast.info("No changes detected - there are no differences to submit for review.");
        return null;
      }

      // 3) Create change request only after confirming there are changes
      const { data: requestData, error: requestError } = await supabase
        .from('change_requests')
        .insert({
          created_by: user.id,
          status: 'IN_REVIEW' as ApprovalStatus,
          version_id: versionId,
          submitted_at: new Date().toISOString()
        })
        .select()
        .single();

      if (requestError) throw requestError;

      const requestId = requestData.id;

      // 4) Insert change details (now attach the request_id)
      const changeDetailsToInsert = pendingDetails.map(d => ({
        request_id: requestId,
        ...d,
      }));

      const { error: detailsError } = await supabase
        .from('change_details')
        .insert(changeDetailsToInsert);
      
      if (detailsError) throw detailsError;

      // 5) Insert table locks for affected schemas
      const tableLocks = Array.from(lockSchemas).map(schemaId => ({
        schema_id: schemaId,
        locked_by: user.id,
        request_id: requestId,
      }));

      if (tableLocks.length > 0) {
        const { error: locksError } = await supabase
          .from('table_locks')
          .insert(tableLocks);
        if (locksError) {
          if (locksError.code === '42P01' || (typeof locksError.message === 'string' && locksError.message.toLowerCase().includes('table_locks'))) {
            console.warn('table_locks not found; skipping lock creation');
          } else {
            throw locksError;
          }
        }
      }

      toast.success(`Changes submitted for review - ${changeDetailsToInsert.length} changes submitted successfully.`);

      return requestId;
    } catch (error) {
      console.error('Error submitting for review:', error);
      const errMsg = (error as any)?.message || "Failed to submit changes for review.";
      toast.error(`Error: ${errMsg}`);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, lockedTables]);

  const getChangeRequestWithDetails = useCallback((requestId: string): ChangeRequestWithDetails | null => {
    const request = changeRequests.find(r => r.id === requestId);
    if (!request) return null;

    const requestDetails = changeDetails.filter(d => d.requestId === requestId);
    
    // Group changes by table
    const tableChangesMap = new Map<string, ChangeDetail[]>();
    requestDetails.forEach(detail => {
      if (!tableChangesMap.has(detail.table)) {
        tableChangesMap.set(detail.table, []);
      }
      tableChangesMap.get(detail.table)!.push(detail);
    });

    const tableChanges: TableChangesSummary[] = Array.from(tableChangesMap.entries()).map(([table, changes]) => ({
      table,
      schemaId: table,
      changedRowsCount: changes.length,
      changes,
      status: changes.every(c => c.status === 'APPROVED') ? 'APPROVED' as ApprovalStatus :
              changes.every(c => c.status === 'REJECTED') ? 'REJECTED' as ApprovalStatus :
              changes.some(c => c.status === 'APPROVED' || c.status === 'REJECTED') ? 'IN_REVIEW' as ApprovalStatus :
              'PENDING' as ApprovalStatus
    }));

    return {
      ...request,
      tableChanges,
      totalChanges: requestDetails.length
    };
  }, [changeRequests, changeDetails]);

  const approveTableChanges = useCallback(async (requestId: string, table: string, comment?: string): Promise<void> => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('change_details')
        .update({
          status: 'APPROVED' as ApprovalStatus,
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
          comment
        })
        .eq('request_id', requestId)
        .eq('table_name', table);

      if (error) throw error;

      // Force refresh data to sync with database
      await Promise.all([
        loadChangeRequests(),
        loadChangeDetails()
      ]);

      toast.success(`Changes approved - Changes for ${table} have been approved.`);
    } catch (error) {
      console.error('Error approving changes:', error);
      toast.error("Error: Failed to approve changes.");
    }
  }, [user]);

  const rejectTableChanges = useCallback(async (requestId: string, table: string, comment?: string): Promise<void> => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('change_details')
        .update({
          status: 'REJECTED' as ApprovalStatus,
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
          comment
        })
        .eq('request_id', requestId)
        .eq('table_name', table);

      if (error) throw error;

      // Force refresh data to sync with database
      await Promise.all([
        loadChangeRequests(),
        loadChangeDetails()
      ]);

      toast.success(`Changes rejected - Changes for ${table} have been rejected.`);
    } catch (error) {
      console.error('Error rejecting changes:', error);
      toast.error("Error: Failed to reject changes.");
    }
  }, [user]);

  const finalizeChangeRequest = useCallback(async (requestId: string): Promise<void> => {
    if (!user) return;

    try {
      // Update request status
      const { error: requestError } = await supabase
        .from('change_requests')
        .update({
          status: 'APPROVED' as ApprovalStatus,
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (requestError) throw requestError;

      // Remove table locks (if table exists)
      const { error: locksError } = await supabase
        .from('table_locks')
        .delete()
        .eq('request_id', requestId);

      if (locksError) {
        if (locksError.code === '42P01' || (typeof locksError.message === 'string' && locksError.message.toLowerCase().includes('table_locks'))) {
          console.warn('table_locks not found; skipping unlock');
        } else {
          throw locksError;
        }
      }

      // Force refresh data to sync with database
      await Promise.all([
        loadChangeRequests(),
        loadChangeDetails(),
        loadLockedTables()
      ]);

      toast.success("Request finalized - Change request has been finalized and tables unlocked.");
    } catch (error) {
      console.error('Error finalizing request:', error);
      toast.error("Error: Failed to finalize request.");
    }
  }, [user]);

  const getPendingRequestsForAdmin = useCallback((): ChangeRequestWithDetails[] => {
    return changeRequests
      .filter(request => request.status === 'IN_REVIEW')
      .map(request => {
        const details = changeDetails.filter(d => d.requestId === request.id);
        const hasPending = details.some(d => d.status === 'PENDING');
        if (details.length === 0 || !hasPending) return null;
        return getChangeRequestWithDetails(request.id);
      })
      .filter(Boolean) as ChangeRequestWithDetails[];
  }, [changeRequests, changeDetails, getChangeRequestWithDetails]);

  const isTableLocked = useCallback((schemaId: string): boolean => {
    return lockedTables.includes(schemaId);
  }, [lockedTables]);

  const approveAllPendingRequests = useCallback(async (): Promise<void> => {
    if (!user) return;

    setLoading(true);
    try {
      const pendingRequests = getPendingRequestsForAdmin();
      
      if (pendingRequests.length === 0) {
        toast.info("No pending requests - There are no pending requests to approve.");
        return;
      }

      // Approve all change details for all pending requests
      for (const request of pendingRequests) {
        for (const tableChange of request.tableChanges) {
          if (tableChange.status === "PENDING") {
            await approveTableChanges(request.id, tableChange.schemaId, "Bulk approval of all pending requests");
          }
        }
        await finalizeChangeRequest(request.id);
      }

      toast.success(`All requests approved - ${pendingRequests.length} pending requests have been approved.`);
    } catch (error) {
      console.error('Error approving all requests:', error);
      toast.error("Error: Failed to approve all requests.");
    } finally {
      setLoading(false);
    }
  }, [user, getPendingRequestsForAdmin, approveTableChanges, finalizeChangeRequest]);

  const rejectAllPendingRequests = useCallback(async (): Promise<void> => {
    if (!user) return;

    setLoading(true);
    try {
      const pendingRequests = getPendingRequestsForAdmin();
      
      if (pendingRequests.length === 0) {
        toast.info("No pending requests - There are no pending requests to reject.");
        return;
      }

      // Reject all change details for all pending requests
      for (const request of pendingRequests) {
        for (const tableChange of request.tableChanges) {
          if (tableChange.status === "PENDING") {
            await rejectTableChanges(request.id, tableChange.schemaId, "Bulk rejection of all pending requests");
          }
        }
        await finalizeChangeRequest(request.id);
      }

      toast.success(`All requests rejected - ${pendingRequests.length} pending requests have been rejected.`);
    } catch (error) {
      console.error('Error rejecting all requests:', error);
      toast.error("Error: Failed to reject all requests.");
    } finally {
      setLoading(false);
    }
  }, [user, getPendingRequestsForAdmin, rejectTableChanges, finalizeChangeRequest]);

  const forceRefresh = useCallback(async () => {
    await Promise.all([
      loadChangeRequests(),
      loadChangeDetails(),
      loadLockedTables()
    ]);
  }, []);

  return {
    changeRequests,
    changeDetails,
    loading,
    submitForReview,
    getChangeRequestWithDetails,
    approveTableChanges,
    rejectTableChanges,
    finalizeChangeRequest,
    getPendingRequestsForAdmin,
    approveAllPendingRequests,
    rejectAllPendingRequests,
    isTableLocked,
    forceRefresh
  };
};