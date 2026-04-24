"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getStoredAccessToken } from "@/lib/api";

export function useRequireAuth() {
  const router = useRouter();
  const token = useMemo(() => getStoredAccessToken(), []);

  useEffect(() => {
    if (!token) router.push("/signin");
  }, [router, token]);

  return { router, token, isAuthenticated: Boolean(token) };
}
