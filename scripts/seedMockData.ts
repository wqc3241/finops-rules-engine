import { supabase } from '@/integrations/supabase/client';
import { applications } from '@/data/mock/applicationsData';

// Generate deterministic UUID based on mock ID format
function generateUUID(mockId: string): string {
  // Use UUID v5 (name-based) with a custom namespace
  const namespace = '6ba7b810-9dad-11d1-80b4-00c04fd430c8'; // ISO OID namespace
  return generateUUIDv5(namespace, mockId);
}

// Simple UUID v5 implementation
function generateUUIDv5(namespace: string, name: string): string {
  const crypto = window.crypto || (window as any).msCrypto;
  const data = namespace + name;
  const hash = Array.from(data).reduce((hash, char) => {
    return ((hash << 5) - hash) + char.charCodeAt(0);
  }, 0);
  
  // Generate a deterministic UUID from the hash
  const hex = Math.abs(hash).toString(16).padStart(32, '0').slice(0, 32);
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-5${hex.slice(13, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

// Store mapping of original IDs to generated UUIDs
const idMap = new Map<string, string>();

// Helper function to generate applicant info from application name
function generateApplicantInfo(fullName: string, appState: string, isCoApplicant: boolean = false) {
  const nameParts = fullName.trim().split(' ');
  const firstName = nameParts[0] || 'Unknown';
  const lastName = nameParts[nameParts.length - 1] || 'Customer';
  const middleName = nameParts.length > 2 ? nameParts.slice(1, -1).join(' ') : '';
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
  
  const randomPhone = `(555) ${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`;
  const randomIncome = Math.floor(Math.random() * 5000 + 5000); // $5,000 - $10,000 monthly
  const randomRent = Math.floor(Math.random() * 2000 + 1000); // $1,000 - $3,000 monthly
  
  return {
    first_name: firstName,
    middle_name: middleName,
    last_name: lastName,
    email_address: email,
    contact_number: randomPhone,
    dob: '01/01/1985',
    address: '123 Main Street',
    city: appState === 'CA' ? 'San Francisco' : (appState === 'TX' ? 'Austin' : 'New York'),
    state: appState || 'CA',
    zip_code: appState === 'CA' ? '94102' : (appState === 'TX' ? '73301' : '10001'),
    residence_type: 'Rent',
    housing_payment_amount: `$${randomRent.toLocaleString()}.00`,
    employment_type: 'Full-time',
    employer_name: 'Tech Company Inc.',
    job_title: 'Professional',
    income_amount: `$${randomIncome.toLocaleString()}.00`,
    other_source_of_income: '',
    other_income_amount: '$0.00',
    relationship: isCoApplicant ? 'Spouse' : 'Self',
    is_co_applicant: isCoApplicant
  };
}

// Generate Lucid vehicle data for an application
function generateVehicleData(applicationId: string) {
  const years = ['2025', '2026'];
  const models = ['Air', 'Gravity'];
  const trims = ['Pure', 'Grand Touring', 'Touring'];
  
  const year = years[Math.floor(Math.random() * years.length)];
  const model = models[Math.floor(Math.random() * models.length)];
  const trim = trims[Math.floor(Math.random() * trims.length)];
  const mileage = Math.floor(Math.random() * 500); // 0-499 miles
  
  // Generate realistic VIN for Lucid (starts with 5YJ)
  const vinSuffix = Math.random().toString(36).substring(2, 11).toUpperCase();
  const vin = `5YJ${vinSuffix}${Math.floor(Math.random() * 100000)}`;
  
  // Generate realistic pricing based on model and trim
  let baseMsrp = 0;
  if (model === 'Air') {
    baseMsrp = trim === 'Pure' ? 69900 : trim === 'Touring' ? 87400 : 109900;
  } else { // Gravity
    baseMsrp = trim === 'Pure' ? 79900 : trim === 'Touring' ? 94900 : 109900;
  }
  
  const discountAmount = Math.floor(Math.random() * 10000) + 5000; // $5,000-$15,000
  const gccCashPrice = baseMsrp - discountAmount;
  
  const discounts = [
    'Studio Unit',
    'Referral Discount',
    'Early Adopter',
    'Loyalty Program',
    'On-site Discount'
  ];
  const applicableDiscounts = discounts
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.floor(Math.random() * 3) + 1)
    .join(', ');
  
  return {
    application_id: applicationId,
    vin: vin,
    year: year,
    model: model,
    trim: trim,
    msrp: `$${baseMsrp.toLocaleString()}.00`,
    gcc_cash_price: `$${gccCashPrice.toLocaleString()}.00`,
    applicable_discounts: applicableDiscounts,
    total_discount_amount: `$${discountAmount.toLocaleString()}.00`
  };
}

async function migrateApplication(app: any) {
  // Generate UUID for this application based on its original ID
  const newUUID = generateUUID(app.id);
  idMap.set(app.id, newUUID);
  // Map status to valid enum values
  const statusMap: Record<string, string> = {
    'Void': 'Declined',
    'Voided': 'Declined'
  };
  
  const mappedStatus = statusMap[app.status] || app.status;

  // Insert main application with generated UUID
  const { data: appData, error: appError } = await supabase
    .from('applications')
    .insert([{
      id: newUUID,
      name: app.name,
      status: mappedStatus as any,
      type: app.type as any,
      date: app.date,
      state: app.state,
      country: app.country || 'US',
      amount: app.amount,
      reapply_enabled: app.reapplyEnabled,
      reapplication_sequence: app.reapplicationSequence,
      original_application_id: app.originalApplicationId ? idMap.get(app.originalApplicationId) : null,
      parent_application_id: app.parentApplicationId ? idMap.get(app.parentApplicationId) : null,
    }])
    .select()
    .single();

  if (appError) {
    console.error(`Error inserting application ${app.name}:`, appError);
    throw appError;
  }

  // Insert application details
  if (app.orderNumber || app.model || app.edition || app.orderedBy) {
    const { error: detailsError } = await supabase.from('application_details').insert({
      application_id: newUUID,
      order_number: app.orderNumber,
      model: app.model,
      edition: app.edition,
      ordered_by: app.orderedBy,
    });
    if (detailsError) console.error(`Error inserting application_details for ${app.name}:`, detailsError);
  }

  // Always generate and insert primary applicant info
  const primaryApplicant = generateApplicantInfo(app.name, app.state || 'CA', false);
  const { error: applicantError } = await supabase.from('applicant_info').insert({
    application_id: newUUID,
    ...primaryApplicant
  });
  if (applicantError) console.error(`Error inserting applicant_info for ${app.name}:`, applicantError);

  // Generate co-applicant for approximately 30% of applications
  if (Math.random() > 0.7) {
    const nameParts = app.name.split(' ');
    const coApplicantName = nameParts.length > 1 
      ? `${nameParts[nameParts.length - 1]} Co-Applicant` 
      : `${app.name} Spouse`;
    
    const coApplicant = generateApplicantInfo(coApplicantName, app.state || 'CA', true);
    const { error: coApplicantError } = await supabase.from('applicant_info').insert({
      application_id: newUUID,
      ...coApplicant
    });
    if (coApplicantError) console.error(`Error inserting co-applicant_info for ${app.name}:`, coApplicantError);
  }

  // Always insert vehicle data with Lucid specifications
  const vehicleData = generateVehicleData(newUUID);
  const { error: vehicleError } = await supabase.from('vehicle_data').insert(vehicleData);
  if (vehicleError) console.error(`Error inserting vehicle_data for ${app.name}:`, vehicleError);

  // Insert app DT references
  if (app.appDtReferences) {
    await supabase.from('app_dt_references').insert({
      application_id: newUUID,
      dt_portal_state: app.appDtReferences.dtPortalState,
      dt_id: app.appDtReferences.dtId,
      application_date: app.appDtReferences.applicationDate,
    });
  }

  // Insert order details
  await supabase.from('order_details').insert({
    application_id: newUUID,
    delivery_date: '2024-12-15',
    vehicle_trade_in_year: '2018',
    vehicle_trade_in_make: 'Tesla',
    vehicle_trade_in_model: 'Model 3',
    vehicle_trade_in_trim: 'Base',
    vehicle_trade_in_mileage: '45000',
    vehicle_trade_in_value: '$50,000',
    vehicle_trade_in_lien_holder: 'Bank of America',
    vehicle_trade_in_payoff_amount: '$35,000',
    sale_data: {
      invoiceSummary: {
        model: 'Air',
        trim: 'Touring',
        options: [
          { name: 'Premium Package', price: '$10,000.00' },
          { name: 'Extended Warranty', price: '$2,000.00' },
          { name: 'Paint Protection', price: '$5,500.00' },
          { name: 'Wheel Upgrade', price: '$3,200.00' },
        ],
        discounts: [
          { name: 'Studio Unit', value: '$2,000.00' },
          { name: 'January Program', value: '$1,500.00' },
        ],
        subTotal: '$113,700.00'
      },
      credits: {
        items: [
          { name: 'Referral', value: '$2,000.00' },
          { name: 'Deposit', value: '$1,000.00' },
        ],
        subTotal: '$3,000.00'
      },
      taxesAndFees: {
        salesTax: { rate: '10%', amount: '$11,370.00' },
        registrationFees: { type: 'DMV', amount: '$500.00' },
        otherFees: { type: 'FL Doc Stamp', amount: '$12.00' },
        total: '$11,882.00'
      },
      amountFinanced: '$100,000.00',
      totalDueAtDelivery: '$22,582.00',
      invoiceSummaryDetails: Array(15).fill(null).map((_, i) => ({ 
        label: `Item ${i + 1}`, 
        subLabel: 'Detail', 
        value: `$${(Math.random() * 5000).toFixed(2)}` 
      }))
    },
    registration_data: [
      { label: 'Registration Type', value: 'Personal' },
      { label: 'Global Region', value: 'North America' },
      { label: 'Registration Country', value: 'United States' },
      { label: 'Registration State/Province', value: app.state || 'California' },
      { label: 'Registration Street', value: '1000 Pine Tree Ln' },
      { label: 'Registration City', value: 'San Francisco' },
      { label: 'Registration Zip/Postal Code', value: '94107' },
      { label: 'Borough/Municipality', value: '' },
      { label: 'Buyer DOB', value: '8/20/1975' },
      { label: "Buyer's DL Expiration Date", value: '8/20/2026' },
      { label: 'Is Mailing Add different than Regis Add?', value: 'No' }
    ]
  });

  // Insert notes
  if (app.notesArray && app.notesArray.length > 0) {
    await supabase.from('application_notes').insert(
      app.notesArray.map((note: any) => ({
        application_id: newUUID,
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
      .insert({ application_id: newUUID })
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

  // Insert history - convert notesArray to history if history doesn't exist
  const historyData = app.history || (app.notesArray ? app.notesArray.map((note: any) => ({
    action: 'Note Added',
    title: note.content,
    user: note.user,
    date: note.date,
    time: note.time
  })) : []);
  
  if (historyData && historyData.length > 0) {
    const { error: historyError } = await supabase.from('application_history').insert(
      historyData.map((h: any) => ({
        application_id: newUUID,
        action: h.title || h.action || 'Note Added',
        description: h.title || h.content || '',
        user_name: h.user || 'System',
        date: h.date ? new Date(`${h.date} ${h.time || '12:00'}`).toISOString() : new Date().toISOString(),
      }))
    );
    if (historyError) console.error(`Error inserting application_history for ${app.name}:`, historyError);
  }
}

export async function seedMockData() {
  console.log('🌱 Starting mock data seeding to Supabase...');
  console.log(`📦 Found ${applications.length} mock applications to seed`);
  
  // Pre-generate all UUIDs to handle relationships
  applications.forEach(app => {
    const uuid = generateUUID(app.id);
    idMap.set(app.id, uuid);
  });
  
  console.log('✅ Generated UUIDs for all applications');

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
