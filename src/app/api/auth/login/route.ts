import { NextRequest, NextResponse } from "next/server";
import { env } from "@/shared/config/env";
import { LOGIN_MUTATION } from "@/graphql/mutations/auth";

const AUTH_COOKIE_NAME = "auth_token";
const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

type AuthPayload = {
  token: string;
  user: { id: string; email: string; name: string | null };
};

type GraphQLResponse = {
  data?: { login: AuthPayload };
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

  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const { email, password } = body;
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
      query: LOGIN_MUTATION,
      variables: { email, password },
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "Auth service unavailable" },
      { status: 502 },
    );
  }

  const json = (await res.json()) as GraphQLResponse;

  if (json.errors?.length) {
    return NextResponse.json(
      { error: json.errors[0]?.message ?? "Login failed" },
      { status: 401 },
    );
  }

  const token = json.data?.login?.token;
  if (!token) {
    return NextResponse.json(
      { error: "No token in response" },
      { status: 502 },
    );
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
