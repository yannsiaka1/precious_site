import type { ReactNode } from "react";
import { Eyebrow } from "./Eyebrow";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/cn";

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  /** Sur fond sombre, le surtitre et le texte d'intro s'éclaircissent. */
  tone?: "light" | "dark";
  className?: string;
}

/** En-tête commun à toutes les sections : surtitre, titre, intro à droite. */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  tone = "light",
  className,
}: SectionHeadingProps) {
  const dark = tone === "dark";

  return (
    <div
      className={cn(
        "grid items-end gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.7fr)] lg:gap-16",
        className,
      )}
    >
      <Reveal>
        <Eyebrow className={dark ? "text-mango" : undefined}>{eyebrow}</Eyebrow>
        <h2 className="mt-4 text-(length:--text-title)">{title}</h2>
      </Reveal>
      {intro ? (
        <Reveal delay={90}>
          <p
            className={cn(
              "max-w-prose",
              dark ? "text-paper/70" : "text-ink/70",
            )}
          >
            {intro}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}
