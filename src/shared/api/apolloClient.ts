"use client";

import { ApolloClient, InMemoryCache } from "@apollo/client";
import { apolloLink } from "./apolloLinks";

function createApolloClient() {
  return new ApolloClient({
    link: apolloLink,
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            // При необходимости можно добавить keyArgs и merge для пагинируемых полей (boards, tasksByColumn и т.д.)
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
