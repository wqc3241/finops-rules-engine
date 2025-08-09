import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { WizardData } from "../FinancialProgramWizard";
import { supabase } from "@/integrations/supabase/client";

interface FinancialProductStepProps {
  data: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
}

type Product = { id: string; label: string; type: string; geoCode?: string | null };

const FinancialProductStep = ({ data, onUpdate }: FinancialProductStepProps) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("financial_products")
        .select("product_id, product_type, product_subtype, geo_code, is_active");

      const list: Product[] = (data || [])
        .filter((r: any) => r.is_active !== false)
        .map((r: any) => ({
          id: r.product_id,
          label: `${r.product_id} - ${r.product_subtype || r.product_type}`,
          type: r.product_type,
          geoCode: r.geo_code,
        }));
      setProducts(list);
    };
    load();
  }, []);

  const handleProductSelect = (value: string) => {
    onUpdate({ financialProduct: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Financial Product</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Select the single financial product that will be available in this program.
        </p>
      </div>

      <RadioGroup
        value={data.financialProduct}
        onValueChange={handleProductSelect}
        className="space-y-4"
      >
        {products.map((product) => (
          <div key={product.id} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50">
            <RadioGroupItem value={product.id} id={product.id} className="mt-1" />
            <div className="flex-1">
              <Label htmlFor={product.id} className="text-sm font-medium cursor-pointer">
                {product.label}
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                Type: {product.type} {product.geoCode ? `| Geo: ${product.geoCode}` : ""}
              </p>
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <div className="text-sm text-muted-foreground">No financial products found.</div>
        )}
      </RadioGroup>

      {data.financialProduct && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Selected Product ID:</strong> {data.financialProduct}
          </p>
        </div>
      )}
    </div>
  );
};

export default FinancialProductStep;
