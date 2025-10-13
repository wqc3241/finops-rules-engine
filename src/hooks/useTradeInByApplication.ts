import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TradeIn } from '@/types/tradeIn';

export const useTradeInByApplication = (applicationId: string | undefined) => {
  return useQuery({
    queryKey: ['trade-in', applicationId],
    queryFn: async () => {
      if (!applicationId) return null;
      
      const { data, error } = await supabase
        .from('trade_ins')
        .select('*')
        .eq('application_id', applicationId)
        .maybeSingle();
      
      if (error) throw error;
      return data as TradeIn | null;
    },
    enabled: !!applicationId
  });
};
