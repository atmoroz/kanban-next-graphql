"use client";

import { ApolloProvider as ApolloProviderClient } from "@apollo/client/react";
import { getApolloClient } from "./apolloClient";

type ApolloProviderProps = {
  children: React.ReactNode;
};

export function ApolloProvider({ children }: ApolloProviderProps) {
  const client = getApolloClient();
  return (
    <ApolloProviderClient client={client}>{children}</ApolloProviderClient>
  );
}
