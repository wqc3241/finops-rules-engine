import { supabase } from '@/integrations/supabase/client';
import { Application, Note } from '@/types/application';
import { toast } from 'sonner';

export class ApplicationService {
  /**
   * Fetch all applications for the current user's country
   */
  static async fetchApplications(countryCode: string = 'US'): Promise<Application[]> {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        applicant_info(*),
        application_details(*),
        application_notes(
          id,
          content,
          author,
          date,
          created_at
        ),
        application_history(*)
      `)
      .eq('country', countryCode)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
      throw error;
    }

    return this.transformToApplications(data || []);
  }

  /**
   * Fetch single application by ID
   */
  static async fetchApplicationById(id: string): Promise<Application | null> {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        applicant_info(*),
        application_details(*),
        application_notes(*),
        application_history(*),
        deal_structures(
          *,
          deal_structure_offers(
            *,
            deal_structure_parameters(*),
            deal_stipulations(*)
          )
        ),
        app_dt_references(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching application:', error);
      return null;
    }

    return this.transformToApplication(data);
  }

  /**
   * Add note to application
   */
  static async addNote(applicationId: string, note: Omit<Note, 'id'>): Promise<void> {
    const { error } = await supabase
      .from('application_notes')
      .insert({
        application_id: applicationId,
        content: note.content,
        author: note.user,
        date: new Date().toISOString(),
      });

    if (error) {
      console.error('Error adding note:', error);
      toast.error('Failed to add note');
      throw error;
    }

    await this.addHistory(applicationId, 'Note Added', `Note by ${note.user}`);
    toast.success('Note added successfully');
  }

  /**
   * Update application status
   */
  static async updateStatus(applicationId: string, newStatus: string, userName: string): Promise<void> {
    const { error } = await supabase
      .from('applications')
      .update({ 
        status: newStatus as any,
        updated_at: new Date().toISOString()
      })
      .eq('id', applicationId);

    if (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
      throw error;
    }

    await this.addHistory(applicationId, 'Status Changed', `Status updated to ${newStatus}`);
  }

  /**
   * Add history entry
   */
  private static async addHistory(applicationId: string, action: string, description: string): Promise<void> {
    const { data: userData } = await supabase.auth.getUser();
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('email')
      .eq('user_id', userData?.user?.id)
      .single();

    const userName = profile?.email || 'System';

    await supabase
      .from('application_history')
      .insert({
        application_id: applicationId,
        action,
        description,
        user_name: userName,
        date: new Date().toISOString(),
      });
  }

  /**
   * Transform database records to Application type
   */
  private static transformToApplications(records: any[]): Application[] {
    return records.map(record => this.transformToApplication(record));
  }

  private static transformToApplication(record: any): Application {
    const notesArray = (record.application_notes || [])
      .map((note: any) => ({
        content: note.content,
        user: note.author || 'System',
        date: new Date(note.date).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        }),
        time: new Date(note.date).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
      }))
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const appDetails = record.application_details?.[0];

    return {
      id: record.id,
      orderNumber: appDetails?.order_number || 'N/A',
      name: record.name,
      status: record.status as Application['status'],
      type: record.type as Application['type'],
      date: record.date,
      state: record.state,
      country: record.country || 'US',
      notesArray,
      notes: notesArray[0]?.content || '',
      reapplyEnabled: record.reapply_enabled,
      reapplicationSequence: record.reapplication_sequence,
      originalApplicationId: record.original_application_id,
      parentApplicationId: record.parent_application_id,
      model: appDetails?.model || '',
      edition: appDetails?.edition || '',
      orderedBy: appDetails?.ordered_by || '',
    } as any;
  }
}
