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
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('user_id', userData.user.id)
          .single();

        // Enable all features for all authenticated users
        if (profile?.role) {
          setFlags(DEFAULT_FLAGS);
        }
      }

      setLoading(false);
    };

    loadFlags();
  }, []);

  return { flags, loading };
};
