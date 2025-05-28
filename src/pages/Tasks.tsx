
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TasksSummary from "@/components/tasks/TasksSummary";
import TasksList from "@/components/tasks/TasksList";
import UpcomingDeliveries from "@/components/tasks/UpcomingDeliveries";

const Tasks = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [activeItem, setActiveItem] = React.useState('Tasks');

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
              <h1 className="text-xl font-semibold mb-4">Tasks Management</h1>
              
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="unassigned">Unassigned Tasks</TabsTrigger>
                  <TabsTrigger value="assigned">Assigned Tasks</TabsTrigger>
                  <TabsTrigger value="completed">Completed Tasks</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <TasksSummary />
                  <UpcomingDeliveries />
                </TabsContent>

                <TabsContent value="unassigned">
                  <TasksList type="unassigned" />
                </TabsContent>

                <TabsContent value="assigned">
                  <TasksList type="assigned" />
                </TabsContent>

                <TabsContent value="completed">
                  <TasksList type="completed" />
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
