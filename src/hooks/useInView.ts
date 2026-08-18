import { useEffect, useRef, useState } from "react";

interface Options {
  /**
   * Marge de déclenchement. La valeur négative en bas retarde l'apparition :
   * l'élément est déjà bien entré dans l'écran quand l'animation démarre,
   * ce qui la rend visible au lieu de se jouer hors champ.
   */
  rootMargin?: string;
  /** Part de l'élément qui doit être visible avant de déclencher. */
  threshold?: number;
  /** Une fois visible, on arrête d'observer. */
  once?: boolean;
}

/**
 * Observe un élément et indique quand il entre dans le champ de vision.
 * Socle des apparitions au scroll, sans bibliothèque d'animation.
 */
export function useInView<T extends HTMLElement>({
  rootMargin = "0px 0px -12% 0px",
  threshold = 0.15,
  once = true,
}: Options = {}) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;

    // Sans IntersectionObserver, on affiche tout : mieux vaut une page sans
    // animation qu'une page vide.
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
      { rootMargin, threshold: [0, threshold] },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [rootMargin, threshold, once]);

  return { ref, inView } as const;
}
