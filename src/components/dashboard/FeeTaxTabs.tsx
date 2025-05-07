
import { useState } from "react";
import TabComponent, { TabItem } from "./TabComponent";
import FeeSection from "./FeeSection";
import TaxSection from "./TaxSection";
import { toast } from "sonner";

const FeeTaxTabs = () => {
  const [selectedTab, setSelectedTab] = useState("fee");
  const [showAddFeeModal, setShowAddFeeModal] = useState(false);
  const [showAddTaxModal, setShowAddTaxModal] = useState(false);

  const handleTabChange = (value: string) => {
    setSelectedTab(value);
  };

  const handleAddFee = (feeData: any) => {
    console.log("New fee data:", feeData);
    toast.success("New fee has been added successfully");
    setShowAddFeeModal(false);
  };

  const handleAddTax = (taxData: any) => {
    console.log("New tax data:", taxData);
    toast.success("New tax has been added successfully");
    setShowAddTaxModal(false);
  };

  const tabItems: TabItem[] = [
    {
      value: "fee",
      label: "Fee",
      content: (
        <FeeSection 
          title="Fee" 
          showAddFeeModal={showAddFeeModal}
          setShowAddFeeModal={setShowAddFeeModal}
          onAddFee={handleAddFee}
        />
      )
    },
    {
      value: "tax",
      label: "Tax",
      content: (
        <TaxSection 
          title="Tax" 
          showAddTaxModal={showAddTaxModal}
          setShowAddTaxModal={setShowAddTaxModal}
          onAddTax={handleAddTax}
        />
      )
    }
  ];

  return <TabComponent defaultValue="fee" items={tabItems} onValueChange={handleTabChange} />;
};

export default FeeTaxTabs;
