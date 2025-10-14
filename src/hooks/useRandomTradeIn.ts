import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TradeIn } from '@/types/tradeIn';

export const useRandomTradeIn = () => {
  return useQuery({
    queryKey: ['random-trade-in'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trade_ins')
        .select('*')
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      return data as TradeIn | null;
    }
  });
};
