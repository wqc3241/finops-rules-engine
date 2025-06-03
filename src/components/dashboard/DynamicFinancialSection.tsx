import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import DynamicTable from "@/components/dynamic-table/DynamicTable";
import SectionHeader from "./SectionHeader";
import { useDynamicTableSchemas } from "@/hooks/useDynamicTableSchemas";
import { TableData } from "@/types/dynamicTable";
import { toast } from "sonner";

interface DynamicFinancialSectionProps {
  schemaId: string;
  title: string;
  onSelectionChange?: (items: string[]) => void;
  selectedItems?: string[];
  onSetBatchDeleteCallback?: (callback: () => void) => void;
}

const DynamicFinancialSection = ({ 
  schemaId,
  title,
  onSelectionChange,
  selectedItems = [],
  onSetBatchDeleteCallback
}: DynamicFinancialSectionProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [data, setData] = useState<TableData[]>([]);
  const { getSchema, updateSchema } = useDynamicTableSchemas();

  const schema = getSchema(schemaId);

  // Load initial data based on schema
  useEffect(() => {
    const savedData = localStorage.getItem(`dynamicTableData_${schemaId}`);
    if (savedData) {
      try {
        setData(JSON.parse(savedData));
      } catch (error) {
        console.error('Failed to parse saved data:', error);
        setData(getInitialData(schemaId));
      }
    } else {
      setData(getInitialData(schemaId));
    }
  }, [schemaId]);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(`dynamicTableData_${schemaId}`, JSON.stringify(data));
  }, [data, schemaId]);

  // Set up batch delete callback
  useEffect(() => {
    if (onSetBatchDeleteCallback) {
      const batchDeleteFunction = () => {
        const updatedData = data.filter(row => !selectedItems.includes(row.id));
        setData(updatedData);
        onSelectionChange?.([]);
      };
      onSetBatchDeleteCallback(batchDeleteFunction);
    }
  }, [data, selectedItems, onSetBatchDeleteCallback, onSelectionChange]);

  const getInitialData = (schemaId: string): TableData[] => {
    switch (schemaId) {
      case 'bulletin-pricing':
        return [
          {
            id: "1",
            financialProgramCode: "KSAAIBM05251",
            programId: "FPKSA01",
            pricingConfig: "PR003",
            geoCode: "ME-KSA",
            lenderName: "KSAAJB",
            advertised: false,
            pricingType: "INR",
            bulletinId: "BTKSA01",
            pricingValue: 0.0300,
            uploadDate: "2023-05-15"
          },
          {
            id: "2",
            financialProgramCode: "KSAAIBM05251",
            programId: "FPKSA01",
            pricingConfig: "PR003",
            geoCode: "ME-KSA",
            lenderName: "KSAAJB",
            advertised: false,
            pricingType: "SPR",
            bulletinId: "BTKSA01",
            pricingValue: 0.0295,
            uploadDate: "2023-05-15"
          }
        ];
      case 'pricing-types':
        return [
          { id: "1", typeCode: "STDAPR", typeName: "Standard APR" },
          { id: "2", typeCode: "SUBAPR", typeName: "Subvented APR" },
          { id: "3", typeCode: "MINDWPAY", typeName: "Min Down Payment" }
        ];
      case 'financial-products':
        return [
          {
            id: "USLN",
            productType: "Loan",
            productSubtype: null,
            geoCode: "NA-US",
            category: "Personal",
            isActive: true
          },
          {
            id: "USLE",
            productType: "Lease",
            productSubtype: null,
            geoCode: "NA-US",
            category: "Personal",
            isActive: true
          }
        ];
      default:
        return [];
    }
  };

  const handleAddNew = () => {
    if (!schema) {
      toast.error("Schema not found");
      return;
    }

    const newRow: TableData = {
      id: `new_${Date.now()}`,
    };

    // Initialize with default values based on column types
    schema.columns.forEach(column => {
      if (column.key !== 'id') {
        switch (column.type) {
          case 'string':
            newRow[column.key] = '';
            break;
          case 'boolean':
            newRow[column.key] = false;
            break;
          case 'number':
            newRow[column.key] = 0;
            break;
        }
      }
    });

    setData(prev => [...prev, newRow]);
    toast.success("New record added");
  };

  if (!schema) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-sm">
        <div className="text-center text-gray-500">
          Schema not found for {schemaId}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <SectionHeader 
        title={title} 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
        onAddNew={handleAddNew}
      />
      {!isCollapsed && (
        <div className="mt-4">
          <DynamicTable
            schema={schema}
            data={data}
            onDataChange={setData}
            onSchemaChange={(updatedSchema) => updateSchema(schemaId, updatedSchema)}
            onSelectionChange={onSelectionChange}
            selectedItems={selectedItems}
            allowColumnManagement={true}
          />
        </div>
      )}
    </div>
  );
};

export default DynamicFinancialSection;
