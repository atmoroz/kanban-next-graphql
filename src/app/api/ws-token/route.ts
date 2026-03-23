import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/shared/config/auth";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value ?? null;
  return NextResponse.json({ token });
}
