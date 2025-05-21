import { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
export interface TabItem {
  value: string;
  label: string | ReactNode;
  content: ReactNode;
  isSelected?: boolean;
  isPresentedToCustomer?: boolean;
}
interface TabComponentProps {
  defaultValue: string;
  items: TabItem[];
  onValueChange?: (value: string) => void;
}
const TabComponent = ({
  defaultValue,
  items,
  onValueChange
}: TabComponentProps) => {
  return <Tabs defaultValue={defaultValue} className="w-full" onValueChange={onValueChange}>
      <div className="border-b border-gray-200">
        <TabsList className="bg-transparent h-auto p-0 w-full flex overflow-x-auto">
          {items.map(item => {
          // Check if this tab is for a lender that's been presented to customer
          const isSelectedLender = item.isSelected || item.isPresentedToCustomer || typeof item.label === 'object' && 'props' in item.label && item.label.props?.className?.includes('text-green-600');
          return;
        })}
        </TabsList>
      </div>

      {items.map(item => <TabsContent key={item.value} value={item.value}>
          {item.content}
        </TabsContent>)}
    </Tabs>;
};
export default TabComponent;