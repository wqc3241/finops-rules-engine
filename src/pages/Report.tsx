
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReportList from "@/components/reports/ReportList";
import ReportDetail from "@/components/reports/ReportDetail";
import { mockReports, getReportById } from "@/data/mock/reports";
import { Report as ReportType } from "@/types/application/report";

const Report = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [activeItem, setActiveItem] = React.useState('Report');
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  
  const selectedReport = selectedReportId ? getReportById(selectedReportId) : null;
  
  // Filter reports based on the selected tab
  const filteredReports = mockReports.filter(report => {
    if (activeTab === "all") return true;
    return report.type === activeTab;
  });
  
  const handleViewReport = (reportId: string) => {
    setSelectedReportId(reportId);
  };
  
  const handleBack = () => {
    setSelectedReportId(null);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          open={sidebarOpen}
          activeItem={activeItem}
          setActiveItem={setActiveItem} 
        />
        <main className="flex-1 overflow-auto p-2">
          <div className="container mx-auto px-2 py-3">
            <div className="bg-white rounded-lg shadow-sm p-3">
              <h1 className="text-xl font-semibold mb-2">Reports</h1>
              
              {selectedReport ? (
                <ReportDetail report={selectedReport} onBack={handleBack} />
              ) : (
                <>
                  <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-3">
                      <TabsTrigger value="all">All Reports</TabsTrigger>
                      <TabsTrigger value="status">Status</TabsTrigger>
                      <TabsTrigger value="application">Application Type</TabsTrigger>
                      <TabsTrigger value="timeline">Timeline</TabsTrigger>
                      <TabsTrigger value="financial">Financial</TabsTrigger>
                    </TabsList>
                    <TabsContent value={activeTab}>
                      <ReportList reports={filteredReports} onViewReport={handleViewReport} />
                    </TabsContent>
                  </Tabs>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Report;
