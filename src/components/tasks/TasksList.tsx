
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTasks } from "@/hooks/useTasks";

interface TasksListProps {
  type: "unassigned" | "assigned" | "completed";
  showMyTasksOnly?: boolean;
  currentUser?: string;
}

const TasksList: React.FC<TasksListProps> = ({ type, showMyTasksOnly = false, currentUser = "" }) => {
  const { data: tasks, isLoading, error } = useTasks(type, showMyTasksOnly ? currentUser : undefined);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "P1": return "bg-red-100 text-red-800";
      case "P2": return "bg-orange-100 text-orange-800";
      case "P3": return "bg-yellow-100 text-yellow-800";
      case "P4": return "bg-blue-100 text-blue-800";
      case "P5": return "bg-green-100 text-green-800";
      case "P6": return "bg-purple-100 text-purple-800";
      case "P7": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTitle = () => {
    const baseTitle = (() => {
      switch (type) {
        case "unassigned": return "Unassigned Tasks";
        case "assigned": return "Assigned Tasks";
        case "completed": return "Completed Tasks";
      }
    })();
    
    return showMyTasksOnly ? `My ${baseTitle}` : baseTitle;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{getTitle()}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading tasks...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{getTitle()}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">Error loading tasks. Please try again.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{getTitle()}</CardTitle>
      </CardHeader>
      <CardContent>
        {!tasks || tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {showMyTasksOnly && type === "unassigned" 
              ? "No unassigned tasks (viewing your tasks only)"
              : "No tasks found"
            }
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order Number</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Delivery Date</TableHead>
                {(type === "assigned" || type === "completed") && (
                  <TableHead>Task Owner</TableHead>
                )}
                {type === "completed" && (
                  <TableHead>Closed Time</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.order_number}</TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(task.delivery_date).toLocaleDateString()}</TableCell>
                  {type === "assigned" && (
                    <TableCell>{task.assignee?.email || 'Unassigned'}</TableCell>
                  )}
                  {type === "completed" && (
                    <>
                      <TableCell>{task.assignee?.email || 'Unassigned'}</TableCell>
                      <TableCell>{task.completed_at ? new Date(task.completed_at).toLocaleString() : '-'}</TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default TasksList;
