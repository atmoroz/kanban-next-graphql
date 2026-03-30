"use client";

import { ApolloLink, HttpLink } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";
import { showInfoToast } from "@/shared/lib/toast";

async function getWsAuthToken(): Promise<string | null> {
  try {
    const res = await fetch("/api/ws-token", { method: "GET" });
    if (!res.ok) return null;
    const data = (await res.json()) as { token: string | null };
    return data.token ?? null;
  } catch {
    return null;
  }
}

function getHttpUri(): string {
  // All HTTP requests go through the edge proxy /api/graphql,
  // which adds Authorization from the httpOnly cookie.
  return "/api/graphql";
}

function getWsUri(): string {
  const httpUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!httpUrl) return "ws://localhost:4000/graphql";
  const url = new URL(httpUrl);
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  if (!url.pathname || url.pathname === "/") {
    url.pathname = "/graphql";
  }
  return url.toString();
}

const httpLink = new HttpLink({
  uri: getHttpUri(),
});

const wsLink =
  typeof window === "undefined"
    ? null
    : new GraphQLWsLink(
        createClient({
          url: getWsUri(),
          lazy: true,
          retryAttempts: 5,
          connectionParams: async () => {
            const token = await getWsAuthToken();
            return token ? { Authorization: `Bearer ${token}` } : {};
          },
          on: {
            connected: () => {
              console.info("Realtime connected");
            },
          },
        }),
      );

const splitLink =
  wsLink &&
  ApolloLink.split(
    ({ query }) => {
      const def = getMainDefinition(query);
      return def.kind === "OperationDefinition" && def.operation === "subscription";
    },
    wsLink,
    httpLink,
  );

export const apolloLink: ApolloLink = splitLink ?? httpLink;
