
import TabComponent, { TabItem } from "./TabComponent";
import FeeSection from "./FeeSection";
import TaxSection from "./TaxSection";

const FeeTaxTabs = () => {
  const tabItems: TabItem[] = [
    {
      value: "fee",
      label: "Fee",
      content: <FeeSection title="Fee" />
    },
    {
      value: "tax",
      label: "Tax",
      content: <TaxSection title="Tax" />
    }
  ];

  return <TabComponent defaultValue="fee" items={tabItems} />;
};

export default FeeTaxTabs;
