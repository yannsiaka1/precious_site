import { useState } from "react";
import { albums } from "@/content/offerings";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Lightbox } from "@/components/ui/Lightbox";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";

/**
 * Grille asymétrique : un grand album à gauche, deux petits à droite, un
 * large en dessous. Les quatre cases remplissent la grille sans trou.
 */
const layout = ["sm:col-span-2 sm:row-span-2", "", "", "sm:col-span-2"];

export function Realisations() {
  const [openId, setOpenId] = useState<string | null>(null);
  const open = albums.find((album) => album.id === openId);

  return (
    <section
      id="realisations"
      className="page-x grain bg-cream py-20 md:py-28 lg:py-32"
    >
      <div className="mx-auto w-full max-w-[82rem]">
        <SectionHeader
          eyebrow="Réalisations"
          title="Un aperçu de l'univers Precious"
        />

        <div className="mt-20 grid gap-4 sm:auto-rows-[15rem] sm:grid-cols-2 lg:auto-rows-[16rem] lg:grid-cols-4">
          {albums.map((album, index) => {
            const cover = album.images[0];
            if (!cover) return null;

            return (
              <Reveal
                key={album.id}
                delay={index * 80}
                className={cn("flex", layout[index])}
              >
                <button
                  type="button"
                  onClick={() => setOpenId(album.id)}
                  aria-haspopup="dialog"
                  className="group relative w-full overflow-hidden text-left"
                >
                  <img
                    src={cover.src}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-72 w-full object-cover transition-transform duration-700 ease-(--ease-out-soft) group-hover:scale-[1.05] sm:h-full"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 bg-linear-to-t from-forest-deep/80 to-transparent to-60% transition-opacity duration-500 group-hover:from-forest-deep/90"
                  />
                  <span className="absolute inset-x-0 bottom-0 p-6 text-paper">
                    <span className="block font-display text-2xl">
                      {album.label}
                    </span>
                    <span className="mt-1 block text-paper/75">
                      {album.blurb}
                    </span>
                    <span className="mt-3 inline-flex items-center gap-2 font-ui text-xs font-bold tracking-[0.16em] uppercase">
                      {album.images.length} visuels
                      <svg
                        viewBox="0 0 16 16"
                        width="13"
                        height="13"
                        fill="none"
                        aria-hidden="true"
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      >
                        <path
                          d="M2 8h11M9 4l4 4-4 4"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </span>
                </button>
              </Reveal>
            );
          })}
        </div>
      </div>

      {open ? (
        <Lightbox
          title={open.label}
          images={open.images}
          onClose={() => setOpenId(null)}
        />
      ) : null}
    </section>
  );
}
