
import { Pencil, Trash2, Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface FinancialProgramConfigActionsProps {
  programId: string;
  programCode: string;
  onEdit: (id: string) => void;
  onCopy: (id: string) => void;
  onDelete: (id: string) => void;
}

const FinancialProgramConfigActions = ({ 
  programId, 
  programCode,
  onEdit, 
  onCopy, 
  onDelete 
}: FinancialProgramConfigActionsProps) => {
  
  const handleDownloadTemplate = async () => {
    try {
      toast.info("Generating template...");
      
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token;
      const url = `https://izxgyxqpgpcqvyzlwcgl.supabase.co/functions/v1/generate-bulletin-template`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {})
        },
        body: JSON.stringify({ programCode })
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || `Failed with status ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();

      const blob = new Blob([arrayBuffer], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `${programCode}_Bulletin_Pricing_Template.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Template downloaded successfully!");
    } catch (error) {
      console.error('Template download failed:', error);
      toast.error("Failed to download template. Please try again.");
    }
  };
  return (
    <div className="text-right space-x-2">
      <Button 
        variant="ghost" 
        size="icon"
        onClick={handleDownloadTemplate}
        className="h-8 w-8"
        title="Download Template"
      >
        <Download className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => onEdit(programId)}
        className="h-8 w-8"
        title="Edit"
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => onCopy(programId)}
        className="h-8 w-8"
        title="Duplicate"
      >
        <Copy className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => onDelete(programId)}
        className="h-8 w-8 text-destructive"
        title="Delete"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default FinancialProgramConfigActions;
