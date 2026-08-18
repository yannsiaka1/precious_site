import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface SectionProps {
  id: string;
  children: ReactNode;
  className?: string;
  /** Largeur maximale du contenu, centrée. */
  contentClassName?: string;
}

/** Rythme vertical et gouttières identiques pour toutes les sections. */
export function Section({
  id,
  children,
  className,
  contentClassName,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn("px-5 py-20 sm:px-8 md:py-28 lg:px-16 lg:py-36", className)}
    >
      <div className={cn("mx-auto w-full max-w-[82rem]", contentClassName)}>
        {children}
      </div>
    </section>
  );
}
