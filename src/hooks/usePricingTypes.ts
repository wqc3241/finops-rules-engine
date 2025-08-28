
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export type PricingType = {
  id: string;
  typeCode: string;
  typeName: string;
  financialProducts: string[];
};

export const usePricingTypes = () => {
  const [pricingTypes, setPricingTypes] = useState<PricingType[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTypes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("pricing_types")
      .select("id, type_code, type_name, financial_products_list")
      .order("type_code", { ascending: true });

    if (!error) {
      setPricingTypes(
        (data || []).map((r: any) => ({
          id: r.id,
          typeCode: r.type_code,
          typeName: r.type_name,
          financialProducts: r.financial_products_list || [],
        }))
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  const addPricingType = async (typeCode: string, typeName: string) => {
    if (pricingTypes.some((pt) => pt.typeCode === typeCode)) {
      return false;
    }
    const { error } = await supabase
      .from("pricing_types")
      .insert({ type_code: typeCode, type_name: typeName });
    if (error) return false;
    await fetchTypes();
    return true;
  };

  return { pricingTypes, addPricingType, setPricingTypes, loading, refetch: fetchTypes };
};

