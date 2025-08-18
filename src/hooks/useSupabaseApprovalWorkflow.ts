import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useSupabaseAuth';
import { ApprovalStatus, ChangeRequest, ChangeDetail, ChangeRequestWithDetails, TableChangesSummary } from '@/types/approval';
import { TableData } from '@/types/dynamicTable';
import { toast } from '@/hooks/use-toast';

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
    } catch (error) {
      console.error('Error loading locked tables:', error);
    }
  };

  const submitForReview = useCallback(async (
    schemaIds: string[], 
    tableChanges: Record<string, { oldData: TableData[], newData: TableData[] }>
  ): Promise<string | null> => {
    if (!user) return null;

    setLoading(true);
    try {
      const versionId = `v${Date.now()}`;
      
      // Create change request
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

      // Create change details and table locks
      const changeDetailsToInsert = [];
      const tableLocks = [];

      for (const [table, changes] of Object.entries(tableChanges)) {
        const { oldData, newData } = changes;
        
        // Create table lock
        tableLocks.push({
          schema_id: table,
          locked_by: user.id,
          request_id: requestId
        });

        // Compare old vs new data to create change details
        const getPrimaryKey = (item: any) => {
          return item.id || item._id || item.pricing_rule_id || item.profile_id || 
                 Object.values(item)[0]; // fallback to first value
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
            changeDetailsToInsert.push({
              request_id: requestId,
              table_name: table,
              rule_key: key,
              old_value: null,
              new_value: newItem
            });
          } else if (oldItem && !newItem) {
            // Deleted item
            changeDetailsToInsert.push({
              request_id: requestId,
              table_name: table,
              rule_key: key,
              old_value: oldItem,
              new_value: null
            });
          } else if (oldItem && newItem && JSON.stringify(oldItem) !== JSON.stringify(newItem)) {
            // Modified item
            changeDetailsToInsert.push({
              request_id: requestId,
              table_name: table,
              rule_key: key,
              old_value: oldItem,
              new_value: newItem
            });
          }
        }
      }

      // Insert change details
      if (changeDetailsToInsert.length > 0) {
        const { error: detailsError } = await supabase
          .from('change_details')
          .insert(changeDetailsToInsert);
        
        if (detailsError) throw detailsError;
      }

      // Insert table locks
      if (tableLocks.length > 0) {
        const { error: locksError } = await supabase
          .from('table_locks')
          .insert(tableLocks);
        
        if (locksError) throw locksError;
      }

      toast({
        title: "Changes submitted for review",
        description: `${changeDetailsToInsert.length} changes submitted successfully.`
      });

      return requestId;
    } catch (error) {
      console.error('Error submitting for review:', error);
      toast({
        title: "Error",
        description: "Failed to submit changes for review.",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

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

      toast({
        title: "Changes approved",
        description: `Changes for ${table} have been approved.`
      });
    } catch (error) {
      console.error('Error approving changes:', error);
      toast({
        title: "Error",
        description: "Failed to approve changes.",
        variant: "destructive"
      });
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

      toast({
        title: "Changes rejected",
        description: `Changes for ${table} have been rejected.`
      });
    } catch (error) {
      console.error('Error rejecting changes:', error);
      toast({
        title: "Error",
        description: "Failed to reject changes.",
        variant: "destructive"
      });
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

      // Remove table locks
      const { error: locksError } = await supabase
        .from('table_locks')
        .delete()
        .eq('request_id', requestId);

      if (locksError) throw locksError;

      toast({
        title: "Request finalized",
        description: "Change request has been finalized and tables unlocked."
      });
    } catch (error) {
      console.error('Error finalizing request:', error);
      toast({
        title: "Error",
        description: "Failed to finalize request.",
        variant: "destructive"
      });
    }
  }, [user]);

  const getPendingRequestsForAdmin = useCallback((): ChangeRequestWithDetails[] => {
    return changeRequests
      .filter(request => request.status === 'IN_REVIEW')
      .map(request => getChangeRequestWithDetails(request.id))
      .filter(Boolean) as ChangeRequestWithDetails[];
  }, [changeRequests, getChangeRequestWithDetails]);

  const isTableLocked = useCallback((schemaId: string): boolean => {
    return lockedTables.includes(schemaId);
  }, [lockedTables]);

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
    isTableLocked
  };
};