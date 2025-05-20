
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Dashboard from "@/components/Dashboard";

const LFSSetupPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Setting directly to "LFS Setup" instead of "Business Reference Data"
  const [activeItem, setActiveItem] = useState('LFS Setup');

  // Make sure useEffect sets the same value
  useEffect(() => {
    setActiveItem('LFS Setup');
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
