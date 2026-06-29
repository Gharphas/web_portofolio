"use client";

import { Spinner } from "@/components/ui/Spinner";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background gap-3">
      <Spinner className="h-8 w-8 text-primary" />
      <span className="text-xs text-muted-foreground font-mono animate-pulse uppercase tracking-wider">
        Loading...
      </span>
    </div>
  );
}
