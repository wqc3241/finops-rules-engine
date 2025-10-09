import { useSupabaseApplications } from './useSupabaseApplications';
import { useFeatureFlags } from './useFeatureFlags';

/**
 * Wrapper hook that switches between Supabase and localStorage based on feature flags
 * Currently always uses Supabase since migration is complete
 * This hook exists for future rollback capability
 */
export const useApplications = () => {
  const { flags, loading: flagsLoading } = useFeatureFlags();
  
  // Always use Supabase since we've migrated
  const supabaseHook = useSupabaseApplications();
  
  return {
    ...supabaseHook,
    loading: supabaseHook.loading || flagsLoading,
  };
};
