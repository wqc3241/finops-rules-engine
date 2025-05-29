
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserPermissions } from '@/types/user';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (module: keyof UserPermissions, action: string) => boolean;
  isAdmin: () => boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock current user - in real app this would come from authentication service
const mockUser: User = {
  id: "user-1",
  name: "John Smith",
  email: "john.smith@company.com",
  role: "admin",
  permissions: {
    applications: { view: true, create: true, edit: true, delete: true },
    tasks: { view: true, create: true, edit: true, delete: true },
    reports: { view: true, create: true, edit: true, delete: true },
    dashboard: { view: true, edit: true },
    userManagement: { view: true, create: true, edit: true, delete: true },
    adminSettings: { view: true, edit: true }
  },
  createdAt: "2024-01-01",
  lastLogin: "2024-01-15T10:30:00Z"
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading user from storage/API
    setTimeout(() => {
      setUser(mockUser);
      setIsLoading(false);
    }, 1000);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setUser(mockUser);
      setIsLoading(false);
    }, 1000);
  };

  const logout = () => {
    setUser(null);
  };

  const hasPermission = (module: keyof UserPermissions, action: string): boolean => {
    if (!user) return false;
    const modulePermissions = user.permissions[module];
    return (modulePermissions as any)[action] || false;
  };

  const isAdmin = (): boolean => {
    return user?.role === 'admin';
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      hasPermission,
      isAdmin,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
