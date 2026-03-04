"use client";

import { ApolloLink, HttpLink } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";
import { env } from "@/shared/config/env";
import { showErrorToast, showInfoToast } from "@/shared/lib/toast";

function getHttpUri(): string {
  const url = env.public.NEXT_PUBLIC_API_URL;
  if (!url) return "http://localhost:4000/graphql";
  return url;
}

function getWsUri(): string {
  const httpUrl = env.public.NEXT_PUBLIC_API_URL;
  if (!httpUrl) return "ws://localhost:4000/graphql";
  return httpUrl.replace(/^http/, "ws");
}

const httpLink = new HttpLink({
  uri: getHttpUri(),
  credentials: "same-origin",
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
