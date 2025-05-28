
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TasksListProps {
  type: "unassigned" | "assigned" | "completed";
  showMyTasksOnly?: boolean;
  currentUser?: string;
}

const TasksList: React.FC<TasksListProps> = ({ type, showMyTasksOnly = false, currentUser = "" }) => {
  const mockTasks = {
    unassigned: [
      { orderNumber: "ORD-2024-001", priority: "P1", deliveryDate: "2024-01-15" },
      { orderNumber: "ORD-2024-002", priority: "P3", deliveryDate: "2024-01-16" },
      { orderNumber: "ORD-2024-003", priority: "P2", deliveryDate: "2024-01-17" },
      { orderNumber: "ORD-2024-004", priority: "P5", deliveryDate: "2024-01-18" },
      { orderNumber: "ORD-2024-005", priority: "P1", deliveryDate: "2024-01-19" },
    ],
    assigned: [
      { orderNumber: "ORD-2024-006", priority: "P2", deliveryDate: "2024-01-15", owner: "John Smith" },
      { orderNumber: "ORD-2024-007", priority: "P4", deliveryDate: "2024-01-16", owner: "Sarah Johnson" },
      { orderNumber: "ORD-2024-008", priority: "P1", deliveryDate: "2024-01-17", owner: "Mike Davis" },
      { orderNumber: "ORD-2024-009", priority: "P3", deliveryDate: "2024-01-18", owner: "Lisa Wilson" },
      { orderNumber: "ORD-2024-010", priority: "P6", deliveryDate: "2024-01-19", owner: "Tom Brown" },
      { orderNumber: "ORD-2024-015", priority: "P1", deliveryDate: "2024-01-20", owner: "John Smith" },
      { orderNumber: "ORD-2024-016", priority: "P2", deliveryDate: "2024-01-21", owner: "John Smith" },
    ],
    completed: [
      { orderNumber: "ORD-2024-011", priority: "P1", deliveryDate: "2024-01-10", owner: "John Smith", closedTime: "2024-01-12 14:30" },
      { orderNumber: "ORD-2024-012", priority: "P2", deliveryDate: "2024-01-11", owner: "Sarah Johnson", closedTime: "2024-01-13 09:15" },
      { orderNumber: "ORD-2024-013", priority: "P3", deliveryDate: "2024-01-12", owner: "Mike Davis", closedTime: "2024-01-14 16:45" },
      { orderNumber: "ORD-2024-014", priority: "P4", deliveryDate: "2024-01-13", owner: "Lisa Wilson", closedTime: "2024-01-15 11:20" },
      { orderNumber: "ORD-2024-017", priority: "P2", deliveryDate: "2024-01-14", owner: "John Smith", closedTime: "2024-01-16 10:15" },
    ]
  };

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

  // Filter tasks based on showMyTasksOnly flag
  const getFilteredTasks = () => {
    let tasks = mockTasks[type];
    
    if (showMyTasksOnly && (type === "assigned" || type === "completed")) {
      tasks = tasks.filter(task => task.owner === currentUser);
    }
    
    // For unassigned tasks, if "My Tasks Only" is enabled, show empty list
    if (showMyTasksOnly && type === "unassigned") {
      tasks = [];
    }
    
    return tasks;
  };

  const tasks = getFilteredTasks();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{getTitle()}</CardTitle>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
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
              {tasks.map((task, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{task.orderNumber}</TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(task.deliveryDate).toLocaleDateString()}</TableCell>
                  {(type === "assigned" || type === "completed") && (
                    <TableCell>{task.owner}</TableCell>
                  )}
                  {type === "completed" && (
                    <TableCell>{task.closedTime}</TableCell>
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
