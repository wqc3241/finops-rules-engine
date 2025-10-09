import { supabase } from '@/integrations/supabase/client';

export class Analytics {
  static async trackEvent(
    event: string,
    properties?: Record<string, any>
  ) {
    const { data: userData } = await supabase.auth.getUser();
    
    console.log('[Analytics]', event, properties);

    // Log to console for now - can be extended to external analytics service
    try {
      // Could send to analytics table if needed
      const eventData = {
        user_id: userData?.user?.id,
        event,
        properties,
        timestamp: new Date().toISOString(),
      };
      
      // For now just console log - can be enhanced later
      console.log('Analytics Event:', eventData);
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }

  static trackApplicationView(applicationId: string) {
    this.trackEvent('application_viewed', { applicationId });
  }

  static trackFilterUsage(filterType: string, values: string[]) {
    this.trackEvent('filter_used', { filterType, values });
  }

  static trackError(error: Error, context: string) {
    this.trackEvent('error_occurred', {
      message: error.message,
      context,
      stack: error.stack,
    });
  }
}
