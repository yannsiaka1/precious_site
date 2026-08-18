import { savoirFaire } from "@/content/offerings";
import type { ServiceId } from "@/content/types";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
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
      className="grain page-x bg-leaf py-20 text-paper md:py-28 lg:py-32"
    >
      <div className="mx-auto w-full max-w-[82rem]">
        <SectionHeader
          tone="dark"
          eyebrow="Notre savoir-faire"
          title="Une seule maison, trois façons de faire plaisir."
        />

        {/* Colonnes de 26,4 % séparées par 10,4 % — proportions de la maquette. */}
        <ul className="mt-24 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-[10.4%]">
          {savoirFaire.map((card, index) => (
            <Reveal
              key={card.title}
              as="li"
              delay={index * 160}
              className={cn("flex flex-col", offsets[card.offset])}
            >
              <div className="border-l border-paper/50 pl-4">
                <p className="font-display text-xl">{card.pillar}</p>
                <p className="mt-1 text-lg text-paper/85">
                  {card.pillarDetail}
                </p>
              </div>

              <p className="mt-5 max-w-[36ch] text-paper/85">
                {card.description}
              </p>

              <Button
                variant="onDark"
                className="mt-7 w-fit"
                onClick={() => onGoTo(card.target)}
              >
                Voir les détails
              </Button>

              <img
                src={card.image}
                alt={card.alt}
                loading="lazy"
                decoding="async"
                width={662}
                height={1054}
                sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 27vw"
                className="mt-8 aspect-[331/527] w-full object-cover object-center"
              />

              <h3 className="mt-6 font-display text-2xl text-paper">
                {card.title}
              </h3>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
