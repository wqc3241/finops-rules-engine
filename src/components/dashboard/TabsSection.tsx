
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RulesSection from "./RulesSection";
import PricingConfigRulesSection from "./PricingConfigRulesSection";
import FinancialProductsSection from "./FinancialProductsSection";
import FinancialProgramConfigSection from "./FinancialProgramConfigSection";
import PricingRulesSection from "./PricingRulesSection";
import AdvertisedOfferSection from "./AdvertisedOfferSection";
import PricingTypeSection from "./PricingTypeSection";
import { Button } from "@/components/ui/button";
import { Copy, Edit, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface TabsSectionProps {
  showAddPricingModal: boolean;
  setShowAddPricingModal: (open: boolean) => void;
  showAddPricingTypeModal: boolean;
  setShowAddPricingTypeModal: (open: boolean) => void;
}

const TabsSection = ({ 
  showAddPricingModal, 
  setShowAddPricingModal,
  showAddPricingTypeModal,
  setShowAddPricingTypeModal
}: TabsSectionProps) => {
  return (
    <Tabs defaultValue="bulletin-pricing">
      <div className="px-6 border-b border-gray-200">
        <TabsList className="border-b-0">
          <TabsTrigger value="credit-profile">Credit Profile</TabsTrigger>
          <TabsTrigger value="pricing-config">Pricing Config</TabsTrigger>
          <TabsTrigger value="product">Financial Product</TabsTrigger>
          <TabsTrigger value="program">Financial Program Config</TabsTrigger>
          <TabsTrigger value="bulletin-pricing">Bulletin Pricing</TabsTrigger>
          <TabsTrigger value="advertised-offer">Advertised Offer</TabsTrigger>
          <TabsTrigger value="inventory-type">Pricing Type</TabsTrigger>
          
          {/* LFS Setup Section Tabs */}
          <TabsTrigger value="geo">Geo</TabsTrigger>
          <TabsTrigger value="lease-config">Lease Config</TabsTrigger>
          <TabsTrigger value="gateway">Gateway</TabsTrigger>
          <TabsTrigger value="dealer">Dealer</TabsTrigger>
          <TabsTrigger value="lender">Lender</TabsTrigger>
          <TabsTrigger value="vehicle-condition">Vehicle Condition</TabsTrigger>
          <TabsTrigger value="routing-rule">Routing Rule</TabsTrigger>
          <TabsTrigger value="stipulation">Stipulation</TabsTrigger>
          <TabsTrigger value="vehicle-options">Vehicle Options</TabsTrigger>
          <TabsTrigger value="vehicle-style">Vehicle Style Coding</TabsTrigger>
        </TabsList>
      </div>
      
      {/* Financial Pricing Section */}
      <TabsContent value="credit-profile" className="p-0">
        <RulesSection title="Credit Profile Rules" />
      </TabsContent>
      
      <TabsContent value="pricing-config">
        <PricingConfigRulesSection title="Pricing Config Rules" />
      </TabsContent>
      
      <TabsContent value="product">
        <FinancialProductsSection title="Financial Product Rules" />
      </TabsContent>
      
      <TabsContent value="program">
        <FinancialProgramConfigSection title="Financial Program Config Rules" />
      </TabsContent>
      
      <TabsContent value="bulletin-pricing">
        <PricingRulesSection 
          title="Bulletin Pricing Rules" 
          showAddModal={showAddPricingModal}
          setShowAddModal={setShowAddPricingModal}
        />
      </TabsContent>
      
      <TabsContent value="advertised-offer">
        <AdvertisedOfferSection title="Advertised Offer Rules" />
      </TabsContent>
      
      <TabsContent value="inventory-type">
        <PricingTypeSection 
          title="Pricing Type Rules"
          showAddModal={showAddPricingTypeModal}
          setShowAddModal={setShowAddPricingTypeModal}
        />
      </TabsContent>
      
      {/* LFS Setup Section Content */}
      <TabsContent value="geo">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Geo</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-2 border">Geo Code</th>
                  <th className="p-2 border">Geo Level</th>
                  <th className="p-2 border">Country Name</th>
                  <th className="p-2 border">Country Code</th>
                  <th className="p-2 border">Currency</th>
                  <th className="p-2 border">State/Provinces Code</th>
                  <th className="p-2 border">State Name</th>
                  <th className="p-2 border">Location Name</th>
                  <th className="p-2 border">Location Code</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* Sample data for Geo */}
                <tr>
                  <td className="p-2 border">NA-US-CA</td>
                  <td className="p-2 border">State</td>
                  <td className="p-2 border">United States of America</td>
                  <td className="p-2 border">US</td>
                  <td className="p-2 border">USD</td>
                  <td className="p-2 border">CA</td>
                  <td className="p-2 border">California</td>
                  <td className="p-2 border"></td>
                  <td className="p-2 border"></td>
                  <td className="p-2 border">
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm"><Copy className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </td>
                </tr>
                {/* Add more rows as needed */}
              </tbody>
            </table>
          </div>
          <div className="mt-4">
            <Button>Add New Record</Button>
          </div>
        </div>
      </TabsContent>
      
      {/* Similar structure for other LFS Setup tabs */}
      <TabsContent value="lease-config">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Lease Config</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-2 border">Geo Code</th>
                  <th className="p-2 border">Default Capitalization Items</th>
                  <th className="p-2 border">Optional Capitalization Items</th>
                  <th className="p-2 border">Mandatory Upfront items</th>
                  <th className="p-2 border">Sales tax basis</th>
                  <th className="p-2 border">Tax payment option</th>
                  <th className="p-2 border">Trade on CCR</th>
                  <th className="p-2 border">Trade Tax credit eligibility</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* Sample data for Lease Config */}
              </tbody>
            </table>
          </div>
          <div className="mt-4">
            <Button>Add New Record</Button>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="gateway">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Gateway</h2>
          <div className="mt-4">
            <Button>Add New Record</Button>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="dealer">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Dealer</h2>
          <div className="mt-4">
            <Button>Add New Record</Button>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="lender">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Lender</h2>
          <div className="mt-4">
            <Button>Add New Record</Button>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="vehicle-condition">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Vehicle Condition</h2>
          <div className="mt-4">
            <Button>Add New Record</Button>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="routing-rule">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Routing Rule</h2>
          <div className="mt-4">
            <Button>Add New Record</Button>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="stipulation">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Stipulation</h2>
          <div className="mt-4">
            <Button>Add New Record</Button>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="vehicle-options">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Vehicle Options</h2>
          <div className="mt-4">
            <Button>Add New Record</Button>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="vehicle-style">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Vehicle Style Coding</h2>
          <div className="mt-4">
            <Button>Add New Record</Button>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default TabsSection;
