import { areArraysEqual } from "@/shared/lib/array/are-arrays-equal";

type TaskPriorityChoice = "low" | "medium" | "high";

type IsTaskFormPristineParams = {
  mode: "create" | "update";
  title: string;
  description: string;
  statusId: string;
  priority: TaskPriorityChoice;
  selectedLabelIds: string[];
  assigneeId: string;
  dueDate: string;
  initialTitle: string;
  initialDescription: string;
  initialStatusId: string;
  initialPriority: TaskPriorityChoice;
  initialLabelIds: string[];
  initialAssigneeId: string;
  initialDueDate: string;
};

export function isTaskFormPristine({
  mode,
  title,
  description,
  statusId,
  priority,
  selectedLabelIds,
  assigneeId,
  dueDate,
  initialTitle,
  initialDescription,
  initialStatusId,
  initialPriority,
  initialLabelIds,
  initialAssigneeId,
  initialDueDate,
}: IsTaskFormPristineParams): boolean {
  if (mode !== "update") return false;

  return (
    title.trim() === initialTitle.trim() &&
    description.trim() === initialDescription.trim() &&
    statusId === initialStatusId &&
    priority === initialPriority &&
    areArraysEqual(selectedLabelIds, initialLabelIds) &&
    assigneeId === initialAssigneeId &&
    dueDate === initialDueDate
  );
}
