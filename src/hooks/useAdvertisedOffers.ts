import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AdvertisedOffer, DiscountInfo } from '@/types/advertisedOffer';
import { toast } from 'sonner';

export const useAdvertisedOffers = () => {
  const [offers, setOffers] = useState<AdvertisedOffer[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('advertised_offers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match our AdvertisedOffer type
      const transformedData = (data || []).map(offer => ({
        ...offer,
        applicable_discounts: (offer.applicable_discounts || []) as any as DiscountInfo[]
      })) as AdvertisedOffer[];
      
      setOffers(transformedData);
    } catch (error: any) {
      console.error('Error fetching advertised offers:', error);
      toast.error('Failed to fetch advertised offers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const createOffer = async (offerData: Partial<AdvertisedOffer>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('advertised_offers')
        .insert({
          ...offerData as any,
          created_by: user?.id
        })
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Advertised offer created successfully');
      await fetchOffers();
      return data;
    } catch (error: any) {
      console.error('Error creating advertised offer:', error);
      toast.error('Failed to create advertised offer');
      throw error;
    }
  };

  const createOffers = async (offersData: Partial<AdvertisedOffer>[]) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const offersWithUser = offersData.map(offer => ({
        ...offer as any,
        created_by: user?.id
      }));

      const { data, error } = await supabase
        .from('advertised_offers')
        .insert(offersWithUser as any)
        .select();

      if (error) throw error;
      
      toast.success(`${offersData.length} advertised offers created successfully`);
      await fetchOffers();
      return data;
    } catch (error: any) {
      console.error('Error creating advertised offers:', error);
      toast.error('Failed to create advertised offers');
      throw error;
    }
  };

  const updateOffer = async (id: string, updates: Partial<AdvertisedOffer>, requestId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('pending_advertised_offers')
        .insert({
          ...updates as any,
          request_id: requestId,
          original_offer_id: id,
          created_by: user?.id
        });

      if (error) throw error;
      
      toast.success('Changes submitted for review');
    } catch (error: any) {
      console.error('Error submitting offer changes:', error);
      toast.error('Failed to submit changes for review');
      throw error;
    }
  };

  const deleteOffer = async (id: string) => {
    try {
      const { error } = await supabase
        .from('advertised_offers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Advertised offer deleted successfully');
      await fetchOffers();
    } catch (error: any) {
      console.error('Error deleting advertised offer:', error);
      toast.error('Failed to delete advertised offer');
      throw error;
    }
  };

  const toggleOfferStatus = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('advertised_offers')
        .update({ is_active: isActive })
        .eq('id', id);

      if (error) throw error;
      
      await fetchOffers();
    } catch (error: any) {
      console.error('Error toggling offer status:', error);
      toast.error('Failed to toggle offer status');
      throw error;
    }
  };

  return {
    offers,
    loading,
    fetchOffers,
    createOffer,
    createOffers,
    updateOffer,
    deleteOffer,
    toggleOfferStatus
  };
};
