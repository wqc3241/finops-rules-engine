import React, { useState } from 'react';
import DealerTable from './DealerTable';
import TableWithVersions from '@/components/version-management/TableWithVersions';

const mockDealerData = [
  {
    id: "DL001",
    gatewayDealerId: "625801",
    gatewayId: "NA-US-00DT",
    geoCode: "",
    dbaName: "Lucid Group USA, Inc. NY",
    sellingState: "NY",
    financingFormList: "State-Specific",
    legalEntityName: "Lucid Motor Group, Inc",
    legalEntityAddress: "",
    gatewayDealershipAddress: ""
  },
  {
    id: "KSADL001",
    gatewayDealerId: "",
    gatewayId: "",
    geoCode: "ME-KSA",
    dbaName: "",
    sellingState: "",
    financingFormList: "",
    legalEntityName: "",
    legalEntityAddress: "",
    gatewayDealershipAddress: ""
  }
];

const DealerSection: React.FC = () => {
  const [data, setData] = useState(mockDealerData);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleEdit = (id: string) => {
    console.log('Edit dealer:', id);
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
    const newDealer = {
      id: `DL${Date.now()}`,
      gatewayDealerId: "",
      gatewayId: "",
      geoCode: "",
      dbaName: "",
      sellingState: "",
      financingFormList: "",
      legalEntityName: "",
      legalEntityAddress: "",
      gatewayDealershipAddress: ""
    };
    setData(prev => [...prev, newDealer]);
  };

  return (
    <TableWithVersions
      tableName="Dealers"
      data={data}
      onDataChange={setData}
      title="Dealers"
      onAddNew={handleAddNew}
    >
      <DealerTable
        onEdit={handleEdit}
        onCopy={handleCopy}
        onRemove={handleRemove}
        onSelectionChange={setSelectedItems}
        selectedItems={selectedItems}
      />
    </TableWithVersions>
  );
};

export default DealerSection;