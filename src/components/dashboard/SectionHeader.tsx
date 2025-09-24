import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Undo, Redo, Upload, Download, History } from "lucide-react";
interface SectionHeaderProps {
  title: string;
  isCollapsed?: boolean;
  setIsCollapsed?: (collapsed: boolean) => void;
  onAddNew?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onUpload?: () => void;
  onDownload?: () => void;
  uploadLabel?: string;
  downloadLabel?: string;
  downloadDisabled?: boolean;
  selectedItems?: string[];
  onVersionHistory?: () => void;
  showVersionHistory?: boolean;
  children?: ReactNode;
}
const SectionHeader = ({
  title,
  isCollapsed,
  setIsCollapsed,
  onAddNew,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  onUpload,
  onDownload,
  uploadLabel = "Upload",
  downloadLabel = "Download",
  downloadDisabled = false,
  selectedItems = [],
  onVersionHistory,
  showVersionHistory = true,
  children
}: SectionHeaderProps) => {
  return <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        <h2 className="text-lg font-medium text-gray-800">{title}</h2>
        {isCollapsed !== undefined && setIsCollapsed && <button onClick={() => setIsCollapsed(!isCollapsed)} className="ml-2 text-gray-400 hover:text-gray-600">
            {isCollapsed ? <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg> : <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>}
          </button>}
      </div>
      <div className="flex items-center space-x-2">
        {onUpload && <Button variant="outline" size="sm" onClick={onUpload}>
            <Upload className="h-3 w-3 mr-1" />
            {uploadLabel}
          </Button>}
        {onDownload && <Button variant="outline" size="sm" onClick={onDownload} disabled={downloadDisabled} className={downloadDisabled ? "opacity-50 cursor-not-allowed" : ""}>
            <Download className="h-3 w-3 mr-1" />
            {downloadLabel}
          </Button>}
        {onUndo && onRedo && <>
            
            
          </>}
        {showVersionHistory && onVersionHistory && <Button variant="outline" size="sm" onClick={onVersionHistory} className="mr-2">
            <History className="h-4 w-4 mr-1" />
            Versions
          </Button>}
        {onAddNew && <button 
            onClick={(e) => {
              console.log('🚨 ADD NEW BUTTON CLICKED');
              console.log('🚨 Event:', e);
              console.log('🚨 Event target:', e.target);
              e.preventDefault();
              e.stopPropagation();
              onAddNew();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
            type="button"
          >
            Add New
          </button>}
        {children}
      </div>
    </div>;
};
export default SectionHeader;