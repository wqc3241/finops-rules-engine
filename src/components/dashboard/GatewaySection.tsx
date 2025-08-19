import React, { useState } from 'react';
import GatewayTable from './GatewayTable';
import TableWithVersions from '@/components/version-management/TableWithVersions';

const mockGatewayData = [
  {
    id: "1",
    gatewayId: "NA-US-00DT",
    gatewayName: "DealerTrack",
    geoCode: "NA-US",
    optionalPlatformId: ""
  },
  {
    id: "2",
    gatewayId: "NA-CA-0SCI",
    gatewayName: "SCI",
    geoCode: "NA-CA",
    optionalPlatformId: ""
  }
];

const GatewaySection: React.FC = () => {
  const [data, setData] = useState(mockGatewayData);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleEdit = (id: string) => {
    console.log('Edit gateway:', id);
  };

  const handleCopy = (id: string) => {
    const itemToCopy = data.find(item => item.id === id);
    if (itemToCopy) {
      const newItem = { 
        ...itemToCopy, 
        id: `${Date.now()}`,
        gatewayId: `${itemToCopy.gatewayId}_copy`
      };
      setData(prev => [...prev, newItem]);
    }
  };

  const handleRemove = (id: string) => {
    setData(prev => prev.filter(item => item.id !== id));
    setSelectedItems(prev => prev.filter(item => item !== id));
  };

  const handleAddNew = () => {
    const newGateway = {
      id: `${Date.now()}`,
      gatewayId: "",
      gatewayName: "",
      geoCode: "",
      optionalPlatformId: ""
    };
    setData(prev => [...prev, newGateway]);
  };

  return (
    <TableWithVersions
      tableName="Gateways"
      data={data}
      onDataChange={setData}
      title="Gateways"
      onAddNew={handleAddNew}
    >
      <GatewayTable
        onEdit={handleEdit}
        onCopy={handleCopy}
        onRemove={handleRemove}
        onSelectionChange={setSelectedItems}
        selectedItems={selectedItems}
      />
    </TableWithVersions>
  );
};

export default GatewaySection;