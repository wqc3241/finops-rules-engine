import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useUpdateTask } from "@/hooks/useUpdateTask";
import { useUserProfiles } from "@/hooks/useUserProfiles";
import TradeInSection from "./TradeInSection";
import type { Task } from "@/hooks/useTasks";

interface TaskDetailModalProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, open, onOpenChange }) => {
  const [caseStatus, setCaseStatus] = useState<"New" | "In Progress" | "Closed">(task?.case_status || "New");
  const [assignedTo, setAssignedTo] = useState(task?.assigned_to || "unassigned");
  
  const { mutate: updateTask, isPending } = useUpdateTask();
  const { data: userProfiles } = useUserProfiles();

  React.useEffect(() => {
    if (task) {
      setCaseStatus(task.case_status);
      setAssignedTo(task.assigned_to || "unassigned");
    }
  }, [task]);

  const handleSave = () => {
    if (!task) return;

    const updates: Partial<Task> = {
      case_status: caseStatus,
      assigned_to: assignedTo === "unassigned" ? null : assignedTo,
      is_assigned: assignedTo !== "unassigned",
    };

    if (caseStatus === "Closed" && !task.completed_at) {
      updates.completed_at = new Date().toISOString();
    }

    updateTask(
      { taskId: task.id, updates },
      {
        onSuccess: () => {
          onOpenChange(false);
        }
      }
    );
  };

  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-4">
        <DialogHeader>
          <DialogTitle>Task Details - {task.task_number}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-muted-foreground text-xs">Task Number</Label>
              <p className="font-medium text-sm">{task.task_number}</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">Order Number</Label>
              <p className="font-medium text-sm">{task.order_number}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-muted-foreground text-xs">Priority</Label>
              <p className="font-medium text-sm">{task.priority}</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">Category</Label>
              <p className="font-medium text-sm">{task.category}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-muted-foreground text-xs">Subject</Label>
              <p className="font-medium text-sm">{task.subject || '-'}</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">Type</Label>
              <p className="font-medium text-sm">{task.type || '-'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-muted-foreground text-xs">Delivery Date</Label>
              <p className="font-medium text-sm">{new Date(task.delivery_date).toLocaleDateString()}</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">Created At</Label>
              <p className="font-medium text-sm">{new Date(task.created_at).toLocaleDateString()}</p>
            </div>
          </div>

          <TradeInSection tradeInId={task.trade_in_id} />

          <div className="pt-2 border-t space-y-2">
            <div>
              <Label htmlFor="case-status" className="text-xs">Case Status</Label>
              <Select value={caseStatus} onValueChange={(value) => setCaseStatus(value as "New" | "In Progress" | "Closed")}>
                <SelectTrigger id="case-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="assigned-to" className="text-xs">Assigned To</Label>
              <Select value={assignedTo} onValueChange={setAssignedTo}>
                <SelectTrigger id="assigned-to">
                  <SelectValue placeholder="Select user..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {userProfiles?.map((profile) => (
                    <SelectItem key={profile.user_id} value={profile.user_id}>
                      {profile.email} ({profile.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isPending}>
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailModal;
