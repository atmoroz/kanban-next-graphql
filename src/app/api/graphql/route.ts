import { NextRequest, NextResponse } from "next/server";
import { env } from "@/shared/config/env";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;

  const body = await req.text();

  const res = await fetch(env.server.GRAPHQL_API_URL ?? "", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body,
  });

  return new NextResponse(res.body, {
    status: res.status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

