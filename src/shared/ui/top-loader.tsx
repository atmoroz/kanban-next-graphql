"use client";

import NextTopLoader from "nextjs-toploader";

export function TopLoader() {
  return (
    <NextTopLoader
      showSpinner={false}
      color="var(--foreground)"
      height={4}
      crawl={true}
      easing="ease"
      speed={200}
    />
  );
}
