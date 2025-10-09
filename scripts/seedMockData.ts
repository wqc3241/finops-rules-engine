import { supabase } from '@/integrations/supabase/client';
import { applications } from '@/data/mock/applicationsData';

async function migrateApplication(app: any) {
  // Insert main application
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
      amount: app.amount,
      reapply_enabled: app.reapplyEnabled,
      reapplication_sequence: app.reapplicationSequence,
      original_application_id: app.originalApplicationId,
      parent_application_id: app.parentApplicationId,
    }])
    .select()
    .single();

  if (appError) throw appError;

  // Insert application details
  if (app.orderNumber || app.model || app.edition || app.orderedBy) {
    await supabase.from('application_details').insert({
      application_id: app.id,
      order_number: app.orderNumber,
      model: app.model,
      edition: app.edition,
      ordered_by: app.orderedBy,
    });
  }

  // Insert applicant info (primary)
  if (app.applicantInfo) {
    await supabase.from('applicant_info').insert({
      application_id: app.id,
      is_co_applicant: false,
      first_name: app.applicantInfo.firstName,
      middle_name: app.applicantInfo.middleName,
      last_name: app.applicantInfo.lastName,
      email_address: app.applicantInfo.emailAddress,
      contact_number: app.applicantInfo.contactNumber,
      dob: app.applicantInfo.dob,
      address: app.applicantInfo.address,
      city: app.applicantInfo.city,
      state: app.applicantInfo.state,
      zip_code: app.applicantInfo.zipCode,
      residence_type: app.applicantInfo.residenceType,
      housing_payment_amount: app.applicantInfo.housingPaymentAmount,
      employment_type: app.applicantInfo.employmentType,
      employer_name: app.applicantInfo.employerName,
      job_title: app.applicantInfo.jobTitle,
      income_amount: app.applicantInfo.incomeAmount,
      other_source_of_income: app.applicantInfo.otherSourceOfIncome,
      other_income_amount: app.applicantInfo.otherIncomeAmount,
      relationship: app.applicantInfo.relationship,
    });
  }

  // Insert co-applicant info
  if (app.coApplicantInfo) {
    await supabase.from('applicant_info').insert({
      application_id: app.id,
      is_co_applicant: true,
      first_name: app.coApplicantInfo.firstName,
      middle_name: app.coApplicantInfo.middleName,
      last_name: app.coApplicantInfo.lastName,
      email_address: app.coApplicantInfo.emailAddress,
      contact_number: app.coApplicantInfo.contactNumber,
      dob: app.coApplicantInfo.dob,
      address: app.coApplicantInfo.address,
      city: app.coApplicantInfo.city,
      state: app.coApplicantInfo.state,
      zip_code: app.coApplicantInfo.zipCode,
      residence_type: app.coApplicantInfo.residenceType,
      housing_payment_amount: app.coApplicantInfo.housingPaymentAmount,
      employment_type: app.coApplicantInfo.employmentType,
      employer_name: app.coApplicantInfo.employerName,
      job_title: app.coApplicantInfo.jobTitle,
      income_amount: app.coApplicantInfo.incomeAmount,
      other_source_of_income: app.coApplicantInfo.otherSourceOfIncome,
      other_income_amount: app.coApplicantInfo.otherIncomeAmount,
      relationship: app.coApplicantInfo.relationship,
    });
  }

  // Insert vehicle data
  if (app.vehicleData) {
    await supabase.from('vehicle_data').insert({
      application_id: app.id,
      vin: app.vehicleData.vin,
      year: app.vehicleData.year,
      model: app.vehicleData.model,
      trim: app.vehicleData.trim,
      msrp: app.vehicleData.msrp,
      gcc_cash_price: app.vehicleData.gccCashPrice,
      applicable_discounts: app.vehicleData.applicableDiscounts,
      total_discount_amount: app.vehicleData.totalDiscountAmount,
    });
  }

  // Insert app DT references
  if (app.appDtReferences) {
    await supabase.from('app_dt_references').insert({
      application_id: app.id,
      dt_portal_state: app.appDtReferences.dtPortalState,
      dt_id: app.appDtReferences.dtId,
      application_date: app.appDtReferences.applicationDate,
    });
  }

  // Insert notes
  if (app.notesArray && app.notesArray.length > 0) {
    await supabase.from('application_notes').insert(
      app.notesArray.map((note: any) => ({
        application_id: app.id,
        content: note.content,
        author: note.user,
        date: new Date().toISOString(),
      }))
    );
  }

  // Insert deal structure
  if (app.dealStructure && app.dealStructure.length > 0) {
    const { data: dealStructureData } = await supabase
      .from('deal_structures')
      .insert({ application_id: app.id })
      .select()
      .single();

    if (dealStructureData) {
      for (const offer of app.dealStructure) {
        const { data: offerData } = await supabase
          .from('deal_structure_offers')
          .insert({
            deal_structure_id: dealStructureData.id,
            lender_name: offer.lenderName,
            status: offer.status || 'requested',
            decision: offer.contractStatus,
          })
          .select()
          .single();

        if (offerData) {
          // Insert requested parameters
          if (offer.requested && offer.requested.length > 0) {
            await supabase.from('deal_structure_parameters').insert(
              offer.requested.map((p: any) => ({
                deal_offer_id: offerData.id,
                parameter_key: `requested_${p.name}`,
                parameter_value: p.value,
              }))
            );
          }

          // Insert approved parameters
          if (offer.approved && offer.approved.length > 0) {
            await supabase.from('deal_structure_parameters').insert(
              offer.approved.map((p: any) => ({
                deal_offer_id: offerData.id,
                parameter_key: `approved_${p.name}`,
                parameter_value: p.value,
              }))
            );
          }

          // Insert customer parameters
          if (offer.customer && offer.customer.length > 0) {
            await supabase.from('deal_structure_parameters').insert(
              offer.customer.map((p: any) => ({
                deal_offer_id: offerData.id,
                parameter_key: `customer_${p.name}`,
                parameter_value: p.value,
              }))
            );
          }

          // Insert stipulations
          if (offer.stipulations && offer.stipulations.length > 0) {
            await supabase.from('deal_stipulations').insert(
              offer.stipulations.map((s: any) => ({
                deal_offer_id: offerData.id,
                description: typeof s === 'string' ? s : `${s.requestedDocument} - ${s.status}`,
              }))
            );
          }
        }
      }
    }
  }

  // Insert history
  if (app.history && app.history.length > 0) {
    await supabase.from('application_history').insert(
      app.history.map((h: any) => ({
        application_id: app.id,
        action: h.title || h.action || 'Update',
        description: h.title || '',
        user_name: h.user || 'System',
        date: h.date ? new Date(`${h.date} ${h.time || '12:00'}`).toISOString() : new Date().toISOString(),
      }))
    );
  }
}

export async function seedMockData() {
  console.log('🌱 Starting mock data seeding to Supabase...');
  console.log(`📦 Found ${applications.length} mock applications to seed`);

  let successCount = 0;
  let errorCount = 0;

  for (const app of applications) {
    try {
      await migrateApplication(app);
      successCount++;
      console.log(`✅ Seeded: ${app.name} (${app.orderNumber || app.id})`);
    } catch (error) {
      errorCount++;
      console.error(`❌ Failed to seed ${app.name}:`, error);
    }
  }

  console.log(`🎉 Mock data seeding completed!`);
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${errorCount}`);
}
