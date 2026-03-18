"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function useBoardFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const searchQuery = searchParams.get("q") ?? "";

  const setSearchQuery = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set("q", value);
    } else {
      params.delete("q");
    }

    const queryString = params.toString();
    const url = queryString ? `${pathname}?${queryString}` : pathname;

    router.replace(url, { scroll: false });
  };

  const clear = () => setSearchQuery("");

  const filtersActive = Boolean(searchQuery.trim());

  return {
    searchQuery,
    setSearchQuery,
    clear,
    filtersActive,
  };
}

export function useIsBoardSearchMode() {
  const { filtersActive } = useBoardFilters();
  return filtersActive;
}
