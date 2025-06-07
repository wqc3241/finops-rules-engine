
import React from 'react';
import ApplicationCard from './ApplicationCard';
import { Application } from '@/types/application';
import EmptyApplicationState from './EmptyApplicationState';

interface ApplicationListProps {
  applications: Application[];
  clearFilters: () => void;
}

const ApplicationList: React.FC<ApplicationListProps> = ({ applications, clearFilters }) => {
  return (
    <div>
      {applications.length > 0 ? (
        <>
          {applications.map((application) => (
            <ApplicationCard key={application.id} application={application} />
          ))}
        </>
      ) : (
        <EmptyApplicationState clearFilters={clearFilters} />
      )}
    </div>
  );
};

export default ApplicationList;
