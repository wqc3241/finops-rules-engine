import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface QueryIntent {
  type: 'report' | 'dashboard';
  title: string;
  description: string;
  filters: {
    status?: string[];
    type?: string[];
    dateRange?: string;
    customDateStart?: string;
    customDateEnd?: string;
    state?: string[];
    amount?: { min?: number; max?: number };
  };
  chartTypes?: string[];
  aggregations?: string[];
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
            content: `You are an AI assistant that helps users generate reports and dashboards from application data. 
            
            Parse the user's request and determine:
            1. Whether they want a report or dashboard
            2. What filters to apply (status, type, date range, state, amount)
            3. What kind of visualization or data they need
            
            Available application statuses: Pending, Approved, Declined, Conditionally Approved, Funded, Booked, Pending Signature, Submitted
            Available application types: Loan, Lease
            
            Respond with a JSON object matching this structure:
            {
              "type": "report" | "dashboard",
              "title": "Generated title for the report/dashboard",
              "description": "Brief description of what this shows",
              "filters": {
                "status": ["array of status filters if any"],
                "type": ["array of type filters if any"], 
                "dateRange": "last_week|last_month|last_quarter|custom",
                "customDateStart": "YYYY-MM-DD if custom date range",
                "customDateEnd": "YYYY-MM-DD if custom date range",
                "state": ["array of state filters if any"],
                "amount": {"min": number, "max": number}
              },
              "chartTypes": ["pie", "bar", "line", "table"] for dashboards,
              "aggregations": ["count", "sum", "average", "trend"] what to calculate
            }`
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

    // Build query based on parsed intent
    let query = supabase.from('applications').select('*');

    // Apply filters
    if (queryIntent.filters.status && queryIntent.filters.status.length > 0) {
      query = query.in('status', queryIntent.filters.status);
    }
    
    if (queryIntent.filters.type && queryIntent.filters.type.length > 0) {
      query = query.in('type', queryIntent.filters.type);
    }

    if (queryIntent.filters.state && queryIntent.filters.state.length > 0) {
      query = query.in('state', queryIntent.filters.state);
    }

    // Date range filter
    if (queryIntent.filters.dateRange) {
      const now = new Date();
      let startDate: Date;
      
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
          break;
      }
      
      if (startDate!) {
        query = query.gte('date', startDate.toISOString());
      }
      
      if (queryIntent.filters.dateRange === 'custom' && queryIntent.filters.customDateEnd) {
        const endDate = new Date(queryIntent.filters.customDateEnd);
        query = query.lte('date', endDate.toISOString());
      }
    }

    // Amount filter
    if (queryIntent.filters.amount) {
      if (queryIntent.filters.amount.min) {
        query = query.gte('amount', queryIntent.filters.amount.min);
      }
      if (queryIntent.filters.amount.max) {
        query = query.lte('amount', queryIntent.filters.amount.max);
      }
    }

    // Execute query
    const { data: applications, error } = await query;

    if (error) {
      throw new Error(`Database query failed: ${error.message}`);
    }

    console.log(`Retrieved ${applications?.length || 0} applications`);

    // Generate report data and charts based on the results
    const reportData = generateReportData(applications || [], queryIntent);

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

function generateReportData(applications: any[], intent: QueryIntent) {
  const data: any = {
    totalApplications: applications.length,
    summary: {}
  };

  // Status distribution
  const statusCounts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {});
  
  data.summary.statusDistribution = statusCounts;

  // Type distribution
  const typeCounts = applications.reduce((acc, app) => {
    acc[app.type] = (acc[app.type] || 0) + 1;
    return acc;
  }, {});
  
  data.summary.typeDistribution = typeCounts;

  // Calculate totals and averages
  if (applications.length > 0) {
    const amounts = applications.filter(app => app.amount).map(app => parseFloat(app.amount));
    if (amounts.length > 0) {
      data.summary.totalAmount = amounts.reduce((sum, amount) => sum + amount, 0);
      data.summary.averageAmount = data.summary.totalAmount / amounts.length;
    }
  }

  // Generate chart configurations for dashboards
  if (intent.type === 'dashboard') {
    data.charts = [
      {
        type: 'pie',
        title: 'Applications by Status',
        data: Object.entries(statusCounts).map(([status, count]) => ({
          name: status,
          value: count
        }))
      },
      {
        type: 'bar',
        title: 'Applications by Type',
        data: Object.entries(typeCounts).map(([type, count]) => ({
          name: type,
          value: count
        }))
      }
    ];
  }

  // Add detailed application list for reports
  if (intent.type === 'report') {
    data.applications = applications.map(app => ({
      id: app.id,
      name: app.name,
      status: app.status,
      type: app.type,
      amount: app.amount,
      date: app.date,
      state: app.state
    }));
  }

  return data;
}