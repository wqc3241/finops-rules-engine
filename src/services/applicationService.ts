import { supabase } from '@/integrations/supabase/client';
import { Application, Note } from '@/types/application';
import { toast } from 'sonner';
import { retryOperation, handleSupabaseError } from '@/utils/errorHandling';
import { Analytics } from '@/utils/analytics';

export class ApplicationService {
  /**
   * Fetch all applications for the current user's country
   */
  static async fetchApplications(countryCode: string = 'US'): Promise<Application[]> {
    const startTime = Date.now();
    try {
      return await retryOperation(async () => {
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

        if (error) throw error;

        const result = this.transformToApplications(data || []);
        
        Analytics.trackEvent('applications_fetched', {
          count: result.length,
          duration: Date.now() - startTime,
          country: countryCode,
        });
        
        return result;
      }, 3, 1000);
    } catch (error) {
      Analytics.trackError(error as Error, 'fetchApplications');
      handleSupabaseError(error, 'Fetch applications');
      throw error;
    }
  }

  /**
   * Fetch single application by ID
   */
  static async fetchApplicationById(id: string): Promise<Application | null> {
    const startTime = Date.now();
    try {
      return await retryOperation(async () => {
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
            app_dt_references(*),
            vehicle_data(*),
            order_details(*),
            financial_summaries(*)
          `)
          .eq('id', id)
          .single();

        if (error) throw error;

        const result = data ? this.transformToApplication(data) : null;
        
        if (result) {
          Analytics.trackApplicationView(id);
          Analytics.trackEvent('application_detail_loaded', {
            duration: Date.now() - startTime,
          });
        }
        
        return result;
      }, 3, 1000);
    } catch (error) {
      Analytics.trackError(error as Error, 'fetchApplicationById');
      handleSupabaseError(error, 'Fetch application');
      return null;
    }
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
    const toastId = toast.loading('Updating status...');
    
    try {
      const { error } = await supabase
        .from('applications')
        .update({ 
          status: newStatus as any,
          updated_at: new Date().toISOString()
        })
        .eq('id', applicationId);

      if (error) throw error;

      await this.addHistory(applicationId, 'Status Changed', `Status updated to ${newStatus}`);
      
      toast.success('Status updated successfully', { id: toastId });
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status', { id: toastId });
      throw error;
    }
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

    // Transform primary applicant info
    const applicantInfo = record.applicant_info?.find((info: any) => !info.is_co_applicant) 
      ? {
          relationship: record.applicant_info.find((i: any) => !i.is_co_applicant)?.relationship,
          firstName: record.applicant_info.find((i: any) => !i.is_co_applicant)?.first_name,
          middleName: record.applicant_info.find((i: any) => !i.is_co_applicant)?.middle_name,
          lastName: record.applicant_info.find((i: any) => !i.is_co_applicant)?.last_name,
          emailAddress: record.applicant_info.find((i: any) => !i.is_co_applicant)?.email_address,
          contactNumber: record.applicant_info.find((i: any) => !i.is_co_applicant)?.contact_number,
          dob: record.applicant_info.find((i: any) => !i.is_co_applicant)?.dob,
          residenceType: record.applicant_info.find((i: any) => !i.is_co_applicant)?.residence_type,
          housingPaymentAmount: record.applicant_info.find((i: any) => !i.is_co_applicant)?.housing_payment_amount,
          address: record.applicant_info.find((i: any) => !i.is_co_applicant)?.address,
          city: record.applicant_info.find((i: any) => !i.is_co_applicant)?.city,
          state: record.applicant_info.find((i: any) => !i.is_co_applicant)?.state,
          zipCode: record.applicant_info.find((i: any) => !i.is_co_applicant)?.zip_code,
          employmentType: record.applicant_info.find((i: any) => !i.is_co_applicant)?.employment_type,
          employerName: record.applicant_info.find((i: any) => !i.is_co_applicant)?.employer_name,
          jobTitle: record.applicant_info.find((i: any) => !i.is_co_applicant)?.job_title,
          incomeAmount: record.applicant_info.find((i: any) => !i.is_co_applicant)?.income_amount,
          otherSourceOfIncome: record.applicant_info.find((i: any) => !i.is_co_applicant)?.other_source_of_income,
          otherIncomeAmount: record.applicant_info.find((i: any) => !i.is_co_applicant)?.other_income_amount,
        } 
      : undefined;

    // Transform co-applicant info
    const coApplicantInfo = record.applicant_info?.find((info: any) => info.is_co_applicant)
      ? {
          relationship: record.applicant_info.find((i: any) => i.is_co_applicant)?.relationship,
          firstName: record.applicant_info.find((i: any) => i.is_co_applicant)?.first_name,
          middleName: record.applicant_info.find((i: any) => i.is_co_applicant)?.middle_name,
          lastName: record.applicant_info.find((i: any) => i.is_co_applicant)?.last_name,
          emailAddress: record.applicant_info.find((i: any) => i.is_co_applicant)?.email_address,
          contactNumber: record.applicant_info.find((i: any) => i.is_co_applicant)?.contact_number,
          dob: record.applicant_info.find((i: any) => i.is_co_applicant)?.dob,
          residenceType: record.applicant_info.find((i: any) => i.is_co_applicant)?.residence_type,
          housingPaymentAmount: record.applicant_info.find((i: any) => i.is_co_applicant)?.housing_payment_amount,
          address: record.applicant_info.find((i: any) => i.is_co_applicant)?.address,
          city: record.applicant_info.find((i: any) => i.is_co_applicant)?.city,
          state: record.applicant_info.find((i: any) => i.is_co_applicant)?.state,
          zipCode: record.applicant_info.find((i: any) => i.is_co_applicant)?.zip_code,
          employmentType: record.applicant_info.find((i: any) => i.is_co_applicant)?.employment_type,
          employerName: record.applicant_info.find((i: any) => i.is_co_applicant)?.employer_name,
          jobTitle: record.applicant_info.find((i: any) => i.is_co_applicant)?.job_title,
          incomeAmount: record.applicant_info.find((i: any) => i.is_co_applicant)?.income_amount,
          otherSourceOfIncome: record.applicant_info.find((i: any) => i.is_co_applicant)?.other_source_of_income,
          otherIncomeAmount: record.applicant_info.find((i: any) => i.is_co_applicant)?.other_income_amount,
        }
      : undefined;

    // Transform vehicle data
    const vehicleData = record.vehicle_data?.[0] ? {
      vin: record.vehicle_data[0].vin,
      year: record.vehicle_data[0].year,
      make: record.vehicle_data[0].make,
      model: record.vehicle_data[0].model,
      trim: record.vehicle_data[0].trim,
      mileage: record.vehicle_data[0].mileage,
      condition: record.vehicle_data[0].condition,
      exteriorColor: record.vehicle_data[0].exterior_color,
      interiorColor: record.vehicle_data[0].interior_color,
    } : undefined;

    // Transform DT references
    const appDtReferences = record.app_dt_references?.[0] ? {
      dtId: record.app_dt_references[0].dt_id,
      dtPortalState: record.app_dt_references[0].dt_portal_state,
      applicationDate: record.app_dt_references[0].application_date,
    } : undefined;

    // Transform order details
    const orderDetails = record.order_details?.[0] ? {
      vehiclePrice: parseFloat(record.order_details[0].vehicle_price || '0'),
      downPayment: parseFloat(record.order_details[0].down_payment || '0'),
      tradeInValue: parseFloat(record.order_details[0].trade_in_value || '0'),
      tradeInPayoff: parseFloat(record.order_details[0].trade_in_payoff || '0'),
      taxesAndFees: parseFloat(record.order_details[0].taxes_and_fees || '0'),
      totalAmount: parseFloat(record.order_details[0].total_amount || '0'),
    } : undefined;

    // Transform financial summary
    const financialSummary = record.financial_summary?.[0] ? {
      loanAmount: parseFloat(record.financial_summary[0].loan_amount || '0'),
      interestRate: parseFloat(record.financial_summary[0].interest_rate || '0'),
      term: parseInt(record.financial_summary[0].term || '0'),
      monthlyPayment: parseFloat(record.financial_summary[0].monthly_payment || '0'),
      totalInterest: parseFloat(record.financial_summary[0].total_interest || '0'),
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
      status: record.status,
      type: record.type,
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
      coApplicantInfo,
      vehicleData,
      appDtReferences,
      orderDetails,
      financialSummary,
      dealStructure,
      history,
    };
  }
}
