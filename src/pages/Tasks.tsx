
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import TasksSummary from "@/components/tasks/TasksSummary";
import TasksList from "@/components/tasks/TasksList";
import UpcomingDeliveries from "@/components/tasks/UpcomingDeliveries";
import { useAuth } from "@/hooks/useAuth";

const Tasks = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [activeItem, setActiveItem] = React.useState('Tasks');
  const [showMyTasksOnly, setShowMyTasksOnly] = useState(false);
  const { user } = useAuth();

  const currentUserId = user?.id;

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
                <h1 className="text-xl font-semibold">Tasks Management</h1>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="my-tasks-switch" className="text-sm">
                    My Tasks Only
                  </Label>
                  <Switch
                    id="my-tasks-switch"
                    checked={showMyTasksOnly}
                    onCheckedChange={setShowMyTasksOnly}
                  />
                </div>
              </div>
              
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="unassigned">Unassigned Tasks</TabsTrigger>
                  <TabsTrigger value="assigned">Assigned Tasks</TabsTrigger>
                  <TabsTrigger value="completed">Completed Tasks</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <TasksSummary showMyTasksOnly={showMyTasksOnly} currentUser={currentUserId} />
                  <UpcomingDeliveries showMyTasksOnly={showMyTasksOnly} currentUser={currentUserId} />
                </TabsContent>

                <TabsContent value="unassigned">
                  <TasksList type="unassigned" showMyTasksOnly={showMyTasksOnly} currentUser={currentUserId} />
                </TabsContent>

                <TabsContent value="assigned">
                  <TasksList type="assigned" showMyTasksOnly={showMyTasksOnly} currentUser={currentUserId} />
                </TabsContent>

                <TabsContent value="completed">
                  <TasksList type="completed" showMyTasksOnly={showMyTasksOnly} currentUser={currentUserId} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Tasks;
