
import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ChevronDown, ArrowUpDown } from 'lucide-react';
import { toast } from "sonner";

interface SortPopoverProps {
  sortOption: string;
  sortDirection: 'asc' | 'desc';
  setSortOption: (option: string) => void;
  setSortDirection: (direction: 'asc' | 'desc') => void;
  toggleSortDirection: () => void;
}

const SortPopover: React.FC<SortPopoverProps> = ({
  sortOption,
  sortDirection,
  setSortOption,
  setSortDirection,
  toggleSortDirection
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center justify-between min-w-[200px] border border-gray-300"
        >
          <span>Sort ({sortOption === 'date' ? 'Date' : 'Name'})</span>
          <div className="flex items-center">
            {sortOption === 'date' && (
              <ArrowUpDown 
                className="mr-2 h-4 w-4 cursor-pointer" 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSortDirection();
                }}
              />
            )}
            <ChevronDown className="h-4 w-4" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2" align="end">
        <div className="space-y-1">
          <Button 
            variant={sortOption === 'date' ? 'secondary' : 'ghost'} 
            className="w-full justify-start"
            onClick={() => {
              setSortOption('date');
              toast.success('Sorted by date');
            }}
          >
            By Date
          </Button>
          <Button 
            variant={sortOption === 'name' ? 'secondary' : 'ghost'} 
            className="w-full justify-start"
            onClick={() => {
              setSortOption('name');
              toast.success('Sorted by name');
            }}
          >
            By Name
          </Button>
          
          {sortOption === 'date' && (
            <>
              <hr className="my-2" />
              <Button 
                variant={sortDirection === 'desc' ? 'secondary' : 'ghost'} 
                className="w-full justify-start"
                onClick={() => {
                  setSortDirection('desc');
                  toast.success('Sorted newest to oldest');
                }}
              >
                Newest first
              </Button>
              <Button 
                variant={sortDirection === 'asc' ? 'secondary' : 'ghost'} 
                className="w-full justify-start"
                onClick={() => {
                  setSortDirection('asc');
                  toast.success('Sorted oldest to newest');
                }}
              >
                Oldest first
              </Button>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SortPopover;
