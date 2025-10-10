import { supabase } from '@/integrations/supabase/client';

// Generate Lucid vehicle data for an application
function generateVehicleData(applicationId: string) {
  const years = ['2025', '2026'];
  const models = ['Air', 'Gravity'];
  const trims = ['Pure', 'Grand Touring', 'Touring'];
  
  const year = years[Math.floor(Math.random() * years.length)];
  const model = models[Math.floor(Math.random() * models.length)];
  const trim = trims[Math.floor(Math.random() * trims.length)];
  
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

export async function populateVehicleData() {
  console.log('🚗 Starting vehicle data population...');
  
  try {
    // Fetch all applications
    const { data: applications, error: fetchError } = await supabase
      .from('applications')
      .select('id');
    
    if (fetchError) {
      console.error('Error fetching applications:', fetchError);
      throw fetchError;
    }
    
    if (!applications || applications.length === 0) {
      console.log('No applications found');
      return { success: false, message: 'No applications found' };
    }
    
    console.log(`📦 Found ${applications.length} applications`);
    
    // Check which applications already have vehicle data
    const { data: existingVehicleData } = await supabase
      .from('vehicle_data')
      .select('application_id');
    
    const existingAppIds = new Set(existingVehicleData?.map(v => v.application_id) || []);
    const applicationsToPopulate = applications.filter(app => !existingAppIds.has(app.id));
    
    console.log(`✨ Need to populate ${applicationsToPopulate.length} applications`);
    
    if (applicationsToPopulate.length === 0) {
      return { success: true, message: 'All applications already have vehicle data' };
    }
    
    // Generate and insert vehicle data for each application
    const vehicleDataToInsert = applicationsToPopulate.map(app => 
      generateVehicleData(app.id)
    );
    
    const { error: insertError } = await supabase
      .from('vehicle_data')
      .insert(vehicleDataToInsert);
    
    if (insertError) {
      console.error('Error inserting vehicle data:', insertError);
      throw insertError;
    }
    
    console.log(`✅ Successfully populated ${applicationsToPopulate.length} vehicle records`);
    
    return {
      success: true,
      message: `Successfully populated ${applicationsToPopulate.length} Lucid vehicle records`,
      count: applicationsToPopulate.length
    };
    
  } catch (error) {
    console.error('Failed to populate vehicle data:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}
