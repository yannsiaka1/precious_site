import type { ElementType, ReactNode } from "react";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/cn";

type Variant = "up" | "left" | "right" | "zoom" | "fade";

interface RevealProps {
  children: ReactNode;
  /** Décalage en millisecondes, pour orchestrer une entrée en cascade. */
  delay?: number;
  /** Sens de l'apparition. Discret par défaut. */
  variant?: Variant;
  as?: ElementType;
  className?: string;
}

const hidden: Record<Variant, string> = {
  up: "translate-y-10 opacity-0",
  left: "-translate-x-12 opacity-0",
  right: "translate-x-12 opacity-0",
  zoom: "scale-[0.95] opacity-0",
  fade: "opacity-0",
};

/**
 * Fait apparaître son contenu à l'entrée dans l'écran.
 * L'attribut `data-reveal` sert de repère au repli <noscript> défini dans
 * index.html : sans JavaScript, le contenu s'affiche directement.
 */
export function Reveal({
  children,
  delay = 0,
  variant = "up",
  as: Tag = "div",
  className,
}: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <Tag
      ref={ref}
      data-reveal=""
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "transition-[opacity,transform] duration-[1100ms] ease-(--ease-out-soft) will-change-[opacity,transform] motion-reduce:transition-none",
        inView ? "translate-none scale-100 opacity-100" : hidden[variant],
        className,
      )}
    >
      {children}
    </Tag>
  );
}
