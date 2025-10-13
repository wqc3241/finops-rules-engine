import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Task {
  id: string;
  task_number: string;
  order_number: string;
  priority: 'P1' | 'P2' | 'P3' | 'P4' | 'P5' | 'P6' | 'P7';
  delivery_date: string;
  is_assigned: boolean;
  category: 'pending_application' | 'contract_redraft' | 'ofac_review' | 'credit_notice' | 'review_copy';
  assigned_to?: string;
  assigned_at?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
  application_id?: string;
  case_status: 'New' | 'In Progress' | 'Closed';
  subject?: string;
  case_origin?: string;
  description?: string;
  type?: string;
  sub_type?: string;
  case_reason?: string;
  sub_reason?: string;
  additional_reasons?: string[];
  trade_in_id?: string;
  assignee?: {
    email: string;
    role: string;
  };
}

export const useTasks = (filterType?: 'unassigned' | 'assigned' | 'completed', userId?: string) => {
  return useQuery({
    queryKey: ['tasks', filterType, userId],
    queryFn: async () => {
      let query: any = supabase
        .from('tasks')
        .select('*')
        .order('delivery_date', { ascending: true });

      if (filterType === 'unassigned') {
        query = query.eq('is_assigned', false);
      } else if (filterType === 'assigned') {
        query = query.eq('is_assigned', true);
        if (userId) {
          query = query.eq('assigned_to', userId);
        }
      } else if (filterType === 'completed') {
        query = query.eq('case_status', 'Closed');
      }

      if (userId && !filterType) {
        query = query.eq('assigned_to', userId);
      }

      const { data, error } = await query;

      if (error) throw error;

      if (!data) return [] as Task[];

      // Fetch user profiles for assigned tasks
      if (data.length > 0) {
        const userIds = data
          .map((task: any) => task.assigned_to)
          .filter((id: any): id is string => id !== null);

        if (userIds.length > 0) {
          const { data: profiles } = await supabase
            .from('user_profiles')
            .select('user_id, email, role')
            .in('user_id', userIds);

          const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);

          return data.map((task: any) => ({
            ...task,
            assignee: task.assigned_to ? profileMap.get(task.assigned_to) : undefined
          })) as Task[];
        }
      }

      return (data as any) as Task[];
    }
  });
};

export const useTasksSummary = (userId?: string) => {
  return useQuery({
    queryKey: ['tasks-summary', userId],
    queryFn: async () => {
      let query: any = supabase
        .from('tasks')
        .select('category, case_status')
        .neq('case_status', 'Closed');

      if (userId) {
        query = query.eq('assigned_to', userId);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Count tasks by category
      const counts = {
        pendingApplications: 0,
        contractsToRedraft: 0,
        ofacReview: 0,
        creditNotice: 0,
        reviewCopy: 0
      };

      data?.forEach((task: any) => {
        switch (task.category) {
          case 'pending_application':
            counts.pendingApplications++;
            break;
          case 'contract_redraft':
            counts.contractsToRedraft++;
            break;
          case 'ofac_review':
            counts.ofacReview++;
            break;
          case 'credit_notice':
            counts.creditNotice++;
            break;
          case 'review_copy':
            counts.reviewCopy++;
            break;
        }
      });

      return counts;
    }
  });
};

export const useUpcomingDeliveries = (userId?: string) => {
  return useQuery({
    queryKey: ['upcoming-deliveries', userId],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      
      let query: any = supabase
        .from('tasks')
        .select('delivery_date')
        .neq('case_status', 'Closed')
        .gte('delivery_date', today)
        .order('delivery_date', { ascending: true});

      if (userId) {
        query = query.eq('assigned_to', userId);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Group by date and count
      const deliveryCounts = new Map<string, number>();
      data?.forEach((task: any) => {
        const date = task.delivery_date;
        deliveryCounts.set(date, (deliveryCounts.get(date) || 0) + 1);
      });

      // Convert to array and determine status
      const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

      return Array.from(deliveryCounts.entries())
        .map(([date, count]) => ({
          date,
          count,
          status: date === today ? 'today' : date === tomorrow ? 'tomorrow' : 'upcoming'
        }))
        .slice(0, 5); // Limit to next 5 days
    }
  });
};
