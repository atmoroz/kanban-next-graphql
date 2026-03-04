"use client";

import { createContext, useContext, useEffect } from "react";
import { useApolloClient } from "@apollo/client/react";
import type { MeUser } from "@/entities/user";
import { MeDocument } from "@/graphql/generated/graphql";

type AuthContextValue = MeUser | null;

const AuthContext = createContext<AuthContextValue>(null);

type AuthProviderProps = {
  user: AuthContextValue;
  children: React.ReactNode;
};

export function AuthProvider({ user, children }: AuthProviderProps) {
  const client = useApolloClient();

  useEffect(() => {
    try {
      client.cache.writeQuery({
        query: MeDocument,
        data: { me: user },
      });
    } catch {
      // ignore cache write errors
    }
  }, [client, user]);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}

export function useUser() {
  return useContext(AuthContext);
}
