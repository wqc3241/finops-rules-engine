import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface FeatureFlags {
  useSupabaseApplications: boolean;
  enableRealtimeSync: boolean;
  enableDateRangeFilter: boolean;
}

const DEFAULT_FLAGS: FeatureFlags = {
  useSupabaseApplications: true,
  enableRealtimeSync: true,
  enableDateRangeFilter: true,
};

export const useFeatureFlags = () => {
  const [flags, setFlags] = useState<FeatureFlags>(DEFAULT_FLAGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFlags = async () => {
      const { data: userData } = await supabase.auth.getUser();
      
      if (userData?.user) {
        // Check for system-wide feature flags in database
        const { data: systemFlags } = await supabase
          .from('feature_flags')
          .select('*')
          .limit(1)
          .maybeSingle();

        if (systemFlags) {
          setFlags({
            useSupabaseApplications: systemFlags.use_supabase_applications ?? true,
            enableRealtimeSync: systemFlags.enable_realtime_sync ?? true,
            enableDateRangeFilter: systemFlags.enable_date_range_filter ?? true,
          });
        } else {
          // Use default flags
          setFlags(DEFAULT_FLAGS);
        }
      }

      setLoading(false);
    };

    loadFlags();
  }, []);

  return { flags, loading };
};
