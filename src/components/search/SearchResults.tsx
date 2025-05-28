
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { FileText, CheckSquare, BarChart3, User } from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  category: 'Applications' | 'Tasks' | 'Reports' | 'Users';
  type?: string;
  url: string;
}

interface SearchResultsProps {
  groupedResults: Record<string, SearchResult[]>;
  onResultClick: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ groupedResults, onResultClick }) => {
  const navigate = useNavigate();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Applications': return <FileText className="h-4 w-4" />;
      case 'Tasks': return <CheckSquare className="h-4 w-4" />;
      case 'Reports': return <BarChart3 className="h-4 w-4" />;
      case 'Users': return <User className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const handleResultClick = (result: SearchResult) => {
    onResultClick();
    if (result.url !== '#') {
      navigate(result.url);
    }
  };

  const totalResults = Object.values(groupedResults).reduce((sum, results) => sum + results.length, 0);

  if (totalResults === 0) {
    return (
      <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-96 overflow-y-auto">
        <CardContent className="p-4 text-center text-gray-500">
          No results found
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-96 overflow-y-auto">
      <CardContent className="p-0">
        {Object.entries(groupedResults).map(([category, results]) => (
          <div key={category} className="border-b last:border-b-0">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border-b">
              {getCategoryIcon(category)}
              <span className="font-medium text-sm">{category}</span>
              <Badge variant="secondary" className="ml-auto">
                {results.length}
              </Badge>
            </div>
            {results.map((result) => (
              <div
                key={result.id}
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                onClick={() => handleResultClick(result)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-sm text-gray-900">
                      {result.title}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {result.subtitle}
                    </div>
                  </div>
                  {result.type && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      {result.type}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default SearchResults;
