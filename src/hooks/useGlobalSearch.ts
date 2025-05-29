
import { useState, useMemo } from 'react';
import { applications } from '@/data/mockApplications';
import { useCountry } from '@/hooks/useCountry';
import { filterDataByCountry } from '@/utils/countryDataFilter';

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  category: 'Applications' | 'Tasks' | 'Reports' | 'Users';
  type?: string;
  url: string;
}

export const useGlobalSearch = (query: string) => {
  const [isSearching, setIsSearching] = useState(false);
  const { selectedCountry } = useCountry();

  const searchResults = useMemo(() => {
    if (!query || query.length < 2) return [];

    const results: SearchResult[] = [];
    const searchTerm = query.toLowerCase();

    // Filter applications by selected country first
    const countryFilteredApplications = filterDataByCountry(applications, selectedCountry.code);

    // Search Applications
    countryFilteredApplications.forEach(app => {
      const matchesName = app.name?.toLowerCase().includes(searchTerm);
      const matchesOrderNumber = app.orderNumber?.toLowerCase().includes(searchTerm);
      const matchesId = app.id.toLowerCase().includes(searchTerm);
      const matchesType = app.type?.toLowerCase().includes(searchTerm);
      const matchesStatus = app.status?.toLowerCase().includes(searchTerm);

      if (matchesName || matchesOrderNumber || matchesId || matchesType || matchesStatus) {
        results.push({
          id: app.id,
          title: `${app.orderNumber} - ${app.name}`,
          subtitle: `Status: ${app.status} • Type: ${app.type}`,
          category: 'Applications',
          type: app.type,
          url: `/applications/${app.id}`
        });
      }
    });

    // Search Tasks (mock data) - filter by country
    const mockTasks = [
      { id: 'ORD-2024-001', customer: 'John Smith', vehicle: 'Toyota Camry', priority: 'P1', country: 'US' },
      { id: 'ORD-2024-002', customer: 'Sarah Johnson', vehicle: 'Honda Accord', priority: 'P3', country: 'US' },
      { id: 'ORD-2024-003', customer: 'Mike Davis', vehicle: 'Ford F-150', priority: 'P2', country: 'US' },
    ];

    const countryFilteredTasks = filterDataByCountry(mockTasks, selectedCountry.code);

    countryFilteredTasks.forEach(task => {
      const matchesOrder = task.id.toLowerCase().includes(searchTerm);
      const matchesCustomer = task.customer.toLowerCase().includes(searchTerm);
      const matchesVehicle = task.vehicle.toLowerCase().includes(searchTerm);

      if (matchesOrder || matchesCustomer || matchesVehicle) {
        results.push({
          id: task.id,
          title: task.id,
          subtitle: `${task.customer} • ${task.vehicle} • Priority: ${task.priority}`,
          category: 'Tasks',
          url: '/tasks'
        });
      }
    });

    // Search Reports (mock data) - filter by country
    const mockReports = [
      { id: 'RPT-001', name: 'Monthly Applications Report', type: 'Financial', country: 'US' },
      { id: 'RPT-002', name: 'Approval Rate Analysis', type: 'Analytics', country: 'US' },
      { id: 'RPT-003', name: 'Risk Assessment Summary', type: 'Risk', country: 'US' },
    ];

    const countryFilteredReports = filterDataByCountry(mockReports, selectedCountry.code);

    countryFilteredReports.forEach(report => {
      const matchesName = report.name.toLowerCase().includes(searchTerm);
      const matchesType = report.type.toLowerCase().includes(searchTerm);

      if (matchesName || matchesType) {
        results.push({
          id: report.id,
          title: report.name,
          subtitle: `Type: ${report.type}`,
          category: 'Reports',
          url: '/report'
        });
      }
    });

    // Search Users (mock data) - filter by country
    const mockUsers = [
      { id: 'USR-001', name: 'John Smith', role: 'Loan Officer', department: 'Finance', country: 'US' },
      { id: 'USR-002', name: 'Sarah Johnson', role: 'Risk Analyst', department: 'Risk Management', country: 'US' },
      { id: 'USR-003', name: 'Mike Davis', role: 'Manager', department: 'Operations', country: 'US' },
    ];

    const countryFilteredUsers = filterDataByCountry(mockUsers, selectedCountry.code);

    countryFilteredUsers.forEach(user => {
      const matchesName = user.name.toLowerCase().includes(searchTerm);
      const matchesRole = user.role.toLowerCase().includes(searchTerm);
      const matchesDept = user.department.toLowerCase().includes(searchTerm);

      if (matchesName || matchesRole || matchesDept) {
        results.push({
          id: user.id,
          title: user.name,
          subtitle: `${user.role} • ${user.department}`,
          category: 'Users',
          url: '#'
        });
      }
    });

    return results;
  }, [query, selectedCountry.code]);

  const groupedResults = useMemo(() => {
    const grouped: Record<string, SearchResult[]> = {};
    searchResults.forEach(result => {
      if (!grouped[result.category]) {
        grouped[result.category] = [];
      }
      grouped[result.category].push(result);
    });
    return grouped;
  }, [searchResults]);

  return {
    searchResults,
    groupedResults,
    isSearching,
    setIsSearching
  };
};
