import { useEffect, useState } from "react";
import { testimonials } from "@/content/offerings";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/cn";

const DELAY = 7000;

/** Carrousel d'avis : défilement automatique, arrêt au survol et au focus. */
export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const current = testimonials[index] ?? testimonials[0]!;

  useEffect(() => {
    if (paused || testimonials.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(
      () => setIndex((i) => (i + 1) % testimonials.length),
      DELAY,
    );
    return () => window.clearInterval(timer);
  }, [paused]);

  return (
    <section
      id="temoignages"
      className="page-x bg-blush py-20 md:py-28 lg:py-32"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="mx-auto w-full max-w-[82rem]">
        <SectionHeader
          eyebrow="Notre communauté"
          title="Les échos de notre passage"
        />

        <div className="relative mx-auto mt-20 max-w-[52rem]">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-6 -left-2 font-display text-[7rem] leading-none text-mango-soft select-none sm:-left-10"
          >
            &rdquo;
          </span>

          <p className="text-center text-eyebrow text-gold-ink">
            Ce qu'ils disent
          </p>

          <figure
            key={current.quote.slice(0, 20)}
            className="mt-8 animate-[fade_600ms_var(--ease-out-soft)_both]"
            aria-live="polite"
          >
            <blockquote className="text-center text-[clamp(1.2rem,1.9vw,1.7rem)] leading-[1.5] text-ink">
              « {current.quote} »
            </blockquote>

            <span
              aria-hidden="true"
              className="mx-auto mt-9 block h-px w-28 bg-ink/25"
            />

            <figcaption className="mt-6 text-center">
              <span className="block font-display text-lg tracking-wide text-forest">
                {current.author}
              </span>
              <span className="mt-1 block text-ink/60">{current.role}</span>
            </figcaption>
          </figure>

          <div className="mt-10 flex justify-center gap-3">
            {testimonials.map((item, position) => (
              <button
                key={item.author}
                type="button"
                onClick={() => setIndex(position)}
                aria-label={`Avis de ${item.author}`}
                aria-current={position === index ? "true" : undefined}
                className={cn(
                  "size-2.5 rounded-full border border-ink/40 transition-colors",
                  position === index ? "bg-ink/70" : "hover:bg-ink/20",
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
