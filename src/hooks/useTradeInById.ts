import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { TradeIn } from '@/types/tradeIn';

export const useTradeInById = (tradeInId: string | null | undefined) => {
  return useQuery({
    queryKey: ['trade-in-by-id', tradeInId],
    queryFn: async () => {
      if (!tradeInId) return null;
      
      const { data, error } = await supabase
        .from('trade_ins')
        .select('*')
        .eq('id', tradeInId)
        .maybeSingle();
      
      if (error) throw error;
      return data as TradeIn | null;
    },
    enabled: !!tradeInId
  });
};
