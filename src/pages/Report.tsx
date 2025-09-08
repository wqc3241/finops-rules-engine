
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Bot } from "lucide-react";
import ReportList from "@/components/reports/ReportList";
import ReportDetail from "@/components/reports/ReportDetail";
import CreateReportModal from "@/components/reports/CreateReportModal";
import AIReportsList from "@/components/reports/AIReportsList";
import { mockReports, getReportById } from "@/data/mock/reports";
import { Report as ReportType } from "@/types/application/report";
import { useAIGeneratedReports } from "@/hooks/useAIReports";
import AIAgentButton from "@/components/ai-agent/AIAgentButton";

const Report = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [activeItem, setActiveItem] = React.useState('Report');
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [selectedAIReportId, setSelectedAIReportId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("standard");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [customReports, setCustomReports] = useState<ReportType[]>([]);
  
  const { data: aiReports } = useAIGeneratedReports();
  
  const selectedReport = selectedReportId ? getReportById(selectedReportId) : null;
  const selectedAIReport = selectedAIReportId && aiReports 
    ? aiReports.find(r => r.id === selectedAIReportId) 
    : null;
  
  // Combine mock reports with custom reports for standard tab
  const allReports = [...mockReports, ...customReports];
  
  // Filter reports based on the selected tab
  const filteredReports = activeTab === "standard" ? allReports : [];
  
  const handleViewReport = (reportId: string) => {
    setSelectedReportId(reportId);
    setSelectedAIReportId(null);
  };

  const handleViewAIReport = (reportId: string) => {
    setSelectedAIReportId(reportId);
    setSelectedReportId(null);
  };
  
  const handleBack = () => {
    setSelectedReportId(null);
    setSelectedAIReportId(null);
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
                {!selectedReport && !selectedAIReport && (
                  <div className="flex gap-2">
                    <Button onClick={() => setShowCreateModal(true)} size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Report
                    </Button>
                  </div>
                )}
              </div>
              
              {selectedReport ? (
                <ReportDetail report={selectedReport} onBack={handleBack} />
              ) : selectedAIReport ? (
                <div className="space-y-4">
                  <Button onClick={handleBack} variant="outline" size="sm">
                    ← Back to Reports
                  </Button>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h2 className="text-lg font-semibold mb-2">{selectedAIReport.title}</h2>
                    {selectedAIReport.description && (
                      <p className="text-muted-foreground mb-4">{selectedAIReport.description}</p>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-background p-3 rounded border">
                        <div className="text-sm text-muted-foreground">Total Applications</div>
                        <div className="text-2xl font-bold">{selectedAIReport.report_data?.totalApplications || 0}</div>
                      </div>
                      {selectedAIReport.report_data?.summary?.averageAmount && (
                        <div className="bg-background p-3 rounded border">
                          <div className="text-sm text-muted-foreground">Average Amount</div>
                          <div className="text-2xl font-bold">${selectedAIReport.report_data.summary.averageAmount.toLocaleString()}</div>
                        </div>
                      )}
                      {selectedAIReport.report_data?.summary?.totalAmount && (
                        <div className="bg-background p-3 rounded border">
                          <div className="text-sm text-muted-foreground">Total Amount</div>
                          <div className="text-2xl font-bold">${selectedAIReport.report_data.summary.totalAmount.toLocaleString()}</div>
                        </div>
                      )}
                    </div>
                    {selectedAIReport.report_data?.summary?.statusDistribution && (
                      <div className="mt-4">
                        <h3 className="font-medium mb-2">Status Distribution</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {Object.entries(selectedAIReport.report_data.summary.statusDistribution).map(([status, count]) => (
                            <div key={status} className="bg-background p-2 rounded border text-center">
                              <div className="text-xs text-muted-foreground">{status}</div>
                              <div className="text-lg font-bold">{count as number}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-3">
                      <TabsTrigger value="standard">Standard Reports</TabsTrigger>
                      <TabsTrigger value="ai">
                        <Bot className="h-4 w-4 mr-1" />
                        AI Generated
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="standard">
                      <ReportList reports={filteredReports} onViewReport={handleViewReport} />
                    </TabsContent>
                    <TabsContent value="ai">
                      <AIReportsList onViewReport={handleViewAIReport} />
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
      
      <AIAgentButton />
    </div>
  );
};

export default Report;
