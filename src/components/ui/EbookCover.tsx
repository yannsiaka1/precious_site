import type { Ebook } from "@/content/types";

/**
 * Couverture du guide, dessinée en CSS.
 * Rien à charger, et elle se met à jour toute seule si le titre change.
 * Le nom est composé dans la police de la maison plutôt que dans l'italique
 * de la référence : une police de plus aurait été payée en poids et en
 * cohérence pour un seul mot.
 */
export function EbookCover({ cover }: { cover: Ebook["cover"] }) {
  return (
    <div className="relative mx-auto w-full max-w-64">
      {/* Ombre portée décalée : donne l'épaisseur d'un livre posé. */}
      <span
        aria-hidden="true"
        className="absolute inset-0 translate-x-3 translate-y-3 bg-ink/15"
      />

      <div className="relative aspect-2/3 overflow-hidden bg-linear-160 from-[#e9f1cd] via-[#dfe98c] to-[#eec84f] p-6 text-forest-deep">
        <p className="font-ui text-[0.6rem] font-bold tracking-[0.22em] uppercase">
          {cover.kicker}
        </p>

        <span
          aria-hidden="true"
          className="absolute top-[18%] right-[14%] size-14 rounded-full bg-[#f0a92a]"
        />
        <span
          aria-hidden="true"
          className="absolute top-[31%] right-[8%] size-8 rounded-full bg-[#e8785a]"
        />

        <p className="absolute top-1/2 left-6 -translate-y-1/2 font-display text-3xl tracking-tight">
          {cover.title}
        </p>

        <p className="absolute right-6 bottom-6 left-6 font-ui text-[0.55rem] font-bold tracking-[0.18em] uppercase">
          {cover.footer}
        </p>
      </div>
    </div>
  );
}
