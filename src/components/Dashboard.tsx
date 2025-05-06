
import { useState } from "react";
import TabsSection from "./dashboard/TabsSection";

const Dashboard = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddPricingModal, setShowAddPricingModal] = useState(false);
  const [showAddPricingTypeModal, setShowAddPricingTypeModal] = useState(false);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <TabsSection 
          showAddPricingModal={showAddPricingModal}
          setShowAddPricingModal={setShowAddPricingModal}
          showAddPricingTypeModal={showAddPricingTypeModal}
          setShowAddPricingTypeModal={setShowAddPricingTypeModal}
        />
      </div>
    </div>
  );
};

export default Dashboard;
