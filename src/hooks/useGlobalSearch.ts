
import { useState, useMemo } from 'react';
import { applications } from '@/data/mockApplications';

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

  const searchResults = useMemo(() => {
    if (!query || query.length < 2) return [];

    const results: SearchResult[] = [];
    const searchTerm = query.toLowerCase();

    // Search Applications
    applications.forEach(app => {
      const matchesVin = app.vinNumber?.toLowerCase().includes(searchTerm);
      const matchesCustomer = `${app.applicantFirstName} ${app.applicantLastName}`.toLowerCase().includes(searchTerm);
      const matchesVehicle = `${app.vehicleMake} ${app.vehicleModel}`.toLowerCase().includes(searchTerm);
      const matchesId = app.id.toLowerCase().includes(searchTerm);

      if (matchesVin || matchesCustomer || matchesVehicle || matchesId) {
        results.push({
          id: app.id,
          title: `${app.vehicleMake} ${app.vehicleModel} ${app.vehicleYear}`,
          subtitle: `${app.applicantFirstName} ${app.applicantLastName} • VIN: ${app.vinNumber}`,
          category: 'Applications',
          type: app.applicationType,
          url: `/applications/${app.id}`
        });
      }
    });

    // Search Tasks (mock data)
    const mockTasks = [
      { id: 'ORD-2024-001', customer: 'John Smith', vehicle: 'Toyota Camry', priority: 'P1' },
      { id: 'ORD-2024-002', customer: 'Sarah Johnson', vehicle: 'Honda Accord', priority: 'P3' },
      { id: 'ORD-2024-003', customer: 'Mike Davis', vehicle: 'Ford F-150', priority: 'P2' },
    ];

    mockTasks.forEach(task => {
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

    // Search Reports (mock data)
    const mockReports = [
      { id: 'RPT-001', name: 'Monthly Applications Report', type: 'Financial' },
      { id: 'RPT-002', name: 'Approval Rate Analysis', type: 'Analytics' },
      { id: 'RPT-003', name: 'Risk Assessment Summary', type: 'Risk' },
    ];

    mockReports.forEach(report => {
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

    // Search Users (mock data)
    const mockUsers = [
      { id: 'USR-001', name: 'John Smith', role: 'Loan Officer', department: 'Finance' },
      { id: 'USR-002', name: 'Sarah Johnson', role: 'Risk Analyst', department: 'Risk Management' },
      { id: 'USR-003', name: 'Mike Davis', role: 'Manager', department: 'Operations' },
    ];

    mockUsers.forEach(user => {
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
  }, [query]);

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
