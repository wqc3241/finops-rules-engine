import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Eye, Calendar, Bot } from 'lucide-react';
import { useAIGeneratedDashboards, useDeleteAIDashboard } from '@/hooks/useAIReports';
import { formatDistanceToNow } from 'date-fns';

interface AIDashboardsListProps {
  onViewDashboard: (dashboardId: string) => void;
}

const AIDashboardsList: React.FC<AIDashboardsListProps> = ({ onViewDashboard }) => {
  const { data: aiDashboards, isLoading } = useAIGeneratedDashboards();
  const deleteDashboard = useDeleteAIDashboard();

  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <p className="text-sm text-muted-foreground">Loading AI-generated dashboards...</p>
      </div>
    );
  }

  if (!aiDashboards || aiDashboards.length === 0) {
    return (
      <div className="p-4 text-center">
        <Bot className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-sm text-muted-foreground mb-2">No AI-generated dashboards yet</p>
        <p className="text-xs text-muted-foreground">
          Use the AI Assistant to generate dashboards using natural language
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {aiDashboards.map((dashboard) => (
        <Card key={dashboard.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg line-clamp-2">{dashboard.name}</CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="text-xs">
                    <Bot className="h-3 w-3 mr-1" />
                    AI Generated
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-3">
            {dashboard.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {dashboard.description}
              </p>
            )}

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>
                {formatDistanceToNow(new Date(dashboard.created_at), { addSuffix: true })}
              </span>
            </div>

            {dashboard.widgets && Array.isArray(dashboard.widgets) && (
              <div className="text-xs">
                <p>Widgets: <span className="font-medium">{dashboard.widgets.length}</span></p>
              </div>
            )}

            <div className="flex justify-between pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDashboard(dashboard.id)}
                className="flex-1 mr-2"
              >
                <Eye className="h-4 w-4 mr-1" />
                View Dashboard
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => deleteDashboard.mutate(dashboard.id)}
                disabled={deleteDashboard.isPending}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AIDashboardsList;