import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import ConfirmationStep from "@/components/dashboard/WizardSteps/ConfirmationStep";
import { generateProgramCode } from "@/utils/programCodeGenerator";
import { FinancialProgramRecord } from "@/types/financialProgram";
import type { WizardData } from "@/components/dashboard/FinancialProgramWizard";

const FinancialProgramConfirmation = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Get wizard data from navigation state or sessionStorage
  const wizardData = location.state?.wizardData as WizardData | undefined;
  const vehicleStyleOptions = location.state?.vehicleStyleOptions || [];
  const financialProducts = location.state?.financialProducts || [];
  const programPreviews = location.state?.programPreviews || [];

  // Redirect if no data available
  useEffect(() => {
    if (!wizardData) {
      toast.error("No wizard data found. Please start from the beginning.");
      navigate("/financial-pricing");
    }
  }, [wizardData, navigate]);

  const handleBackToEdit = () => {
    // Store wizard data in sessionStorage for retrieval
    if (wizardData) {
      sessionStorage.setItem('wizardEditData', JSON.stringify(wizardData));
    }
    navigate("/financial-pricing", { 
      state: { 
        reopenWizard: true,
        wizardData: wizardData 
      }
    });
  };

  const handleCreatePrograms = async () => {
    if (!wizardData) return;
    
    setLoading(true);
    try {
      // Get existing program codes to avoid conflicts
      const { data: existingPrograms } = await supabase
        .from('financial_program_configs')
        .select('program_code');
      
      const existingCodes = existingPrograms?.map(p => p.program_code) || [];
      
      // Generate program data for each vehicle style
      const programsToCreate: FinancialProgramRecord[] = await Promise.all(
        wizardData.vehicleStyleIds.map(async (vehicleStyleId) => {
          // Get vehicle style record for model year
          const { data: vehicleStyleData } = await supabase
            .from('vehicle_style_coding')
            .select('*')
            .eq('vehicle_style_id', vehicleStyleId)
            .single();

          const programCode = generateProgramCode({
            vehicleCondition: wizardData.vehicleCondition,
            financialProduct: (financialProducts.find(p => p.id === wizardData.financialProduct)?.productType || wizardData.financialProduct),
            vehicleStyleId,
            vehicleStyleRecord: vehicleStyleData,
            programStartDate: wizardData.programStartDate
          }, existingCodes);

          // Add this code to existing codes for next iterations
          existingCodes.push(programCode);

          return {
            program_code: programCode,
            vehicle_style_id: vehicleStyleId,
            financing_vehicle_condition: wizardData.vehicleCondition,
            financial_product_id: wizardData.financialProduct,
            program_start_date: wizardData.programStartDate,
            program_end_date: wizardData.programEndDate,
            is_active: 'Active',
            advertised: 'Yes',
            version: 1,
            priority: 1
          };
        })
      );

      // Insert all programs
      const { error } = await supabase
        .from('financial_program_configs')
        .insert(programsToCreate);

      if (error) throw error;

      // Clear any stored wizard data
      sessionStorage.removeItem('wizardEditData');
      
      toast.success(`${programsToCreate.length} financial program${programsToCreate.length > 1 ? 's' : ''} created successfully!`);
      navigate("/financial-pricing");
    } catch (error) {
      console.error('Error creating programs:', error);
      toast.error("Failed to create financial programs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!wizardData) {
    return (
      <div className="h-screen flex flex-col bg-background">
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar 
            open={sidebarOpen}
            activeItem="Financial Pricing"
            setActiveItem={() => {}} 
          />
          <main className="flex-1 overflow-auto p-6">
            <div className="container mx-auto">
              <div className="text-center py-12">
                <h1 className="text-2xl font-semibold mb-4">No Data Available</h1>
                <p className="text-muted-foreground mb-6">Please start the wizard from the Financial Pricing page.</p>
                <Button onClick={() => navigate("/financial-pricing")}>
                  Go to Financial Pricing
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          open={sidebarOpen}
          activeItem="Financial Pricing"
          setActiveItem={() => {}} 
        />
        <main className="flex-1 overflow-auto p-6">
          <div className="container mx-auto max-w-6xl">
            {/* Breadcrumb */}
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
              <span>Financial Pricing</span>
              <span>›</span>
              <span>Program Creation</span>
              <span>›</span>
              <span className="text-foreground font-medium">Confirmation</span>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Confirm Program Creation</h1>
                <p className="text-muted-foreground mt-2">
                  Review the configuration and programs that will be created
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={handleBackToEdit}
                className="flex items-center space-x-2"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back to Edit</span>
              </Button>
            </div>

            {/* Confirmation Content */}
            <ConfirmationStep
              data={wizardData}
              vehicleStyleOptions={vehicleStyleOptions}
              financialProducts={financialProducts}
              programPreviews={programPreviews}
            />

            {/* Action Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t">
              <Button 
                variant="outline" 
                onClick={handleBackToEdit}
                className="flex items-center space-x-2"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back to Edit</span>
              </Button>

              <Button 
                onClick={handleCreatePrograms}
                disabled={loading}
                className="px-8"
              >
                {loading ? "Creating Programs..." : `Create ${programPreviews.length} Program${programPreviews.length > 1 ? 's' : ''}`}
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FinancialProgramConfirmation;