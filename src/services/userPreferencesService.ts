import { supabase } from '@/integrations/supabase/client';

interface UserPreferences {
  sort_option: string;
  sort_direction: 'asc' | 'desc';
  status_filters: string[];
  type_filters: string[];
  state_filters: string[];
}

export class UserPreferencesService {
  static async fetchPreferences(): Promise<UserPreferences | null> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return null;

    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userData.user.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching preferences:', error);
      return null;
    }

    return data ? {
      sort_option: data.sort_option,
      sort_direction: data.sort_direction as 'asc' | 'desc',
      status_filters: data.status_filters as string[],
      type_filters: data.type_filters as string[],
      state_filters: data.state_filters as string[],
    } : null;
  }

  static async savePreferences(preferences: Partial<UserPreferences>): Promise<void> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    const { error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: userData.user.id,
        ...preferences,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Error saving preferences:', error);
    }
  }
}
