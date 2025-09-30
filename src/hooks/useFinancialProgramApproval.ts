import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useSupabaseAuth';
import { toast } from 'sonner';
import { WizardData } from '@/components/dashboard/FinancialProgramWizard';

export const useFinancialProgramApproval = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const submitProgramForApproval = async (
    programData: WizardData,
    programCode: string,
    isEdit = false,
    existingProgramId?: string
  ) => {
    if (!user) {
      toast.error('You must be logged in to submit programs for approval');
      return { success: false };
    }

    setIsSubmitting(true);
    try {
      console.log('📝 Submitting financial program for approval:', programCode);

      // Create change request
      const changeRequestId = crypto.randomUUID();
      const { error: changeRequestError } = await supabase
        .from('change_requests')
        .insert({
          id: changeRequestId,
          created_by: user.id,
          status: 'IN_REVIEW',
          version_id: programCode,
          table_schema_ids: ['financial_program_configs'],
          comment: isEdit 
            ? `Financial program configuration update: ${programCode}`
            : `New financial program configuration: ${programCode}`
        });

      if (changeRequestError) {
        console.error('❌ Error creating change request:', changeRequestError);
        throw changeRequestError;
      }

      // Prepare program data for pending table
      const pendingProgramData = {
        request_id: changeRequestId,
        program_code: programCode,
        vehicle_style_id: programData.vehicleStyleIds[0] || '',
        financing_vehicle_condition: programData.vehicleCondition,
        financial_product_id: programData.financialProduct,
        program_start_date: programData.programStartDate,
        program_end_date: programData.programEndDate,
        is_active: 'Y',
        advertised: 'N',
        order_types: programData.orderTypes.join(', '),
        template_metadata: {
          pricingTypes: programData.pricingTypes,
          pricingTypeConfigs: programData.pricingTypeConfigs,
          lenders: programData.lenders,
          geoCodes: programData.geoCodes
        },
        created_by: user.id
      };

      // Insert into pending table
      const { error: pendingInsertError } = await supabase
        .from('pending_financial_program_configs')
        .insert(pendingProgramData);

      if (pendingInsertError) {
        console.error('❌ Error inserting pending program config:', pendingInsertError);
        throw pendingInsertError;
      }

      // Create change detail
      const changeDetail = {
        request_id: changeRequestId,
        table_name: 'financial_program_configs',
        rule_key: programCode,
        old_value: isEdit && existingProgramId ? { id: existingProgramId } : null,
        new_value: pendingProgramData,
        status: 'PENDING' as const
      };

      const { error: changeDetailError } = await supabase
        .from('change_details')
        .insert(changeDetail);

      if (changeDetailError) {
        console.error('❌ Error creating change detail:', changeDetailError);
        throw changeDetailError;
      }

      // Lock the financial_program_configs table
      const { error: lockError } = await supabase
        .from('table_locks')
        .insert({
          schema_id: 'financial_program_configs',
          locked_by: user.id,
          request_id: changeRequestId
        });

      if (lockError) {
        console.error('⚠️ Warning: Could not lock table:', lockError);
        // Don't throw here as it's not critical
      }

      console.log('✅ Successfully submitted financial program for approval');
      toast.success(
        isEdit 
          ? 'Program updates submitted for approval' 
          : 'New program submitted for approval'
      );

      return { success: true, changeRequestId };

    } catch (error) {
      console.error('❌ Error submitting program for approval:', error);
      toast.error('Failed to submit program for approval');
      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitProgramForApproval,
    isSubmitting
  };
};