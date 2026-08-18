/**
 * Section d'ouverture, reprise de la maquette « section_1 ».
 *
 * Le halo doré est peint en CSS plutôt que laissé dans l'image de fond :
 * ancré sur le bloc de texte, il l'englobe quelle que soit la largeur
 * d'écran, alors qu'un halo incrusté dériverait au recadrage.
 */
export function Hero() {
  return (
    <section
      id="accueil"
      className="relative -mt-24 flex min-h-svh items-center overflow-hidden pt-28 pb-14 lg:-mt-32 lg:pt-36"
    >
      <img
        src="/assets/hero-fond.webp"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />

      {/* Halo doré : centre à 20,5 % de la largeur, diamètre 26,5 % — relevé
          sur la maquette, exprimé en vw pour tenir à toutes les tailles. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[52%] left-[20.5vw] -z-10 hidden aspect-square w-[26.5vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(236,203,124,0.5)_0%,rgba(236,203,124,0.34)_60%,transparent_72%)] blur-lg lg:block"
      />

      <div className="page-x grid w-full items-center gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-6">
        {/* Décalage vers le bas : cale le titre sur le milieu des bouteilles. */}
        <div className="animate-[rise_900ms_var(--ease-out-soft)_both] lg:mt-[9vh]">
          <p className="text-eyebrow text-gold-ink">Artisanat Végétal</p>
          <p className="text-eyebrow mt-1.5 text-ink/70">
            Jus · Donuts · Événements · Transmission
          </p>

          <h1 className="mt-8 font-display text-ink [text-shadow:0_2px_14px_rgba(255,255,255,0.55)]">
            <span className="block text-[clamp(1.3rem,2.35vw,2.2rem)] leading-[1.25] tracking-[0.01em] uppercase">
              La{" "}
              <span className="text-[clamp(2.4rem,4.5vw,4.2rem)]">Nature</span>{" "}
              dans
            </span>
            <span className="mt-1 block text-[clamp(2.4rem,4.5vw,4.2rem)] leading-[1.15] tracking-[0.01em] uppercase">
              chaque goutte.
            </span>
          </h1>

          <p className="mt-8 max-w-[30rem] text-[clamp(1.1rem,1.45vw,1.4rem)] leading-[1.45] text-ink">
            Prenez soin de votre santé et de votre bien-être avec nos jus
            pressés et nos créations gourmandes.
          </p>
          <p className="mt-3 max-w-[30rem] text-[clamp(1.1rem,1.45vw,1.4rem)] leading-[1.45] text-ink">
            Puis faites de ce savoir-faire le vôtre, avec notre ebook et nos
            ateliers de formation.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-x-10 gap-y-4">
            <a
              href="#creations"
              className="font-display text-[clamp(1rem,1.25vw,1.2rem)] tracking-wide text-brand-red decoration-1 underline-offset-[10px] hover:underline"
            >
              Découvrir nos créations
            </a>
            <a
              href="#academie"
              className="font-display text-[clamp(1rem,1.25vw,1.2rem)] tracking-wide text-ink decoration-1 underline-offset-[10px] hover:underline"
            >
              Explorer les formations
            </a>
          </div>
        </div>

        <div className="animate-[rise_1100ms_var(--ease-out-soft)_both]">
          <img
            src="/assets/hero-bouteilles.webp"
            alt="Six bouteilles de jus de gingembre Precious alignées"
            width={781}
            height={429}
            fetchPriority="high"
            decoding="async"
            className="w-full origin-center scale-y-[1.07] object-contain drop-shadow-[0_26px_46px_rgba(90,80,20,0.22)]"
          />

          <ul className="mt-10 flex flex-wrap justify-center gap-x-7 gap-y-2 font-ui text-xs font-bold tracking-[0.14em] text-ink/60 uppercase">
            <li>100 % naturel</li>
            <li>Sans alcool</li>
            <li>Sur commande</li>
            <li>En magasin</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
