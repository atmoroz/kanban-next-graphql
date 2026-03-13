"use client";

import { ApolloClient, InMemoryCache, ApolloLink } from "@apollo/client";
import { apolloLink } from "./apolloLinks";
import { errorLink, feedbackLink } from "@/shared/lib/apollo/errorLink";

function createApolloClient() {
  return new ApolloClient({
    link: ApolloLink.from([errorLink, feedbackLink, apolloLink]),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            taskActivities: {
              keyArgs: ["taskId"],
              merge(existing, incoming) {
                const existingEdges = existing?.edges ?? [];
                const incomingEdges = incoming?.edges ?? [];

                return {
                  ...incoming,
                  edges: [...existingEdges, ...incomingEdges],
                };
              },
            },
            // Add keyArgs and merge for paginated fields (boards, tasksByColumn, etc.) when needed.
          },
        },
        Board: {
          keyFields: ["id"],
        },
        Column: {
          keyFields: ["id"],
        },
        Task: {
          keyFields: ["id"],
        },
        User: {
          keyFields: ["id"],
        },
      },
    }),
    ssrMode: typeof window === "undefined",
  });
}

let client: ReturnType<typeof createApolloClient> | null = null;

export function getApolloClient(): ReturnType<typeof createApolloClient> {
  if (typeof window === "undefined") {
    return createApolloClient();
  }
  if (!client) {
    client = createApolloClient();
  }
  return client;
}
