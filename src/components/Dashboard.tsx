
import { useState } from "react";
import TabsSection from "./dashboard/TabsSection";
import { Button } from "@/components/ui/button";
import { Upload, Download } from "lucide-react";

interface DashboardProps {
  activeSection: string;
}

const Dashboard = ({ activeSection }: DashboardProps) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddPricingModal, setShowAddPricingModal] = useState(false);
  const [showAddPricingTypeModal, setShowAddPricingTypeModal] = useState(false);

  const handleUploadPricing = () => {
    console.log("Upload pricing clicked");
    // Functionality for uploading pricing
  };

  const handleDownloadPricing = () => {
    console.log("Download pricing clicked");
    // Functionality for downloading pricing
  };


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
        {activeSection === "Financial Pricing" && (
          <div className="flex justify-end space-x-2 p-2 border-b border-gray-200">
            <Button variant="outline" size="sm" onClick={handleUploadPricing}>
              <Upload className="h-3 w-3 mr-1" />
              Upload Pricing
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownloadPricing}>
              <Download className="h-3 w-3 mr-1" />
              Download Pricing
            </Button>
          </div>
        )}
        <TabsSection 
          activeSection={activeSection}
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
