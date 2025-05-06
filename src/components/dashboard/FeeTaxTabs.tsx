
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FeeSection from "./FeeSection";
import TaxSection from "./TaxSection";

const FeeTaxTabs = () => {
  return (
    <Tabs defaultValue="fee" className="w-full">
      <div className="border-b border-gray-200">
        <TabsList className="bg-transparent h-auto p-0 w-full flex overflow-x-auto">
          <TabsTrigger value="fee" className="py-3 px-6 data-[state=active]:border-b-2 data-[state=active]:border-gray-900 data-[state=active]:bg-transparent rounded-none">
            Fee
          </TabsTrigger>
          <TabsTrigger value="tax" className="py-3 px-6 data-[state=active]:border-b-2 data-[state=active]:border-gray-900 data-[state=active]:bg-transparent rounded-none">
            Tax
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="fee">
        <FeeSection title="Fee" />
      </TabsContent>
      <TabsContent value="tax">
        <TaxSection title="Tax" />
      </TabsContent>
    </Tabs>
  );
};

export default FeeTaxTabs;
