
import React from 'react';
import { AppDTReferences } from '@/types/application';
import DataField from './DataField';

interface AppDTReferencesSectionProps {
  appDtReferences: AppDTReferences;
}

const AppDTReferencesSection: React.FC<AppDTReferencesSectionProps> = ({ appDtReferences }) => {
  return (
    <section className="mt-3">
      <h4 className="text-sm font-medium mb-2">App & DT References</h4>
      <div className="grid grid-cols-1 gap-y-1">
        <DataField label="DT Portal State" value={appDtReferences.dtPortalState} />
        <DataField label="DT ID" value={appDtReferences.dtId} />
        <DataField label="Application Date" value={appDtReferences.applicationDate} />
      </div>
    </section>
  );
};

export default AppDTReferencesSection;
