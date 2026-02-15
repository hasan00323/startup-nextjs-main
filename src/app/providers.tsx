"use client";

import { ThemeProvider } from "next-themes";
import AuthTimer from "./AuthTimer";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthTimer />
      {children}
    </ThemeProvider>
  );
}
