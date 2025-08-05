import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface TaxRule {
  id: string;
  tax_name: string;
  tax_type: string;
  rate: number;
  geo_code?: string;
  is_active: boolean;
  created_at: string;
}

export const useSupabaseTaxRules = () => {
  const [taxRules, setTaxRules] = useState<TaxRule[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTaxRules = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tax_rules')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setTaxRules(data || []);
    } catch (error) {
      console.error('Error fetching tax rules:', error);
      toast({
        title: "Error",
        description: "Failed to fetch tax rules",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addTaxRule = async (taxRule: Omit<TaxRule, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('tax_rules')
        .insert([taxRule])
        .select()
        .single();

      if (error) throw error;
      setTaxRules(prev => [...prev, data]);
      toast({
        title: "Success",
        description: "Tax rule added successfully",
      });
      return data;
    } catch (error) {
      console.error('Error adding tax rule:', error);
      toast({
        title: "Error",
        description: "Failed to add tax rule",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateTaxRule = async (id: string, updates: Partial<TaxRule>) => {
    try {
      const { data, error } = await supabase
        .from('tax_rules')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setTaxRules(prev => prev.map(rule => rule.id === id ? data : rule));
      toast({
        title: "Success",
        description: "Tax rule updated successfully",
      });
      return data;
    } catch (error) {
      console.error('Error updating tax rule:', error);
      toast({
        title: "Error",
        description: "Failed to update tax rule",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteTaxRule = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tax_rules')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setTaxRules(prev => prev.filter(rule => rule.id !== id));
      toast({
        title: "Success",
        description: "Tax rule deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting tax rule:', error);
      toast({
        title: "Error",
        description: "Failed to delete tax rule",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteTaxRules = async (ids: string[]) => {
    try {
      const { error } = await supabase
        .from('tax_rules')
        .delete()
        .in('id', ids);

      if (error) throw error;
      setTaxRules(prev => prev.filter(rule => !ids.includes(rule.id)));
      toast({
        title: "Success",
        description: `${ids.length} tax rules deleted successfully`,
      });
    } catch (error) {
      console.error('Error deleting tax rules:', error);
      toast({
        title: "Error",
        description: "Failed to delete tax rules",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchTaxRules();
  }, []);

  return {
    taxRules,
    loading,
    addTaxRule,
    updateTaxRule,
    deleteTaxRule,
    deleteTaxRules,
    refetch: fetchTaxRules
  };
};