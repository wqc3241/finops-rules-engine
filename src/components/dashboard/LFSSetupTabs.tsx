
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RulesSection from "./RulesSection";

const LFSSetupTabs = () => {
  return (
    <Tabs defaultValue="geo" className="w-full">
      <div className="border-b border-gray-200">
        <TabsList className="bg-transparent h-auto p-0 w-full flex overflow-x-auto">
          <TabsTrigger value="geo" className="py-3 px-6 data-[state=active]:border-b-2 data-[state=active]:border-gray-900 data-[state=active]:bg-transparent rounded-none">
            Geo
          </TabsTrigger>
          <TabsTrigger value="lease-config" className="py-3 px-6 data-[state=active]:border-b-2 data-[state=active]:border-gray-900 data-[state=active]:bg-transparent rounded-none">
            Lease Config
          </TabsTrigger>
          <TabsTrigger value="gateway" className="py-3 px-6 data-[state=active]:border-b-2 data-[state=active]:border-gray-900 data-[state=active]:bg-transparent rounded-none">
            Gateway
          </TabsTrigger>
          <TabsTrigger value="dealer" className="py-3 px-6 data-[state=active]:border-b-2 data-[state=active]:border-gray-900 data-[state=active]:bg-transparent rounded-none">
            Dealer
          </TabsTrigger>
          <TabsTrigger value="lender" className="py-3 px-6 data-[state=active]:border-b-2 data-[state=active]:border-gray-900 data-[state=active]:bg-transparent rounded-none">
            Lender
          </TabsTrigger>
          <TabsTrigger value="vehicle-condition" className="py-3 px-6 data-[state=active]:border-b-2 data-[state=active]:border-gray-900 data-[state=active]:bg-transparent rounded-none">
            Vehicle Condition
          </TabsTrigger>
          <TabsTrigger value="routing-rule" className="py-3 px-6 data-[state=active]:border-b-2 data-[state=active]:border-gray-900 data-[state=active]:bg-transparent rounded-none">
            Routing Rule
          </TabsTrigger>
          <TabsTrigger value="stipulation" className="py-3 px-6 data-[state=active]:border-b-2 data-[state=active]:border-gray-900 data-[state=active]:bg-transparent rounded-none">
            Stipulation
          </TabsTrigger>
          <TabsTrigger value="vehicle-options" className="py-3 px-6 data-[state=active]:border-b-2 data-[state=active]:border-gray-900 data-[state=active]:bg-transparent rounded-none">
            Vehicle Options
          </TabsTrigger>
          <TabsTrigger value="vehicle-style-coding" className="py-3 px-6 data-[state=active]:border-b-2 data-[state=active]:border-gray-900 data-[state=active]:bg-transparent rounded-none">
            Vehicle Style Coding
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="geo">
        <RulesSection title="Geo Rules" />
      </TabsContent>
      <TabsContent value="lease-config">
        <RulesSection title="Lease Config Rules" />
      </TabsContent>
      <TabsContent value="gateway">
        <RulesSection title="Gateway Rules" />
      </TabsContent>
      <TabsContent value="dealer">
        <RulesSection title="Dealer Rules" />
      </TabsContent>
      <TabsContent value="lender">
        <RulesSection title="Lender Rules" />
      </TabsContent>
      <TabsContent value="vehicle-condition">
        <RulesSection title="Vehicle Condition Rules" />
      </TabsContent>
      <TabsContent value="routing-rule">
        <RulesSection title="Routing Rules" />
      </TabsContent>
      <TabsContent value="stipulation">
        <RulesSection title="Stipulation Rules" />
      </TabsContent>
      <TabsContent value="vehicle-options">
        <RulesSection title="Vehicle Options Rules" />
      </TabsContent>
      <TabsContent value="vehicle-style-coding">
        <RulesSection title="Vehicle Style Coding Rules" />
      </TabsContent>
    </Tabs>
  );
};

export default LFSSetupTabs;
