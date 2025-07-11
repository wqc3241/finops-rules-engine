import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar } from "lucide-react";

export type DateRange = 'today' | '3days' | '7days' | '14days' | '30days' | '60days' | 'all';

interface DateRangeFilterProps {
  selectedRange: DateRange;
  onRangeChange: (range: DateRange) => void;
}

const dateRangeOptions = [
  { value: 'today' as DateRange, label: 'Today' },
  { value: '3days' as DateRange, label: 'Last 3 days' },
  { value: '7days' as DateRange, label: 'Last 7 days' },
  { value: '14days' as DateRange, label: 'Last 14 days' },
  { value: '30days' as DateRange, label: 'Last 30 days' },
  { value: '60days' as DateRange, label: 'Last 60 days' },
  { value: 'all' as DateRange, label: 'All' },
];

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({ selectedRange, onRangeChange }) => {
  const selectedLabel = dateRangeOptions.find(option => option.value === selectedRange)?.label || 'All';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Calendar className="h-4 w-4" />
          {selectedLabel}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {dateRangeOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onRangeChange(option.value)}
            className={selectedRange === option.value ? "bg-accent" : ""}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DateRangeFilter;