
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DataField } from './DataField';

interface RegistrationDataProps {
  registrationData: Array<{label: string; value: string}>;
}

const RegistrationDataCard: React.FC<RegistrationDataProps> = ({ registrationData }) => {
  return (
    <Card className="h-fit">
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">Registration Data</h3>
        <div className="space-y-2">
          {registrationData.map((item, index) => (
            <DataField key={index} label={item.label} value={item.value} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RegistrationDataCard;
