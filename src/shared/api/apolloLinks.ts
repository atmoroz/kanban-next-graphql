"use client";

import { ApolloLink, HttpLink } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";
import { showErrorToast, showInfoToast } from "@/shared/lib/toast";

function getHttpUri(): string {
  // All HTTP requests go through the edge proxy /api/graphql,
  // which adds Authorization from the httpOnly cookie.
  return "/api/graphql";
}

function getWsUri(): string {
  const httpUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!httpUrl) return "ws://localhost:4000/graphql";
  return httpUrl.replace(/^http/, "ws");
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
          connectionParams: () => ({}),
          on: {
            connected: () => {
              showInfoToast("Realtime connection established");
            },
            closed: () => {
              showErrorToast("Realtime connection lost. Reconnecting…");
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
