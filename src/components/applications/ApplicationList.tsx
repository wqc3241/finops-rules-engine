
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
    uniqueStatuses,
    uniqueTypes,
    filteredApplications,
    toggleStatusFilter,
    toggleTypeFilter,
    clearFilters,
    toggleSortDirection,
  } = useApplicationFiltering(initialApplications);

  return (
    <div>
      <div className="flex justify-end mb-6 gap-4">
        <SortPopover 
          sortOption={sortOption}
          sortDirection={sortDirection}
          setSortOption={setSortOption}
          setSortDirection={setSortDirection}
          toggleSortDirection={toggleSortDirection}
        />
        <FilterPopover 
          uniqueStatuses={uniqueStatuses}
          uniqueTypes={uniqueTypes}
          statusFilters={statusFilters}
          typeFilters={typeFilters}
          toggleStatusFilter={toggleStatusFilter}
          toggleTypeFilter={toggleTypeFilter}
          clearFilters={clearFilters}
        />
      </div>

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
