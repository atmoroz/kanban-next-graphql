"use client";

import { useRouter } from "next/navigation";

export function useLogout() {
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  return { logout };
}
