import { ebook, formations, inscription } from "@/content/offerings";
import type { Formation } from "@/content/types";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { EbookCover } from "@/components/ui/EbookCover";
import { Button } from "@/components/ui/Button";
import { Reveal, STAGGER } from "@/components/ui/Reveal";

/**
 * Section « L'académie Precious ».
 *
 * Colonne de gauche : les deux offres de formation (présentiel et en ligne),
 * chacune avec son contenu, son tarif et son lien de paiement Payhip.
 * Colonne de droite : le guide, dont le style ne change pas — il garde sa
 * hauteur naturelle et reste calé en haut plutôt que de s'étirer sur toute la
 * colonne voisine, devenue bien plus longue.
 */

/** Coche des listes « ce que comprend la formation ». */
function Coche() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="15"
      height="15"
      fill="none"
      aria-hidden="true"
      className="mt-1.5 shrink-0 text-lime"
    >
      <path
        d="M3 8.5l3.2 3.2L13 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CarteFormation({
  formation,
  delai,
}: {
  formation: Formation;
  delai: number;
}) {
  return (
    <Reveal delay={delai} className="flex">
      <article className="flex flex-col bg-linear-135 from-forest via-[#2d7e35] to-[#7aa729] p-8 transition-[transform,box-shadow] duration-500 ease-out hover:-translate-y-2 hover:shadow-[0_18px_44px_rgba(0,0,0,0.28)] sm:p-12">
        <div className="flex flex-wrap justify-between gap-4 font-ui text-xs font-bold tracking-[0.16em] text-lime uppercase">
          <span>{formation.badge}</span>
          <span>{formation.format}</span>
        </div>

        <h3 className="mt-7 max-w-[24ch] text-[clamp(1.45rem,2vw,1.95rem)]">
          {formation.title}
        </h3>
        <p className="mt-5 max-w-prose text-paper/85">{formation.intro}</p>

        <p className="mt-8 font-ui text-xs font-bold tracking-[0.16em] text-lime uppercase">
          Ce que vous apprenez
        </p>
        <ul className="mt-4 grid gap-2.5">
          {formation.programme.map((item) => (
            <li key={item} className="flex gap-3 text-paper/90">
              <Coche />
              {item}
            </li>
          ))}
        </ul>

        <p className="mt-8 font-ui text-xs font-bold tracking-[0.16em] text-lime uppercase">
          Ce qui est compris
        </p>
        <ul className="mt-4 grid gap-2.5">
          {formation.includes.map((item) => (
            <li key={item} className="flex gap-3 text-paper/90">
              <Coche />
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-9">
          <p className="font-display text-[clamp(1.8rem,2.4vw,2.4rem)] text-paper">
            {formation.price}
          </p>
          <p className="mt-2 max-w-prose text-sm text-paper/70">
            {formation.priceNote}
          </p>

          <Button
            as="a"
            href={formation.url}
            target="_blank"
            rel="noreferrer noopener"
            variant="onDark"
            className="mt-7"
          >
            {formation.cta}
          </Button>
        </div>
      </article>
    </Reveal>
  );
}

export function Academy() {
  return (
    <section
      id="academie"
      className="grain page-x bg-forest-deep py-20 text-paper md:py-28 lg:py-32"
    >
      <div className="mx-auto w-full max-w-[82rem]">
        <SectionHeader
          tone="dark"
          eyebrow="L'académie Precious"
          title="Le savoir-faire se savoure. Il se partage aussi."
        />

        <div className="mt-28 grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <div className="grid gap-6">
            {/* Déroulé de l'inscription, avant les offres : on comprend
                comment les choses se passent avant de regarder les prix. */}
            <Reveal>
              <div className="border border-lime/30 p-8 sm:p-10">
                <p className="font-ui text-xs font-bold tracking-[0.16em] text-lime uppercase">
                  Comment se déroule l'inscription
                </p>
                <ol className="mt-5 grid gap-4">
                  {inscription.map((etape, index) => (
                    <li key={etape} className="flex gap-4 text-paper/85">
                      <span className="font-display text-lg text-mango">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {etape}
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>

            {formations.map((formation, index) => (
              <CarteFormation
                key={formation.id}
                formation={formation}
                delai={(index + 1) * STAGGER}
              />
            ))}
          </div>

          <Reveal delay={STAGGER} className="flex self-start">
            <article className="flex flex-col bg-cream p-8 text-ink transition-[transform,box-shadow] duration-500 ease-out hover:-translate-y-2 hover:shadow-[0_18px_44px_rgba(0,0,0,0.22)] sm:p-12 lg:p-14">
              <div className="flex flex-wrap justify-between gap-4 font-ui text-xs font-bold tracking-[0.16em] text-forest uppercase">
                <span>{ebook.badge}</span>
                <span>{ebook.format}</span>
              </div>

              <div className="mt-10">
                <EbookCover cover={ebook.cover} />
              </div>

              <h3 className="mt-10 text-[clamp(1.6rem,2.3vw,2.2rem)] text-forest">
                {ebook.title}
              </h3>
              <p className="mt-5 text-ink/75">{ebook.intro}</p>

              <ul className="mt-7 grid gap-3">
                {ebook.highlights.map((item, position) => (
                  <Reveal
                    as="li"
                    key={item}
                    delay={position * STAGGER}
                    className="flex gap-3"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-2.5 block size-1.5 shrink-0 rounded-full bg-mango"
                    />
                    {item}
                  </Reveal>
                ))}
              </ul>

              {/* Le guide n'est pas encore en vente : on renvoie au formulaire
                  de contact pour être prévenu, plutôt qu'à un panier vide. */}
              <div className="mt-auto pt-10">
                <Button as="a" href="#contact" variant="red">
                  Être prévenu de sa sortie
                </Button>
              </div>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
