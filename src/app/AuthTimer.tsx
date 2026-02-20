"use client";

import { useEffect } from "react";
import { startRefreshTokenTimer } from "@/lib/api";

export default function AuthTimer() {
  useEffect(() => {
    startRefreshTokenTimer();
  }, []);

  return null;
}
