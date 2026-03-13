"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { BoardLabel } from "@/entities/label";
import { LabelBadge } from "@/entities/label";
import { TaskActivityList, useTaskActivities } from "@/features/task-activity";
import { isTaskFormPristine } from "@/features/task-form/model/is-task-form-pristine";
import { cn } from "@/shared/lib/cn";
import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";
import { Label } from "@/shared/ui/label";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "@/shared/ui/modal";
import { ChevronDown } from "lucide-react";

type TaskPriorityChoice = "low" | "medium" | "high";

export type TaskFormValues = {
  title: string;
  description: string;
  statusId: string;
  priority: TaskPriorityChoice;
  labelIds: string[];
  dueDate?: string | null;
};

export type TaskStatusOption = {
  id: string;
  label: string;
};

type TaskModalMode = "create" | "update";

type TaskModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: TaskFormValues) => void | Promise<void>;
  statusOptions: TaskStatusOption[];
  labels: BoardLabel[];
  mode?: TaskModalMode;
  initialTitle?: string;
  initialDescription?: string;
  initialStatusId?: string;
  initialPriority?: TaskPriorityChoice;
  initialLabelIds?: string[];
  initialDueDate?: string | null;
  createdAt?: string | null;
  taskId?: string | null;
  isSubmitting?: boolean;
};

export function TaskModal({
  open,
  onClose,
  onSubmit,
  statusOptions,
  labels,
  mode = "create",
  initialTitle = "",
  initialDescription = "",
  initialStatusId,
  initialPriority = "medium",
  initialLabelIds = [],
  initialDueDate = null,
  createdAt,
  taskId,
  isSubmitting = false,
}: TaskModalProps) {
  const initialResolvedStatusId = initialStatusId ?? statusOptions[0]?.id ?? "";
  const initialResolvedDueDate = initialDueDate ? initialDueDate.slice(0, 10) : "";

  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [statusId, setStatusId] = useState<string>(initialResolvedStatusId);
  const [priority, setPriority] = useState<TaskPriorityChoice>(initialPriority);
  const [selectedLabelIds, setSelectedLabelIds] = useState<string[]>(initialLabelIds);
  const [dueDate, setDueDate] = useState<string>("");

  const {
    activities,
    isLoading: activitiesLoading,
    hasMore: activitiesHasMore,
    loadMore: loadMoreActivities,
    isLoadingMore: activitiesLoadingMore,
  } = useTaskActivities(mode === "update" ? (taskId ?? null) : null);

  const hasStatuses = statusOptions.length > 0;

  useEffect(() => {
    if (!open) return;
    setTitle(initialTitle);
    setDescription(initialDescription);
    setStatusId(initialResolvedStatusId);
    setPriority(initialPriority);
    setSelectedLabelIds(initialLabelIds);
    setDueDate(initialResolvedDueDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleToggleLabel = (id: string) => {
    setSelectedLabelIds((prev) =>
      prev.includes(id) ? prev.filter((labelId) => labelId !== id) : [...prev, id],
    );
  };

  const handleSubmit = async (event?: FormEvent) => {
    event?.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle || !hasStatuses || !statusId) return;

    await onSubmit({
      title: trimmedTitle,
      description: description.trim(),
      statusId,
      priority,
      labelIds: selectedLabelIds,
      dueDate: dueDate || null,
    });
  };

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  const titleLabel = mode === "create" ? "Create task" : "Task Details";
  const okText = mode === "create" ? "Create task" : "Save changes";

  const isPristine = isTaskFormPristine({
    mode,
    title,
    description,
    statusId,
    priority,
    selectedLabelIds,
    dueDate,
    initialTitle,
    initialDescription,
    initialStatusId: initialResolvedStatusId,
    initialPriority,
    initialLabelIds,
    initialDueDate: initialResolvedDueDate,
  });

  return (
    <Modal open={open} onClose={handleClose} size="xl">
      <form onSubmit={handleSubmit}>
        <ModalHeader title={titleLabel} onClose={handleClose} />
        <ModalBody>
          <div className="flex flex-col gap-1">
            <div className="flex gap-4">
              <div className="w-4/5 flex flex-col gap-2">
                <div className="space-y-2">
                  <Label htmlFor="task-title">Title</Label>
                  <Input
                    id="task-title"
                    placeholder="Task title"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    autoFocus
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        void handleSubmit();
                      }
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="task-description">Description</Label>
                  <textarea
                    id="task-description"
                    className="min-h-[120px] w-full resize-y rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2 placeholder:text-muted-foreground"
                    placeholder="Add a description..."
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    rows={4}
                  />
                </div>

                {mode === "update" && (
                  <TaskActivityList
                    activities={activities}
                    isLoading={activitiesLoading}
                    isLoadingMore={activitiesLoadingMore}
                    hasMore={activitiesHasMore}
                    onLoadMore={loadMoreActivities}
                  />
                )}
              </div>

              <div className="flex flex-col gap-2">
                <div>
                  <Label htmlFor="task-status">Status</Label>
                  {statusOptions.length < 2 ? (
                    <p className="h-9 w-full flex items-center capitalize rounded-md border border-border bg-background px-3 py-1 text-sm text-foreground shadow-sm">
                      {statusOptions[0]?.label}
                    </p>
                  ) : (
                    <div className="relative">
                      <Select
                        id="task-status"
                        className="h-9 w-full appearance-none capitalize"
                        value={statusId}
                        onChange={(event) => setStatusId(event.target.value)}
                        disabled={!hasStatuses}
                      >
                        {!hasStatuses && <option>No columns available</option>}
                        {statusOptions.map((option) => (
                          <option
                            key={option.id}
                            value={option.id}
                            className="capitalize"
                          >
                            {option.label}
                          </option>
                        ))}
                      </Select>
                      {hasStatuses && (
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="task-priority">Priority</Label>
                  <div className="relative">
                    <Select
                      id="task-priority"
                      className="h-9 w-full appearance-none"
                      value={priority}
                      onChange={(event) =>
                        setPriority(event.target.value as TaskPriorityChoice)
                      }
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </Select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <Label>Select Labels</Label>
                  {labels.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {labels.map((label) => {
                        const isSelected = selectedLabelIds.includes(label.id);
                        return (
                          <LabelBadge
                            key={label.id}
                            label={label}
                            onClick={() => handleToggleLabel(label.id)}
                            className={cn(
                              "text-xs cursor-pointer opacity-40",
                              isSelected && "opacity-100",
                            )}
                          />
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      No labels yet. You can create them from the board header.
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="task-due-date">Due date</Label>
                  <input
                    id="task-due-date"
                    type="date"
                    className="h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm text-foreground shadow-sm outline-none focus-visible:border-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={dueDate}
                    onChange={(event) => setDueDate(event.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                {mode === "update" && createdAt && (
                  <div>
                    <Label htmlFor="">Created at:</Label>
                    <input
                      id="task-created-at-date"
                      type="date"
                      className="h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm text-foreground shadow-sm outline-none focus-visible:border-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      defaultValue={new Date(createdAt).toISOString().split("T")[0]}
                      disabled
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter
          onOk={() => void handleSubmit()}
          onCancel={handleClose}
          okText={okText}
          cancelText="Cancel"
          showCancel
          isLoading={isSubmitting}
          isOkDisabled={mode === "update" && isPristine}
        />
      </form>
    </Modal>
  );
}
