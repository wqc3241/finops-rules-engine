import React, { useState } from 'react';
import FinancialProductsTable from '../FinancialProductsTable';
import TableWithVersions from '@/components/version-management/TableWithVersions';

const mockFinancialProductsData = [
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
  },
  {
    id: "DEL",
    productType: "Loan",
    productSubtype: null,
    geoCode: "EU-DE",
    category: "Personal",
    isActive: true
  },
  {
    id: "DELC",
    productType: "Loan",
    productSubtype: null,
    geoCode: "EU-DE",
    category: "Commercial",
    isActive: true
  },
  {
    id: "DELE",
    productType: "Lease",
    productSubtype: "Full service",
    geoCode: "EU-DE",
    category: "Personal",
    isActive: true
  },
  {
    id: "DELO",
    productType: "Lease",
    productSubtype: "Operating",
    geoCode: "EU-DE",
    category: "Personal",
    isActive: true
  },
  {
    id: "KSABM",
    productType: "Balloon",
    productSubtype: "Monthly",
    geoCode: "ME-KSA",
    category: "Personal",
    isActive: true
  },
  {
    id: "KSABA5050",
    productType: "Balloon",
    productSubtype: "Annual 50-50",
    geoCode: "ME-KSA",
    category: "Personal",
    isActive: true
  }
];

const FinancialProductsSection: React.FC = () => {
  const [data, setData] = useState(mockFinancialProductsData);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleEdit = (id: string) => {
    console.log('Edit financial product:', id);
  };

  const handleCopy = (id: string) => {
    const itemToCopy = data.find(item => item.id === id);
    if (itemToCopy) {
      const newItem = { ...itemToCopy, id: `${id}_copy_${Date.now()}` };
      setData(prev => [...prev, newItem]);
    }
  };

  const handleRemove = (id: string) => {
    setData(prev => prev.filter(item => item.id !== id));
    setSelectedItems(prev => prev.filter(item => item !== id));
  };

  const handleAddNew = () => {
    const newProduct = {
      id: `FP${Date.now()}`,
      productType: "Loan",
      productSubtype: null,
      geoCode: "",
      category: "Personal",
      isActive: true
    };
    setData(prev => [...prev, newProduct]);
  };

  return (
    <TableWithVersions
      tableName="Financial Products"
      data={data}
      onDataChange={setData}
      title="Financial Products"
      onAddNew={handleAddNew}
    >
      <FinancialProductsTable
        onEdit={handleEdit}
        onCopy={handleCopy}
        onRemove={handleRemove}
        onSelectionChange={setSelectedItems}
        selectedItems={selectedItems}
      />
    </TableWithVersions>
  );
};

export default FinancialProductsSection;