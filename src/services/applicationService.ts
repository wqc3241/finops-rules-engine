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
    const appDetails = record.application_details?.[0];
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

    // Transform applicant info
    const applicantInfo = record.applicant_info?.[0] ? {
      firstName: record.applicant_info[0].first_name,
      middleName: record.applicant_info[0].middle_name,
      lastName: record.applicant_info[0].last_name,
      email: record.applicant_info[0].email_address,
      phone: record.applicant_info[0].contact_number,
      dateOfBirth: record.applicant_info[0].dob,
      address: {
        street: record.applicant_info[0].address,
        city: record.applicant_info[0].city,
        state: record.applicant_info[0].state,
        zipCode: record.applicant_info[0].zip_code,
      },
      employment: {
        type: record.applicant_info[0].employment_type,
        employer: record.applicant_info[0].employer_name,
        title: record.applicant_info[0].job_title,
        income: parseFloat(record.applicant_info[0].income_amount || '0'),
      },
      housing: {
        type: record.applicant_info[0].residence_type,
        payment: parseFloat(record.applicant_info[0].housing_payment_amount || '0'),
      },
    } : undefined;

    // Transform deal structure
    const dealStructure = record.deal_structures?.[0]?.deal_structure_offers?.map((offer: any) => ({
      lenderName: offer.lender_name,
      status: offer.status,
      decision: offer.decision,
      requested: offer.deal_structure_parameters
        ?.filter((p: any) => p.parameter_key.startsWith('requested_'))
        .map((p: any) => ({
          name: p.parameter_key.replace('requested_', ''),
          label: p.parameter_key.replace('requested_', '').replace(/_/g, ' '),
          value: p.parameter_value,
        })) || [],
      approved: offer.deal_structure_parameters
        ?.filter((p: any) => p.parameter_key.startsWith('approved_'))
        .map((p: any) => ({
          name: p.parameter_key.replace('approved_', ''),
          label: p.parameter_key.replace('approved_', '').replace(/_/g, ' '),
          value: p.parameter_value,
        })) || [],
      stipulations: offer.deal_stipulations?.map((s: any) => s.description) || [],
      contractStatus: offer.status === 'approved' ? 'Contract Ready' : 'Application Under Review',
    })) || [];

    // Transform history
    const history = record.application_history?.map((h: any) => ({
      date: new Date(h.date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
      time: new Date(h.date).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      }),
      action: h.action,
      description: h.description,
      user: h.user_name || 'System',
    })) || [];

    return {
      id: record.id,
      orderNumber: appDetails?.order_number || 'N/A',
      name: record.name,
      status: record.status as Application['status'],
      type: record.type as Application['type'],
      date: record.date,
      state: record.state,
      country: record.country || 'US',
      amount: record.amount ? parseFloat(record.amount) : undefined,
      notesArray,
      notes: notesArray[0]?.content || '',
      reapplyEnabled: record.reapply_enabled,
      reapplicationSequence: record.reapplication_sequence,
      originalApplicationId: record.original_application_id,
      parentApplicationId: record.parent_application_id,
      model: appDetails?.model || '',
      edition: appDetails?.edition || '',
      orderedBy: appDetails?.ordered_by || '',
      applicantInfo,
      dealStructure,
      history,
    } as any;
  }
}
