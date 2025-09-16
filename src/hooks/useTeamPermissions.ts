import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useSupabaseAuth';

export interface TeamPermissionCheck {
  canManageCategory: (categoryId: string) => boolean;
  canAddDocumentToCategory: (categoryId: string) => boolean;
  userRole: string | null;
  isLoading: boolean;
}

export const useTeamPermissions = (): TeamPermissionCheck => {
  const { user } = useAuth();

  const { data: userProfile, isLoading: profileLoading } = useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('user_id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['documentCategoriesWithTeams'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('document_categories')
        .select('id, allowed_teams');
      
      if (error) throw error;
      return data as { id: string; allowed_teams: string[] }[];
    }
  });

  const canManageCategory = (categoryId: string): boolean => {
    if (!userProfile?.role) return false;
    
    // Admins can manage all categories
    if (['FS_ADMIN', 'admin'].includes(userProfile.role)) {
      return true;
    }

    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return false;

    // If no teams specified, all authenticated users can manage
    if (!category.allowed_teams || category.allowed_teams.length === 0) {
      return true;
    }

    // Check if user's role is in allowed teams
    return category.allowed_teams.includes(userProfile.role);
  };

  const canAddDocumentToCategory = (categoryId: string): boolean => {
    return canManageCategory(categoryId);
  };

  return {
    canManageCategory,
    canAddDocumentToCategory,
    userRole: userProfile?.role || null,
    isLoading: profileLoading || categoriesLoading
  };
};