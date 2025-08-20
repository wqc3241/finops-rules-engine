
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useRef, useEffect } from "react";
import { useGlobalSearch } from "@/hooks/useGlobalSearch";
import SearchResults from "@/components/search/SearchResults";
import ProfileMenu from "@/components/profile/ProfileMenu";
import CountrySelector from "@/components/CountrySelector";
import ChangeRequestNotifications from "@/components/notifications/ChangeRequestNotifications";

interface NavbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Navbar = ({ sidebarOpen, setSidebarOpen }: NavbarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const { groupedResults } = useGlobalSearch(searchQuery);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowResults(value.length >= 2);
  };

  const handleResultClick = () => {
    setShowResults(false);
    setSearchQuery("");
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-20">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center">
          <button
            type="button"
            className="p-2 rounded-md focus:outline-none"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <svg
              className="h-6 w-6 text-gray-700"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <div className="ml-4 text-2xl font-semibold text-gray-800">LUCID</div>
        </div>

        <div className="mx-4 flex-1 max-w-2xl relative" ref={searchRef}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input 
              type="text"
              placeholder="Search by VIN no, vehicle name, customer name, tasks, reports..."
              className="pl-10 pr-4 py-2 w-full rounded-md border"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
            />
          </div>
          {showResults && (
            <SearchResults 
              groupedResults={groupedResults}
              onResultClick={handleResultClick}
            />
          )}
        </div>

        <div className="flex items-center">
          <ChangeRequestNotifications />
          <div className="border-l border-gray-200 h-8 mx-4"></div>
          <div className="flex items-center gap-4">
            <CountrySelector />
            <ProfileMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
