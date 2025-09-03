import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.53.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Mock data mappings
const documentCategories = [
  {
    name: 'Order Documents',
    description: 'Purchase order, sales contract, and lease agreement',
    icon: 'FileText'
  },
  {
    name: 'Registration Documents',
    description: 'Vehicle registration, title, and related paperwork',
    icon: 'Car'
  },
  {
    name: 'Customer Documents',
    description: 'Customer identification, credit application, and personal documents',
    icon: 'User'
  },
  {
    name: 'Stipulation Documents',
    description: 'Required documents for loan approval conditions',
    icon: 'CreditCard'
  },
  {
    name: 'Compliance Documents',
    description: 'Legal and regulatory compliance documentation',
    icon: 'FileImage'
  },
  {
    name: 'Supporting Documents',
    description: 'Additional supporting documentation and attachments',
    icon: 'File'
  }
];

const mockDocuments = [
  // Order Documents
  {
    name: 'Purchase Order',
    type: 'Purchase Order',
    category: 'Order Documents',
    status: 'approved',
    fileUrl: '/documents/purchase-order-2024-15.pdf',
    fileName: 'purchase-order-2024-15.pdf',
    fileSize: '2.3 MB',
    uploadedDate: '2025-05-01',
    uploadedBy: 'Michael McCann',
    lastModified: '2025-05-01',
    isRequired: true,
    notes: 'Original purchase order signed by customer'
  },
  {
    name: 'Sales Contract',
    type: 'Sales Contract',
    category: 'Order Documents',
    status: 'approved',
    fileUrl: '/documents/sales-contract-2024-001.pdf',
    fileName: 'sales-contract-2024-001.pdf',
    fileSize: '1.8 MB',
    uploadedDate: '2025-05-02',
    uploadedBy: 'Sarah Wilson',
    lastModified: '2025-05-02',
    isRequired: true,
    notes: 'Fully executed sales contract'
  },
  {
    name: 'Lease Agreement',
    type: 'Lease Agreement',
    category: 'Order Documents',
    status: 'pending_review',
    fileUrl: '/documents/lease-agreement-draft.pdf',
    fileName: 'lease-agreement-draft.pdf',
    fileSize: '2.1 MB',
    uploadedDate: '2025-05-03',
    uploadedBy: 'James Rodriguez',
    lastModified: '2025-05-03',
    isRequired: true,
    notes: 'Draft lease agreement pending final review'
  },

  // Registration Documents
  {
    name: 'Vehicle Registration',
    type: 'Vehicle Registration',
    category: 'Registration Documents',
    status: 'submitted',
    fileUrl: '/documents/vehicle-registration.pdf',
    fileName: 'vehicle-registration.pdf',
    fileSize: '892 KB',
    uploadedDate: '2025-04-28',
    uploadedBy: 'David Chen',
    lastModified: '2025-04-28',
    isRequired: true,
    notes: 'Current vehicle registration document'
  },
  {
    name: 'Title Certificate',
    type: 'Title Certificate',
    category: 'Registration Documents',
    status: 'approved',
    fileUrl: '/documents/title-certificate.pdf',
    fileName: 'title-certificate.pdf',
    fileSize: '1.2 MB',
    uploadedDate: '2025-04-29',
    uploadedBy: 'Lisa Anderson',
    lastModified: '2025-04-29',
    isRequired: true,
    notes: 'Clean title certificate'
  },

  // Customer Documents
  {
    name: 'Driver License',
    type: 'Driver License',
    category: 'Customer Documents',
    status: 'approved',
    fileUrl: '/documents/drivers-license.jpg',
    fileName: 'drivers-license.jpg',
    fileSize: '1.1 MB',
    uploadedDate: '2025-04-25',
    uploadedBy: 'Michael Thompson',
    lastModified: '2025-04-25',
    isRequired: true,
    notes: 'Valid driver license'
  },
  {
    name: 'Credit Application',
    type: 'Credit Application',
    category: 'Customer Documents',
    status: 'approved',
    fileUrl: '/documents/credit-application.pdf',
    fileName: 'credit-application.pdf',
    fileSize: '943 KB',
    uploadedDate: '2025-04-26',
    uploadedBy: 'Jennifer Davis',
    lastModified: '2025-04-26',
    isRequired: true,
    notes: 'Completed credit application form'
  },

  // Stipulation Documents
  {
    name: 'Income Verification',
    type: 'Income Verification',
    category: 'Stipulation Documents',
    status: 'submitted',
    fileUrl: '/documents/income-verification.pdf',
    fileName: 'income-verification.pdf',
    fileSize: '756 KB',
    uploadedDate: '2025-04-30',
    uploadedBy: 'Robert Martinez',
    lastModified: '2025-04-30',
    isRequired: true,
    notes: 'Pay stubs for income verification'
  },
  {
    name: 'Insurance Proof',
    type: 'Insurance Proof',
    category: 'Stipulation Documents',
    status: 'approved',
    fileUrl: '/documents/insurance-proof.pdf',
    fileName: 'insurance-proof.pdf',
    fileSize: '625 KB',
    uploadedDate: '2025-05-01',
    uploadedBy: 'Amanda Garcia',
    lastModified: '2025-05-01',
    isRequired: true,
    notes: 'Current insurance certificate'
  },

  // Compliance Documents
  {
    name: 'Disclosure Statement',
    type: 'Disclosure Statement',
    category: 'Compliance Documents',
    status: 'approved',
    fileUrl: '/documents/disclosure-statement.pdf',
    fileName: 'disclosure-statement.pdf',
    fileSize: '534 KB',
    uploadedDate: '2025-04-27',
    uploadedBy: 'Kevin Brown',
    lastModified: '2025-04-27',
    isRequired: true,
    notes: 'Required regulatory disclosure'
  },

  // Supporting Documents
  {
    name: 'Additional Notes',
    type: 'Additional Notes',
    category: 'Supporting Documents',
    status: 'submitted',
    fileUrl: '/documents/additional-notes.txt',
    fileName: 'additional-notes.txt',
    fileSize: '12 KB',
    uploadedDate: '2025-05-02',
    uploadedBy: 'Nicole Wilson',
    lastModified: '2025-05-02',
    isRequired: false,
    notes: 'Supplementary customer notes'
  }
];

