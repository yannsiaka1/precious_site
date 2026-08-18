import type { ReactNode } from "react";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/cn";

interface SectionHeaderProps {
  eyebrow: string;
  title: ReactNode;
  /** Sur fond sombre, les filets et le titre s'éclaircissent. */
  tone?: "light" | "dark";
  className?: string;
}

/**
 * En-tête commun à toutes les sections : bloc centré, filet court en haut à
 * gauche, filet court en bas à droite. Proportions relevées sur la maquette
 * (filets de 162 px pour un bloc de ~570 px).
 */
export function SectionHeader({
  eyebrow,
  title,
  tone = "light",
  className,
}: SectionHeaderProps) {
  const dark = tone === "dark";
  const rule = cn(
    "absolute hidden h-px w-40 lg:block",
    dark ? "bg-paper/45" : "bg-ink/30",
  );

  return (
    <Reveal
      className={cn("relative mx-auto w-fit max-w-full text-center", className)}
    >
      <span
        aria-hidden="true"
        className={cn(rule, "-top-8 right-[calc(100%-1rem)]")}
      />

      <p
        className={cn(
          "text-eyebrow font-bold",
          dark ? "text-mango" : "text-gold-ink",
        )}
      >
        {eyebrow}
      </p>
      <h2
        className={cn(
          // Taille calée sur le titre le plus long pour qu'il tienne sur une
          // seule ligne à partir du grand écran. En dessous, on laisse le
          // texte revenir à la ligne : forcer une ligne unique sur téléphone
          // le rendrait illisible.
          "mt-3 text-[clamp(1.6rem,2.15vw,2.4rem)] lg:whitespace-nowrap",
          dark ? "text-paper" : "text-forest",
        )}
      >
        {title}
      </h2>

      <span
        aria-hidden="true"
        className={cn(rule, "-bottom-8 left-[calc(100%-1rem)]")}
      />
    </Reveal>
  );
}
