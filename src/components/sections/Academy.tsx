import { ebook, formation } from "@/content/offerings";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { EbookCover } from "@/components/ui/EbookCover";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

/**
 * Appel à l'action d'une offre.
 * Tant que le lien Payhip n'est pas renseigné, on renvoie vers le formulaire
 * de contact plutôt que d'afficher un bouton qui ne mène nulle part.
 */
function OfferAction({
  label,
  url,
  tone,
}: {
  label: string;
  url: string;
  tone: "light" | "dark";
}) {
  const variant = tone === "dark" ? "onDark" : "red";

  if (!url) {
    return (
      <Button as="a" href="#contact" variant={variant} size="lg">
        {label}
      </Button>
    );
  }

  return (
    <Button
      as="a"
      href={url}
      target="_blank"
      rel="noreferrer noopener"
      variant={variant}
      size="lg"
    >
      {label}
    </Button>
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
          <Reveal className="flex">
            <article className="flex flex-col bg-linear-135 from-forest via-[#2d7e35] to-[#7aa729] p-8 sm:p-12 lg:p-14">
              <div className="flex flex-wrap justify-between gap-4 font-ui text-xs font-bold tracking-[0.16em] text-lime uppercase">
                <span>{formation.badge}</span>
                <span>{formation.format}</span>
              </div>

              <h3 className="mt-8 max-w-[20ch] text-[clamp(1.6rem,2.3vw,2.2rem)]">
                {formation.title}
              </h3>
              <p className="mt-5 max-w-prose text-paper/85">
                {formation.intro}
              </p>

              <ul className="mt-9 grid gap-6 sm:grid-cols-2">
                {formation.modules.map((module, position) => (
                  <Reveal
                    as="li"
                    key={module.title}
                    delay={position * 120}
                    className="border-l border-lime/50 pl-4"
                  >
                    <p className="font-display text-lg">{module.title}</p>
                    <p className="mt-1.5 text-paper/75">{module.detail}</p>
                  </Reveal>
                ))}
              </ul>

              <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-2 font-ui text-xs font-bold tracking-[0.12em] text-paper/60 uppercase">
                {formation.practical.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <div className="mt-auto pt-10">
                <OfferAction
                  label={formation.cta}
                  url={formation.url}
                  tone="dark"
                />
              </div>
            </article>
          </Reveal>

          <Reveal delay={110} className="flex">
            <article className="flex flex-col bg-cream p-8 text-ink sm:p-12 lg:p-14">
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
                    delay={position * 110}
                    variant="left"
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

              <div className="mt-auto pt-10">
                <OfferAction label={ebook.cta} url={ebook.url} tone="light" />
              </div>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
