import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { WizardData } from "../FinancialProgramWizard";
import { supabase } from "@/integrations/supabase/client";

interface LenderGeoStepProps {
  data: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
}

type Lender = { id: string; name?: string | null };
type Geo = { id: string; name?: string | null };

const LenderGeoStep = ({ data, onUpdate }: LenderGeoStepProps) => {
  const [lenders, setLenders] = useState<Lender[]>([]);
  const [geos, setGeos] = useState<Geo[]>([]);

  useEffect(() => {
    const load = async () => {
      const lendersRes = await supabase
        .from("lenders")
        .select('"Gateway lender ID", lender_name');
      const lenderList: Lender[] = (lendersRes.data || []).map((r: any) => ({
        id: r["Gateway lender ID"],
        name: r.lender_name,
      }));
      setLenders(lenderList);

      const geoRes = await supabase
        .from("geo_location")
        .select("geo_code, location_name");
      const geoList: Geo[] = (geoRes.data || []).map((r: any) => ({
        id: r.geo_code,
        name: r.location_name,
      }));
      setGeos(geoList);
    };
    load();
  }, []);

  const handleLenderToggle = (lenderId: string, checked: boolean) => {
    const updatedLenders = checked
      ? [...data.lenders, lenderId]
      : data.lenders.filter((id) => id !== lenderId);
    onUpdate({ lenders: updatedLenders });
  };

  const handleGeoToggle = (geoId: string, checked: boolean) => {
    const updatedGeos = checked
      ? [...data.geoCodes, geoId]
      : data.geoCodes.filter((id) => id !== geoId);
    onUpdate({ geoCodes: updatedGeos });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Lenders & Geography</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Select the lenders and geographic regions for this financial program.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h4 className="font-medium">Available Lenders *</h4>
          <div className="space-y-3">
            {lenders.map((lender) => (
              <div key={lender.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                <Checkbox
                  id={`lender-${lender.id}`}
                  checked={data.lenders.includes(lender.id)}
                  onCheckedChange={(checked) => handleLenderToggle(lender.id, checked as boolean)}
                />
                <div className="flex-1">
                  <Label htmlFor={`lender-${lender.id}`} className="text-sm font-medium cursor-pointer">
                    {lender.id}
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">{lender.name}</p>
                </div>
              </div>
            ))}
            {lenders.length === 0 && (
              <div className="text-sm text-muted-foreground">No lenders found.</div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Geographic Regions *</h4>
          <div className="space-y-3">
            {geos.map((geo) => (
              <div key={geo.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                <Checkbox
                  id={`geo-${geo.id}`}
                  checked={data.geoCodes.includes(geo.id)}
                  onCheckedChange={(checked) => handleGeoToggle(geo.id, checked as boolean)}
                />
                <div className="flex-1">
                  <Label htmlFor={`geo-${geo.id}`} className="text-sm font-medium cursor-pointer">
                    {geo.id}
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">{geo.name}</p>
                </div>
              </div>
            ))}
            {geos.length === 0 && (
              <div className="text-sm text-muted-foreground">No geographic regions found.</div>
            )}
          </div>
        </div>
      </div>

      {(data.lenders.length > 0 || data.geoCodes.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {data.lenders.length > 0 && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800 font-medium">Selected Lenders ({data.lenders.length})</p>
              <div className="text-xs text-green-700 mt-2">{data.lenders.join(", ")}</div>
            </div>
          )}

          {data.geoCodes.length > 0 && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800 font-medium">Selected Regions ({data.geoCodes.length})</p>
              <div className="text-xs text-blue-700 mt-2">{data.geoCodes.join(", ")}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LenderGeoStep;
