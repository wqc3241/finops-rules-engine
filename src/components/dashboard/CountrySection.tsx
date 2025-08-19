import React, { useState } from 'react';
import CountryTable from './CountryTable';
import TableWithVersions from '@/components/version-management/TableWithVersions';

const mockCountryData = [
  {
    id: "US",
    countryName: "United States",
    countryCode: "US",
    currency: "USD",
    geoCode: "US001"
  },
  {
    id: "CA",
    countryName: "Canada",
    countryCode: "CA",
    currency: "CAD",
    geoCode: "CA001"
  },
  {
    id: "MX",
    countryName: "Mexico",
    countryCode: "MX",
    currency: "MXN",
    geoCode: "MX001"
  },
  {
    id: "SA",
    countryName: "Saudi Arabia",
    countryCode: "SA",
    currency: "SAR",
    geoCode: "SA001"
  }
];

const CountrySection: React.FC = () => {
  const [data, setData] = useState(mockCountryData);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleEdit = (id: string) => {
    console.log('Edit country:', id);
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
    const newCountry = {
      id: `NEW_${Date.now()}`,
      countryName: "New Country",
      countryCode: "XX",
      currency: "XXX",
      geoCode: "XX001"
    };
    setData(prev => [...prev, newCountry]);
  };

  return (
    <TableWithVersions
      tableName="Countries"
      data={data}
      onDataChange={setData}
      title="Countries"
      onAddNew={handleAddNew}
    >
      <CountryTable
        onEdit={handleEdit}
        onCopy={handleCopy}
        onRemove={handleRemove}
        onSelectionChange={setSelectedItems}
        selectedItems={selectedItems}
      />
    </TableWithVersions>
  );
};

export default CountrySection;