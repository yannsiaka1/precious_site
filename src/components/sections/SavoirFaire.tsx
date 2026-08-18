import { savoirFaire } from "@/content/offerings";
import type { ServiceId } from "@/content/types";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { Arrow } from "@/components/ui/Arrow";
import { cn } from "@/lib/cn";

/** Décalages verticaux des trois colonnes, repris de la maquette. */
const offsets = {
  high: "lg:mt-0",
  mid: "lg:mt-12",
  low: "lg:mt-16",
} as const;

interface SavoirFaireProps {
  /** Amène le visiteur à la destination de la carte, plus bas dans la page. */
  onGoTo: (target: ServiceId | "academie") => void;
}

export function SavoirFaire({ onGoTo }: SavoirFaireProps) {
  return (
    <section
      id="savoir-faire"
      className="grain page-x bg-leaf py-20 text-paper md:py-28"
    >
      <div className="mx-auto w-full max-w-[82rem]">
        <SectionHeader
          tone="dark"
          eyebrow="Notre savoir-faire"
          title="Une seule maison, trois façons de faire plaisir."
        />

        <ul className="mt-20 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-[10.4%]">
          {savoirFaire.map((card, index) => (
            <Reveal
              key={card.title}
              as="li"
              delay={index * 110}
              className={cn("flex flex-col", offsets[card.offset])}
            >
              <div className="border-l border-paper/50 pl-4">
                <p className="font-display text-xl">{card.pillar}</p>
                <p className="mt-1 text-lg text-paper/85">
                  {card.pillarDetail}
                </p>
              </div>

              <img
                src={card.image}
                alt={card.alt}
                loading="lazy"
                decoding="async"
                width={662}
                height={1054}
                className="mt-6 aspect-[331/527] w-full object-cover"
              />

              <h3 className="mt-6 font-display text-2xl text-paper">
                {card.title}
              </h3>
              <p className="mt-3 max-w-[34ch] text-paper/85">
                {card.description}
              </p>

              <button
                type="button"
                onClick={() => onGoTo(card.target)}
                className="group mt-5 inline-flex w-fit items-center gap-2.5 border-b border-paper/50 pb-1 font-ui text-xs font-bold tracking-[0.16em] uppercase transition-colors hover:border-mango hover:text-mango"
              >
                Voir les détails
                <Arrow />
              </button>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
