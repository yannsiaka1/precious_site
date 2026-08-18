import { useEffect, useState } from "react";
import type { GalleryImage } from "@/content/types";
import { cn } from "@/lib/cn";

interface ImagePairCarouselProps {
  images: GalleryImage[];
  /** Repart de la première paire quand l'univers change. */
  resetKey: string;
}

const DELAY = 3200;

function Slide({ image, visible }: { image: GalleryImage; visible: boolean }) {
  return (
    <figure
      aria-hidden={!visible}
      className={cn(
        "absolute inset-0 transition-opacity duration-500 ease-(--ease-out-soft)",
        visible ? "opacity-100" : "opacity-0",
      )}
    >
      <img
        src={image.src}
        alt={image.alt}
        loading="lazy"
        decoding="async"
        width={820}
        height={615}
        sizes="(max-width: 1023px) 100vw, 45vw"
        className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover/slide:scale-[1.04]"
      />
      {image.caption ? (
        <>
          {/* Voile flou en bas, comme sur la maquette : la légende reste
              lisible quelle que soit la photo. */}
          <span
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/65 to-transparent backdrop-blur-[3px] [mask-image:linear-gradient(to_top,black_55%,transparent)]"
          />
          <figcaption className="absolute inset-x-0 bottom-0 px-6 py-4 text-lg text-paper">
            {image.caption}
          </figcaption>
        </>
      ) : null}
    </figure>
  );
}

/**
 * Deux visuels empilés qui défilent par paires.
 * Le défilement s'arrête au survol, au focus clavier, et lorsque la personne
 * a demandé à réduire les animations.
 */
export function ImagePairCarousel({
  images,
  resetKey,
}: ImagePairCarouselProps) {
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);
  const pages = Math.max(1, Math.ceil(images.length / 2));

  useEffect(() => setPage(0), [resetKey]);

  useEffect(() => {
    if (paused || pages < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(
      () => setPage((current) => (current + 1) % pages),
      DELAY,
    );
    return () => window.clearInterval(timer);
  }, [paused, pages, resetKey]);

  if (images.length === 0) return null;

  return (
    <div
      className="grid gap-4"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {[0, 1].map((slot) => (
        <div
          key={slot}
          className="group/slide relative aspect-4/3 w-full overflow-hidden rounded-sm bg-cream"
        >
          {images.map((image, index) => (
            <Slide
              key={image.src}
              image={image}
              visible={index === (page * 2 + slot) % images.length}
            />
          ))}
        </div>
      ))}

      {pages > 1 ? (
        <div className="mt-1 flex items-center gap-2.5">
          {Array.from({ length: pages }, (_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setPage(index)}
              aria-label={`Voir les visuels ${index * 2 + 1} et ${index * 2 + 2}`}
              aria-current={index === page ? "true" : undefined}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300 ease-(--ease-out-soft)",
                index === page
                  ? "w-7 bg-forest"
                  : "w-1.5 bg-ink/25 hover:bg-ink/45",
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
