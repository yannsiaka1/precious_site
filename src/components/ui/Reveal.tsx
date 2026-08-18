import type { ElementType, ReactNode } from "react";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/cn";

/**
 * Sens d'apparition disponibles.
 *
 * Volontairement limités au vertical et à l'opacité : un décalage horizontal
 * élargit la zone défilable du document et provoque un défilement latéral sur
 * téléphone. C'est aussi ce qui rend le défilement plus calme — l'œil suit un
 * seul axe, celui de la lecture.
 */
type Variant = "up" | "fade" | "zoom";

/** État de départ de chaque variante. */
const hidden: Record<Variant, string> = {
  up: "translate-y-12 opacity-0",
  fade: "opacity-0",
  zoom: "scale-[0.96] opacity-0",
};

interface RevealProps {
  children: ReactNode;
  /** Décalage en millisecondes. Utiliser des multiples de STAGGER. */
  delay?: number;
  variant?: Variant;
  as?: ElementType;
  className?: string;
}

/**
 * Intervalle standard entre deux éléments d'une même série.
 * Une seule valeur pour tout le site : les cascades ont partout le même
 * rythme, ce qui donne l'impression d'une page unique plutôt que d'une
 * succession d'effets.
 */
export const STAGGER = 200;

/**
 * Fait apparaître son contenu à l'entrée dans l'écran.
 *
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
        "transition-[opacity,transform] duration-700 ease-out will-change-[opacity,transform]",
        "motion-reduce:translate-none motion-reduce:scale-100 motion-reduce:opacity-100 motion-reduce:transition-none",
        inView ? "translate-none scale-100 opacity-100" : hidden[variant],
        className,
      )}
    >
      {children}
    </Tag>
  );
}
