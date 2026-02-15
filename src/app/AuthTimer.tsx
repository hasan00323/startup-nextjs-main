"use client";

import { useEffect } from "react";
import { startRefreshTokenTimer, stopRefreshTokenTimer } from "@/lib/api";

export default function AuthTimer() {
  useEffect(() => {
    startRefreshTokenTimer();
    return () => stopRefreshTokenTimer();
  }, []);

  return null;
}
