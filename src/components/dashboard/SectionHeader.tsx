
import { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  children?: ReactNode;
}

const SectionHeader = ({ title, isCollapsed, setIsCollapsed, children }: SectionHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        <h2 className="text-lg font-medium text-gray-800">{title}</h2>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="ml-2 text-gray-400 hover:text-gray-600"
        >
          {isCollapsed ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>
      {children}
    </div>
  );
};

export default SectionHeader;
