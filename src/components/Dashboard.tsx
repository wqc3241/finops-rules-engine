
import { useState } from "react";

interface DashboardProps {
  activeSection: string;
}

const Dashboard = ({ activeSection }: DashboardProps) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddPricingModal, setShowAddPricingModal] = useState(false);
  const [showAddPricingTypeModal, setShowAddPricingTypeModal] = useState(false);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
        <p className="text-gray-600">This page is under construction.</p>
      </div>
    </div>
  );
};

export default Dashboard;
