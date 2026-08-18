import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Surtitre de section : situe le contenu avant que le titre ne le nomme. */
export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("text-eyebrow text-forest", className)}>{children}</p>
  );
}
