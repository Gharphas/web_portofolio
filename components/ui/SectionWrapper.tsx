"use client";

import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
  children: ReactNode;
  className?: string;
}

export function SectionWrapper({ id, children, className, ...props }: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative overflow-hidden bg-white dark:bg-transparent transition-colors duration-300",
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
}
