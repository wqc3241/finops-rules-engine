
import React from 'react';
import ApplicationCard from './ApplicationCard';
import { applications as initialApplications } from '../../data/mockApplications';
import { useApplicationFiltering } from '@/hooks/useApplicationFiltering';
import SortPopover from './filters/SortPopover';
import FilterPopover from './filters/FilterPopover';
import EmptyApplicationState from './EmptyApplicationState';

const ApplicationList: React.FC = () => {
  const {
    sortOption,
    setSortOption,
    sortDirection,
    setSortDirection,
    statusFilters,
    typeFilters,
    stateFilters,
    uniqueStatuses,
    uniqueTypes,
    uniqueStates,
    filteredApplications,
    toggleStatusFilter,
    toggleTypeFilter,
    toggleStateFilter,
    clearFilters,
    toggleSortDirection,
  } = useApplicationFiltering(initialApplications);

  return (
    <div>
      {filteredApplications.length > 0 ? (
        <>
          {filteredApplications.map((application) => (
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
