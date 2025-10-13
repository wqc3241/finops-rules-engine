import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface UserProfile {
  user_id: string;
  email: string;
  role: string;
}

export const useUserProfiles = () => {
  return useQuery({
    queryKey: ['user-profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('user_id, email, role')
        .order('email');
      
      if (error) throw error;
      return data as UserProfile[];
    }
  });
};
