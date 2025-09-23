import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Database schema mapping for AI understanding
const DATABASE_SCHEMA = {
  applications: {
    description: "Main application records for loans and leases",
    fields: {
      id: "UUID - unique identifier",
      name: "TEXT - applicant full name", 
      status: "ENUM - Pending, Approved, Declined, Conditionally Approved, Funded, Booked, Pending Signature, Submitted, Void",
      type: "ENUM - Loan, Lease",
      amount: "NUMERIC - loan/lease amount in dollars",
      date: "TIMESTAMP - application submission date",
      state: "TEXT - US state (e.g., CA, NY, TX)",
      reapply_enabled: "BOOLEAN - whether reapplication is allowed",
      reapplication_sequence: "INTEGER - sequence number in reapplication chain"
    }
  },
  applicant_info: {
    description: "Detailed applicant personal and financial information",
    fields: {
      application_id: "UUID - links to applications table",
      relationship: "TEXT - Primary Applicant, Co-Applicant",
      first_name: "TEXT - applicant first name",
      last_name: "TEXT - applicant last name", 
      email_address: "TEXT - contact email",
      contact_number: "TEXT - phone number",
      dob: "TEXT - date of birth",
      address: "TEXT - street address",
      city: "TEXT - city name",
      state: "TEXT - US state",
      zip_code: "TEXT - postal code",
      employment_type: "TEXT - Full Time, Part Time, Self Employed, etc.",
      employer_name: "TEXT - company name",
      job_title: "TEXT - position title",
      income_amount: "TEXT - annual income",
      housing_payment_amount: "TEXT - monthly rent/mortgage",
      is_co_applicant: "BOOLEAN - whether this is co-applicant info"
    }
  },
  documents: {
    description: "Document management and tracking",
    fields: {
      application_id: "TEXT - links to applications",
      name: "TEXT - document name",
      document_type_id: "UUID - type of document",
      category_id: "UUID - document category", 
      status: "TEXT - Pending, Approved, Rejected, Received",
      file_name: "TEXT - uploaded file name",
      uploaded_date: "TIMESTAMP - when document was uploaded",
      requires_signature: "BOOLEAN - needs e-signature",
      signature_status: "TEXT - signature completion status",
      product_type: "TEXT - Loan, Lease applicability",
      expiration_date: "TIMESTAMP - document expiry"
    }
  },
  financial_products: {
    description: "Available financing products and configurations",
    fields: {
      product_id: "TEXT - unique product identifier",
      product_type: "TEXT - Loan, Lease",
      product_subtype: "TEXT - specific product variant", 
      geo_code: "TEXT - geographical availability",
      lender_name: "TEXT - financial institution name",
      min_amount: "NUMERIC - minimum financing amount",
      max_amount: "NUMERIC - maximum financing amount",
      min_term: "INTEGER - minimum term in months",
      max_term: "INTEGER - maximum term in months"
    }
  },
  dealers: {
    description: "Dealer/partner information and settings",
    fields: {
      id: "TEXT - dealer identifier",
      legal_entity_name: "TEXT - official business name",
      dba_name: "TEXT - doing business as name",
      gateway_entity_address: "TEXT - business address",
      gateway_entity_city: "TEXT - business city",
      gateway_entity_state: "TEXT - business state", 
      selling_state: "TEXT - state where sales occur",
      geo_code: "TEXT - geographical classification",
      licensed: "TEXT - licensing status"
    }
  },
  bulletin_pricing: {
    description: "Pricing configurations and rate bulletins",
    fields: {
      financial_program_code: "TEXT - program identifier",
      lender_list: "TEXT - applicable lenders",
      pricing_type: "TEXT - type of pricing rule",
      pricing_value: "NUMERIC - rate or percentage value",
      credit_profile: "TEXT - target credit profile",
      geo_code: "TEXT - geographical applicability",
      advertised: "BOOLEAN - whether publicly advertised"
    }
  }
};

// Business term mappings for natural language understanding
const BUSINESS_TERMS = {
  "customer": ["name", "applicant_info.first_name", "applicant_info.last_name"],
  "income": ["applicant_info.income_amount"],
  "employment": ["applicant_info.employment_type", "applicant_info.employer_name"],
  "address": ["applicant_info.address", "applicant_info.city", "applicant_info.state"],
  "dealer": ["dealers.legal_entity_name", "dealers.dba_name"],
  "lender": ["financial_products.lender_name", "bulletin_pricing.lender_list"],
  "pricing": ["bulletin_pricing.pricing_value", "bulletin_pricing.pricing_type"],
  "location": ["state", "applicant_info.state", "dealers.selling_state"],
  "paperwork": ["documents.name", "documents.status", "documents.signature_status"]
};

