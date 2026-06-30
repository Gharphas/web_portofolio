"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ReactNode } from "react";

// Filter out the React 19 script tag warning and common hydration mismatch warnings (e.g. extension autofills) in development console
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const orig = console.error;
  console.error = (...args: unknown[]) => {
    if (typeof args[0] === "string") {
      const msg = args[0].toLowerCase();
      if (
        msg.includes("encountered a script tag") ||
        msg.includes("hydration") ||
        msg.includes("did not match") ||
        msg.includes("fdprocessedid")
      ) {
        return;
      }
    }
    orig.apply(console, args);
  };
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange={false}
    >
      {children}
    </NextThemesProvider>
  );
}
