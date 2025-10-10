import { supabase } from '@/integrations/supabase/client';

// Helper functions to generate realistic data
const firstNames = ['John', 'Sarah', 'Michael', 'Emily', 'David', 'Jessica', 'James', 'Jennifer', 'Robert', 'Linda', 'William', 'Elizabeth', 'Richard', 'Maria', 'Joseph', 'Susan'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Wilson', 'Anderson', 'Taylor', 'Thomas', 'Moore', 'Jackson'];
const streets = ['Main St', 'Oak Ave', 'Maple Dr', 'Cedar Ln', 'Pine Rd', 'Washington Blvd', 'Park Ave', 'Elm St', 'Lake Dr', 'Hill Rd'];
const cities = [
  { city: 'Los Angeles', state: 'CA', zip: '90001' },
  { city: 'San Francisco', state: 'CA', zip: '94102' },
  { city: 'San Diego', state: 'CA', zip: '92101' },
  { city: 'Seattle', state: 'WA', zip: '98101' },
  { city: 'Portland', state: 'OR', zip: '97201' },
  { city: 'Phoenix', state: 'AZ', zip: '85001' },
  { city: 'Austin', state: 'TX', zip: '78701' },
  { city: 'Miami', state: 'FL', zip: '33101' },
  { city: 'New York', state: 'NY', zip: '10001' },
  { city: 'Boston', state: 'MA', zip: '02101' }
];
const employmentTypes = ['Full-time', 'Self-employed', 'Part-time', 'Contract'];
const residenceTypes = ['Own', 'Rent', 'Mortgage'];
const companies = ['Apple', 'Google', 'Microsoft', 'Tesla', 'Amazon', 'Meta', 'Netflix', 'Adobe', 'Salesforce', 'Oracle'];
const jobTitles = ['Software Engineer', 'Product Manager', 'Designer', 'Consultant', 'Director', 'Vice President', 'Manager', 'Analyst', 'Architect', 'Specialist'];

const tradeinMakes = ['Toyota', 'Honda', 'Tesla', 'BMW', 'Mercedes-Benz', 'Audi', 'Lexus', 'Porsche'];
const tradeinModels: Record<string, string[]> = {
  'Toyota': ['Camry', 'RAV4', 'Highlander', 'Prius'],
  'Honda': ['Accord', 'CR-V', 'Civic', 'Pilot'],
  'Tesla': ['Model S', 'Model 3', 'Model X', 'Model Y'],
  'BMW': ['3 Series', '5 Series', 'X3', 'X5'],
  'Mercedes-Benz': ['C-Class', 'E-Class', 'GLC', 'GLE'],
  'Audi': ['A4', 'A6', 'Q5', 'Q7'],
  'Lexus': ['ES', 'RX', 'NX', 'GX'],
  'Porsche': ['911', 'Cayenne', 'Macan', 'Taycan']
};

const random = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomAmount = (min: number, max: number) => `$${(Math.random() * (max - min) + min).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;

function generateApplicantInfo(applicationId: string, isCoApplicant: boolean) {
  const firstName = random(firstNames);
  const lastName = random(lastNames);
  const location = random(cities);
  const residenceType = random(residenceTypes);
  const employmentType = random(employmentTypes);
  
  const housingPayment = residenceType === 'Own' ? '$0.00' : randomAmount(1000, 3500);
  const income = randomAmount(50000, 150000);
  
  return {
    application_id: applicationId,
    is_co_applicant: isCoApplicant,
    relationship: isCoApplicant ? 'Spouse' : 'Self',
    first_name: firstName,
    middle_name: String.fromCharCode(65 + randomInt(0, 25)),
    last_name: lastName,
    email_address: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
    contact_number: `(${randomInt(200, 999)}) ${randomInt(200, 999)}-${randomInt(1000, 9999)}`,
    dob: `${randomInt(1, 12).toString().padStart(2, '0')}/${randomInt(1, 28).toString().padStart(2, '0')}/${randomInt(1960, 2000)}`,
    residence_type: residenceType,
    housing_payment_amount: housingPayment,
    address: `${randomInt(100, 9999)} ${random(streets)}`,
    city: location.city,
    state: location.state,
    zip_code: location.zip,
    employment_type: employmentType,
    employer_name: random(companies),
    job_title: random(jobTitles),
    income_amount: income,
    other_source_of_income: Math.random() > 0.5 ? 'Investment Income' : 'Rental Income',
    other_income_amount: randomAmount(5000, 25000)
  };
}

function generateOrderDetails(applicationId: string) {
  const hasTradeIn = Math.random() > 0.5;
  const make = random(tradeinMakes);
  const model = hasTradeIn ? random(tradeinModels[make]) : '';
  const tradeinValue = hasTradeIn ? parseFloat(randomAmount(15000, 50000).replace(/[$,]/g, '')) : 0;
  const payoffAmount = hasTradeIn ? tradeinValue * (Math.random() * 0.8) : 0;
  
  const msrp = randomInt(70000, 140000);
  const discounts = randomInt(2000, 8000);
  const subTotal = msrp - discounts;
  const salesTaxRate = 0.0725;
  const salesTax = subTotal * salesTaxRate;
  const regFees = randomInt(300, 800);
  const otherFees = randomInt(200, 500);
  const totalTaxesFees = salesTax + regFees + otherFees;
  const credits = tradeinValue - payoffAmount;
  const amountFinanced = subTotal + totalTaxesFees - credits;
  const dueAtDelivery = randomInt(5000, 15000);
  
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + randomInt(30, 90));
  
  return {
    application_id: applicationId,
    delivery_date: deliveryDate.toISOString().split('T')[0],
    vehicle_trade_in: {
      year: hasTradeIn ? randomInt(2015, 2023).toString() : '',
      make: make,
      model: model,
      trim: hasTradeIn ? 'Premium' : '',
      lienHolder: hasTradeIn && payoffAmount > 0 ? 'Chase Bank' : '',
      totalValue: `$${tradeinValue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`,
      payoffAmount: `$${payoffAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
    },
    sale: {
      invoiceSummary: {
        model: 'Lucid Air',
        trim: 'Grand Touring',
        options: [
          { name: 'Premium Paint', price: `$${randomInt(1000, 3000)}` },
          { name: 'Enhanced Interior', price: `$${randomInt(2000, 5000)}` }
        ],
        discounts: [
          { name: 'Customer Cash', value: `-$${discounts}` }
        ],
        subTotal: `$${subTotal.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
      },
      credits: {
        items: credits > 0 ? [
          { name: 'Trade-in Equity', value: `$${credits.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}` }
        ] : [],
        subTotal: `$${credits.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
      },
      taxesAndFees: {
        salesTax: { 
          rate: `${(salesTaxRate * 100).toFixed(2)}%`, 
          amount: `$${salesTax.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}` 
        },
        registrationFees: { 
          type: 'Standard Registration', 
          amount: `$${regFees}` 
        },
        otherFees: { 
          type: 'Documentation Fee', 
          amount: `$${otherFees}` 
        },
        total: `$${totalTaxesFees.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
      },
      amountFinanced: `$${amountFinanced.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`,
      totalDueAtDelivery: `$${dueAtDelivery.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`,
      invoiceSummaryDetails: [
        { label: 'MSRP', subLabel: '', value: `$${msrp}` }
      ]
    },
    registration_data: [
      { label: 'Registration State', value: random(cities).state },
      { label: 'License Plate Type', value: 'Standard' },
      { label: 'Title Type', value: 'Electronic' }
    ]
  };
}

export async function populateApplicationData() {
  try {
    console.log('Fetching applications...');
    
    // Get all applications
    const { data: applications, error: appsError } = await supabase
      .from('applications')
      .select('id');
    
    if (appsError) throw appsError;
    if (!applications || applications.length === 0) {
      return { success: false, message: 'No applications found in database' };
    }
    
    console.log(`Found ${applications.length} applications`);
    
    // Get existing applicant info to find which apps need data
    const { data: existingApplicants, error: existingError } = await supabase
      .from('applicant_info')
      .select('application_id');
    
    if (existingError) throw existingError;
    
    const existingAppIds = new Set(existingApplicants?.map(a => a.application_id) || []);
    const appsNeedingData = applications.filter(app => !existingAppIds.has(app.id));
    
    console.log(`${appsNeedingData.length} applications need applicant data`);
    
    if (appsNeedingData.length === 0) {
      return { success: true, message: 'All applications already have applicant data' };
    }
    
    // Generate and insert applicant data
    const applicantRecords = [];
    for (const app of appsNeedingData) {
      // Primary applicant
      applicantRecords.push(generateApplicantInfo(app.id, false));
      
      // 50% chance of co-applicant
      if (Math.random() > 0.5) {
        applicantRecords.push(generateApplicantInfo(app.id, true));
      }
    }
    
    console.log(`Inserting ${applicantRecords.length} applicant records...`);
    const { error: insertError } = await supabase
      .from('applicant_info')
      .insert(applicantRecords);
    
    if (insertError) throw insertError;
    
    // Generate and insert order details
    const { data: existingOrders, error: ordersCheckError } = await supabase
      .from('order_details')
      .select('application_id');
    
    if (ordersCheckError) throw ordersCheckError;
    
    const existingOrderIds = new Set(existingOrders?.map(o => o.application_id) || []);
    const appsNeedingOrders = applications.filter(app => !existingOrderIds.has(app.id));
    
    console.log(`${appsNeedingOrders.length} applications need order details`);
    
    if (appsNeedingOrders.length > 0) {
      const orderRecords = appsNeedingOrders.map(app => generateOrderDetails(app.id));
      
      console.log(`Inserting ${orderRecords.length} order detail records...`);
      const { error: ordersInsertError } = await supabase
        .from('order_details')
        .insert(orderRecords);
      
      if (ordersInsertError) throw ordersInsertError;
    }
    
    const primaryCount = appsNeedingData.length;
    const coApplicantCount = applicantRecords.length - primaryCount;
    
    return {
      success: true,
      message: `Successfully populated data for ${primaryCount} applications (${coApplicantCount} with co-applicants) and ${appsNeedingOrders.length} order details`
    };
  } catch (error: any) {
    console.error('Error populating application data:', error);
    return {
      success: false,
      message: error.message || 'Failed to populate application data'
    };
  }
}
