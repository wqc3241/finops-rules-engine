
import React from 'react';
import { AppDTReferences } from '@/types/application';
import DataField from './DataField';

interface AppDTReferencesSectionProps {
  appDtReferences: AppDTReferences;
}

const AppDTReferencesSection: React.FC<AppDTReferencesSectionProps> = ({ appDtReferences }) => {
  return (
    <section className="mt-6">
      <h4 className="text-md font-medium mb-4">App & DT References</h4>
      <div className="grid grid-cols-1 gap-y-3">
        <DataField label="DT Portal State" value={appDtReferences.dtPortalState} />
        <DataField label="DT ID" value={appDtReferences.dtId} />
        <DataField label="Application Date" value={appDtReferences.applicationDate} />
      </div>
    </section>
  );
};

export default AppDTReferencesSection;
