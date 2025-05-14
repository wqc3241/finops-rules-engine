
import { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface TabItem {
  value: string;
  label: string;
  content: ReactNode;
}

interface TabComponentProps {
  defaultValue: string;
  items: TabItem[];
  onValueChange?: (value: string) => void;
}

const TabComponent = ({ defaultValue, items, onValueChange }: TabComponentProps) => {
  return (
    <Tabs 
      defaultValue={defaultValue} 
      className="w-full"
      onValueChange={onValueChange}
    >
      <div className="border-b border-gray-200">
        <TabsList className="bg-transparent h-auto p-0 w-full flex overflow-x-auto">
          {items.map((item) => (
            <TabsTrigger 
              key={item.value} 
              value={item.value} 
              className="py-2 px-4 data-[state=active]:border-b-2 data-[state=active]:border-gray-900 data-[state=active]:bg-transparent rounded-none"
            >
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {items.map((item) => (
        <TabsContent key={item.value} value={item.value}>
          {item.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default TabComponent;
