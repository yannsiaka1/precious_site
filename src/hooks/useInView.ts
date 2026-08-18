import { useEffect, useRef, useState } from "react";

interface Options {
  /** Marge de déclenchement : négative en bas = l'élément doit être bien entré. */
  rootMargin?: string;
  /** Une fois visible, on arrête d'observer. */
  once?: boolean;
}

/**
 * Observe un élément et indique quand il entre dans le champ de vision.
 * Socle des apparitions au scroll, sans bibliothèque d'animation.
 */
export function useInView<T extends HTMLElement>({
  rootMargin = "0px 0px -12% 0px",
  once = true,
}: Options = {}) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin, threshold: 0.05 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [rootMargin, once]);

  return { ref, inView } as const;
}
