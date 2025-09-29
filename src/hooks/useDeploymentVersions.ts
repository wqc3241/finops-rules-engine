import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DeploymentVersion, DeploymentSchedule } from '@/types/deployment';
import { generateVersionNumber, calculateSnapshotMetadata } from '@/utils/deploymentUtils';
import { toast } from 'sonner';

export const useDeploymentVersions = () => {
  const [versions, setVersions] = useState<DeploymentVersion[]>([]);
  const [schedule, setSchedule] = useState<DeploymentSchedule | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getDeploymentVersions = useCallback(async (days: number = 7) => {
    try {
      setIsLoading(true);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const { data, error } = await supabase
        .from('deployment_versions')
        .select('*')
        .gte('deployed_at', cutoffDate.toISOString())
        .order('deployed_at', { ascending: false });

      if (error) throw error;
      setVersions((data || []) as DeploymentVersion[]);
      return (data || []) as DeploymentVersion[];
    } catch (error: any) {
      console.error('Error fetching deployment versions:', error);
      toast.error('Failed to load deployment versions');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getVersionDetails = useCallback(async (versionId: string) => {
    try {
      const { data, error } = await supabase
        .from('deployment_versions')
        .select('*')
        .eq('id', versionId)
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error fetching version details:', error);
      toast.error('Failed to load version details');
      return null;
    }
  }, []);

  const getVersionByNumber = useCallback(async (versionNumber: string) => {
    try {
      const { data, error } = await supabase
        .from('deployment_versions')
        .select('*')
        .eq('version_number', versionNumber)
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error fetching version by number:', error);
      return null;
    }
  }, []);

  const createDeploymentVersion = useCallback(async (
    requestIds: string[],
    type: 'auto' | 'manual',
    notes?: string
  ) => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('User not authenticated');

      // Get change details for metadata
      const { data: changeDetails, error: detailsError } = await supabase
        .from('change_details')
        .select('*')
        .in('request_id', requestIds);

      if (detailsError) throw detailsError;

      const metadata = calculateSnapshotMetadata(changeDetails || []);
      const versionNumber = generateVersionNumber();

      const { data, error } = await supabase
        .from('deployment_versions')
        .insert({
          version_number: versionNumber,
          deployed_by: user.id,
          deployment_type: type,
          status: 'deployed',
          change_request_ids: requestIds,
          snapshot_metadata: metadata,
          notes
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Deployment version created successfully');
      return data;
    } catch (error: any) {
      console.error('Error creating deployment version:', error);
      toast.error('Failed to create deployment version');
      return null;
    }
  }, []);

  const deployApprovedChanges = useCallback(async (
    requestIds: string[],
    notes?: string
  ) => {
    try {
      setIsLoading(true);

      // Create deployment version
      const version = await createDeploymentVersion(requestIds, 'manual', notes);
      if (!version) throw new Error('Failed to create version');

      // Mark change requests as deployed
      const { error: updateError } = await supabase
        .from('change_requests')
        .update({
          deployment_version_id: version.id,
          deployed_at: new Date().toISOString()
        })
        .in('id', requestIds);

      if (updateError) throw updateError;

      // Remove table locks for deployed changes
      const { data: requests } = await supabase
        .from('change_requests')
        .select('table_schema_ids')
        .in('id', requestIds);

      const schemaIds: string[] = [];
      requests?.forEach(r => {
        if (Array.isArray(r.table_schema_ids)) {
          schemaIds.push(...(r.table_schema_ids as string[]));
        }
      });
      
      // Remove locks and update version
      if (schemaIds.length > 0) {
        // Delete locks - type assertion to avoid TS recursion
        const deleteQuery = supabase.from('table_locks').delete();
        const { error: lockDeleteError } = await (deleteQuery as any).in('table_schema_id', schemaIds);
        
        if (lockDeleteError) console.error('Error deleting locks:', lockDeleteError);
      }

      
      // First, expire all currently active versions
      const { error: expireError } = await supabase
        .from('deployment_versions')
        .update({ status: 'expired' })
        .eq('status', 'active');
      
      if (expireError) console.error('Error expiring previous versions:', expireError);

      // Then set the new version as active
      const { error: versionUpdateError } = await supabase
        .from('deployment_versions')
        .update({ status: 'active' })
        .eq('id', version.id);
      
      if (versionUpdateError) console.error('Error updating version:', versionUpdateError);

      toast.success('Changes deployed successfully');
      await getDeploymentVersions();
      return version;
    } catch (error: any) {
      console.error('Error deploying changes:', error);
      toast.error('Failed to deploy changes');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [createDeploymentVersion, getDeploymentVersions]);

  const revertToVersion = useCallback(async (versionId: string, reason: string) => {
    try {
      setIsLoading(true);
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('User not authenticated');

      const targetVersion = await getVersionDetails(versionId);
      if (!targetVersion) throw new Error('Version not found');

      // Mark current active version as reverted
      await supabase
        .from('deployment_versions')
        .update({ status: 'reverted' })
        .eq('status', 'active');

      // Create new rollback version
      const versionNumber = generateVersionNumber();
      const { data: rollbackVersion, error } = await supabase
        .from('deployment_versions')
        .insert({
          version_number: versionNumber,
          deployed_by: user.id,
          deployment_type: 'manual',
          status: 'active',
          change_request_ids: targetVersion.change_request_ids,
          snapshot_metadata: targetVersion.snapshot_metadata,
          notes: `Rollback to ${targetVersion.version_number}: ${reason}`,
          is_rollback: true,
          parent_version_id: versionId
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Successfully reverted to previous version');
      await getDeploymentVersions();
      return rollbackVersion;
    } catch (error: any) {
      console.error('Error reverting version:', error);
      toast.error('Failed to revert version');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [getVersionDetails, getDeploymentVersions]);

  const getScheduleInfo = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('deployment_schedule')
        .select('*')
        .limit(1)
        .single();

      if (error) throw error;
      setSchedule(data);
      return data;
    } catch (error: any) {
      console.error('Error fetching schedule:', error);
      return null;
    }
  }, []);

  const getPendingDeployableChanges = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('change_requests')
        .select('*')
        .eq('status', 'APPROVED')
        .is('deployment_version_id', null);

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Error fetching pending changes:', error);
      return [];
    }
  }, []);

  useEffect(() => {
    getDeploymentVersions();
    getScheduleInfo();

    // Subscribe to deployment_versions changes
    const channel = supabase
      .channel('deployment_versions_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'deployment_versions'
        },
        () => {
          getDeploymentVersions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [getDeploymentVersions, getScheduleInfo]);

  return {
    versions,
    schedule,
    isLoading,
    getDeploymentVersions,
    getVersionDetails,
    getVersionByNumber,
    createDeploymentVersion,
    deployApprovedChanges,
    revertToVersion,
    getScheduleInfo,
    getPendingDeployableChanges
  };
};
