
export const getNextFPCId = (data: any[]) => {
  // Get all ids matching FPC followed by digits, extract numbers
  const fpIds = data
    .map(row => typeof row.id === "string" && row.id.match(/^FPC(\d{2})$/) ? Number(row.id.slice(3)) : null)
    .filter((v): v is number => v !== null);
  const nextNumber = fpIds.length > 0 ? Math.max(...fpIds) + 1 : 1;
  // Pad with leading zero to two digits
  return `FPC${String(nextNumber).padStart(2, "0")}`;
};

export const getHeaderClassName = (column: any) => {
  return column.inputType === 'Input' 
    ? 'bg-blue-50 text-blue-900' 
    : 'bg-gray-50 text-gray-700';
};
