import { useEffect, useRef, useState } from "react";
import { services } from "@/content/offerings";
import type { ServiceId } from "@/content/types";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ImagePairCarousel } from "@/components/ui/ImagePairCarousel";
import { RequestForm } from "@/components/sections/RequestForm";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";

/** Pictogrammes des onglets, repris de la maquette. */
const icons: Record<ServiceId, string> = {
  jus: "M7 4h10l-1 15a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2L7 4Zm0 5h10",
  donuts:
    "M12 4a8 8 0 1 1 0 16 8 8 0 0 1 0-16Zm0 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z",
  evenements: "M4 20l5-14 9 9-14 5Zm10-16 1 2m3 0 1-2m1 6 2-1",
};

interface ServicesProps {
  activeId: ServiceId;
  onActiveChange: (id: ServiceId) => void;
}

export function Services({ activeId, onActiveChange }: ServicesProps) {
  /** L'univers dont le formulaire est ouvert, sinon null. */
  const [formFor, setFormFor] = useState<ServiceId | null>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const activeIndex = services.findIndex((service) => service.id === activeId);
  const active = services[activeIndex] ?? services[0]!;
  const showForm = formFor === activeId;

  // Changer d'univers referme un formulaire ouvert : on ne laisse pas un
  // formulaire « Donuts » sous un onglet « Jus ».
  useEffect(() => setFormFor(null), [activeId]);

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const keys = ["ArrowRight", "ArrowLeft", "Home", "End"];
    if (!keys.includes(event.key)) return;
    event.preventDefault();

    const last = services.length - 1;
    const next =
      event.key === "ArrowRight"
        ? (activeIndex + 1) % services.length
        : event.key === "ArrowLeft"
          ? (activeIndex + last) % services.length
          : event.key === "Home"
            ? 0
            : last;

    const target = services[next];
    if (!target) return;
    onActiveChange(target.id);
    tabRefs.current[target.id]?.focus();
  }

  return (
    <section
      id="creations"
      className="page-x grain bg-blush py-20 md:py-28 lg:py-32"
    >
      <div className="mx-auto w-full max-w-[82rem]">
        <SectionHeader
          eyebrow="Nos créations"
          title="Choisissez votre expérience."
        />

        <Reveal delay={80} className="mt-16 flex justify-center">
          <p className="max-w-[52ch] text-center text-[clamp(1.05rem,1.35vw,1.3rem)] leading-[1.55] text-ink/80">
            Une envie gourmande, une commande de boissons ou un événement à
            imaginer ? Parcourez chaque univers, puis envoyez votre demande en
            quelques instants.
          </p>
        </Reveal>

        <Reveal delay={120} className="mt-12">
          <div
            role="tablist"
            aria-label="Univers Precious"
            onKeyDown={onKeyDown}
            className="flex flex-wrap justify-center gap-4 sm:gap-8"
          >
            {services.map((service) => {
              const selected = service.id === activeId;
              return (
                <button
                  key={service.id}
                  ref={(node) => {
                    tabRefs.current[service.id] = node;
                  }}
                  id={`onglet-${service.id}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls="panneau-creations"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => onActiveChange(service.id)}
                  className={cn(
                    "inline-flex items-center gap-3 border px-6 py-3 font-display text-lg tracking-wide uppercase transition-colors duration-300 sm:text-xl",
                    selected
                      ? "border-mango bg-mango text-paper"
                      : "border-ink/45 text-ink hover:border-ink hover:bg-ink/5",
                  )}
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d={icons[service.id]} />
                  </svg>
                  {service.tab}
                </button>
              );
            })}
          </div>
        </Reveal>

        <div
          id="panneau-creations"
          role="tabpanel"
          aria-labelledby={`onglet-${activeId}`}
          className="mt-10 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]"
        >
          <Reveal variant="left">
            <ImagePairCarousel images={active.gallery} resetKey={active.id} />
          </Reveal>

          {/* Le panneau de droite bascule entre présentation et formulaire.
              La clé relance l'animation d'entrée à chaque changement. */}
          <Reveal variant="right" delay={90} className="self-stretch">
            <div
              key={showForm ? `form-${activeId}` : `intro-${activeId}`}
              className="h-full animate-[panel_420ms_var(--ease-out-soft)_both] bg-butter"
            >
              {showForm ? (
                <RequestForm
                  service={active}
                  onClose={() => setFormFor(null)}
                />
              ) : (
                <div className="flex h-full flex-col justify-center p-8 sm:p-10 lg:p-14">
                  <Eyebrow>{active.eyebrow}</Eyebrow>
                  <h3 className="mt-4 text-[clamp(1.75rem,2.6vw,2.5rem)] text-forest">
                    {active.title}
                  </h3>
                  <p className="mt-6 text-ink/75">{active.description}</p>

                  <ul className="mt-7 grid gap-3">
                    {active.features.map((feature, position) => (
                      <li
                        key={feature}
                        style={{ animationDelay: `${180 + position * 110}ms` }}
                        className="flex animate-[panel_620ms_var(--ease-out-soft)_both] gap-3"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-2.5 block size-1.5 shrink-0 rounded-full bg-mango"
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-9 flex flex-wrap items-center gap-4">
                    <Button variant="red" onClick={() => setFormFor(activeId)}>
                      {active.action}
                    </Button>
                    <Button as="a" href="#contact" variant="forest">
                      Poser une question
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
