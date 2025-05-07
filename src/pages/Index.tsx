
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Dashboard from "@/components/Dashboard";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to dashboard page for consistency
    navigate("/dashboard");
  }, [navigate]);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Navbar sidebarOpen={true} setSidebarOpen={() => {}} />
      <div className="flex-1 flex justify-center items-center">
        <p>Redirecting to dashboard...</p>
      </div>
    </div>
  );
};

export default Index;
