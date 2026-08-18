import { useState } from "react";
import { maison } from "@/content/offerings";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";

/**
 * « La maison » en trois chapitres.
 *
 * Carrousel volontairement manuel : on lit ici un texte long, un défilement
 * automatique couperait la lecture. La navigation se fait par les chapitres
 * numérotés, qui servent aussi de repère de progression.
 */
export function Maison() {
  const [index, setIndex] = useState(0);
  const chapter = maison[index] ?? maison[0]!;

  function go(step: number) {
    setIndex((current) => (current + step + maison.length) % maison.length);
  }

  return (
    <section id="maison" className="page-x bg-paper py-20 md:py-28 lg:py-32">
      <div className="mx-auto w-full max-w-[82rem]">
        <SectionHeader eyebrow="La maison" title="À propos de Precious" />

        <Reveal delay={80} className="mt-20">
          {/* Sommaire : chaque chapitre est un onglet, la barre indique
              l'avancement dans le récit. */}
          <ol className="grid gap-px overflow-hidden border-y border-ink/15 sm:grid-cols-3">
            {maison.map((item, position) => {
              const current = position === index;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => setIndex(position)}
                    aria-current={current ? "step" : undefined}
                    className="group relative flex w-full items-baseline gap-4 px-2 py-5 text-left"
                  >
                    <span
                      className={cn(
                        "font-ui text-xs font-bold tracking-[0.16em] transition-colors",
                        current ? "text-mango" : "text-ink/35",
                      )}
                    >
                      {String(position + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        "font-display text-lg transition-colors sm:text-xl",
                        current
                          ? "text-forest"
                          : "text-ink/45 group-hover:text-ink",
                      )}
                    >
                      {item.chapter}
                    </span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute inset-x-0 bottom-0 h-0.5 origin-left bg-mango transition-transform duration-500 ease-(--ease-out-soft)",
                        current ? "scale-x-100" : "scale-x-0",
                      )}
                    />
                  </button>
                </li>
              );
            })}
          </ol>
        </Reveal>

        {/* La clé relance l'animation d'entrée à chaque changement de chapitre. */}
        <div
          key={chapter.id}
          className="mt-14 grid animate-[chapter_560ms_var(--ease-out-soft)_both] items-center gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20"
        >
          <img
            src={chapter.image}
            alt={chapter.alt}
            loading="lazy"
            decoding="async"
            className={cn(
              "w-full object-cover shadow-(--shadow-soft)",
              chapter.imageStyle === "portrait"
                ? "aspect-[483/814] max-h-[34rem] object-top"
                : "aspect-4/3",
            )}
          />

          <div>
            <p className="text-eyebrow text-gold-ink">{chapter.chapter}</p>
            <p className="mt-5 max-w-[32ch] font-display text-[clamp(1.4rem,2.1vw,2rem)] leading-[1.25] text-forest">
              {chapter.lead}
            </p>

            <div className="mt-8 grid gap-5 text-[clamp(1.02rem,1.2vw,1.15rem)] leading-[1.6] text-ink/80">
              {chapter.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 24)} className="max-w-[62ch]">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-10 flex items-center gap-6">
              <button
                type="button"
                onClick={() => go(-1)}
                className="grid size-12 place-items-center rounded-full border border-ink/20 transition-colors hover:border-ink hover:bg-ink hover:text-paper"
                aria-label="Chapitre précédent"
              >
                <svg
                  viewBox="0 0 16 16"
                  width="15"
                  height="15"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M14 8H3m4-4L3 8l4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                className="grid size-12 place-items-center rounded-full border border-ink/20 transition-colors hover:border-ink hover:bg-ink hover:text-paper"
                aria-label="Chapitre suivant"
              >
                <svg
                  viewBox="0 0 16 16"
                  width="15"
                  height="15"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 8h11M9 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <span className="font-ui text-xs font-bold tracking-[0.16em] text-ink/45">
                {String(index + 1).padStart(2, "0")} /{" "}
                {String(maison.length).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