// Mock applications data for seeding
const mockApplications = [
  // Loan Applications
  { id: '7', name: 'Sarah Johnson', type: 'Loan', status: 'Submitted' },
  { id: '8', name: 'Michael Torres', type: 'Loan', status: 'Void' },
  { id: '9', name: 'Michael Torres', type: 'Loan', status: 'Approved' },
  { id: '10', name: 'David Chen', type: 'Loan', status: 'Pending' },
  { id: '11', name: 'Emily Chang', type: 'Loan', status: 'Pending Signature' },
  { id: '12', name: 'James Wilson', type: 'Loan', status: 'Booked' },
  { id: '13', name: 'Robert Kim', type: 'Loan', status: 'Pending' },
  { id: '14', name: 'Daniel Patel', type: 'Loan', status: 'Submitted' },
  { id: '15', name: 'William Johnson', type: 'Loan', status: 'Funded' },
  
  // Lease Applications
  { id: '1', name: 'Becca Yukelson', type: 'Loan', status: 'Void' },
  { id: '2', name: 'Becca Yukelson', type: 'Lease', status: 'Approved' },
  { id: '3', name: 'Aisha Washington', type: 'Lease', status: 'Void' },
  { id: '4', name: 'Carlos Rodriguez', type: 'Lease', status: 'Conditionally Approved' },
  { id: '6', name: 'Sarah Johnson', type: 'Lease', status: 'Void' },
  { id: '16', name: 'Sophia Martinez', type: 'Lease', status: 'Funded' },
  { id: '17', name: 'Olivia Thompson', type: 'Lease', status: 'Approved' },
  { id: '18', name: 'Maria Garcia', type: 'Lease', status: 'Conditionally Approved' }
];

