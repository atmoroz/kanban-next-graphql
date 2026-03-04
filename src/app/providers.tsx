"use client";

import type { MeUser } from "@/entities/user";
import { ApolloProvider } from "@/shared/api/ApolloProvider";
import { AuthProvider } from "@/shared/providers/auth-provider";

type AppProvidersProps = {
  user: MeUser | null;
  children: React.ReactNode;
};

export function AppProviders({ user, children }: AppProvidersProps) {
  return (
    <ApolloProvider>
      <AuthProvider user={user}>{children}</AuthProvider>
    </ApolloProvider>
  );
}
