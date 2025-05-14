
import React from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

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
              <h1 className="text-xl font-semibold mb-2">Tasks</h1>
              <p className="text-gray-600 text-sm">This page is under construction.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Tasks;
