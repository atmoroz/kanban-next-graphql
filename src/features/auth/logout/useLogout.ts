"use client";

import { useApolloClient } from "@apollo/client/react";
import { useRouter } from "next/navigation";

export function useLogout() {
  const apolloClient = useApolloClient();
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    await apolloClient.clearStore();
    router.push("/login");
    router.refresh();
  };

  return { logout };
}
