export type DeploymentType = 'auto' | 'manual';
export type DeploymentStatus = 'pending' | 'deployed' | 'active' | 'reverted';

export interface DeploymentVersion {
  id: string;
  version_number: string;
  deployed_at: string;
  deployed_by: string;
  deployment_type: DeploymentType;
  status: DeploymentStatus;
  change_request_ids: string[];
  snapshot_metadata: {
    totalTables: number;
    totalChanges: number;
    tables: Record<string, number>;
  };
  notes?: string;
  is_rollback: boolean;
  parent_version_id?: string;
  created_at: string;
}

export interface DeploymentSchedule {
  id: string;
  schedule_time: string;
  timezone: string;
  is_enabled: boolean;
  last_run_at?: string;
  next_run_at?: string;
  created_at: string;
  updated_at: string;
}

export interface DeploymentChangeRequest {
  id: string;
  status: string;
  table_schema_ids: string[];
  created_by: string;
  created_at: string;
  submitted_at: string;
  deployment_version_id?: string;
  deployed_at?: string;
  version_id: string;
  comment?: string;
}
