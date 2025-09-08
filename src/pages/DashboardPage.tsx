
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Bot } from "lucide-react";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import CreateDashboardModal from "@/components/dashboard/CreateDashboardModal";
import AIDashboardsList from "@/components/dashboard/AIDashboardsList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { applications } from "@/data/mock/applicationsData";
import { useAIGeneratedDashboards } from "@/hooks/useAIReports";
import AIAgentButton from "@/components/ai-agent/AIAgentButton";

interface CustomDashboard {
  id: string;
  name: string;
  description: string;
  createdDate: string;
}

const DashboardPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeItem, setActiveItem] = useState('Dashboard');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [customDashboards, setCustomDashboards] = useState<CustomDashboard[]>([]);
  const [selectedAIDashboard, setSelectedAIDashboard] = useState<string | null>(null);

  const { data: aiDashboards } = useAIGeneratedDashboards();

  // Stats for the top cards
  const totalApplications = applications.length;
  const pendingApplications = applications.filter(app => app.status === 'Pending').length;
  const approvedApplications = applications.filter(app => 
    app.status === 'Approved' || app.status === 'Conditionally Approved'
  ).length;
  const fundedApplications = applications.filter(app => app.status === 'Funded').length;

  // Calculate approval rate
  const approvalRate = totalApplications > 0 
    ? ((approvedApplications + fundedApplications) / totalApplications * 100).toFixed(1) 
    : '0';

  // Ensure that the activeItem is correctly set on page load
  useEffect(() => {
    setActiveItem('Dashboard');
  }, []);

  const handleCreateDashboard = (dashboard: { name: string; description: string }) => {
    const newDashboard: CustomDashboard = {
      id: Date.now().toString(),
      name: dashboard.name,
      description: dashboard.description,
      createdDate: new Date().toISOString().split('T')[0]
    };
    setCustomDashboards(prev => [...prev, newDashboard]);
  };

  const handleViewAIDashboard = (dashboardId: string) => {
    setSelectedAIDashboard(dashboardId);
  };

  const selectedAIDashboardData = selectedAIDashboard && aiDashboards 
    ? aiDashboards.find(d => d.id === selectedAIDashboard) 
    : null;

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
                <h1 className="text-xl font-semibold">Dashboard</h1>
                {!selectedAIDashboardData && (
                  <Button onClick={() => setShowCreateModal(true)} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Dashboard
                  </Button>
                )}
              </div>
              
              {selectedAIDashboardData ? (
                <div className="space-y-4">
                  <Button onClick={() => setSelectedAIDashboard(null)} variant="outline" size="sm">
                    ← Back to Dashboards
                  </Button>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h2 className="text-lg font-semibold mb-2">{selectedAIDashboardData.name}</h2>
                    {selectedAIDashboardData.description && (
                      <p className="text-muted-foreground mb-4">{selectedAIDashboardData.description}</p>
                    )}
                    
                    {/* Render widgets if available */}
                    {selectedAIDashboardData.widgets && Array.isArray(selectedAIDashboardData.widgets) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedAIDashboardData.widgets.map((widget: any, index: number) => (
                          <Card key={index}>
                            <CardHeader>
                              <CardTitle className="text-base">{widget.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              {widget.type === 'pie' && widget.data && (
                                <div className="space-y-2">
                                  {widget.data.map((item: any, i: number) => (
                                    <div key={i} className="flex justify-between">
                                      <span className="text-sm">{item.name}</span>
                                      <span className="font-medium">{item.value}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {widget.type === 'bar' && widget.data && (
                                <div className="space-y-2">
                                  {widget.data.map((item: any, i: number) => (
                                    <div key={i} className="flex justify-between">
                                      <span className="text-sm">{item.name}</span>
                                      <span className="font-medium">{item.value}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <Tabs defaultValue="main" className="w-full">
                  <TabsList>
                    <TabsTrigger value="main">Main Dashboard</TabsTrigger>
                    <TabsTrigger value="ai">
                      <Bot className="h-4 w-4 mr-1" />
                      AI Generated
                    </TabsTrigger>
                    {customDashboards.map(dashboard => (
                      <TabsTrigger key={dashboard.id} value={dashboard.id}>
                        {dashboard.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  
                  <TabsContent value="main">
                    {/* Stats cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                      <Card>
                        <CardHeader className="p-3 pb-0">
                          <CardTitle className="text-sm text-muted-foreground">Total Applications</CardTitle>
                        </CardHeader>
                        <CardContent className="p-3">
                          <div className="text-2xl font-bold">{totalApplications}</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="p-3 pb-0">
                          <CardTitle className="text-sm text-muted-foreground">Pending</CardTitle>
                        </CardHeader>
                        <CardContent className="p-3">
                          <div className="text-2xl font-bold">{pendingApplications}</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="p-3 pb-0">
                          <CardTitle className="text-sm text-muted-foreground">Approved</CardTitle>
                        </CardHeader>
                        <CardContent className="p-3">
                          <div className="text-2xl font-bold">{approvedApplications}</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="p-3 pb-0">
                          <CardTitle className="text-sm text-muted-foreground">Approval Rate</CardTitle>
                        </CardHeader>
                        <CardContent className="p-3">
                          <div className="text-2xl font-bold">{approvalRate}%</div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    {/* Charts section */}
                    <DashboardCharts />
                  </TabsContent>
                  
                  <TabsContent value="ai">
                    <AIDashboardsList onViewDashboard={handleViewAIDashboard} />
                  </TabsContent>
                  
                  {customDashboards.map(dashboard => (
                    <TabsContent key={dashboard.id} value={dashboard.id}>
                      <div className="p-4 border border-dashed border-gray-300 rounded-lg text-center">
                        <h3 className="text-lg font-semibold mb-2">{dashboard.name}</h3>
                        <p className="text-gray-600 mb-4">{dashboard.description || 'No description provided'}</p>
                        <p className="text-sm text-gray-500">Created on: {dashboard.createdDate}</p>
                        <div className="mt-4">
                          <p className="text-gray-500">Dashboard content can be customized here</p>
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              )}
            </div>
          </div>
        </main>
      </div>
      
      <CreateDashboardModal 
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onCreateDashboard={handleCreateDashboard}
      />
      
      <AIAgentButton />
    </div>
  );
};

export default DashboardPage;
