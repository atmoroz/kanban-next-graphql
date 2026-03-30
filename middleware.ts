import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(_request: NextRequest) {
// Placeholder for EPIC-02: here we will later add JWT checks in httpOnly cookie
// and redirects depending on whether the user is authenticated or not.
  return NextResponse.next();
}

export const config = {
  matcher: ["/board/:path*"],
};