interface QueryIntent {
  type: 'report' | 'dashboard';
  title: string;
  description: string;
  tables?: string[];
  joins?: Array<{from: string; to: string; on: string}>;
  filters: {
    status?: string[];
    type?: string[];
    dateRange?: string;
    customDateStart?: string;
    customDateEnd?: string;
    state?: string[];
    amount?: { min?: number; max?: number };
    income?: { min?: number; max?: number };
    employment_type?: string[];
    document_status?: string[];
    lender?: string[];
    dealer?: string[];
    product_type?: string[];
  };
  groupBy?: string[];
  aggregations?: Array<{field: string; function: 'count' | 'sum' | 'avg' | 'min' | 'max'}>;
  chartTypes?: string[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId } = await req.json();
    
    if (!message || !userId) {
      throw new Error('Message and userId are required');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('Processing AI request:', { message, userId });

    // Use OpenAI to parse the natural language request
    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          {
            role: 'system',
            content: `You are an expert AI assistant for a financial services application management system. You help users generate comprehensive reports and dashboards by understanding their natural language requests and mapping them to the appropriate database queries.

## DATABASE SCHEMA KNOWLEDGE

### Available Tables and Fields:
${JSON.stringify(DATABASE_SCHEMA, null, 2)}

### Business Term Mappings:
${JSON.stringify(BUSINESS_TERMS, null, 2)}

## UNDERSTANDING CAPABILITIES

You can analyze requests about:
- **Applications**: Status tracking, approval rates, processing times, regional distribution
- **Applicants**: Demographics, employment patterns, income analysis, credit profiles  
- **Documents**: Completion rates, missing paperwork, signature tracking, compliance
- **Financial Products**: Product performance, lender analysis, pricing trends
- **Dealers**: Partner performance, geographical coverage, licensing status
- **Operational**: Workflow efficiency, bottlenecks, team performance

## QUERY INTELLIGENCE

**Automatic Table Selection**: Determine which tables to query based on the request
**Smart Joins**: Identify relationships (applications ↔ applicant_info via application_id)
**Advanced Filters**: Support complex filtering across multiple tables and fields
**Aggregations**: Calculate counts, sums, averages, trends, and business metrics

## RESPONSE FORMAT

Generate a detailed JSON response with this structure:
{
  "type": "report" | "dashboard",
  "title": "Descriptive title for the analysis",
  "description": "Detailed description of insights provided",
  "tables": ["primary tables to query - choose based on the request"],
  "joins": [{"from": "table1", "to": "table2", "on": "linking_field"}],
  "filters": {
    "status": ["Pending", "Approved", etc.] - application statuses,
    "type": ["Loan", "Lease"] - application types,
    "dateRange": "last_week|last_month|last_quarter|custom",
    "customDateStart": "YYYY-MM-DD", 
    "customDateEnd": "YYYY-MM-DD",
    "state": ["CA", "NY", "TX"] - geographical filters,
    "amount": {"min": number, "max": number} - financial ranges,
    "income": {"min": number, "max": number} - income brackets,
    "employment_type": ["Full Time", "Part Time"] - employment categories,
    "document_status": ["Pending", "Approved"] - document states,
    "lender": ["lender names"] - financial institution filters,
    "dealer": ["dealer names"] - partner filters,
    "product_type": ["Loan", "Lease"] - product categories
  },
  "groupBy": ["fields to group results by"],
  "aggregations": [{"field": "field_name", "function": "count|sum|avg|min|max"}],
  "chartTypes": ["pie", "bar", "line", "area", "table", "metric"] - for dashboards
}

## EXAMPLES

"Show me loan applications from California this month" →
- tables: ["applications", "applicant_info"]  
- joins: [{"from": "applications", "to": "applicant_info", "on": "application_id"}]
- filters: {"type": ["Loan"], "dateRange": "last_month"}
- Use applicant_info.state for CA filter

"Document completion rates by lender" →
- tables: ["documents", "applications", "financial_products"]
- Focus on document status analysis with lender breakdown

Analyze all requests comprehensively and provide actionable business insights.`
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_completion_tokens: 1000
      }),
    });

    if (!aiResponse.ok) {
      throw new Error(`OpenAI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices[0].message.content;
    
    console.log('AI parsed intent:', aiContent);

    let queryIntent: QueryIntent;
    try {
      queryIntent = JSON.parse(aiContent);
    } catch (e) {
      throw new Error('Failed to parse AI response as JSON');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Multi-table query support: determine target tables (default to 'applications')
    const targetTables = (Array.isArray(queryIntent.tables) && queryIntent.tables.length > 0)
      ? queryIntent.tables
      : ['applications'];

    const tableResults: Record<string, any[]> = {};

    // Helper to compute date bounds
    const now = new Date();
    let startDate: Date | undefined;
    let endDate: Date | undefined;
    if (queryIntent.filters?.dateRange) {
      switch (queryIntent.filters.dateRange) {
        case 'last_week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'last_month':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case 'last_quarter':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case 'custom':
          if (queryIntent.filters.customDateStart) {
            startDate = new Date(queryIntent.filters.customDateStart);
          }
          if (queryIntent.filters.customDateEnd) {
            endDate = new Date(queryIntent.filters.customDateEnd);
          }
          break;
      }
    }

    // Enhanced multi-table querying with intelligent filtering
    await Promise.all(targetTables.map(async (tableName) => {
      try {
        console.log(`Querying table: ${tableName}`);
        
        // Discover columns for intelligent filtering
        const { data: cols } = await supabase
          .rpc('get_table_columns', { table_name_param: tableName });
        const columnSet = new Set<string>((cols || []).map((c: any) => c.column_name));
        
        console.log(`Available columns for ${tableName}:`, Array.from(columnSet));

        let q = supabase.from(tableName).select('*');

        // Apply comprehensive filters based on available columns
        if (queryIntent.filters?.status && columnSet.has('status')) {
          q = q.in('status', queryIntent.filters.status);
        }
        
        if (queryIntent.filters?.type) {
          // Handle both 'type' and 'product_type' columns
          if (columnSet.has('type')) {
            q = q.in('type', queryIntent.filters.type);
          } else if (columnSet.has('product_type')) {
            q = q.in('product_type', queryIntent.filters.type);
          }
        }
        
        // Geographical filters - handle multiple state column variations
        if (queryIntent.filters?.state) {
          const stateColumns = ['state', 'selling_state', 'gateway_entity_state'].filter(col => columnSet.has(col));
          if (stateColumns.length > 0) {
            q = q.in(stateColumns[0], queryIntent.filters.state);
          }
        }
        
        // Financial amount filters
        if (queryIntent.filters?.amount && columnSet.has('amount')) {
          if (typeof queryIntent.filters.amount.min === 'number') {
            q = q.gte('amount', queryIntent.filters.amount.min);
          }
          if (typeof queryIntent.filters.amount.max === 'number') {
            q = q.lte('amount', queryIntent.filters.amount.max);
          }
        }
        
        // Income filters for applicant info
        if (queryIntent.filters?.income && columnSet.has('income_amount')) {
          const incomeFilter = queryIntent.filters.income;
          if (typeof incomeFilter.min === 'number') {
            q = q.gte('income_amount', incomeFilter.min);
          }
          if (typeof incomeFilter.max === 'number') {
            q = q.lte('income_amount', incomeFilter.max);
          }
        }
        
        // Employment type filters
        if (queryIntent.filters?.employment_type && columnSet.has('employment_type')) {
          q = q.in('employment_type', queryIntent.filters.employment_type);
        }
        
        // Document status filters
        if (queryIntent.filters?.document_status && columnSet.has('status') && tableName === 'documents') {
          q = q.in('status', queryIntent.filters.document_status);
        }
        
        // Lender filters
        if (queryIntent.filters?.lender) {
          const lenderColumns = ['lender_name', 'lender_list'].filter(col => columnSet.has(col));
          if (lenderColumns.length > 0) {
            q = q.in(lenderColumns[0], queryIntent.filters.lender);
          }
        }
        
        // Dealer filters
        if (queryIntent.filters?.dealer) {
          const dealerColumns = ['legal_entity_name', 'dba_name'].filter(col => columnSet.has(col));
          if (dealerColumns.length > 0) {
            q = q.in(dealerColumns[0], queryIntent.filters.dealer);
          }
        }

        // Enhanced date filtering with multiple column support
        const dateCol = ['date', 'created_at', 'updated_at', 'uploaded_date', 'submitted_at'].find(c => columnSet.has(c));
        if (dateCol) {
          if (startDate) q = q.gte(dateCol, startDate.toISOString());
          if (endDate) q = q.lte(dateCol, endDate.toISOString());
        }

        const { data, error } = await q.limit(2000); // Increased limit for comprehensive analysis
        if (error) throw error;
        
        tableResults[tableName] = data || [];
        console.log(`Successfully retrieved ${tableResults[tableName].length} rows from ${tableName}`);
        
      } catch (err) {
        console.error(`Failed to query table ${tableName}:`, err);
        tableResults[tableName] = [];
      }
    }));

    // Backward compatibility: set applications result if available
    const applications = tableResults['applications'] || [];

    // Generate comprehensive report data from all queried tables
    const reportData = generateAdvancedReportData(tableResults, queryIntent);
    
    console.log('Generated report data:', {
      totalTables: Object.keys(tableResults).length,
      dataPoints: Object.entries(tableResults).map(([table, rows]) => ({ table, count: rows.length }))
    });
    // Save the generated report/dashboard if requested
    if (queryIntent.type === 'report') {
      const { data: savedReport, error: saveError } = await supabase
        .from('ai_generated_reports')
        .insert({
          title: queryIntent.title,
          description: queryIntent.description,
          query_parameters: queryIntent.filters,
          report_data: reportData,
          chart_config: queryIntent.chartTypes || [],
          created_by: userId
        })
        .select()
        .single();

      if (saveError) {
        console.error('Error saving report:', saveError);
      } else {
        console.log('Report saved:', savedReport?.id);
      }
    } else if (queryIntent.type === 'dashboard') {
      const { data: savedDashboard, error: saveError } = await supabase
        .from('ai_generated_dashboards')
        .insert({
          name: queryIntent.title,
          description: queryIntent.description,
          layout_config: { filters: queryIntent.filters },
          widgets: reportData.charts || [],
          created_by: userId
        })
        .select()
        .single();

      if (saveError) {
        console.error('Error saving dashboard:', saveError);
      } else {
        console.log('Dashboard saved:', savedDashboard?.id);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      intent: queryIntent,
      data: reportData,
      message: `Generated ${queryIntent.type} successfully: "${queryIntent.title}"`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in AI report generator:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generateAdvancedReportData(tableResults: Record<string, any[]>, intent: QueryIntent) {
  const data: any = {
    summary: {},
    tables: {},
    insights: [],
    charts: []
  };

  // Process each table's data
  Object.entries(tableResults).forEach(([tableName, rows]) => {
    data.tables[tableName] = {
      totalRows: rows.length,
      sampleData: rows.slice(0, 5) // Include sample for debugging
    };

    // Generate table-specific analytics
    if (tableName === 'applications' && rows.length > 0) {
      // Application analytics
      const statusDist = rows.reduce((acc, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
      }, {});
      
      const typeDist = rows.reduce((acc, app) => {
        acc[app.type] = (acc[app.type] || 0) + 1;
        return acc;
      }, {});
      
      const stateDist = rows.reduce((acc, app) => {
        if (app.state) acc[app.state] = (acc[app.state] || 0) + 1;
        return acc;
      }, {});

      data.summary.applications = {
        totalApplications: rows.length,
        statusDistribution: statusDist,
        typeDistribution: typeDist,
        stateDistribution: stateDist,
        averageAmount: rows.filter(r => r.amount).length > 0 ? 
          rows.filter(r => r.amount).reduce((sum, r) => sum + parseFloat(r.amount || 0), 0) / rows.filter(r => r.amount).length : 0
      };

      // Generate charts for applications
      if (intent.type === 'dashboard') {
        data.charts.push({
          type: 'pie',
          title: 'Applications by Status',
          data: Object.entries(statusDist).map(([status, count]) => ({ name: status, value: count }))
        });
        
        data.charts.push({
          type: 'bar', 
          title: 'Applications by Type',
          data: Object.entries(typeDist).map(([type, count]) => ({ name: type, value: count }))
        });

        if (Object.keys(stateDist).length > 0) {
          data.charts.push({
            type: 'bar',
            title: 'Applications by State', 
            data: Object.entries(stateDist).map(([state, count]) => ({ name: state, value: count }))
          });
        }
      }
    }

    if (tableName === 'applicant_info' && rows.length > 0) {
      // Applicant analytics
      const employmentDist = rows.reduce((acc, applicant) => {
        if (applicant.employment_type) acc[applicant.employment_type] = (acc[applicant.employment_type] || 0) + 1;
        return acc;
      }, {});

      const stateDist = rows.reduce((acc, applicant) => {
        if (applicant.state) acc[applicant.state] = (acc[applicant.state] || 0) + 1;
        return acc;
      }, {});

      data.summary.applicants = {
        totalApplicants: rows.length,
        employmentDistribution: employmentDist,
        stateDistribution: stateDist,
        coApplicantCount: rows.filter(r => r.is_co_applicant).length
      };

      if (intent.type === 'dashboard') {
        data.charts.push({
          type: 'pie',
          title: 'Applicants by Employment Type',
          data: Object.entries(employmentDist).map(([employment, count]) => ({ name: employment, value: count }))
        });
      }
    }

    if (tableName === 'documents' && rows.length > 0) {
      // Document analytics  
      const statusDist = rows.reduce((acc, doc) => {
        if (doc.status) acc[doc.status] = (acc[doc.status] || 0) + 1;
        return acc;
      }, {});

      const signatureDist = rows.reduce((acc, doc) => {
        if (doc.signature_status) acc[doc.signature_status] = (acc[doc.signature_status] || 0) + 1;
        return acc;
      }, {});

      data.summary.documents = {
        totalDocuments: rows.length,
        statusDistribution: statusDist,
        signatureDistribution: signatureDist,
        requireSignatureCount: rows.filter(r => r.requires_signature).length
      };

      if (intent.type === 'dashboard') {
        data.charts.push({
          type: 'pie',
          title: 'Documents by Status',
          data: Object.entries(statusDist).map(([status, count]) => ({ name: status, value: count }))
        });
      }
    }

    if (tableName === 'financial_products' && rows.length > 0) {
      const productTypeDist = rows.reduce((acc, product) => {
        if (product.product_type) acc[product.product_type] = (acc[product.product_type] || 0) + 1;
        return acc;
      }, {});

      const lenderDist = rows.reduce((acc, product) => {
        if (product.lender_name) acc[product.lender_name] = (acc[product.lender_name] || 0) + 1;
        return acc;
      }, {});

      data.summary.financialProducts = {
        totalProducts: rows.length,
        productTypeDistribution: productTypeDist,
        lenderDistribution: lenderDist
      };
    }

    if (tableName === 'dealers' && rows.length > 0) {
      const stateDist = rows.reduce((acc, dealer) => {
        if (dealer.selling_state) acc[dealer.selling_state] = (acc[dealer.selling_state] || 0) + 1;
        return acc;
      }, {});

      data.summary.dealers = {
        totalDealers: rows.length,
        stateDistribution: stateDist,
        licensedCount: rows.filter(r => r.licensed === 'TRUE').length
      };
    }
  });

  // Generate business insights
  const insights = [];
  if (data.summary.applications) {
    const apps = data.summary.applications;
    insights.push(`Total of ${apps.totalApplications} applications analyzed`);
    
    const topStatus = Object.entries(apps.statusDistribution)
      .sort(([,a], [,b]) => (b as number) - (a as number))[0];
    if (topStatus) {
      insights.push(`Most common status: ${topStatus[0]} (${topStatus[1]} applications)`);
    }

    if (apps.averageAmount > 0) {
      insights.push(`Average application amount: $${apps.averageAmount.toLocaleString()}`);
    }
  }

  if (data.summary.documents) {
    const docs = data.summary.documents;
    const completionRate = docs.statusDistribution['Approved'] ? 
      ((docs.statusDistribution['Approved'] / docs.totalDocuments) * 100).toFixed(1) : 0;
    insights.push(`Document completion rate: ${completionRate}%`);
  }

  data.insights = insights;

  // Add detailed data for reports
  if (intent.type === 'report') {
    Object.entries(tableResults).forEach(([tableName, rows]) => {
      data[tableName] = rows.map(row => {
        // Return key fields for each table type
        if (tableName === 'applications') {
          return {
            id: row.id,
            name: row.name,
            status: row.status,
            type: row.type,
            amount: row.amount,
            date: row.date,
            state: row.state
          };
        }
        return row; // For other tables, return full data
      });
    });
  }

  return data;
}