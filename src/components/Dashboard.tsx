
import { useState } from "react";
import TabsSection from "./dashboard/TabsSection";

interface DashboardProps {
  activeSection: string;
  reviewRequestId?: string | null;
}

const Dashboard = ({ activeSection, reviewRequestId }: DashboardProps) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddPricingModal, setShowAddPricingModal] = useState(false);
  const [showAddPricingTypeModal, setShowAddPricingTypeModal] = useState(false);



  // Only show "under construction" for the actual Dashboard section
  if (activeSection === "Dashboard") {
    return (
      <div className="container mx-auto px-2 py-3">
        <div className="bg-white rounded-lg shadow-sm p-3">
          <h1 className="text-xl font-semibold mb-2">Dashboard</h1>
          <p className="text-gray-600 text-sm">This page is under construction.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 py-3">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <TabsSection
          activeSection={activeSection}
          showAddPricingModal={showAddPricingModal}
          setShowAddPricingModal={setShowAddPricingModal}
          showAddPricingTypeModal={showAddPricingTypeModal}
          setShowAddPricingTypeModal={setShowAddPricingTypeModal}
          reviewRequestId={reviewRequestId}
        />
      </div>
    </div>
  );
};

export default Dashboard;
