"use client";

import { ApolloLink, HttpLink, split } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";
import { env } from "@/shared/config/env";

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
          connectionParams: () => ({
            // token if needed
          }),
        }),
      );

const splitLink =
  wsLink &&
  split(
    ({ query }) => {
      const def = getMainDefinition(query);
      return def.kind === "OperationDefinition" && def.operation === "subscription";
    },
    wsLink,
    httpLink,
  );

export const apolloLink: ApolloLink = splitLink ?? httpLink;
