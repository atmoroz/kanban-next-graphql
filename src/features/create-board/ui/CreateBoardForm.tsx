"use client";

import { useCallback, useState } from "react";
import { Label } from "@/shared/ui/label";
import { Input } from "@/shared/ui/input";
import { cn } from "@/shared/lib/cn";
import { BoardVisibility } from "@/graphql/generated/graphql";

export type CreateBoardFormValues = {
  title: string;
  description: string;
  visibility: BoardVisibility;
};

const DEFAULT_VALUES: CreateBoardFormValues = {
  title: "",
  description: "",
  visibility: BoardVisibility.Private,
};

type CreateBoardFormProps = {
  onSubmit: (values: CreateBoardFormValues) => void;
  isLoading?: boolean;
  initialValues?: Partial<CreateBoardFormValues>;
  formId?: string;
};

export function CreateBoardForm({
  onSubmit,
  isLoading,
  initialValues,
  formId = "create",
}: CreateBoardFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? DEFAULT_VALUES.title);
  const [description, setDescription] = useState(
    initialValues?.description ?? DEFAULT_VALUES.description,
  );
  const [visibility, setVisibility] = useState<BoardVisibility>(
    initialValues?.visibility ?? DEFAULT_VALUES.visibility,
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = title.trim();
      if (!trimmed) return;
      onSubmit({
        title: trimmed,
        description: description.trim(),
        visibility,
      });
    },
    [title, description, visibility, onSubmit],
  );

  return (
    <form id={`board-form-${formId}`} onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="board-title">Title</Label>
        <Input
          id="board-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Board name"
          autoFocus
          disabled={isLoading}
          required
          maxLength={100}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="board-description">Description (optional)</Label>
        <Input
          id="board-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short description"
          disabled={isLoading}
          maxLength={400}
        />
      </div>
      <div className="space-y-2">
        <Label>Visibility</Label>
        <div className="flex gap-3">
          {[BoardVisibility.Public, BoardVisibility.Private].map((value) => (
            <label
              key={value}
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-2 text-sm transition-colors",
                visibility === value
                  ? "border-primary bg-primary/10 text-primary"
                  : "hover:bg-muted/50",
              )}
            >
              <input
                type="radio"
                name="visibility"
                value={value}
                checked={visibility === value}
                onChange={() => setVisibility(value)}
                className="sr-only"
                disabled={isLoading}
              />
              {value === BoardVisibility.Public ? "Public" : "Private"}
            </label>
          ))}
        </div>
      </div>
    </form>
  );
}
