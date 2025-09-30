
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export type PricingType = {
  id: string;
  typeCode: string;
  typeName: string;
  financialProducts: string[];
  isLenderSpecific: boolean;
};

export const usePricingTypes = () => {
  const [pricingTypes, setPricingTypes] = useState<PricingType[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTypes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("pricing_types")
      .select("id, type_code, type_name, financial_products_list, is_lender_specific")
      .order("type_code", { ascending: true });

    if (!error) {
      setPricingTypes(
        (data || []).map((r: any) => ({
          id: r.id,
          typeCode: r.type_code,
          typeName: r.type_name,
          financialProducts: r.financial_products_list || [],
          isLenderSpecific: r.is_lender_specific || false,
        }))
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  const addPricingType = async (typeCode: string, typeName: string, financialProductIds?: string[], isLenderSpecific?: boolean) => {
    if (pricingTypes.some((pt) => pt.typeCode === typeCode)) {
      return false;
    }
    const { error } = await supabase
      .from("pricing_types")
      .insert({ 
        type_code: typeCode, 
        type_name: typeName,
        financial_products_list: financialProductIds || [],
        is_lender_specific: isLenderSpecific ?? false
      });
    if (error) return false;
    await fetchTypes();
    return true;
  };

  return { pricingTypes, addPricingType, setPricingTypes, loading, refetch: fetchTypes };
};

