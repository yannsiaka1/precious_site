import { useCallback, useEffect, useRef, useState } from "react";
import type { GalleryImage } from "@/content/types";
import { cn } from "@/lib/cn";

interface LightboxProps {
  title: string;
  images: GalleryImage[];
  startIndex?: number;
  onClose: () => void;
}

/**
 * Visionneuse plein écran.
 *
 * Repose sur <dialog> et showModal() : le navigateur gère lui-même le
 * piégeage du focus, la fermeture par Échap et l'inertie de l'arrière-plan —
 * inutile de réécrire tout cela à la main.
 */
export function Lightbox({
  title,
  images,
  startIndex = 0,
  onClose,
}: LightboxProps) {
  const [index, setIndex] = useState(startIndex);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const current = images[index];

  const go = useCallback(
    (step: number) =>
      setIndex((i) => (i + step + images.length) % images.length),
    [images.length],
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog?.open) dialog?.showModal();
    return () => dialog?.close();
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "ArrowRight") go(1);
      if (event.key === "ArrowLeft") go(-1);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [go]);

  if (!current) return null;

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      aria-label={`Galerie ${title}`}
      className="m-0 h-dvh max-h-none w-dvw max-w-none bg-ink/95 p-0 text-paper backdrop:bg-ink/70"
    >
      <div className="flex h-full flex-col">
        <div className="page-x flex items-center justify-between gap-6 py-6">
          <p className="font-display text-lg">
            {title}
            <span className="ml-4 font-ui text-xs font-bold tracking-[0.16em] text-paper/50">
              {index + 1} / {images.length}
            </span>
          </p>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="grid size-11 place-items-center rounded-full border border-paper/30 transition-colors hover:border-paper hover:bg-paper hover:text-ink"
            aria-label="Fermer la galerie"
          >
            <svg
              viewBox="0 0 16 16"
              width="14"
              height="14"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3 3l10 10M13 3L3 13"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="page-x relative flex min-h-0 flex-1 items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Visuel précédent"
            className="grid size-12 shrink-0 place-items-center rounded-full border border-paper/30 transition-colors hover:border-paper hover:bg-paper hover:text-ink"
          >
            <svg
              viewBox="0 0 16 16"
              width="15"
              height="15"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M14 8H3m4-4L3 8l4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <figure className="flex min-h-0 flex-1 flex-col items-center">
            <img
              key={current.src}
              src={current.src}
              alt={current.alt}
              className="max-h-full min-h-0 w-auto max-w-full animate-[fade_400ms_var(--ease-out-soft)_both] object-contain"
            />
            {current.caption ? (
              <figcaption className="mt-4 text-paper/70">
                {current.caption}
              </figcaption>
            ) : null}
          </figure>

          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Visuel suivant"
            className="grid size-12 shrink-0 place-items-center rounded-full border border-paper/30 transition-colors hover:border-paper hover:bg-paper hover:text-ink"
          >
            <svg
              viewBox="0 0 16 16"
              width="15"
              height="15"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M2 8h11M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className="page-x flex gap-3 overflow-x-auto py-6">
          {images.map((image, position) => (
            <button
              key={image.src}
              type="button"
              onClick={() => setIndex(position)}
              aria-label={`Voir le visuel ${position + 1}`}
              aria-current={position === index ? "true" : undefined}
              className={cn(
                "h-16 w-24 shrink-0 overflow-hidden transition-opacity",
                position === index
                  ? "opacity-100 ring-2 ring-mango"
                  : "opacity-45 hover:opacity-80",
              )}
            >
              {/* Les vignettes se chargent au fil du défilement horizontal. */}
              <img
                src={image.src}
                alt=""
                loading="lazy"
                decoding="async"
                width={820}
                height={615}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </dialog>
  );
}
