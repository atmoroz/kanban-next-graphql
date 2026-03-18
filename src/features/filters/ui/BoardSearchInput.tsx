"use client";

import { useEffect, useState } from "react";
import { Input } from "@/shared/ui/input";
import { useBoardFilters } from "@/features/filters";
import { useDebouncedCallback } from "@/shared/lib/useDebouncedValue";

type BoardSearchInputProps = {
  placeholder?: string;
};

export function BoardSearchInput({
  placeholder = "Search tasks...",
}: BoardSearchInputProps) {
  const { searchQuery, setSearchQuery, clear } = useBoardFilters();

  const [localValue, setLocalValue] = useState(searchQuery);

  const { debounced, cancel } = useDebouncedCallback((value: string) => {
    setSearchQuery(value);
  }, 300);

  useEffect(() => {
    setLocalValue(searchQuery);
  }, [searchQuery]);

  const handleChange = (value: string) => {
    setLocalValue(value);
    debounced(value);
  };

  const handleClear = () => {
    cancel();
    setLocalValue("");
    clear();
  };

  const showClear = localValue.length > 0;

  return (
    <div className="w-[320px] max-w-full relative">
      <Input
        value={localValue}
        placeholder={placeholder}
        onChange={(e) => handleChange(e.target.value)}
      />

      {showClear && (
        <button
          onClick={handleClear}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground"
        >
          ✕
        </button>
      )}
    </div>
  );
}
