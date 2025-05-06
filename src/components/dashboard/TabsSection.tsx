
import { useState } from "react";
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
  const [activeTab, setActiveTab] = useState("bulletin-pricing");
  const [activeCategory, setActiveCategory] = useState("financial-pricing");

  const handleTabChange = (value: string) => {
    setActiveTab(value);

    // Determine which category this tab belongs to
    if (["credit-profile", "pricing-config", "product", "program", "bulletin-pricing", "advertised-offer", "inventory-type"].includes(value)) {
      setActiveCategory("financial-pricing");
    } else if (["geo", "lease-config", "gateway", "dealer", "lender", "vehicle-condition", "routing-rule", "stipulation", "vehicle-options", "vehicle-style"].includes(value)) {
      setActiveCategory("lfs-setup");
    }
  };

  return (
    <div>
      {/* Category Selector */}
      <div className="border-b border-gray-200">
        <div className="px-6">
          <div className="flex space-x-4 text-lg font-medium">
            <button 
              onClick={() => setActiveCategory("financial-pricing")}
              className={`py-3 border-b-2 ${activeCategory === "financial-pricing" ? "border-gray-800 text-gray-800" : "border-transparent text-gray-500 hover:text-gray-800"}`}
            >
              Financial Pricing
            </button>
            <button 
              onClick={() => setActiveCategory("lfs-setup")}
              className={`py-3 border-b-2 ${activeCategory === "lfs-setup" ? "border-gray-800 text-gray-800" : "border-transparent text-gray-500 hover:text-gray-800"}`}
            >
              LFS Setup
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <div className="px-6 border-b border-gray-200">
          <TabsList className="border-b-0">
            {/* Financial Pricing Tabs */}
            {activeCategory === "financial-pricing" && (
              <>
                <TabsTrigger value="credit-profile">Credit Profile</TabsTrigger>
                <TabsTrigger value="pricing-config">Pricing Config</TabsTrigger>
                <TabsTrigger value="product">Financial Product</TabsTrigger>
                <TabsTrigger value="program">Financial Program Config</TabsTrigger>
                <TabsTrigger value="bulletin-pricing">Bulletin Pricing</TabsTrigger>
                <TabsTrigger value="advertised-offer">Advertised Offer</TabsTrigger>
                <TabsTrigger value="inventory-type">Pricing Type</TabsTrigger>
              </>
            )}
            
            {/* LFS Setup Tabs */}
            {activeCategory === "lfs-setup" && (
              <>
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
              </>
            )}
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Geo Code</TableHead>
                    <TableHead>Geo Level</TableHead>
                    <TableHead>Country Name</TableHead>
                    <TableHead>Country Code</TableHead>
                    <TableHead>Currency</TableHead>
                    <TableHead>State/Provinces Code</TableHead>
                    <TableHead>State Name</TableHead>
                    <TableHead>Location Name</TableHead>
                    <TableHead>Location Code</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>NA-US-CA</TableCell>
                    <TableCell>State</TableCell>
                    <TableCell>United States of America</TableCell>
                    <TableCell>US</TableCell>
                    <TableCell>USD</TableCell>
                    <TableCell>CA</TableCell>
                    <TableCell>California</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>NA-CA-BC</TableCell>
                    <TableCell>State</TableCell>
                    <TableCell>Canada</TableCell>
                    <TableCell>CA</TableCell>
                    <TableCell>CAD</TableCell>
                    <TableCell>BC</TableCell>
                    <TableCell>British Columbia</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>NA-US</TableCell>
                    <TableCell>Country</TableCell>
                    <TableCell>United States of America</TableCell>
                    <TableCell>US</TableCell>
                    <TableCell>USD</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>NA-US-CA-Torrence-SD</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>United States of America</TableCell>
                    <TableCell>US</TableCell>
                    <TableCell>USD</TableCell>
                    <TableCell>CA</TableCell>
                    <TableCell>California</TableCell>
                    <TableCell>Torrence</TableCell>
                    <TableCell>NA-US-CA-Torrence-SD</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>ME-KSA</TableCell>
                    <TableCell>Country</TableCell>
                    <TableCell>The Kingdom of Saudi Arabia</TableCell>
                    <TableCell>KSA</TableCell>
                    <TableCell>SAR</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>ME-UAE</TableCell>
                    <TableCell>Country</TableCell>
                    <TableCell>United Arab Emirates</TableCell>
                    <TableCell>UAE</TableCell>
                    <TableCell>AED</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <div className="mt-4">
              <Button>Add New Record</Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="lease-config">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Lease Config</h2>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Geo Code</TableHead>
                    <TableHead>Default Capitalization Items</TableHead>
                    <TableHead>Optional Capitalization Items</TableHead>
                    <TableHead>Mandatory Upfront items</TableHead>
                    <TableHead>Sales tax basis</TableHead>
                    <TableHead>Tax payment option</TableHead>
                    <TableHead>Trade on CCR</TableHead>
                    <TableHead>Trade Tax credit eligibility</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>NA-US-CA</TableCell>
                    <TableCell>Acquisition fee, doc fee</TableCell>
                    <TableCell>Reg Fee, Electronic Filing Fee</TableCell>
                    <TableCell>Transportation fee, 1st monthly payment, CCR</TableCell>
                    <TableCell>Depreciation and Amortization</TableCell>
                    <TableCell>Monthly</TableCell>
                    <TableCell>TRUE</TableCell>
                    <TableCell>TRUE</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>NA-US-FL</TableCell>
                    <TableCell>Acquisition fee, doc fee</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell>Vehicle Price</TableCell>
                    <TableCell>Monthly</TableCell>
                    <TableCell>FALSE</TableCell>
                    <TableCell>FALSE</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <div className="mt-4">
              <Button>Add New Record</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="gateway">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Gateway</h2>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Gateway ID</TableHead>
                    <TableHead>Gateway Name</TableHead>
                    <TableHead>Geo Code</TableHead>
                    <TableHead>Optional Platform ID</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>NA-US-00DT</TableCell>
                    <TableCell>DealerTrack</TableCell>
                    <TableCell>NA-US</TableCell>
                    <TableCell></TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>NA-CA-0SCI</TableCell>
                    <TableCell>SCI</TableCell>
                    <TableCell>NA-CA</TableCell>
                    <TableCell></TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <div className="mt-4">
              <Button>Add New Record</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="dealer">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Dealer</h2>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Gateway Dealer ID</TableHead>
                    <TableHead>Gateway ID</TableHead>
                    <TableHead>Geo Code</TableHead>
                    <TableHead>DBA name</TableHead>
                    <TableHead>Selling State</TableHead>
                    <TableHead>Financing form list</TableHead>
                    <TableHead>Legal Entity Name</TableHead>
                    <TableHead>Legal Entity Address</TableHead>
                    <TableHead>Gateway Dealership Address</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>DL001</TableCell>
                    <TableCell>625801</TableCell>
                    <TableCell>NA-US-00DT</TableCell>
                    <TableCell></TableCell>
                    <TableCell>Lucid Group USA, Inc. NY</TableCell>
                    <TableCell>NY</TableCell>
                    <TableCell>State-Specific</TableCell>
                    <TableCell>Lucid Motor Group , Inc</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>KSADL001</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell>ME-KSA</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <div className="mt-4">
              <Button>Add New Record</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="lender">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Lender</h2>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Gateway lender ID</TableHead>
                    <TableHead>Lien Holder Name</TableHead>
                    <TableHead>Gateway Lender Name</TableHead>
                    <TableHead>Lender Full Name</TableHead>
                    <TableHead>Lender Address</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>L001</TableCell>
                    <TableCell>CMB</TableCell>
                    <TableCell>JPMorgan Chase Bank, N.A</TableCell>
                    <TableCell>Chase</TableCell>
                    <TableCell>JPMorgan Chase Bank, N.A</TableCell>
                    <TableCell>PO BOX 901033, Fort Worth, TX 76101-2033, US</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  {/* More lender rows */}
                  <TableRow>
                    <TableCell>KSAENBD</TableCell>
                    <TableCell>ENBD</TableCell>
                    <TableCell>ENBD</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <div className="mt-4">
              <Button>Add New Record</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="vehicle-condition">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Vehicle Condition</h2>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Financing Vehicle condition Type</TableHead>
                    <TableHead>Geo Code</TableHead>
                    <TableHead>Title Status</TableHead>
                    <TableHead>Advertised Condition</TableHead>
                    <TableHead>Min Odometer</TableHead>
                    <TableHead>Max Odometer</TableHead>
                    <TableHead>Registration Start Date</TableHead>
                    <TableHead>Registration End Date</TableHead>
                    <TableHead>Model Year</TableHead>
                    <TableHead>Prior Sell to customer</TableHead>
                    <TableHead>Applicable RV table</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>New</TableCell>
                    <TableCell>ME-KSA</TableCell>
                    <TableCell>New</TableCell>
                    <TableCell>New</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>New</TableCell>
                    <TableCell>ME-UAE</TableCell>
                    <TableCell>New</TableCell>
                    <TableCell>New</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Used</TableCell>
                    <TableCell></TableCell>
                    <TableCell>New</TableCell>
                    <TableCell>New</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Demo</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>CPO</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <div className="mt-4">
              <Button>Add New Record</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="routing-rule">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Routing Rule</h2>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rule ID</TableHead>
                    <TableHead>Dealer</TableHead>
                    <TableHead>Lender</TableHead>
                    <TableHead>Geo Code</TableHead>
                    <TableHead>Financial Product</TableHead>
                    <TableHead>Vehicle Condition</TableHead>
                    <TableHead>Credit Profile</TableHead>
                    <TableHead>isActive</TableHead>
                    <TableHead>Routing Priority</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>RR001</TableCell>
                    <TableCell>DL001</TableCell>
                    <TableCell>L001</TableCell>
                    <TableCell>NA-US-CA</TableCell>
                    <TableCell>Lease</TableCell>
                    <TableCell>New</TableCell>
                    <TableCell>P001</TableCell>
                    <TableCell>Y</TableCell>
                    <TableCell>1</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>RR002</TableCell>
                    <TableCell>DL002</TableCell>
                    <TableCell>L002</TableCell>
                    <TableCell>NA-US-FL-?</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell>2</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>RR003</TableCell>
                    <TableCell>DL003</TableCell>
                    <TableCell>L003</TableCell>
                    <TableCell>NA-US-FL-??</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell>3</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>KSARR001</TableCell>
                    <TableCell>KSADL001</TableCell>
                    <TableCell>KSAL001</TableCell>
                    <TableCell>ME-KSA</TableCell>
                    <TableCell>Balloon</TableCell>
                    <TableCell>New</TableCell>
                    <TableCell>KSAP001</TableCell>
                    <TableCell>Y</TableCell>
                    <TableCell>1</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <div className="mt-4">
              <Button>Add New Record</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="stipulation">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Stipulation</h2>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Geo Code</TableHead>
                    <TableHead>Stipulation Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Primary/ Co-applicant</TableHead>
                    <TableHead>Document List</TableHead>
                    <TableHead>Customer/ Internal</TableHead>
                    <TableHead>isActive</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>US</TableCell>
                    <TableCell>Income Proof</TableCell>
                    <TableCell>Proof of applicant income</TableCell>
                    <TableCell>Both</TableCell>
                    <TableCell>W2, Paycheck</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Active</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <div className="mt-4">
              <Button>Add New Record</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="vehicle-options">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Vehicle Options</h2>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Drivetrain</TableHead>
                    <TableHead>Color</TableHead>
                    <TableHead>Design</TableHead>
                    <TableHead>Roof</TableHead>
                    <TableHead>Wheels</TableHead>
                    <TableHead>ADAS</TableHead>
                    <TableHead>SoundSystem</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>OP1</TableCell>
                    <TableCell>AWD</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell>1</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>OP2</TableCell>
                    <TableCell>RWD</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell>2</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>OP3</TableCell>
                    <TableCell>AWD</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell>22" wheel</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>KSAOP1</TableCell>
                    <TableCell>AWE</TableCell>
                    <TableCell>Blue</TableCell>
                    <TableCell>Stealth</TableCell>
                    <TableCell>Glass</TableCell>
                    <TableCell>21" wheel</TableCell>
                    <TableCell>Pro</TableCell>
                    <TableCell>Pro</TableCell>
                    <TableCell>1</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <div className="mt-4">
              <Button>Add New Record</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="vehicle-style">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Vehicle Style Coding</h2>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Style ID</TableHead>
                    <TableHead>ALG Code (Local RV code)</TableHead>
                    <TableHead>Geo code</TableHead>
                    <TableHead>Model Year</TableHead>
                    <TableHead>Make</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead>Trim</TableHead>
                    <TableHead>Option Code</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>L25A1</TableCell>
                    <TableCell>ZL_MV001</TableCell>
                    <TableCell></TableCell>
                    <TableCell>2025</TableCell>
                    <TableCell>Lucid</TableCell>
                    <TableCell>Air</TableCell>
                    <TableCell>Grand Touring</TableCell>
                    <TableCell>OP1</TableCell>
                    <TableCell>1</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>L25A2</TableCell>
                    <TableCell>ZL_MV002</TableCell>
                    <TableCell></TableCell>
                    <TableCell>2025</TableCell>
                    <TableCell>Lucid</TableCell>
                    <TableCell>Air</TableCell>
                    <TableCell>Pure</TableCell>
                    <TableCell>OP2</TableCell>
                    <TableCell>1</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>L25A3</TableCell>
                    <TableCell>ZL_MV003</TableCell>
                    <TableCell></TableCell>
                    <TableCell>2025</TableCell>
                    <TableCell>Lucid</TableCell>
                    <TableCell>Air</TableCell>
                    <TableCell>Pure</TableCell>
                    <TableCell></TableCell>
                    <TableCell>2</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>KSA25A1</TableCell>
                    <TableCell></TableCell>
                    <TableCell>ME-KSA</TableCell>
                    <TableCell>2025</TableCell>
                    <TableCell>Lucid</TableCell>
                    <TableCell>Air</TableCell>
                    <TableCell>Pure</TableCell>
                    <TableCell>KSAOP1</TableCell>
                    <TableCell>1</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <div className="mt-4">
              <Button>Add New Record</Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TabsSection;
