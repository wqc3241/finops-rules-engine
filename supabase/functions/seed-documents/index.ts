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

    console.log('Starting document seeding process...');

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

    // 5. Seed documents
    console.log('Seeding documents...');
    for (const doc of mockDocuments) {
      const categoryId = categoryMap.get(doc.category);
      const documentTypeId = typeMap.get(doc.type);
      
      if (categoryId && documentTypeId) {
        const { error: docError } = await supabase
          .from('documents')
          .upsert({
            name: doc.name,
            category_id: categoryId,
            document_type_id: documentTypeId,
            status: doc.status,
            file_url: doc.fileUrl,
            file_name: doc.fileName,
            file_size_mb: parseFloat(doc.fileSize.replace(/[^\d.]/g, '')), // Extract number from "2.3 MB"
            uploaded_date: doc.uploadedDate,
            uploaded_by: doc.uploadedBy,
            last_modified: doc.lastModified,
            is_required: doc.isRequired,
            notes: doc.notes,
            product_type: 'general', // Default product type
            file_extension: doc.fileName?.split('.').pop() || 'pdf'
          }, { onConflict: 'name,category_id' });
        
        if (docError) {
          console.error('Error seeding document:', doc.name, docError);
        } else {
          console.log('Seeded document:', doc.name);
        }
      } else {
        console.warn('Skipping document due to missing category or type:', doc.name);
      }
    }

    console.log('Document seeding completed successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Documents seeded successfully',
        categoriesSeeded: documentCategories.length,
        typesSeeded: uniqueTypes.length,
        documentsSeeded: mockDocuments.length
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