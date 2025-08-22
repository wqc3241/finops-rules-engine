import { Button } from "@/components/ui/button";
import { Edit, Copy, Trash2, Download } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface TableRowActionsProps {
  rowId: string;
  programCode?: string; // Optional for download functionality
  onEdit: () => void;
  onCopy: (rowId: string) => void;
  onDelete: (rowId: string) => void;
}

const TableRowActions = ({
  rowId,
  programCode,
  onEdit,
  onCopy,
  onDelete,
}: TableRowActionsProps) => {
  
  const handleDownloadTemplate = async () => {
    if (!programCode) return;
    
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
    <div className="flex justify-end space-x-2">
      {programCode && (
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleDownloadTemplate}
          className="h-8 px-3 text-xs"
          title="Download Template"
        >
          <Download className="h-3 w-3 mr-1" />
          Download
        </Button>
      )}
      <Button
        variant="ghost"
        size="icon"
        onClick={onEdit}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onCopy(rowId)}
      >
        <Copy className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(rowId)}
        className="text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default TableRowActions;
