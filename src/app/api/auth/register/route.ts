import { NextRequest, NextResponse } from "next/server";
import { env } from "@/shared/config/env";
import { AUTH_COOKIE_NAME } from "@/shared/config/auth";
import { REGISTER_MUTATION } from "@/graphql/mutations/auth";

const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days
type AuthPayload = {
  token: string;
  user: { id: string; email: string; name: string | null };
};

type GraphQLResponse = {
  data?: { register: AuthPayload };
  errors?: Array<{ message: string }>;
};

export async function POST(request: NextRequest) {
  const endpoint = env.server.GRAPHQL_API_URL;
  if (!endpoint) {
    return NextResponse.json(
      { error: "GraphQL API URL not configured" },
      { status: 500 },
    );
  }

  let body: { email?: string; password?: string; name?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { email, password, name } = body;
  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 },
    );
  }

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: REGISTER_MUTATION,
      variables: { email, password, name: name ?? null },
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Auth service unavailable" }, { status: 502 });
  }

  const json = (await res.json()) as GraphQLResponse;

  if (json.errors?.length) {
    return NextResponse.json(
      { error: json.errors[0]?.message ?? "Registration failed" },
      { status: 400 },
    );
  }

  const token = json.data?.register?.token;
  if (!token) {
    return NextResponse.json({ error: "No token in response" }, { status: 502 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
    maxAge: AUTH_COOKIE_MAX_AGE,
  });

  return response;
}
