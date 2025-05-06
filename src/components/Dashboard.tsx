
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

  const handleUploadFeeTax = () => {
    console.log("Upload fee/tax clicked");
    // Functionality for uploading fee/tax
  };

  const handleDownloadFeeTax = () => {
    console.log("Download fee/tax clicked");
    // Functionality for downloading fee/tax
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {(activeSection === "Financial Pricing" || activeSection === "Fee & Tax") && (
          <div className="flex justify-end space-x-4 p-4 border-b border-gray-200">
            <Button variant="outline" onClick={activeSection === "Financial Pricing" ? handleUploadPricing : handleUploadFeeTax}>
              <Upload className="h-4 w-4 mr-2" />
              {activeSection === "Financial Pricing" ? "Upload Pricing" : "Upload Fee & Tax"}
            </Button>
            <Button variant="outline" onClick={activeSection === "Financial Pricing" ? handleDownloadPricing : handleDownloadFeeTax}>
              <Download className="h-4 w-4 mr-2" />
              {activeSection === "Financial Pricing" ? "Download Pricing" : "Download Fee & Tax"}
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
