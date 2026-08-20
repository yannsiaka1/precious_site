import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * Visuels des bouteilles en tête de page.
 *
 * Les trois images font exactement 781 x 429 : le cadre ne bouge pas d'un
 * pixel d'un visuel à l'autre, seul le contenu se substitue en fondu. Le
 * changement est lent et sans mouvement latéral — il doit se remarquer sans
 * jamais attirer l'œil au détriment du texte.
 */

interface Visuel {
  src: string;
  alt: string;
}

const DUREE = 4800;

export function HeroCarousel({ visuels }: { visuels: Visuel[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (visuels.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const minuteur = window.setInterval(
      () => setIndex((courant) => (courant + 1) % visuels.length),
      DUREE,
    );
    return () => window.clearInterval(minuteur);
  }, [visuels.length]);

  return (
    <div className="relative w-full" style={{ aspectRatio: "781 / 429" }}>
      {visuels.map((visuel, position) => {
        const visible = position === index;
        return (
          <img
            key={visuel.src}
            src={visuel.src}
            alt={position === 0 ? visuel.alt : ""}
            aria-hidden={position !== 0 || undefined}
            width={781}
            height={429}
            // Seule la première image est chargée en priorité : c'est elle
            // que le visiteur voit à l'ouverture de la page.
            fetchPriority={position === 0 ? "high" : "low"}
            loading={position === 0 ? "eager" : "lazy"}
            decoding="async"
            sizes="(max-width: 1023px) 92vw, 48vw"
            className={cn(
              "absolute inset-0 h-full w-full origin-center scale-y-[1.07] object-contain",
              "drop-shadow-[0_26px_46px_rgba(90,80,20,0.22)]",
              "transition-opacity duration-[1200ms] ease-in-out motion-reduce:transition-none",
              visible ? "opacity-100" : "opacity-0",
            )}
          />
        );
      })}
    </div>
  );
}
