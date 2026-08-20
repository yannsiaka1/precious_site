import { Button } from "@/components/ui/Button";
import { HeroCarousel } from "@/components/ui/HeroCarousel";
import { Reveal, STAGGER } from "@/components/ui/Reveal";
import { useParallax } from "@/hooks/useParallax";

/**
 * Section d'ouverture, reprise de la maquette « section_1 ».
 *
 * Le halo doré est peint en CSS plutôt que laissé dans l'image de fond :
 * ancré sur le bloc de texte, il l'englobe quelle que soit la largeur
 * d'écran, alors qu'un halo incrusté dériverait au recadrage.
 */
export function Hero() {
  const bottles = useParallax<HTMLDivElement>(26);

  return (
    <section
      id="accueil"
      className="relative -mt-24 flex min-h-svh items-center overflow-hidden pt-28 pb-14 lg:-mt-32 lg:pt-36"
    >
      <img
        src="/assets/hero-fond.webp"
        alt=""
        aria-hidden="true"
        width={1512}
        height={895}
        fetchPriority="high"
        sizes="100vw"
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />

      {/* Halo doré : centre à 20,5 % de la largeur, diamètre 26,5 % — relevé
          sur la maquette, exprimé en vw pour tenir à toutes les tailles. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[52%] left-[20.5vw] -z-10 hidden aspect-square w-[26.5vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(236,203,124,0.5)_0%,rgba(236,203,124,0.34)_60%,transparent_72%)] blur-lg lg:block"
      />

      <div className="page-x grid w-full items-center gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-6">
        <div>
          <Reveal variant="fade">
            <p className="text-eyebrow text-gold-ink">Artisanat Végétal</p>
            <p className="text-eyebrow mt-1.5 text-ink/70">
              Jus · Donuts · Événements · Transmission
            </p>
          </Reveal>

          <Reveal delay={STAGGER}>
            <h1 className="mt-8 font-display text-ink [text-shadow:0_2px_14px_rgba(255,255,255,0.55)]">
              <span className="block text-[clamp(1.3rem,2.35vw,2.2rem)] leading-[1.25] tracking-[0.01em] uppercase">
                La{" "}
                <span className="text-[clamp(2.4rem,4.5vw,4.2rem)]">
                  Nature
                </span>{" "}
                dans
              </span>
              <span className="mt-1 block text-[clamp(2.4rem,4.5vw,4.2rem)] leading-[1.15] tracking-[0.01em] uppercase">
                chaque goutte.
              </span>
            </h1>
          </Reveal>

          {/* Les deux phrases forment un seul bloc de lecture. */}
          <Reveal
            delay={STAGGER * 2}
            className="mt-8 grid max-w-[30rem] gap-1.5"
          >
            <p className="text-[clamp(1.1rem,1.45vw,1.4rem)] leading-[1.45] text-ink">
              Prenez soin de votre santé et de votre bien-être avec nos jus
              pressés et nos créations gourmandes.
            </p>
            <p className="text-[clamp(1.1rem,1.45vw,1.4rem)] leading-[1.45] text-ink">
              Puis faites de ce savoir-faire le vôtre, avec notre ebook et nos
              ateliers de formation.
            </p>
          </Reveal>

          {/* Le second appel à l'action est légèrement décalé vers le bas :
              les deux se lisent comme deux propositions distinctes. */}
          <Reveal
            delay={STAGGER * 3}
            className="mt-12 flex flex-wrap items-start gap-4 sm:gap-5"
          >
            <Button as="a" href="#creations" variant="redFilled" size="lg">
              Découvrir nos créations
            </Button>
            <Button
              as="a"
              href="#academie"
              variant="forestFilled"
              size="lg"
              // Décalage en marge et non en `translate` : le `translate` du
              // survol l'écrasait, ce qui faisait sauter le bouton.
              className="sm:mt-4"
            >
              Explorer les formations
            </Button>
          </Reveal>
        </div>

        <div
          ref={bottles.ref}
          style={bottles.style}
          className="will-change-transform"
        >
          <Reveal variant="zoom" delay={STAGGER}>
            <HeroCarousel
              visuels={[
                {
                  src: "/assets/hero-bouteilles.webp",
                  alt: "Bouteilles de jus Precious alignées : gingembre, jus vert détox et Tango hibiscus",
                },
                { src: "/assets/hero-bouteilles-2.webp", alt: "" },
                { src: "/assets/hero-bouteilles-3.webp", alt: "" },
              ]}
            />

            <ul className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 font-ui text-xs font-bold tracking-[0.14em] text-ink/60 uppercase">
              <li>100 % naturel</li>
              <li>Sans alcool</li>
              <li>Sans arôme artificiel</li>
              <li>Sur commande</li>
              <li>En magasin</li>
            </ul>
          </Reveal>
        </div>
      </div>

      {/* Repère de défilement : signale que la page continue, sans texte. */}
      <a
        href="#savoir-faire"
        aria-label="Aller à la section suivante"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-ink/45 transition-colors hover:text-ink lg:block"
      >
        <svg
          viewBox="0 0 24 34"
          width="22"
          height="31"
          fill="none"
          aria-hidden="true"
          className="animate-[float_2.2s_ease-in-out_infinite] motion-reduce:animate-none"
        >
          <rect
            x="1"
            y="1"
            width="22"
            height="32"
            rx="11"
            stroke="currentColor"
            strokeWidth="1.4"
          />
          <circle cx="12" cy="10" r="2.2" fill="currentColor" />
        </svg>
      </a>
    </section>
  );
}
