import React from "react";
import { cn } from "../lib/utils";

type GlassContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export function GlassContainer({ children, className }: GlassContainerProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-white/2 backdrop-blur-md backdrop-saturate-125 shadow-[inset_0_1px_2px_rgba(255,255,255,0.08),0_4px_12px_rgba(0,0,0,0.25)] text-black/80 dark:text-white/80",
        className
      )}
    >
      {children}
    </div>
  );
}
