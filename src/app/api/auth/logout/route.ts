import { NextResponse } from "next/server";

const AUTH_COOKIE_NAME = "auth_token";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(AUTH_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
    maxAge: 0,
  });
  return response;
}
