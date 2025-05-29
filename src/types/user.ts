
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  avatar?: string;
  permissions: UserPermissions;
  createdAt: string;
  lastLogin?: string;
}

export interface UserPermissions {
  applications: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
  tasks: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
  reports: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
  dashboard: {
    view: boolean;
    edit: boolean;
  };
  userManagement: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
  adminSettings: {
    view: boolean;
    edit: boolean;
  };
}

export interface UserRole {
  id: string;
  name: string;
  permissions: UserPermissions;
}
