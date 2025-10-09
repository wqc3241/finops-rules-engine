import { supabase } from '@/integrations/supabase/client';
import { getSavedApplications } from '@/utils/localStorageUtils';

export async function migrateLocalStorageToSupabase() {
  console.log('🚀 Starting migration from localStorage to Supabase...');
  
  const localApplications = getSavedApplications();
  
  if (localApplications.length === 0) {
    console.log('✅ No applications to migrate');
    return;
  }

  console.log(`📦 Found ${localApplications.length} applications to migrate`);

  for (const app of localApplications) {
    try {
      const { data: appData, error: appError } = await supabase
        .from('applications')
        .insert([{
          id: app.id,
          name: app.name,
          status: app.status as any,
          type: app.type as any,
          date: app.date,
          state: app.state,
          country: app.country || 'US',
          reapply_enabled: app.reapplyEnabled,
          reapplication_sequence: app.reapplicationSequence,
          original_application_id: app.originalApplicationId,
          parent_application_id: app.parentApplicationId,
        }])
        .select()
        .single();

      if (appError) throw appError;

      if (app.notesArray && app.notesArray.length > 0) {
        await supabase
          .from('application_notes')
          .insert(
            app.notesArray.map(note => ({
              application_id: app.id,
              content: note.content,
              author: note.user,
              date: new Date().toISOString(),
            }))
          );
      }

      console.log(`✅ Migrated: ${app.name}`);
    } catch (error) {
      console.error(`❌ Failed to migrate ${app.name}:`, error);
    }
  }

  console.log('🎉 Migration completed!');
}
