import { cookies } from "next/headers";
import type { MeUser } from "@/entities/user";
import { env } from "@/shared/config/env";

type MeResponse = {
  data?: {
    me: MeUser | null;
  };
  errors?: Array<{ message: string }>;
};

export async function getCurrentUser(): Promise<MeUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return null;
  }

  const endpoint = env.server.GRAPHQL_API_URL;

  if (!endpoint) {
    // Без URL до GraphQL-сервера не можем выполнить me-запрос.
    return null;
  }

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: `
        query Me {
          me {
            id
            email
            name
          }
        }
      `,
    }),
    cache: "no-store",
    next: { tags: ["auth-me"] },
  });

  if (!res.ok) {
    return null;
  }

  let json: MeResponse;

  try {
    json = (await res.json()) as MeResponse;
  } catch {
    return null;
  }

  if (json.errors?.length) {
    return null;
  }

  return json.data?.me ?? null;
}

