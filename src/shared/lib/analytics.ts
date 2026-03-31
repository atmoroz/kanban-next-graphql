"use client";

type AnalyticsPrimitive = string | number | boolean | null | undefined;

type AnalyticsData = Record<string, AnalyticsPrimitive>;

export type AnalyticsEvent =
  | "register"
  | "login"
  | "create_board"
  | "create_column"
  | "create_task";

declare global {
  interface Window {
    umami?: (event: string, data?: AnalyticsData) => void;
  }
}

export function track(event: AnalyticsEvent, data?: AnalyticsData): void {
  if (typeof window === "undefined") return;
  if (typeof window.umami !== "function") return;

  try {
    window.umami(event, data);
  } catch {
    // Analytics failures should never affect app UX.
  }
}

