import { areArraysEqual } from "@/shared/lib/array/are-arrays-equal";

type TaskPriorityChoice = "low" | "medium" | "high";

type IsTaskFormPristineParams = {
  mode: "create" | "update";
  title: string;
  description: string;
  statusId: string;
  priority: TaskPriorityChoice;
  selectedLabelIds: string[];
  dueDate: string;
  initialTitle: string;
  initialDescription: string;
  initialStatusId: string;
  initialPriority: TaskPriorityChoice;
  initialLabelIds: string[];
  initialDueDate: string;
};

export function isTaskFormPristine({
  mode,
  title,
  description,
  statusId,
  priority,
  selectedLabelIds,
  dueDate,
  initialTitle,
  initialDescription,
  initialStatusId,
  initialPriority,
  initialLabelIds,
  initialDueDate,
}: IsTaskFormPristineParams): boolean {
  if (mode !== "update") return false;

  return (
    title.trim() === initialTitle.trim() &&
    description.trim() === initialDescription.trim() &&
    statusId === initialStatusId &&
    priority === initialPriority &&
    areArraysEqual(selectedLabelIds, initialLabelIds) &&
    dueDate === initialDueDate
  );
}