// Helper function to generate application-specific documents
function generateApplicationDocuments(application: any) {
  const isLoan = application.type === 'Loan';
  const status = application.status;
  const appId = application.id;
  const customerName = application.name.split(' ')[0];
  
  const baseDocuments = [
    // Required for all applications
    {
      name: `Driver License - ${customerName}`,
      type: 'Driver License',
      category: 'Customer Documents',
      status: ['Approved', 'Booked', 'Funded'].includes(status) ? 'approved' : 
              ['Void'].includes(status) ? 'rejected' : 'submitted',
      fileUrl: `/documents/app-${appId}/drivers-license.jpg`,
      fileName: `drivers-license-${appId}.jpg`,
      fileSize: `${(Math.random() * 2 + 0.5).toFixed(1)} MB`,
      uploadedBy: customerName,
      isRequired: true,
      notes: `Driver license for ${application.name}`
    },
    {
      name: `Credit Application - ${customerName}`,
      type: 'Credit Application',
      category: 'Customer Documents',
      status: ['Approved', 'Booked', 'Funded', 'Conditionally Approved'].includes(status) ? 'approved' : 
              ['Void'].includes(status) ? 'rejected' : 'pending_review',
      fileUrl: `/documents/app-${appId}/credit-application.pdf`,
      fileName: `credit-application-${appId}.pdf`,
      fileSize: `${(Math.random() * 1.5 + 0.5).toFixed(1)} MB`,
      uploadedBy: 'Jennifer Davis',
      isRequired: true,
      notes: `Credit application for ${application.name}`
    }
  ];

  // Add loan/lease specific documents
  if (isLoan) {
    baseDocuments.push(
      {
        name: `Purchase Order - ${appId}`,
        type: 'Purchase Order',
        category: 'Order Documents',
        status: ['Booked', 'Funded'].includes(status) ? 'approved' : 
                ['Void'].includes(status) ? 'rejected' : 'submitted',
        fileUrl: `/documents/app-${appId}/purchase-order.pdf`,
        fileName: `purchase-order-${appId}.pdf`,
        fileSize: `${(Math.random() * 3 + 1.5).toFixed(1)} MB`,
        uploadedBy: 'Michael McCann',
        isRequired: true,
        notes: `Purchase order for loan application ${appId}`
      },
      {
        name: `Sales Contract - ${appId}`,
        type: 'Sales Contract',
        category: 'Order Documents',
        status: ['Approved', 'Booked', 'Funded'].includes(status) ? 'approved' : 
                ['Void'].includes(status) ? 'rejected' : 'pending_review',
        fileUrl: `/documents/app-${appId}/sales-contract.pdf`,
        fileName: `sales-contract-${appId}.pdf`,
        fileSize: `${(Math.random() * 2.5 + 1).toFixed(1)} MB`,
        uploadedBy: 'Sarah Wilson',
        isRequired: true,
        notes: `Sales contract for loan application ${appId}`
      }
    );
  } else {
    baseDocuments.push({
      name: `Lease Agreement - ${appId}`,
      type: 'Lease Agreement',
      category: 'Order Documents',
      status: ['Approved', 'Booked', 'Funded'].includes(status) ? 'approved' : 
              ['Void'].includes(status) ? 'rejected' : 'pending_review',
      fileUrl: `/documents/app-${appId}/lease-agreement.pdf`,
      fileName: `lease-agreement-${appId}.pdf`,
      fileSize: `${(Math.random() * 2.8 + 1.2).toFixed(1)} MB`,
      uploadedBy: 'James Rodriguez',
      isRequired: true,
      notes: `Lease agreement for application ${appId}`
    });
  }

  // Add conditional documents based on status
  if (['Conditionally Approved', 'Approved', 'Booked', 'Funded'].includes(status)) {
    baseDocuments.push(
      {
        name: `Income Verification - ${customerName}`,
        type: 'Income Verification',
        category: 'Stipulation Documents',
        status: ['Approved', 'Booked', 'Funded'].includes(status) ? 'approved' : 'submitted',
        fileUrl: `/documents/app-${appId}/income-verification.pdf`,
        fileName: `income-verification-${appId}.pdf`,
        fileSize: `${(Math.random() * 1.2 + 0.4).toFixed(1)} MB`,
        uploadedBy: 'Robert Martinez',
        isRequired: true,
        notes: `Income verification for ${application.name}`
      },
      {
        name: `Insurance Proof - ${customerName}`,
        type: 'Insurance Proof',
        category: 'Stipulation Documents',
        status: ['Approved', 'Booked', 'Funded'].includes(status) ? 'approved' : 'submitted',
        fileUrl: `/documents/app-${appId}/insurance-proof.pdf`,
        fileName: `insurance-proof-${appId}.pdf`,
        fileSize: `${(Math.random() * 0.8 + 0.3).toFixed(1)} MB`,
        uploadedBy: 'Amanda Garcia',
        isRequired: true,
        notes: `Insurance proof for ${application.name}`
      }
    );
  }

  // Add registration documents for approved/booked/funded
  if (['Approved', 'Booked', 'Funded'].includes(status)) {
    baseDocuments.push(
      {
        name: `Vehicle Registration - ${appId}`,
        type: 'Vehicle Registration',
        category: 'Registration Documents',
        status: ['Booked', 'Funded'].includes(status) ? 'approved' : 'submitted',
        fileUrl: `/documents/app-${appId}/vehicle-registration.pdf`,
        fileName: `vehicle-registration-${appId}.pdf`,
        fileSize: `${(Math.random() * 1.1 + 0.6).toFixed(1)} MB`,
        uploadedBy: 'David Chen',
        isRequired: true,
        notes: `Vehicle registration for application ${appId}`
      },
      {
        name: `Title Certificate - ${appId}`,
        type: 'Title Certificate',
        category: 'Registration Documents',
        status: ['Booked', 'Funded'].includes(status) ? 'approved' : 'submitted',
        fileUrl: `/documents/app-${appId}/title-certificate.pdf`,
        fileName: `title-certificate-${appId}.pdf`,
        fileSize: `${(Math.random() * 1.4 + 0.8).toFixed(1)} MB`,
        uploadedBy: 'Lisa Anderson',
        isRequired: true,
        notes: `Title certificate for application ${appId}`
      }
    );
  }

  // Add compliance documents for funded applications
  if (['Funded', 'Booked'].includes(status)) {
    baseDocuments.push({
      name: `Disclosure Statement - ${appId}`,
      type: 'Disclosure Statement',
      category: 'Compliance Documents',
      status: 'approved',
      fileUrl: `/documents/app-${appId}/disclosure-statement.pdf`,
      fileName: `disclosure-statement-${appId}.pdf`,
      fileSize: `${(Math.random() * 0.7 + 0.3).toFixed(1)} MB`,
      uploadedBy: 'Kevin Brown',
      isRequired: true,
      notes: `Regulatory disclosure for application ${appId}`
    });
  }

  // Add supporting documents randomly
  if (Math.random() > 0.3) {
    baseDocuments.push({
      name: `Additional Notes - ${customerName}`,
      type: 'Additional Notes',
      category: 'Supporting Documents',
      status: 'submitted',
      fileUrl: `/documents/app-${appId}/additional-notes.txt`,
      fileName: `additional-notes-${appId}.txt`,
      fileSize: `${(Math.random() * 0.05 + 0.01).toFixed(2)} MB`,
      uploadedBy: 'Nicole Wilson',
      isRequired: false,
      notes: `Additional customer notes for application ${appId}`
    });
  }

  // Add realistic timestamps
  const baseDate = new Date('2024-04-25');
  const currentDate = new Date();
  
  return baseDocuments.map((doc, index) => ({
    ...doc,
    application_id: appId,
    uploadedDate: new Date(baseDate.getTime() + (index * 2 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
    lastModified: new Date(baseDate.getTime() + (index * 2 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]
  }));
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Parse request body for applicationIds parameter
    let applicationIds: string[] = [];
    if (req.method === 'POST') {
      try {
        const body = await req.json();
        applicationIds = body.applicationIds || [];
      } catch {
        // If no body or invalid JSON, proceed with all applications
      }
    }

    console.log('Starting document seeding process...');
    
    // Filter applications if specific IDs were provided
    const applicationsToSeed = applicationIds.length > 0 
      ? mockApplications.filter(app => applicationIds.includes(app.id))
      : mockApplications;

    console.log(`Seeding documents for ${applicationsToSeed.length} applications`);

    // 1. Seed document categories
    console.log('Seeding document categories...');
    for (const category of documentCategories) {
      const { error: categoryError } = await supabase
        .from('document_categories')
        .upsert(category, { onConflict: 'name' });
      
      if (categoryError) {
        console.error('Error seeding category:', category.name, categoryError);
      } else {
        console.log('Seeded category:', category.name);
      }
    }

    // 2. Get all categories for mapping
    const { data: categories, error: categoriesError } = await supabase
      .from('document_categories')
      .select('*');

    if (categoriesError) {
      throw new Error(`Failed to fetch categories: ${categoriesError.message}`);
    }

    const categoryMap = new Map(categories.map(cat => [cat.name, cat.id]));

    // 3. Create document types from unique types in mock data
    console.log('Seeding document types...');
    const uniqueTypes = [...new Set(mockDocuments.map(doc => doc.type))];
    
    for (const typeName of uniqueTypes) {
      // Find the category for this type from mock data
      const mockDoc = mockDocuments.find(doc => doc.type === typeName);
      const categoryId = categoryMap.get(mockDoc?.category || '');
      
      if (categoryId) {
        const { error: typeError } = await supabase
          .from('document_types')
          .upsert({
            name: typeName,
            category_id: categoryId,
            description: `${typeName} document type`,
            is_required: mockDoc?.isRequired || false,
            requires_signature: false,
            is_internal_only: false,
            sort_order: 0,
            product_types: []
          }, { onConflict: 'name,category_id' });
        
        if (typeError) {
          console.error('Error seeding document type:', typeName, typeError);
        } else {
          console.log('Seeded document type:', typeName);
        }
      }
    }

    // 4. Get all document types for mapping
    const { data: documentTypes, error: typesError } = await supabase
      .from('document_types')
      .select('*');

    if (typesError) {
      throw new Error(`Failed to fetch document types: ${typesError.message}`);
    }

    const typeMap = new Map(documentTypes.map(type => [type.name, type.id]));

    // 5. Generate and seed application-specific documents
    console.log('Seeding application-specific documents...');
    let totalDocumentsSeeded = 0;
    
    for (const application of applicationsToSeed) {
      console.log(`Generating documents for application ${application.id} (${application.name})`);
      const appDocuments = generateApplicationDocuments(application);
      
      for (const doc of appDocuments) {
        const categoryId = categoryMap.get(doc.category);
        const documentTypeId = typeMap.get(doc.type);
        
        if (categoryId && documentTypeId) {
          const { error: docError } = await supabase
            .from('documents')
            .upsert({
              name: doc.name,
              application_id: doc.application_id,
              category_id: categoryId,
              document_type_id: documentTypeId,
              status: doc.status,
              file_url: doc.fileUrl,
              file_name: doc.fileName,
              file_size_mb: parseFloat(doc.fileSize.replace(/[^\d.]/g, '')),
              uploaded_date: doc.uploadedDate,
              uploaded_by: doc.uploadedBy,
              last_modified: doc.lastModified,
              is_required: doc.isRequired,
              notes: doc.notes,
              product_type: application.type.toLowerCase(),
              file_extension: doc.fileName?.split('.').pop() || 'pdf'
            }, { onConflict: 'name,application_id' });
          
          if (docError) {
            console.error('Error seeding document:', doc.name, docError);
          } else {
            totalDocumentsSeeded++;
          }
        }
      }
      
      console.log(`Seeded ${appDocuments.length} documents for application ${application.id}`);
    }

    console.log('Document seeding completed successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Application-specific documents seeded successfully',
        applicationsProcessed: applicationsToSeed.length,
        categoriesSeeded: documentCategories.length,
        typesSeeded: uniqueTypes.length,
        documentsSeeded: totalDocumentsSeeded
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error seeding documents:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Unknown error occurred' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});