
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ReportList from "@/components/reports/ReportList";
import ReportDetail from "@/components/reports/ReportDetail";
import CreateReportModal from "@/components/reports/CreateReportModal";
import { mockReports, getReportById } from "@/data/mock/reports";
import { Report as ReportType } from "@/types/application/report";

const Report = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [activeItem, setActiveItem] = React.useState('Report');
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [customReports, setCustomReports] = useState<ReportType[]>([]);
  
  const selectedReport = selectedReportId ? getReportById(selectedReportId) : null;
  
  // Combine mock reports with custom reports
  const allReports = [...mockReports, ...customReports];
  
  // Filter reports based on the selected tab
  const filteredReports = allReports.filter(report => {
    if (activeTab === "all") return true;
    return report.type === activeTab;
  });
  
  const handleViewReport = (reportId: string) => {
    setSelectedReportId(reportId);
  };
  
  const handleBack = () => {
    setSelectedReportId(null);
  };

  const handleCreateReport = (reportData: { title: string; description: string; type: string }) => {
    const newReport: ReportType = {
      id: `custom-${Date.now()}`,
      title: reportData.title,
      description: reportData.description,
      type: reportData.type as 'status' | 'application' | 'timeline' | 'financial',
      generatedDate: new Date().toISOString(),
      filters: [],
      data: {
        totalApplications: 0,
        statusDistribution: []
      } as any // Placeholder data structure
    };
    setCustomReports(prev => [...prev, newReport]);
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
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-semibold">Reports</h1>
                {!selectedReport && (
                  <Button onClick={() => setShowCreateModal(true)} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Report
                  </Button>
                )}
              </div>
              
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
      
      <CreateReportModal 
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onCreateReport={handleCreateReport}
      />
    </div>
  );
};

export default Report;
