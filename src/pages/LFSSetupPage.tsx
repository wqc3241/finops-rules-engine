
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Dashboard from "@/components/Dashboard";

const LFSSetupPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Setting directly to "Financing Config" instead of "LFS Setup"
  const [activeItem, setActiveItem] = useState('Financing Config');

  // Make sure useEffect sets the same value
  useEffect(() => {
    setActiveItem('Financing Config');
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
          <Dashboard activeSection={activeItem} />
        </main>
      </div>
    </div>
  );
};

export default LFSSetupPage;
