
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import { applications } from "@/data/mock/applicationsData";

const DashboardPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeItem, setActiveItem] = useState('Dashboard');

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
              <h1 className="text-xl font-semibold mb-2">Dashboard</h1>
              
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
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
