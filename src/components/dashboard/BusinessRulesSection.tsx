
import { useState } from "react";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";

import PricingTypeSection from "./PricingTypeSection";
import RulesSection from "./RulesSection";
import PricingConfigRulesSection from "./PricingConfigRulesSection";
import FinancialProductsSection from "./FinancialProductsSection";
import FinancialProgramConfigSection from "./FinancialProgramConfigSection";
import AdvertisedOfferSection from "./AdvertisedOfferSection";
import PricingRulesSection from "./PricingRulesSection";
import { toast } from "sonner";

interface BusinessRulesSectionProps {
  showAddPricingModal: boolean;
  setShowAddPricingModal: (show: boolean) => void;
  showAddPricingTypeModal: boolean;
  setShowAddPricingTypeModal: (show: boolean) => void;
  onSelectionChange?: (items: string[]) => void;
  selectedItems?: string[];
}

const BusinessRulesSection = ({
  showAddPricingModal,
  setShowAddPricingModal,
  showAddPricingTypeModal,
  setShowAddPricingTypeModal,
  onSelectionChange,
  selectedItems = []
}: BusinessRulesSectionProps) => {
  // Local state for modals not controlled by parent
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showConfigRulesModal, setShowConfigRulesModal] = useState(false);
  const [showFinancialProductsModal, setShowFinancialProductsModal] = useState(false);
  const [showFinancialProgramConfigModal, setShowFinancialProgramConfigModal] = useState(false);
  const [showAdvertisedOffersModal, setShowAdvertisedOffersModal] = useState(false);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Business Rules</h2>
      
      <Accordion type="multiple" defaultValue={["pricing-rules"]} className="w-full">
        <AccordionItem value="pricing-rules">
          <AccordionTrigger className="text-lg font-medium py-3">Bulletin Pricing</AccordionTrigger>
          <AccordionContent>
            <PricingRulesSection 
              title="Bulletin Pricing" 
              showAddModal={showAddPricingModal}
              setShowAddModal={setShowAddPricingModal}
              onSelectionChange={onSelectionChange}
              selectedItems={selectedItems}
            />
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="pricing-types">
          <AccordionTrigger className="text-lg font-medium py-3">Pricing Types</AccordionTrigger>
          <AccordionContent>
            <PricingTypeSection 
              title="Pricing Types" 
              showAddModal={showAddPricingTypeModal}
              setShowAddModal={setShowAddPricingTypeModal}
              onSelectionChange={onSelectionChange}
              selectedItems={selectedItems}
            />
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="credit-profile">
          <AccordionTrigger className="text-lg font-medium py-3">Credit Profile</AccordionTrigger>
          <AccordionContent>
            <RulesSection 
              title="Credit Profile" 
              showAddModal={showRulesModal}
              setShowAddModal={setShowRulesModal}
              onSelectionChange={onSelectionChange}
              selectedItems={selectedItems}
            />
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="pricing-config">
          <AccordionTrigger className="text-lg font-medium py-3">Pricing Config</AccordionTrigger>
          <AccordionContent>
            <PricingConfigRulesSection 
              title="Pricing Config" 
              showAddModal={showConfigRulesModal}
              setShowAddModal={setShowConfigRulesModal}
              onSelectionChange={onSelectionChange}
              selectedItems={selectedItems}
            />
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="financial-products">
          <AccordionTrigger className="text-lg font-medium py-3">Financial Products</AccordionTrigger>
          <AccordionContent>
            <FinancialProductsSection 
              title="Financial Products" 
              showAddModal={showFinancialProductsModal}
              setShowAddModal={setShowFinancialProductsModal}
              onSelectionChange={onSelectionChange}
              selectedItems={selectedItems}
            />
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="financial-program-config">
          <AccordionTrigger className="text-lg font-medium py-3">Financial Program Config</AccordionTrigger>
          <AccordionContent>
            <FinancialProgramConfigSection 
              title="Financial Program Config" 
              showAddModal={showFinancialProgramConfigModal}
              setShowAddModal={setShowFinancialProgramConfigModal}
              onSelectionChange={onSelectionChange}
              selectedItems={selectedItems}
            />
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="advertised-offers">
          <AccordionTrigger className="text-lg font-medium py-3">Advertised Offers</AccordionTrigger>
          <AccordionContent>
            <AdvertisedOfferSection 
              title="Advertised Offers" 
              showAddModal={showAdvertisedOffersModal}
              setShowAddModal={setShowAdvertisedOffersModal}
              onSelectionChange={onSelectionChange}
              selectedItems={selectedItems}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default BusinessRulesSection;
