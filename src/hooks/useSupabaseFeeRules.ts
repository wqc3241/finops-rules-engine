import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface FeeRule {
  id: string;
  fee_name: string;
  fee_type: string;
  amount: number;
  is_active: boolean;
  created_at: string;
}

export const useSupabaseFeeRules = () => {
  const [feeRules, setFeeRules] = useState<FeeRule[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchFeeRules = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('fee_rules')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setFeeRules(data || []);
    } catch (error) {
      console.error('Error fetching fee rules:', error);
      toast({
        title: "Error",
        description: "Failed to fetch fee rules",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addFeeRule = async (feeRule: Omit<FeeRule, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('fee_rules')
        .insert([feeRule])
        .select()
        .single();

      if (error) throw error;
      setFeeRules(prev => [...prev, data]);
      toast({
        title: "Success",
        description: "Fee rule added successfully",
      });
      return data;
    } catch (error) {
      console.error('Error adding fee rule:', error);
      toast({
        title: "Error",
        description: "Failed to add fee rule",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateFeeRule = async (id: string, updates: Partial<FeeRule>) => {
    try {
      const { data, error } = await supabase
        .from('fee_rules')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setFeeRules(prev => prev.map(rule => rule.id === id ? data : rule));
      toast({
        title: "Success",
        description: "Fee rule updated successfully",
      });
      return data;
    } catch (error) {
      console.error('Error updating fee rule:', error);
      toast({
        title: "Error",
        description: "Failed to update fee rule",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteFeeRule = async (id: string) => {
    try {
      const { error } = await supabase
        .from('fee_rules')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setFeeRules(prev => prev.filter(rule => rule.id !== id));
      toast({
        title: "Success",
        description: "Fee rule deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting fee rule:', error);
      toast({
        title: "Error",
        description: "Failed to delete fee rule",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteFeeRules = async (ids: string[]) => {
    try {
      const { error } = await supabase
        .from('fee_rules')
        .delete()
        .in('id', ids);

      if (error) throw error;
      setFeeRules(prev => prev.filter(rule => !ids.includes(rule.id)));
      toast({
        title: "Success",
        description: `${ids.length} fee rules deleted successfully`,
      });
    } catch (error) {
      console.error('Error deleting fee rules:', error);
      toast({
        title: "Error",
        description: "Failed to delete fee rules",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchFeeRules();
  }, []);

  return {
    feeRules,
    loading,
    addFeeRule,
    updateFeeRule,
    deleteFeeRule,
    deleteFeeRules,
    refetch: fetchFeeRules
  };
};