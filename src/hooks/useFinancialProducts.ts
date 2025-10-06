
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCountry } from "./useCountry";
import { getGeoCodeFilter } from "@/utils/geoCodeFilter";

export type FinancialProduct = {
  id: string;
  productType: string;
  productSubtype: string | null;
  geoCode: string;
  category: string;
  isActive: boolean;
};

export function useFinancialProducts() {
  const [products, setProducts] = useState<FinancialProduct[]>([]);
  const { selectedCountry } = useCountry();

  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("financial_products")
        .select("product_id, product_type, product_subtype, geo_code, category, is_active")
        .eq("is_active", true)
        .ilike("geo_code", getGeoCodeFilter(selectedCountry.code))
        .order("product_id", { ascending: true });

      if (error) {
        console.error("Failed to load financial products:", error);
        return;
      }

      if (!isMounted) return;
      const mapped: FinancialProduct[] = (data || []).map((r: any) => ({
        id: r.product_id,
        productType: r.product_type,
        productSubtype: r.product_subtype ?? null,
        geoCode: r.geo_code ?? "",
        category: r.category ?? "",
        isActive: r.is_active ?? true,
      }));
      setProducts(mapped);
    };

    fetchProducts();
    return () => {
      isMounted = false;
    };
  }, [selectedCountry.code]);

  return products;
}
