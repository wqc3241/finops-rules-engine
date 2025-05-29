
import React from 'react';
import { User, Settings, Shield, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const ProfileMenu = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleProfileSettings = () => {
    navigate('/profile-settings');
  };

  const handleUserPermissions = () => {
    navigate('/user-permissions');
  };

  const handleAdminSettings = () => {
    navigate('/admin-settings');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-gray-700 font-semibold cursor-pointer hover:bg-gray-300 transition-colors">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              ID: {user.id}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleProfileSettings}>
          <User className="mr-2 h-4 w-4" />
          <span>Profile Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleUserPermissions}>
          <Shield className="mr-2 h-4 w-4" />
          <span>User Permissions</span>
        </DropdownMenuItem>
        {isAdmin() && (
          <DropdownMenuItem onClick={handleAdminSettings}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Admin Settings</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileMenu;
